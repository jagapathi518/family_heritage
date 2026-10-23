'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { TreePine, Heart, ShieldCheck, Globe, BookOpen } from 'lucide-react';

export function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer className="bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-800 text-amber-50 flex items-center justify-center">
                <TreePine className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">
                {t.common.appName}
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md leading-relaxed">
              {locale === 'en'
                ? 'Dedicated to honoring ancestral stories, preserving family photographs, and recording intergenerational relationships across the world with respect, privacy, and cultural richness.'
                : 'పూర్వీకుల చరిత్రలను, కుటుంబ ఛాయాచిత్రాలను మరియు తరతరాల అనుబంధాలను గౌరవప్రదంగా, సురక్షితంగా భద్రపరిచేందుకు అంకితం చేయబడిన వేదిక.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pt-2">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {locale === 'en' ? 'Private by Default' : 'ప్రైవేట్ భాండాగారం'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {locale === 'en' ? 'English & Telugu Unicode' : 'తెలుగు మరియు ఆంగ్ల భాషా మద్దతు'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-200 mb-3">
              {locale === 'en' ? 'Platform Navigation' : 'వేదిక నావిగేషన్'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/" className="hover:text-amber-700 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-amber-700 transition-colors">
                  {t.nav.demo}
                </Link>
              </li>
              <li>
                <Link href="/tree" className="hover:text-amber-700 transition-colors">
                  {t.nav.familyTree}
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-amber-700 transition-colors">
                  {t.nav.timeline}
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-amber-700 transition-colors">
                  {t.nav.memories}
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Heritage Notice */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-200 mb-3">
              {locale === 'en' ? 'Archival Principles' : 'వారసత్వ సూత్రాలు'}
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
              {locale === 'en'
                ? 'Your family records are protected by database row-level security. Unknown and approximate historical dates are respectfully represented.'
                : 'మీ కుటుంబ సమాచారం పూర్తి రక్షణతో ఉంటుంది. చారిత్రక రికార్డులను అసలైన భాషలోనే భద్రపరుస్తాము.'}
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900">
              <BookOpen className="w-3 h-3" />
              <span>{locale === 'en' ? 'Oral lore preservation' : 'మౌఖిక కథల నమోదు'}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>© 2026 {t.common.appName}. {locale === 'en' ? 'All rights reserved.' : 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.'}</p>
          <p className="flex items-center gap-1">
            <span>Built with care for families & future generations</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
