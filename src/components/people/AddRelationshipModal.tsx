'use client';

import React, { useState } from 'react';
import { Person, Relationship, RelationshipType } from '@/types/database';
import { wouldCreateCycle, isDuplicateRelationship } from '@/lib/cycle-prevention';
import { useTranslation } from '@/lib/i18n/context';
import { X, UserPlus, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AddRelationshipModalProps {
  person: Person | null;
  initialType?: 'parent' | 'child' | 'spouse';
  allPeople: Person[];
  allRelationships: Relationship[];
  isOpen: boolean;
  familyId: string;
  onClose: () => void;
  onSave: (relationship: Partial<Relationship>) => void;
  onCreateNewPersonAndLink?: (newPerson: Partial<Person>, relType: RelationshipType) => void;
}

export function AddRelationshipModal({
  person,
  initialType = 'child',
  allPeople,
  allRelationships,
  isOpen,
  familyId,
  onClose,
  onSave,
}: AddRelationshipModalProps) {
  const { t, locale } = useTranslation();
  const [relType, setRelType] = useState<RelationshipType>(
    initialType === 'parent' || initialType === 'child' ? 'parent_child' : 'spouse'
  );
  // Is current person the parent or the child in this relationship?
  const [direction, setDirection] = useState<'person_is_parent' | 'person_is_child'>(
    initialType === 'child' ? 'person_is_parent' : 'person_is_child'
  );
  const [selectedRelativeId, setSelectedRelativeId] = useState<string>('');
  const [marriageDate, setMarriageDate] = useState('');

  if (!isOpen || !person) return null;

  // Filter candidates: cannot link person to themselves
  const candidatePeople = allPeople.filter((p) => p.id !== person.id);

  // Validate cycle & duplicates
  let cycleError = '';
  let duplicateError = '';

  if (selectedRelativeId) {
    if (relType === 'parent_child') {
      const parentId = direction === 'person_is_parent' ? person.id : selectedRelativeId;
      const childId = direction === 'person_is_parent' ? selectedRelativeId : person.id;

      if (isDuplicateRelationship(allRelationships, parentId, childId, 'parent_child')) {
        duplicateError =
          locale === 'en'
            ? 'This parent-child relationship already exists.'
            : 'ఈ తల్లిదండ్రులు-సంతానం సంబంధం ఇప్పటికే నమోదు చేయబడింది.';
      } else if (wouldCreateCycle(allRelationships, parentId, childId)) {
        cycleError = t.tree.cycleDetectedError;
      }
    } else if (relType === 'spouse') {
      if (isDuplicateRelationship(allRelationships, person.id, selectedRelativeId, 'spouse')) {
        duplicateError =
          locale === 'en'
            ? 'This marriage / spouse relationship already exists.'
            : 'ఈ వివాహ బంధం ఇప్పటికే నమోదు చేయబడింది.';
      }
    }
  }

  const isValid = selectedRelativeId && !cycleError && !duplicateError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    let p1 = person.id;
    let p2 = selectedRelativeId;

    if (relType === 'parent_child') {
      p1 = direction === 'person_is_parent' ? person.id : selectedRelativeId;
      p2 = direction === 'person_is_parent' ? selectedRelativeId : person.id;
    }

    const payload: Partial<Relationship> = {
      id: `r-${Date.now()}`,
      family_id: familyId,
      person1_id: p1,
      person2_id: p2,
      relationship_type: relType,
      marriage_date: relType === 'spouse' ? marriageDate || null : null,
      created_at: new Date().toISOString(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
              {t.tree.addRelative}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target person banner */}
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-semibold text-stone-400 block">
              {locale === 'en' ? 'Relating to' : 'సంబంధిత వ్యక్తి'}
            </span>
            <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {person.first_name} {person.last_name || ''}
              {person.telugu_name && (
                <span className="text-amber-800 dark:text-amber-400 font-medium ml-1.5 font-telugu">
                  ({person.telugu_name})
                </span>
              )}
            </p>
          </div>

          {/* Relationship Type Selector */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              {locale === 'en' ? 'Connection Type' : 'సంబంధం రకం'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRelType('parent_child')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                  relType === 'parent_child'
                    ? 'border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                }`}
              >
                {locale === 'en' ? 'Parent / Child' : 'తల్లిదండ్రులు / సంతానం'}
              </button>
              <button
                type="button"
                onClick={() => setRelType('spouse')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                  relType === 'spouse'
                    ? 'border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                }`}
              >
                💍 {locale === 'en' ? 'Spouse / Marriage' : 'భార్య / భర్త'}
              </button>
            </div>
          </div>

          {/* If Parent_Child, direction */}
          {relType === 'parent_child' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                {locale === 'en' ? 'Direction' : 'దిశ'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('person_is_parent')}
                  className={`py-1.5 px-2.5 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer ${
                    direction === 'person_is_parent'
                      ? 'border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {person.first_name} is <strong>Parent</strong> of...
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('person_is_child')}
                  className={`py-1.5 px-2.5 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer ${
                    direction === 'person_is_child'
                      ? 'border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {person.first_name} is <strong>Child</strong> of...
                </button>
              </div>
            </div>
          )}

          {/* Select Relative Dropdown */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              {locale === 'en' ? 'Select Family Member' : 'కుటుంబ సభ్యుడిని ఎంచుకోండి'} *
            </label>
            <select
              required
              value={selectedRelativeId}
              onChange={(e) => setSelectedRelativeId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-700"
            >
              <option value="">-- Choose person --</option>
              {candidatePeople.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name || ''} {p.telugu_name ? `(${p.telugu_name})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Spouse Wedding Date */}
          {relType === 'spouse' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {locale === 'en' ? 'Marriage Date (Optional)' : 'వివాహ తేదీ (ఐచ్ఛికం)'}
              </label>
              <input
                type="date"
                value={marriageDate}
                onChange={(e) => setMarriageDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          )}

          {/* Cycle detection alert */}
          {cycleError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{cycleError}</span>
            </div>
          )}

          {/* Duplicate alert */}
          {duplicateError && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{duplicateError}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-amber-800 hover:bg-amber-900 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
            >
              {t.common.confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
