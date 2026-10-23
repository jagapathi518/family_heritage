'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MemoriesView } from '@/components/memories/MemoriesView';
import { DEMO_PEOPLE, DEMO_MEMORIES } from '@/lib/demo-data';
import { Memory } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';

export default function MemoriesPage() {
  const { t, locale } = useTranslation();
  const [memories, setMemories] = useState<Memory[]>(DEMO_MEMORIES);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            {t.memories.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t.memories.subtitle}
          </p>
        </div>

        <MemoriesView
          memories={memories}
          people={DEMO_PEOPLE}
          onAddMemory={() => {
            alert(
              locale === 'en'
                ? 'To record a new memory or story, test it in the interactive demo!'
                : 'కథను నమోదు చేయడానికి ప్రత్యక్ష డెమోను ఉపయోగించండి!'
            );
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
