'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { DEMO_FAMILY, DEMO_PEOPLE, DEMO_EVENTS, DEMO_MEMORIES } from '@/lib/demo-data';
import { Family, FamilyRole } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';
import {
  TreePine,
  Users,
  Clock,
  BookOpen,
  Settings,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FolderOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const { isConfigured } = getSupabaseEnv();

  const [families, setFamilies] = useState<Family[]>([]);
  const [activeFamily, setActiveFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateFamilyModal, setShowCreateFamilyModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilyDesc, setNewFamilyDesc] = useState('');

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      if (!isConfigured) {
        // Fallback gracefully to demo family workspace
        setFamilies([DEMO_FAMILY]);
        setActiveFamily(DEMO_FAMILY);
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // If not logged in and not configured, route to demo or login
          setFamilies([DEMO_FAMILY]);
          setActiveFamily(DEMO_FAMILY);
        } else {
          // Fetch families user belongs to
          const { data: memberships } = await supabase
            .from('family_memberships')
            .select('role, families(*)')
            .eq('user_id', session.user.id);

          if (memberships && memberships.length > 0) {
            const famList = memberships.map((m: any) => m.families).filter(Boolean);
            setFamilies(famList);
            setActiveFamily(famList[0]);
          } else {
            // First time user, suggest creating family
            setShowCreateFamilyModal(true);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setFamilies([DEMO_FAMILY]);
        setActiveFamily(DEMO_FAMILY);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [isConfigured]);

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName.trim()) return;

    const newFam: Family = {
      id: `fam-${Date.now()}`,
      name: newFamilyName.trim(),
      description: newFamilyDesc.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setFamilies((prev) => [...prev, newFam]);
    setActiveFamily(newFam);
    setShowCreateFamilyModal(false);
    setNewFamilyName('');
    setNewFamilyDesc('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Supabase status notice if unconfigured */}
        {!isConfigured && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <p className="font-bold">
                  {locale === 'en'
                    ? 'Explore with Demo Workspace'
                    : 'డెమో వర్క్‌స్పేస్‌తో పరిశీలించండి'}
                </p>
                <p className="text-stone-600 dark:text-stone-400">
                  {t.auth.supabaseNotConfiguredNotice}
                </p>
              </div>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-800 text-white font-semibold hover:bg-amber-900 transition-colors"
            >
              <span>{t.auth.useDemoInstead}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
              {locale === 'en' ? 'Family Heritage Dashboard' : 'కుటుంబ వారసత్వ డాష్‌బోర్డ్'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {locale === 'en'
                ? 'Manage your family archives, recent milestones, and ancestral branches.'
                : 'మీ కుటుంబ భాండాగారాలు, మైలురాళ్ళు మరియు వంశవృక్షాన్ని నిర్వహించండి.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateFamilyModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'en' ? 'Create Family Archive' : 'కొత్త వంశం ప్రారంభించండి'}</span>
            </button>
          </div>
        </div>

        {/* Active Family Selector Card */}
        {activeFamily && (
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 flex items-center justify-center">
                  <TreePine className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 tracking-wider">
                    {locale === 'en' ? 'Active Family Workspace' : 'ప్రస్తుత కుటుంబ భాండాగారం'}
                  </span>
                  <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                    {activeFamily.name}
                  </h2>
                </div>
              </div>

              {/* Family Switcher */}
              {families.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">Switch:</span>
                  <select
                    value={activeFamily.id}
                    onChange={(e) => {
                      const fam = families.find((f) => f.id === e.target.value);
                      if (fam) setActiveFamily(fam);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  >
                    {families.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Quick Navigation Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/tree"
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 hover:border-amber-700 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <TreePine className="w-5 h-5 text-amber-800 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  {t.nav.familyTree}
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">
                  {locale === 'en'
                    ? 'Explore interactive genealogy tree'
                    : 'ఇంటరాక్టివ్ వంశవృక్షాన్ని వీక్షించండి'}
                </p>
              </Link>

              <Link
                href="/people"
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 hover:border-amber-700 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-amber-800 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  {t.nav.people}
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">
                  {locale === 'en'
                    ? 'Detailed profiles & life stories'
                    : 'వ్యక్తిగత చరిత్రలు & జీవిత విశేషాలు'}
                </p>
              </Link>

              <Link
                href="/timeline"
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 hover:border-amber-700 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-amber-800 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  {t.nav.timeline}
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">
                  {locale === 'en'
                    ? 'Chronological family milestones'
                    : 'కాలక్రమ కుటుంబ మైలురాళ్ళు'}
                </p>
              </Link>

              <Link
                href="/memories"
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 hover:border-amber-700 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-5 h-5 text-amber-800 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  {t.nav.memories}
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">
                  {locale === 'en'
                    ? 'Oral stories & family photographs'
                    : 'మధుర జ్ఞాపకాలు & ఫోటోలు'}
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* Recent Activity Log & Onboarding Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>{locale === 'en' ? 'Recent Milestones' : 'ఇటీవలి ఘట్టాలు'}</span>
            </h3>

            <div className="space-y-3">
              {DEMO_EVENTS.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800"
                >
                  <p className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    {locale === 'te' && evt.title_telugu ? evt.title_telugu : evt.title}
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                    {evt.event_date} {evt.location ? `• ${evt.location}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{locale === 'en' ? 'Genealogy Best Practices' : 'వంశవృక్ష సూచనలు'}</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0" />
                <span>
                  {locale === 'en'
                    ? 'Start by adding your oldest known ancestors (e.g. Great-grandparents).'
                    : 'మీకు తెలిసిన పెద్దాయన లేదా ముత్తాత వివరాలతో వంశవృక్షాన్ని ప్రారంభించండి.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0" />
                <span>
                  {locale === 'en'
                    ? 'Include native villages and ancestral districts in Telugu and English.'
                    : 'స్వగ్రామం మరియు పూర్వీకుల నివాస ప్రదేశాలను నమోదు చేయండి.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0" />
                <span>
                  {locale === 'en'
                    ? 'Use approximate flags (~) for estimated historical birth and death years.'
                    : 'ఖచ్చితమైన తేదీలు తెలియనప్పుడు సుమారు సంవత్సరాన్ని (~) ఉపయోగించండి.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Modal: Create Family Archive */}
      {showCreateFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              {locale === 'en' ? 'Create New Family Archive' : 'కొత్త కుటుంబ భాండాగారం'}
            </h3>
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {locale === 'en' ? 'Family Archive Name' : 'వంశం పేరు'} *
                </label>
                <input
                  type="text"
                  required
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  placeholder="e.g. Godavari Suryanarayana Archive"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {locale === 'en' ? 'Description & Heritage Roots' : 'వివరణ & మూలాలు'}
                </label>
                <textarea
                  rows={2}
                  value={newFamilyDesc}
                  onChange={(e) => setNewFamilyDesc(e.target.value)}
                  placeholder="Preserving ancestors from..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFamilyModal(false)}
                  className="px-3.5 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs"
                >
                  {locale === 'en' ? 'Create Archive' : 'సృష్టించు'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
