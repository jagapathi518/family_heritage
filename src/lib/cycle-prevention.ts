import { Relationship } from '@/types/database';

/**
 * Checks whether adding a new parent-child relationship (parentId -> childId)
 * would introduce an invalid ancestry cycle in the family tree.
 * 
 * Rules:
 * 1. A person cannot be their own parent (parentId === childId).
 * 2. The child cannot already be an ancestor of the parent (transitive check).
 */
export function wouldCreateCycle(
  existingRelationships: Relationship[],
  parentId: string,
  childId: string
): boolean {
  // Rule 1: Direct self-ancestry
  if (parentId === childId) {
    return true;
  }

  // Build adjacency graph for parent_child relationships: parent -> list of children
  // Or child -> list of parents to trace ancestors upwards
  const parentMap = new Map<string, string[]>();

  for (const rel of existingRelationships) {
    if (rel.relationship_type === 'parent_child') {
      const parents = parentMap.get(rel.person2_id) || [];
      parents.push(rel.person1_id);
      parentMap.set(rel.person2_id, parents);
    }
  }

  // To check if childId is an ancestor of parentId:
  // Walk upwards from parentId through its parents. If we ever encounter childId, it's a cycle!
  const visited = new Set<string>();
  const queue: string[] = [parentId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === childId) {
      return true;
    }

    if (!visited.has(current)) {
      visited.add(current);
      const parents = parentMap.get(current) || [];
      for (const p of parents) {
        if (!visited.has(p)) {
          queue.push(p);
        }
      }
    }
  }

  return false;
}

/**
 * Validates whether a duplicate relationship already exists between two people.
 */
export function isDuplicateRelationship(
  existingRelationships: Relationship[],
  person1Id: string,
  person2Id: string,
  type: 'parent_child' | 'spouse'
): boolean {
  return existingRelationships.some((r) => {
    if (r.relationship_type !== type) return false;
    if (type === 'parent_child') {
      return r.person1_id === person1Id && r.person2_id === person2Id;
    } else {
      // Spouse is reciprocal
      return (
        (r.person1_id === person1Id && r.person2_id === person2Id) ||
        (r.person1_id === person2Id && r.person2_id === person1Id)
      );
    }
  });
}
