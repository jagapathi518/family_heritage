'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TimelineView } from '@/components/timeline/TimelineView';
import { DEMO_PEOPLE, DEMO_EVENTS } from '@/lib/demo-data';
import { FamilyEvent } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';

export default function TimelinePage() {
  const { t, locale } = useTranslation();
  const [events, setEvents] = useState<FamilyEvent[]>(DEMO_EVENTS);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            {t.timeline.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t.timeline.subtitle}
          </p>
        </div>

        <TimelineView
          events={events}
          people={DEMO_PEOPLE}
          onAddEvent={() => {
            alert(
              locale === 'en'
                ? 'To record a new milestone, use the form in the demo or configure Supabase for persistent saving.'
                : 'మైలురాయిని నమోదు చేయడానికి డెమోను లేదా సుపాబేస్‌ను ఉపయోగించండి.'
            );
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
