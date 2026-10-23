'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FamilyTreeFlow } from '@/components/tree/FamilyTreeFlow';
import { PersonProfileDrawer } from '@/components/people/PersonProfileDrawer';
import { PersonFormModal } from '@/components/people/PersonFormModal';
import { AddRelationshipModal } from '@/components/people/AddRelationshipModal';
import {
  DEMO_FAMILY,
  DEMO_PEOPLE,
  DEMO_RELATIONSHIPS,
  DEMO_EVENTS,
  DEMO_MEMORIES,
} from '@/lib/demo-data';
import { Person, Relationship } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';

export default function TreePage() {
  const { t, locale } = useTranslation();

  const [people, setPeople] = useState<Person[]>(DEMO_PEOPLE);
  const [relationships, setRelationships] = useState<Relationship[]>(DEMO_RELATIONSHIPS);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isAddRelModalOpen, setIsAddRelModalOpen] = useState(false);
  const [relModalTargetPerson, setRelModalTargetPerson] = useState<Person | null>(null);
  const [relModalType, setRelModalType] = useState<'parent' | 'child' | 'spouse'>('child');

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
    setRelationships((prev) =>
      prev.filter((r) => r.person1_id !== p.id && r.person2_id !== p.id)
    );
    setSelectedPerson(null);
  };

  const handleSaveRelationship = (newRel: Partial<Relationship>) => {
    const relRecord: Relationship = {
      ...newRel,
      id: `r-${Date.now()}`,
      family_id: DEMO_FAMILY.id,
      created_at: new Date().toISOString(),
    } as Relationship;
    setRelationships((prev) => [...prev, relRecord]);
  };

  const handleStartAddRelative = (
    person: Person,
    type: 'parent' | 'child' | 'spouse'
  ) => {
    setRelModalTargetPerson(person);
    setRelModalType(type);
    setIsAddRelModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
              {t.tree.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t.tree.subtitle}
            </p>
          </div>
        </div>

        <FamilyTreeFlow
          initialPeople={people}
          initialRelationships={relationships}
          onSelectPerson={(person) => setSelectedPerson(person)}
          onAddRelative={handleStartAddRelative}
          onAddFirstPerson={() => {
            setEditingPerson(null);
            setIsPersonModalOpen(true);
          }}
          canEdit={true}
        />
      </main>

      <PersonProfileDrawer
        person={selectedPerson}
        allPeople={people}
        allRelationships={relationships}
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

      <AddRelationshipModal
        isOpen={isAddRelModalOpen}
        person={relModalTargetPerson}
        initialType={relModalType}
        allPeople={people}
        allRelationships={relationships}
        familyId={DEMO_FAMILY.id}
        onClose={() => {
          setIsAddRelModalOpen(false);
          setRelModalTargetPerson(null);
        }}
        onSave={handleSaveRelationship}
      />

      <Footer />
    </div>
  );
}
