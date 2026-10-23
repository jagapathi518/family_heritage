import { describe, it, expect } from 'vitest';
import { wouldCreateCycle, isDuplicateRelationship } from '@/lib/cycle-prevention';
import { computeGenerations, getBranchPeopleIds, buildGenealogyLayout } from '@/lib/genealogy-layout';
import { DEMO_PEOPLE, DEMO_RELATIONSHIPS } from '@/lib/demo-data';
import { Relationship } from '@/types/database';
import { en } from '@/lib/i18n/locales/en';
import { te } from '@/lib/i18n/locales/te';

describe('Genealogy Cycle Prevention', () => {
  it('prevents self-ancestry (person becoming their own parent)', () => {
    const rels: Relationship[] = [];
    expect(wouldCreateCycle(rels, 'person-A', 'person-A')).toBe(true);
  });

  it('allows valid multi-generation lineage (Grandparent -> Parent -> Child)', () => {
    const rels: Relationship[] = [
      {
        id: '1',
        family_id: 'fam',
        person1_id: 'grandparent',
        person2_id: 'parent',
        relationship_type: 'parent_child',
        created_at: '',
      },
      {
        id: '2',
        family_id: 'fam',
        person1_id: 'parent',
        person2_id: 'child',
        relationship_type: 'parent_child',
        created_at: '',
      },
    ];

    // Adding child -> grandchild is totally valid
    expect(wouldCreateCycle(rels, 'child', 'grandchild')).toBe(false);
  });

  it('detects and rejects cyclical ancestry (Child becoming Parent of Grandparent)', () => {
    const rels: Relationship[] = [
      {
        id: '1',
        family_id: 'fam',
        person1_id: 'grandparent',
        person2_id: 'parent',
        relationship_type: 'parent_child',
        created_at: '',
      },
      {
        id: '2',
        family_id: 'fam',
        person1_id: 'parent',
        person2_id: 'child',
        relationship_type: 'parent_child',
        created_at: '',
      },
    ];

    // Trying to make child the parent of grandparent: parentId=child, childId=grandparent
    // This is invalid because child is already a descendant of grandparent!
    expect(wouldCreateCycle(rels, 'child', 'grandparent')).toBe(true);
  });

  it('correctly flags duplicate relationships', () => {
    const rels: Relationship[] = [
      {
        id: '1',
        family_id: 'fam',
        person1_id: 'p1',
        person2_id: 'p2',
        relationship_type: 'spouse',
        created_at: '',
      },
    ];

    expect(isDuplicateRelationship(rels, 'p1', 'p2', 'spouse')).toBe(true);
    expect(isDuplicateRelationship(rels, 'p2', 'p1', 'spouse')).toBe(true); // symmetric for spouse
    expect(isDuplicateRelationship(rels, 'p1', 'p3', 'spouse')).toBe(false);
  });
});

describe('Genealogy Layout and Generation Calculation', () => {
  it('computes correct generation ranks for 3-generation demo family', () => {
    const gens = computeGenerations(DEMO_PEOPLE, DEMO_RELATIONSHIPS);

    // Generation 1: Suryanarayana (p-1) & Annapurna (p-2) should be gen 0
    expect(gens.get('p-1')).toBe(0);
    expect(gens.get('p-2')).toBe(0);

    // Generation 2: Venkateswara (p-3), Sujatha (p-4), Lakshmi (p-5), Ramana (p-6) should be gen 1
    expect(gens.get('p-3')).toBe(1);
    expect(gens.get('p-4')).toBe(1);
    expect(gens.get('p-5')).toBe(1);
    expect(gens.get('p-6')).toBe(1);

    // Generation 3: Aditya (p-7), Ananya (p-8), Karthik (p-9) should be gen 2
    expect(gens.get('p-7')).toBe(2);
    expect(gens.get('p-8')).toBe(2);
    expect(gens.get('p-9')).toBe(2);
  });

  it('isolates focused branch people correctly', () => {
    // Focus on grandson Aditya (p-7)
    // Branch should contain: Aditya, parents (p-3, p-4), grandparents (p-1, p-2), sister (p-8)
    const branch = getBranchPeopleIds('p-7', DEMO_PEOPLE, DEMO_RELATIONSHIPS);
    expect(branch.has('p-7')).toBe(true);
    expect(branch.has('p-3')).toBe(true);
    expect(branch.has('p-1')).toBe(true);
  });

  it('builds nodes and edges without throwing', () => {
    const layout = buildGenealogyLayout(DEMO_PEOPLE, DEMO_RELATIONSHIPS);
    expect(layout.nodes.length).toBe(DEMO_PEOPLE.length);
    expect(layout.edges.length).toBe(DEMO_RELATIONSHIPS.length);
  });
});

describe('Localization Dictionary Parity', () => {
  it('has identical top-level keys in English and Telugu dictionaries', () => {
    const enKeys = Object.keys(en).sort();
    const teKeys = Object.keys(te).sort();
    expect(enKeys).toEqual(teKeys);
  });

  it('has all common fields translated in Telugu', () => {
    expect(te.common.appName).toContain('కుటుంబ');
    expect(te.common.language).toBe('భాష');
    expect(te.tree.addParent).toBe('తల్లిదండ్రులను జోడించు');
    expect(te.timeline.types.birth).toBe('జననం');
  });
});
