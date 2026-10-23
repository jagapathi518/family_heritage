'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MembersManagement } from '@/components/settings/MembersManagement';
import { DEMO_FAMILY } from '@/lib/demo-data';
import { useTranslation } from '@/lib/i18n/context';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            {t.settings.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t.settings.familyDesc}
          </p>
        </div>

        <MembersManagement family={DEMO_FAMILY} />
      </main>

      <Footer />
    </div>
  );
}
