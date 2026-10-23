import { Person, Relationship } from '@/types/database';
import { PersonNode, TreeLayoutOptions, LayoutedGraph } from '@/types/genealogy';
import { Edge, MarkerType } from '@xyflow/react';

export function computeGenerations(
  people: Person[],
  relationships: Relationship[]
): Map<string, number> {
  const generations = new Map<string, number>();
  const parentMap = new Map<string, string[]>(); // child -> parents
  const childMap = new Map<string, string[]>();  // parent -> children
  const spouseMap = new Map<string, string[]>(); // person -> spouses

  people.forEach((p) => {
    parentMap.set(p.id, []);
    childMap.set(p.id, []);
    spouseMap.set(p.id, []);
  });

  relationships.forEach((rel) => {
    if (rel.relationship_type === 'parent_child') {
      const pList = parentMap.get(rel.person2_id) || [];
      pList.push(rel.person1_id);
      parentMap.set(rel.person2_id, pList);

      const cList = childMap.get(rel.person1_id) || [];
      cList.push(rel.person2_id);
      childMap.set(rel.person1_id, cList);
    } else if (rel.relationship_type === 'spouse') {
      const s1 = spouseMap.get(rel.person1_id) || [];
      s1.push(rel.person2_id);
      spouseMap.set(rel.person1_id, s1);

      const s2 = spouseMap.get(rel.person2_id) || [];
      s2.push(rel.person1_id);
      spouseMap.set(rel.person2_id, s2);
    }
  });

  // Step 1: Find roots (people with 0 parents)
  const roots = people.filter((p) => (parentMap.get(p.id) || []).length === 0);

  // If no pure roots due to disjoint or missing links, use all people
  const initialQueue = roots.length > 0 ? roots : people;

  initialQueue.forEach((r) => {
    if (!generations.has(r.id)) {
      generations.set(r.id, 0);
    }
  });

  // Step 2: Propagate forward to children
  let changed = true;
  let iterations = 0;
  const maxIterations = people.length * 2;

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    // Forward propagation: child gen = max(parent gen) + 1
    for (const person of people) {
      const parents = parentMap.get(person.id) || [];
      if (parents.length > 0) {
        let maxParentGen = -1;
        for (const pid of parents) {
          if (generations.has(pid)) {
            maxParentGen = Math.max(maxParentGen, generations.get(pid)!);
          }
        }
        if (maxParentGen !== -1) {
          const expectedGen = maxParentGen + 1;
          const currentGen = generations.get(person.id);
          if (currentGen === undefined || currentGen < expectedGen) {
            generations.set(person.id, expectedGen);
            changed = true;
          }
        }
      }
    }

    // Spouse alignment: Spouses should share the same generation
    for (const person of people) {
      const pGen = generations.get(person.id);
      if (pGen !== undefined) {
        const spouses = spouseMap.get(person.id) || [];
        for (const spId of spouses) {
          if (generations.get(spId) !== pGen) {
            generations.set(spId, pGen);
            changed = true;
          }
        }
      }
    }
  }

  // Any remaining unassigned people get default generation 0
  people.forEach((p) => {
    if (!generations.has(p.id)) {
      generations.set(p.id, 0);
    }
  });

  return generations;
}

/**
 * Filter branch elements for a focused person (including ancestors, descendants, spouses)
 */
export function getBranchPeopleIds(
  focusId: string,
  people: Person[],
  relationships: Relationship[]
): Set<string> {
  const branchIds = new Set<string>([focusId]);

  const parentMap = new Map<string, string[]>();
  const childMap = new Map<string, string[]>();
  const spouseMap = new Map<string, string[]>();

  relationships.forEach((rel) => {
    if (rel.relationship_type === 'parent_child') {
      const pList = parentMap.get(rel.person2_id) || [];
      pList.push(rel.person1_id);
      parentMap.set(rel.person2_id, pList);

      const cList = childMap.get(rel.person1_id) || [];
      cList.push(rel.person2_id);
      childMap.set(rel.person1_id, cList);
    } else if (rel.relationship_type === 'spouse') {
      const s1 = spouseMap.get(rel.person1_id) || [];
      s1.push(rel.person2_id);
      spouseMap.set(rel.person1_id, s1);

      const s2 = spouseMap.get(rel.person2_id) || [];
      s2.push(rel.person1_id);
      spouseMap.set(rel.person2_id, s2);
    }
  });

  // Traverse ancestors upwards
  const queueUp = [focusId];
  while (queueUp.length > 0) {
    const cur = queueUp.shift()!;
    const parents = parentMap.get(cur) || [];
    for (const p of parents) {
      if (!branchIds.has(p)) {
        branchIds.add(p);
        queueUp.push(p);
      }
    }
  }

  // Traverse descendants downwards
  const queueDown = [focusId];
  while (queueDown.length > 0) {
    const cur = queueDown.shift()!;
    const children = childMap.get(cur) || [];
    for (const c of children) {
      if (!branchIds.has(c)) {
        branchIds.add(c);
        queueDown.push(c);
      }
    }
  }

  // Add spouses of any person in the branch
  Array.from(branchIds).forEach((id) => {
    const spouses = spouseMap.get(id) || [];
    for (const s of spouses) {
      branchIds.add(s);
    }
  });

  return branchIds;
}

/**
 * Creates layout nodes and edges for the genealogy tree
 */
export function buildGenealogyLayout(
  people: Person[],
  relationships: Relationship[],
  options: TreeLayoutOptions = {}
): LayoutedGraph {
  const {
    nodeWidth = 260,
    nodeHeight = 140,
    horizontalSpacing = 60,
    verticalSpacing = 160,
    focusPersonId = null,
  } = options;

  if (people.length === 0) {
    return { nodes: [], edges: [] };
  }

  const peopleMap = new Map<string, Person>(people.map((p) => [p.id, p]));
  const branchIds = focusPersonId
    ? getBranchPeopleIds(focusPersonId, people, relationships)
    : null;

  const generations = computeGenerations(people, relationships);

  // Group people by generation
  const generationGroups = new Map<number, Person[]>();
  people.forEach((p) => {
    const gen = generations.get(p.id) || 0;
    const group = generationGroups.get(gen) || [];
    group.push(p);
    generationGroups.set(gen, group);
  });

  const sortedGens = Array.from(generationGroups.keys()).sort((a, b) => a - b);
  const nodes: PersonNode[] = [];

  // Compute positions
  sortedGens.forEach((genIndex) => {
    const group = generationGroups.get(genIndex) || [];
    const totalGroupWidth = group.length * (nodeWidth + horizontalSpacing) - horizontalSpacing;
    const startX = -totalGroupWidth / 2;
    const posY = genIndex * (nodeHeight + verticalSpacing);

    group.forEach((person, idx) => {
      const posX = startX + idx * (nodeWidth + horizontalSpacing);
      const isFocused = focusPersonId === person.id;
      const isInBranch = branchIds ? branchIds.has(person.id) : true;

      // Find relatives for person node data
      const parents = relationships
        .filter((r) => r.relationship_type === 'parent_child' && r.person2_id === person.id)
        .map((r) => peopleMap.get(r.person1_id))
        .filter(Boolean) as Person[];

      const children = relationships
        .filter((r) => r.relationship_type === 'parent_child' && r.person1_id === person.id)
        .map((r) => peopleMap.get(r.person2_id))
        .filter(Boolean) as Person[];

      const spouses = relationships
        .filter(
          (r) =>
            r.relationship_type === 'spouse' &&
            (r.person1_id === person.id || r.person2_id === person.id)
        )
        .map((r) => peopleMap.get(r.person1_id === person.id ? r.person2_id : r.person1_id))
        .filter(Boolean) as Person[];

      nodes.push({
        id: person.id,
        type: 'personNode',
        position: { x: posX, y: posY },
        data: {
          person,
          parents,
          children,
          spouses,
          isFocused,
          isSelected: isFocused,
        },
        style: {
          opacity: isInBranch ? 1 : 0.25,
          transition: 'all 0.3s ease',
        },
      });
    });
  });

  // Build edges
  const edges: Edge[] = [];

  relationships.forEach((rel) => {
    const p1 = peopleMap.get(rel.person1_id);
    const p2 = peopleMap.get(rel.person2_id);
    if (!p1 || !p2) return;

    const isInBranch = branchIds
      ? branchIds.has(rel.person1_id) && branchIds.has(rel.person2_id)
      : true;

    if (rel.relationship_type === 'parent_child') {
      edges.push({
        id: `rel-${rel.id}`,
        source: rel.person1_id,
        target: rel.person2_id,
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b3a2b',
          width: 14,
          height: 14,
        },
        style: {
          stroke: '#8b3a2b',
          strokeWidth: 2.2,
          opacity: isInBranch ? 1 : 0.2,
        },
      });
    } else if (rel.relationship_type === 'spouse') {
      edges.push({
        id: `rel-spouse-${rel.id}`,
        source: rel.person1_id,
        target: rel.person2_id,
        type: 'straight',
        animated: false,
        label: '💍',
        labelStyle: { fill: '#c8963e', fontWeight: 700, fontSize: 13 },
        labelBgStyle: { fill: '#fcf9f2', rx: 4, ry: 4 },
        style: {
          stroke: '#c8963e',
          strokeWidth: 2,
          strokeDasharray: '5,5',
          opacity: isInBranch ? 1 : 0.2,
        },
      });
    }
  });

  return { nodes, edges };
}
