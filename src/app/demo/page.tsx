'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FamilyTreeFlow } from '@/components/tree/FamilyTreeFlow';
import { PersonProfileDrawer } from '@/components/people/PersonProfileDrawer';
import { PersonFormModal } from '@/components/people/PersonFormModal';
import { AddRelationshipModal } from '@/components/people/AddRelationshipModal';
import { TimelineView } from '@/components/timeline/TimelineView';
import { MemoriesView } from '@/components/memories/MemoriesView';
import { MembersManagement } from '@/components/settings/MembersManagement';
import {
  DEMO_FAMILY,
  DEMO_PEOPLE,
  DEMO_RELATIONSHIPS,
  DEMO_EVENTS,
  DEMO_MEMORIES,
} from '@/lib/demo-data';
import { Person, Relationship, FamilyEvent, Memory } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';
import {
  TreePine,
  Users,
  Clock,
  BookOpen,
  Settings,
  Sparkles,
  Info,
  Download,
  Plus,
} from 'lucide-react';

export default function DemoPage() {
  const { t, locale } = useTranslation();

  // Demo active state
  const [people, setPeople] = useState<Person[]>(DEMO_PEOPLE);
  const [relationships, setRelationships] = useState<Relationship[]>(DEMO_RELATIONSHIPS);
  const [events, setEvents] = useState<FamilyEvent[]>(DEMO_EVENTS);
  const [memories, setMemories] = useState<Memory[]>(DEMO_MEMORIES);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'tree' | 'people' | 'timeline' | 'memories' | 'settings'>('tree');

  // Modals & Drawer state
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isAddRelModalOpen, setIsAddRelModalOpen] = useState(false);
  const [relModalTargetPerson, setRelModalTargetPerson] = useState<Person | null>(null);
  const [relModalType, setRelModalType] = useState<'parent' | 'child' | 'spouse'>('child');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Add / Edit Person Handler
  const handleSavePerson = (personData: Partial<Person>) => {
    if (editingPerson) {
      setPeople((prev) =>
        prev.map((p) => (p.id === editingPerson.id ? ({ ...p, ...personData } as Person) : p))
      );
      if (selectedPerson?.id === editingPerson.id) {
        setSelectedPerson((prev) => (prev ? ({ ...prev, ...personData } as Person) : null));
      }
      showToast(locale === 'en' ? 'Person profile updated!' : 'వ్యక్తిగత వివరాలు నవీకరించబడ్డాయి!');
    } else {
      const newPerson = {
        ...personData,
        id: `p-${Date.now()}`,
        family_id: DEMO_FAMILY.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Person;
      setPeople((prev) => [...prev, newPerson]);
      showToast(locale === 'en' ? 'New family member added!' : 'కొత్త కుటుంబ సభ్యుడు చేర్చబడ్డారు!');
    }
    setEditingPerson(null);
  };

  // Delete Person Handler
  const handleDeletePerson = (personToDelete: Person) => {
    setPeople((prev) => prev.filter((p) => p.id !== personToDelete.id));
    setRelationships((prev) =>
      prev.filter(
        (r) => r.person1_id !== personToDelete.id && r.person2_id !== personToDelete.id
      )
    );
    setSelectedPerson(null);
    showToast(locale === 'en' ? 'Person removed from tree' : 'వ్యక్తి తొలగించబడ్డారు');
  };

  // Add Relationship Handler
  const handleSaveRelationship = (newRel: Partial<Relationship>) => {
    const relRecord: Relationship = {
      ...newRel,
      id: `r-${Date.now()}`,
      family_id: DEMO_FAMILY.id,
      created_at: new Date().toISOString(),
    } as Relationship;
    setRelationships((prev) => [...prev, relRecord]);
    showToast(locale === 'en' ? 'Family relationship established!' : 'కుటుంబ సంబంధం జోడించబడింది!');
  };

  // Trigger Add Relative from Node or Profile
  const handleStartAddRelative = (
    person: Person,
    type: 'parent' | 'child' | 'spouse'
  ) => {
    setRelModalTargetPerson(person);
    setRelModalType(type);
    setIsAddRelModalOpen(true);
  };

  // Export Data to JSON file
  const handleExportData = () => {
    const backup = {
      family: DEMO_FAMILY,
      people,
      relationships,
      events,
      memories,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `family_heritage_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(locale === 'en' ? 'Genealogy backup downloaded!' : 'సమాచారం విజయవంతంగా ఎగుమతి చేయబడింది!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar isDemo />

      {/* Demo Banner */}
      <div className="bg-amber-100/90 dark:bg-amber-950/70 border-b border-amber-200 dark:border-amber-900 px-4 py-2 text-xs text-amber-900 dark:text-amber-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>
              <strong>{locale === 'en' ? 'Interactive Demonstration Mode' : 'ప్రత్యక్ష డెమో మోడ్'}:</strong>{' '}
              {locale === 'en'
                ? 'Exploring fictional multi-generational Godavari delta lineage. Changes are active in your browser session.'
                : 'గోదావరి సీమ సూర్యనారాయణ వంశ చరిత్ర. ఎలాంటి లాగిన్ లేకుండా మీరు మార్పులను పరీక్షించవచ్చు.'}
            </span>
          </div>
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1 font-semibold underline text-amber-950 dark:text-amber-100 hover:text-amber-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Export Demo JSON' : 'సమాచారాన్ని డౌన్‌లోడ్ చేయి'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Family Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300 block mb-1">
              {locale === 'en' ? 'Heritage Family Workspace' : 'కుటుంబ వారసత్వ భాండాగారం'}
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-amber-50 mb-2">
              {DEMO_FAMILY.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {locale === 'te'
                ? 'గోదావరి తీరప్రాంత రావు వంశస్థుల మూడు తరాల కుటుంబ చరిత్ర, అనుబంధాలు మరియు మౌఖిక గాథల సంకలనం.'
                : DEMO_FAMILY.description}
            </p>
          </div>
        </div>

        {/* Workspace Tab Bar */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tree')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tree'
                ? 'border-amber-800 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <TreePine className="w-4 h-4" />
            <span>{t.nav.familyTree}</span>
          </button>

          <button
            onClick={() => setActiveTab('people')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'people'
                ? 'border-amber-800 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.nav.people} ({people.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-amber-800 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{t.nav.timeline} ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('memories')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'memories'
                ? 'border-amber-800 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.nav.memories} ({memories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-800 text-amber-800 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t.nav.settings}</span>
          </button>
        </div>

        {/* Tab 1: Interactive Family Tree */}
        {activeTab === 'tree' && (
          <div className="space-y-4">
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
          </div>
        )}

        {/* Tab 2: People Directory Grid */}
        {activeTab === 'people' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {t.nav.people}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingPerson(null);
                  setIsPersonModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-800 text-white hover:bg-amber-900 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{locale === 'en' ? 'Add Person' : 'సభ్యుడిని చేర్చు'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {people.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPerson(p)}
                  className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-700 shadow-xs transition-all cursor-pointer flex items-start gap-3.5"
                >
                  {p.avatar_url ? (
                    <img
                      src={p.avatar_url}
                      alt={p.first_name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-800 text-amber-50 flex items-center justify-center font-bold text-sm shrink-0">
                      {p.first_name[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {p.first_name} {p.last_name || ''}
                    </h4>
                    {p.telugu_name && (
                      <p className="text-xs text-amber-800 dark:text-amber-400 truncate">
                        {p.telugu_name}
                      </p>
                    )}
                    {p.occupation && (
                      <p className="text-[11px] text-stone-500 truncate mt-1">
                        {p.occupation}
                      </p>
                    )}
                    {p.native_village && (
                      <p className="text-[10px] text-stone-400 truncate">
                        📍 {p.native_village}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Timeline */}
        {activeTab === 'timeline' && (
          <TimelineView
            events={events}
            people={people}
            onAddEvent={() => {
              showToast(locale === 'en' ? 'Event form open' : 'ఘట్టాన్ని చేర్చండి');
            }}
          />
        )}

        {/* Tab 4: Memories */}
        {activeTab === 'memories' && (
          <MemoriesView
            memories={memories}
            people={people}
            onAddMemory={() => {
              showToast(locale === 'en' ? 'Story recorder open' : 'కథను నమోదు చేయండి');
            }}
          />
        )}

        {/* Tab 5: Settings */}
        {activeTab === 'settings' && (
          <MembersManagement
            family={DEMO_FAMILY}
            onExportData={handleExportData}
          />
        )}
      </main>

      {/* Drawer: Detailed Person Profile */}
      <PersonProfileDrawer
        person={selectedPerson}
        allPeople={people}
        allRelationships={relationships}
        allEvents={events}
        allMemories={memories}
        onClose={() => setSelectedPerson(null)}
        onSelectPerson={(p) => setSelectedPerson(p)}
        onEdit={(p) => {
          setEditingPerson(p);
          setIsPersonModalOpen(true);
        }}
        onDelete={handleDeletePerson}
      />

      {/* Modal: Person Create / Edit */}
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

      {/* Modal: Add Relationship with Cycle Check */}
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      <Footer />
    </div>
  );
}
