'use client';

import React, { useState } from 'react';
import { Person, Relationship, FamilyEvent, Memory } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Home,
  ShieldCheck,
  Heart,
  Users,
  BookOpen,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PersonProfileDrawerProps {
  person: Person | null;
  allPeople: Person[];
  allRelationships: Relationship[];
  allEvents?: FamilyEvent[];
  allMemories?: Memory[];
  onClose: () => void;
  onEdit?: (person: Person) => void;
  onDelete?: (person: Person) => void;
  onSelectPerson?: (person: Person) => void;
  canEdit?: boolean;
}

export function PersonProfileDrawer({
  person,
  allPeople,
  allRelationships,
  allEvents = [],
  allMemories = [],
  onClose,
  onEdit,
  onDelete,
  onSelectPerson,
  canEdit = true,
}: PersonProfileDrawerProps) {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'bio' | 'relatives' | 'timeline' | 'memories'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!person) return null;

  const peopleMap = new Map<string, Person>(allPeople.map((p) => [p.id, p]));

  // Find Parents
  const parents = allRelationships
    .filter((r) => r.relationship_type === 'parent_child' && r.person2_id === person.id)
    .map((r) => peopleMap.get(r.person1_id))
    .filter(Boolean) as Person[];

  // Find Children
  const children = allRelationships
    .filter((r) => r.relationship_type === 'parent_child' && r.person1_id === person.id)
    .map((r) => peopleMap.get(r.person2_id))
    .filter(Boolean) as Person[];

  // Find Spouses
  const spouses = allRelationships
    .filter(
      (r) =>
        r.relationship_type === 'spouse' &&
        (r.person1_id === person.id || r.person2_id === person.id)
    )
    .map((r) => peopleMap.get(r.person1_id === person.id ? r.person2_id : r.person1_id))
    .filter(Boolean) as Person[];

  // Find Siblings (People sharing at least one parent)
  const parentIds = new Set(parents.map((p) => p.id));
  const siblingIds = new Set<string>();
  if (parentIds.size > 0) {
    allRelationships.forEach((r) => {
      if (
        r.relationship_type === 'parent_child' &&
        parentIds.has(r.person1_id) &&
        r.person2_id !== person.id
      ) {
        siblingIds.add(r.person2_id);
      }
    });
  }
  const siblings = Array.from(siblingIds)
    .map((id) => peopleMap.get(id))
    .filter(Boolean) as Person[];

  // Events for this person
  const personEvents = allEvents.filter(
    (e) => e.associated_people_ids && e.associated_people_ids.includes(person.id)
  );

  // Memories for this person
  const personMemories = allMemories.filter((m) => m.person_id === person.id);

  // Date span
  const birthYear = person.date_of_birth
    ? new Date(person.date_of_birth).getFullYear()
    : person.birth_year_approximate || null;

  const deathYear = person.date_of_death
    ? new Date(person.date_of_death).getFullYear()
    : person.death_year_approximate || null;

  const displayName = `${person.first_name} ${person.last_name || ''}`.trim();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-xl h-full bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-950">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              {t.person.profileTitle}
            </span>
            {person.confidence_status === 'verified' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                <span>{t.common.verified}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {canEdit && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(person)}
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title={t.common.edit}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {canEdit && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title={t.common.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ml-1"
              title={t.common.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Warning */}
        {showDeleteConfirm && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border-b border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{t.person.deleteConfirm}</p>
              <p className="text-[11px] text-rose-700 dark:text-rose-300">{t.person.deleteWarning}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 text-xs rounded border border-rose-300 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  onDelete?.(person);
                  setShowDeleteConfirm(false);
                }}
                className="px-2.5 py-1 text-xs rounded bg-rose-700 text-white font-medium hover:bg-rose-800"
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        )}

        {/* Person Hero Header */}
        <div className="p-6 bg-gradient-to-b from-stone-100 to-stone-50 dark:from-stone-950 dark:to-stone-900 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              {person.avatar_url ? (
                <img
                  src={person.avatar_url}
                  alt={displayName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-600/40 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-amber-800 text-amber-50 flex items-center justify-center font-serif font-bold text-2xl shadow-md">
                  {person.first_name?.[0] || 'P'}
                </div>
              )}
              {person.is_deceased && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-md text-[10px] font-bold">
                  † {t.common.deceased}
                </span>
              )}
            </div>

            {/* Core Info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100 leading-tight">
                {displayName}
              </h2>
              {person.telugu_name && (
                <p className="text-base font-medium text-amber-800 dark:text-amber-400 mt-0.5">
                  {person.telugu_name}
                </p>
              )}
              {person.nickname && (
                <p className="text-xs text-stone-500 italic mt-0.5">
                  &ldquo;{person.nickname}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-stone-600 dark:text-stone-300">
                {(birthYear || deathYear) && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {person.is_birth_date_approximate ? '~' : ''}
                      {birthYear || '?'} –{' '}
                      {person.is_deceased
                        ? (person.is_death_date_approximate ? '~' : '') + (deathYear || '?')
                        : t.common.living}
                    </span>
                  </span>
                )}
                {person.native_village && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{person.native_village}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-6 gap-6 bg-white dark:bg-stone-950 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-700 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {locale === 'en' ? 'Overview' : 'సారాంశం'}
          </button>
          <button
            onClick={() => setActiveTab('bio')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'bio'
                ? 'border-amber-700 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {locale === 'en' ? 'Life Story' : 'జీవిత చరిత్ర'}
          </button>
          <button
            onClick={() => setActiveTab('relatives')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'relatives'
                ? 'border-amber-700 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {locale === 'en' ? 'Family Connections' : 'కుటుంబ బంధాలు'}
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-amber-700 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.person.eventsTab} ({personEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'memories'
                ? 'border-amber-700 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.person.memoriesTab} ({personMemories.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {person.occupation && (
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                      {t.person.occupation}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                      <Briefcase className="w-4 h-4 text-amber-700" />
                      <span>{person.occupation}</span>
                    </div>
                  </div>
                )}
                {person.education && (
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                      {t.person.education}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                      <GraduationCap className="w-4 h-4 text-amber-700" />
                      <span className="truncate">{person.education}</span>
                    </div>
                  </div>
                )}
                {person.birthplace && (
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                      {t.person.birthplace}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                      <MapPin className="w-4 h-4 text-stone-500" />
                      <span>{person.birthplace}</span>
                    </div>
                  </div>
                )}
                {person.ancestral_home && (
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                      {t.person.ancestralHome}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                      <Home className="w-4 h-4 text-amber-700" />
                      <span className="truncate">{person.ancestral_home}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Short Bio preview */}
              {(person.biography || person.biography_telugu) && (
                <div className="p-4 rounded-xl bg-stone-100/70 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs uppercase font-semibold text-stone-500 mb-2">
                    {locale === 'en' ? 'Biographical Summary' : 'జీవిత సంగ్రహం'}
                  </h4>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {locale === 'te' && person.biography_telugu
                      ? person.biography_telugu
                      : person.biography || person.biography_telugu}
                  </p>
                </div>
              )}

              {/* Key Relatives Quick Preview */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-stone-500 mb-2">
                  {locale === 'en' ? 'Immediate Family' : 'సమీప బంధువులు'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {parents.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectPerson?.(p)}
                      className="p-2 text-left rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-amber-700 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] text-stone-400 block">
                          {locale === 'en' ? 'Parent' : 'తల్లి/తండ్రి'}
                        </span>
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate block">
                          {p.first_name} {p.last_name || ''}
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                  {spouses.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelectPerson?.(s)}
                      className="p-2 text-left rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-amber-700 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] text-amber-700 block">
                          💍 {locale === 'en' ? 'Spouse' : 'భార్య/భర్త'}
                        </span>
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate block">
                          {s.first_name} {s.last_name || ''}
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                  {children.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectPerson?.(c)}
                      className="p-2 text-left rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-amber-700 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] text-stone-400 block">
                          {locale === 'en' ? 'Child' : 'సంతానం'}
                        </span>
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate block">
                          {c.first_name} {c.last_name || ''}
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIFE STORY TAB */}
          {activeTab === 'bio' && (
            <div className="space-y-6">
              {person.biography && (
                <div className="p-4 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2">
                    {t.person.biography}
                  </h4>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                    {person.biography}
                  </p>
                </div>
              )}

              {person.biography_telugu && (
                <div className="p-4 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-400 mb-2">
                    {t.person.biographyTelugu}
                  </h4>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap font-telugu">
                    {person.biography_telugu}
                  </p>
                </div>
              )}

              {person.favorite_memories && (
                <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.person.favoriteMemories}</span>
                  </h4>
                  <p className="text-xs text-amber-900/90 dark:text-amber-200 leading-relaxed italic">
                    &ldquo;{person.favorite_memories}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FAMILY CONNECTIONS TAB */}
          {activeTab === 'relatives' && (
            <div className="space-y-6">
              {/* Parents */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-stone-500 mb-2">
                  {t.person.parentsTab} ({parents.length})
                </h4>
                {parents.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No parents recorded</p>
                ) : (
                  <div className="space-y-2">
                    {parents.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectPerson?.(p)}
                        className="w-full text-left p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-amber-600 transition-colors flex items-center justify-between"
                      >
                        <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                          {p.first_name} {p.last_name || ''}{' '}
                          {p.telugu_name && (
                            <span className="text-amber-800 text-[11px] ml-1">
                              ({p.telugu_name})
                            </span>
                          )}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Spouses */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-stone-500 mb-2">
                  {t.person.spousesTab} ({spouses.length})
                </h4>
                {spouses.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No spouse recorded</p>
                ) : (
                  <div className="space-y-2">
                    {spouses.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onSelectPerson?.(s)}
                        className="w-full text-left p-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/30 hover:border-amber-600 transition-colors flex items-center justify-between"
                      >
                        <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                          💍 {s.first_name} {s.last_name || ''}{' '}
                          {s.telugu_name && (
                            <span className="text-amber-800 text-[11px] ml-1">
                              ({s.telugu_name})
                            </span>
                          )}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Children */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-stone-500 mb-2">
                  {t.person.childrenTab} ({children.length})
                </h4>
                {children.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No children recorded</p>
                ) : (
                  <div className="space-y-2">
                    {children.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onSelectPerson?.(c)}
                        className="w-full text-left p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-amber-600 transition-colors flex items-center justify-between"
                      >
                        <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                          {c.first_name} {c.last_name || ''}{' '}
                          {c.telugu_name && (
                            <span className="text-amber-800 text-[11px] ml-1">
                              ({c.telugu_name})
                            </span>
                          )}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Siblings */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-stone-500 mb-2">
                  {t.person.siblingsTab} ({siblings.length})
                </h4>
                {siblings.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No siblings recorded</p>
                ) : (
                  <div className="space-y-2">
                    {siblings.map((sib) => (
                      <button
                        key={sib.id}
                        type="button"
                        onClick={() => onSelectPerson?.(sib)}
                        className="w-full text-left p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-amber-600 transition-colors flex items-center justify-between"
                      >
                        <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                          {sib.first_name} {sib.last_name || ''}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {personEvents.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-4 text-center">
                  No events linked to this family member yet.
                </p>
              ) : (
                personEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {locale === 'te' && evt.title_telugu ? evt.title_telugu : evt.title}
                      </span>
                      {evt.event_date && (
                        <span className="text-[11px] font-mono text-stone-400">
                          {evt.event_date}
                        </span>
                      )}
                    </div>
                    {evt.description && (
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        {evt.description}
                      </p>
                    )}
                    {evt.location && (
                      <span className="text-[10px] text-amber-700 flex items-center gap-1 pt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{evt.location}</span>
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* MEMORIES TAB */}
          {activeTab === 'memories' && (
            <div className="space-y-4">
              {personMemories.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-4 text-center">
                  No written memories or anecdotes about this person yet.
                </p>
              ) : (
                personMemories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 space-y-2"
                  >
                    <h5 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                      {mem.title}
                    </h5>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
                      &ldquo;{locale === 'te' && mem.content_telugu ? mem.content_telugu : mem.content}&rdquo;
                    </p>
                    {mem.contributor_name && (
                      <p className="text-[10px] text-stone-400 pt-1">
                        — {mem.contributor_name}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
