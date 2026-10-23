'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
} from '@xyflow/react';
import { Person, Relationship } from '@/types/database';
import { PersonNode } from './PersonNode';
import { buildGenealogyLayout } from '@/lib/genealogy-layout';
import { useTranslation } from '@/lib/i18n/context';
import {
  Search,
  Filter,
  UserPlus,
  RotateCcw,
  TreePine,
  Sparkles,
  Info,
} from 'lucide-react';

const nodeTypes = {
  personNode: PersonNode as any,
};

interface FamilyTreeFlowProps {
  initialPeople: Person[];
  initialRelationships: Relationship[];
  onSelectPerson?: (person: Person) => void;
  onAddRelative?: (person: Person, type: 'parent' | 'child' | 'spouse') => void;
  onAddFirstPerson?: () => void;
  canEdit?: boolean;
}

export function FamilyTreeFlow({
  initialPeople,
  initialRelationships,
  onSelectPerson,
  onAddRelative,
  onAddFirstPerson,
  canEdit = true,
}: FamilyTreeFlowProps) {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [focusPersonId, setFocusPersonId] = useState<string | null>(null);

  // Compute layout
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    return buildGenealogyLayout(initialPeople, initialRelationships, {
      focusPersonId,
    });
  }, [initialPeople, initialRelationships, focusPersonId]);

  // Inject callbacks into node data
  const processedNodes = useMemo(() => {
    return layoutNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onSelectPerson,
        onAddRelative: canEdit ? onAddRelative : undefined,
      },
    }));
  }, [layoutNodes, onSelectPerson, onAddRelative, canEdit]);

  const [nodes, setNodes, onNodesChange] = useNodesState(processedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  // Update when layout changes
  React.useEffect(() => {
    setNodes(processedNodes);
    setEdges(layoutEdges);
  }, [processedNodes, layoutEdges, setNodes, setEdges]);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return initialPeople.filter(
      (p) =>
        `${p.first_name} ${p.last_name || ''}`.toLowerCase().includes(q) ||
        (p.telugu_name && p.telugu_name.toLowerCase().includes(q)) ||
        (p.native_village && p.native_village.toLowerCase().includes(q))
    );
  }, [searchQuery, initialPeople]);

  const handleSelectSearchResult = (person: Person) => {
    setFocusPersonId(person.id);
    setSearchQuery('');
    onSelectPerson?.(person);
  };

  if (initialPeople.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[550px] border-2 border-dashed border-stone-300 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/50">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-4">
          <TreePine className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mb-2">
          {t.tree.emptyTreeTitle}
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mb-6">
          {t.tree.emptyTreeDesc}
        </p>
        {canEdit && (
          <button
            type="button"
            onClick={onAddFirstPerson}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm shadow-md transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.tree.addFirstPerson}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[650px] sm:h-[720px] rounded-2xl border border-stone-300 dark:border-stone-800 overflow-hidden shadow-sm bg-stone-100/40 dark:bg-stone-950">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search Input with Telugu Support */}
        <div className="relative w-72 sm:w-80 pointer-events-auto shadow-md rounded-xl">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.tree.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
              {searchResults.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => handleSelectSearchResult(person)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block">
                      {person.first_name} {person.last_name || ''}
                    </span>
                    {person.telugu_name && (
                      <span className="text-[11px] text-amber-800 dark:text-amber-400 block">
                        {person.telugu_name}
                      </span>
                    )}
                  </div>
                  {person.native_village && (
                    <span className="text-[10px] text-stone-400">{person.native_village}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Branch Filter & Reset Focus */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {focusPersonId && (
            <button
              type="button"
              onClick={() => setFocusPersonId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-800 text-white hover:bg-amber-900 shadow-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.tree.resetFocus}</span>
            </button>
          )}

          {canEdit && onAddFirstPerson && (
            <button
              type="button"
              onClick={onAddFirstPerson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-700" />
              <span>{locale === 'en' ? 'Add Person' : 'సభ్యుడిని చేర్చు'}</span>
            </button>
          )}
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#ded5c8" />
        <Controls position="bottom-right" className="!shadow-md !rounded-xl !overflow-hidden" />
        <MiniMap
          position="bottom-left"
          nodeColor={(node) => {
            const p = (node.data as any)?.person as Person;
            if (p?.gender === 'female') return '#e11d48';
            if (p?.gender === 'male') return '#b45309';
            return '#78716c';
          }}
          className="!rounded-xl !overflow-hidden !border-stone-300 dark:!border-stone-700 shadow-md"
        />
      </ReactFlow>

      {/* Legend at bottom */}
      <div className="absolute bottom-4 left-44 z-10 hidden sm:flex items-center gap-4 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300 shadow-xs pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-700 inline-block" />
          <span>{locale === 'en' ? 'Male' : 'పురుషుడు'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
          <span>{locale === 'en' ? 'Female' : 'స్త్రీ'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5 bg-amber-800 inline-block" />
          <span>{locale === 'en' ? 'Parent-Child' : 'తల్లిదండ్రులు-సంతానం'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5 border-t border-dashed border-amber-600 inline-block" />
          <span>💍 {locale === 'en' ? 'Spouse' : 'భార్య/భర్త'}</span>
        </span>
      </div>
    </div>
  );
}
