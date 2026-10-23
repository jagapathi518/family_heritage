import type { Metadata, Viewport } from 'next';
import { I18nProvider } from '@/lib/i18n/context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital Family Heritage — డిజిటల్ కుటుంబ వారసత్వం',
  description:
    'Preserve family roots, ancestral history, relationships, photographs, biographies, and personal memories across generations in English and Telugu.',
  keywords: [
    'Genealogy',
    'Family Tree',
    'Telugu Heritage',
    'Ancestry',
    'వంశవృక్షం',
    'కుటుంబ చరిత్ర',
    'Family Archive',
    'Digital Heritage',
  ],
  authors: [{ name: 'Digital Family Heritage Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
