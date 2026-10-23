import { Person, Relationship, RelationshipType } from './database';
import { Node, Edge } from '@xyflow/react';

export interface PersonNodeData extends Record<string, unknown> {
  person: Person;
  spouses: Person[];
  parents: Person[];
  children: Person[];
  isSelected?: boolean;
  isFocused?: boolean;
  onSelectPerson?: (person: Person) => void;
  onAddRelative?: (person: Person, type: 'parent' | 'child' | 'spouse') => void;
  onEditPerson?: (person: Person) => void;
}

export type PersonNode = Node<PersonNodeData, 'personNode'>;

export interface TreeGraphData {
  people: Person[];
  relationships: Relationship[];
}

export interface TreeLayoutOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  horizontalSpacing?: number;
  verticalSpacing?: number;
  focusPersonId?: string | null;
}

export interface LayoutedGraph {
  nodes: PersonNode[];
  edges: Edge[];
}
