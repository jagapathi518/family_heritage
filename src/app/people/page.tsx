'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PersonProfileDrawer } from '@/components/people/PersonProfileDrawer';
import { PersonFormModal } from '@/components/people/PersonFormModal';
import {
  DEMO_FAMILY,
  DEMO_PEOPLE,
  DEMO_RELATIONSHIPS,
  DEMO_EVENTS,
  DEMO_MEMORIES,
} from '@/lib/demo-data';
import { Person } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';
import { Users, Search, Plus, MapPin, ShieldCheck, Calendar } from 'lucide-react';

export default function PeoplePage() {
  const { t, locale } = useTranslation();

  const [people, setPeople] = useState<Person[]>(DEMO_PEOPLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);

  const filteredPeople = people.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      `${p.first_name} ${p.last_name || ''}`.toLowerCase().includes(q) ||
      (p.telugu_name && p.telugu_name.toLowerCase().includes(q)) ||
      (p.native_village && p.native_village.toLowerCase().includes(q)) ||
      (p.occupation && p.occupation.toLowerCase().includes(q))
    );
  });

  const handleSavePerson = (personData: Partial<Person>) => {
    if (editingPerson) {
      setPeople((prev) =>
        prev.map((p) => (p.id === editingPerson.id ? ({ ...p, ...personData } as Person) : p))
      );
      if (selectedPerson?.id === editingPerson.id) {
        setSelectedPerson((prev) => (prev ? ({ ...prev, ...personData } as Person) : null));
      }
    } else {
      const newPerson = {
        ...personData,
        id: `p-${Date.now()}`,
        family_id: DEMO_FAMILY.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Person;
      setPeople((prev) => [...prev, newPerson]);
    }
    setEditingPerson(null);
  };

  const handleDeletePerson = (p: Person) => {
    setPeople((prev) => prev.filter((item) => item.id !== p.id));
    setSelectedPerson(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
              {t.nav.people}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {locale === 'en'
                ? 'Complete roster of family members, ancestors, and generations.'
                : 'కుటుంబ సభ్యులు, పూర్వీకులు మరియు తరువాతి తరాల సమగ్ర జాబితా.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingPerson(null);
              setIsPersonModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'en' ? 'Add Person' : 'సభ్యుడిని చేర్చు'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.tree.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:ring-2 focus:ring-amber-700"
          />
        </div>

        {/* People Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map((person) => {
            const birthYear = person.date_of_birth
              ? new Date(person.date_of_birth).getFullYear()
              : person.birth_year_approximate || null;
            const deathYear = person.date_of_death
              ? new Date(person.date_of_death).getFullYear()
              : person.death_year_approximate || null;

            return (
              <div
                key={person.id}
                onClick={() => setSelectedPerson(person)}
                className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs hover:border-amber-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  {person.avatar_url ? (
                    <img
                      src={person.avatar_url}
                      alt={person.first_name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-amber-800 text-amber-50 flex items-center justify-center font-serif font-bold text-base shrink-0">
                      {person.first_name[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {person.first_name} {person.last_name || ''}
                      </h3>
                      {person.confidence_status === 'verified' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    {person.telugu_name && (
                      <p className="text-xs text-amber-800 dark:text-amber-400 font-medium truncate font-telugu">
                        {person.telugu_name}
                      </p>
                    )}

                    {(birthYear || deathYear) && (
                      <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                        {birthYear} – {person.is_deceased ? deathYear || '?' : t.common.living}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
                  <span className="truncate">
                    {person.native_village ? `📍 ${person.native_village}` : person.occupation || 'Family Member'}
                  </span>
                  <span className="text-amber-800 dark:text-amber-400 font-semibold text-[11px]">
                    {t.common.view} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <PersonProfileDrawer
        person={selectedPerson}
        allPeople={people}
        allRelationships={DEMO_RELATIONSHIPS}
        allEvents={DEMO_EVENTS}
        allMemories={DEMO_MEMORIES}
        onClose={() => setSelectedPerson(null)}
        onSelectPerson={(p) => setSelectedPerson(p)}
        onEdit={(p) => {
          setEditingPerson(p);
          setIsPersonModalOpen(true);
        }}
        onDelete={handleDeletePerson}
      />

      <PersonFormModal
        isOpen={isPersonModalOpen}
        person={editingPerson}
        familyId={DEMO_FAMILY.id}
        onClose={() => {
          setIsPersonModalOpen(false);
          setEditingPerson(null);
        }}
        onSave={handleSavePerson}
      />

      <Footer />
    </div>
  );
}
