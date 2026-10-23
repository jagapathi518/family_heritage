'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n/context';
import {
  TreePine,
  Users,
  Clock,
  BookOpen,
  Settings,
  Sparkles,
  Menu,
  X,
  LogIn,
  UserPlus,
  Home,
  LayoutDashboard,
} from 'lucide-react';

interface NavbarProps {
  isDemo?: boolean;
}

export function Navbar({ isDemo = false }: NavbarProps) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = isDemo
    ? [
        { href: '/demo', label: t.nav.familyTree, icon: TreePine },
        { href: '/demo?tab=people', label: t.nav.people, icon: Users },
        { href: '/demo?tab=timeline', label: t.nav.timeline, icon: Clock },
        { href: '/demo?tab=memories', label: t.nav.memories, icon: BookOpen },
        { href: '/demo?tab=settings', label: t.nav.settings, icon: Settings },
      ]
    : [
        { href: '/', label: t.nav.home, icon: Home },
        { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { href: '/tree', label: t.nav.familyTree, icon: TreePine },
        { href: '/people', label: t.nav.people, icon: Users },
        { href: '/timeline', label: t.nav.timeline, icon: Clock },
        { href: '/memories', label: t.nav.memories, icon: BookOpen },
        { href: '/demo', label: t.nav.demo, icon: Sparkles, highlight: true },
      ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 text-amber-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <TreePine className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 block leading-tight">
                {t.common.appName}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block tracking-wide">
                {locale === 'en' ? 'Heritage & Ancestry Platform' : 'వంశవృక్షం & మూలాల భాండాగారం'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    link.highlight
                      ? 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200/80 border border-amber-300 dark:border-amber-800/60 font-semibold shadow-xs'
                      : isActive
                      ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            {isDemo ? (
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-800 text-white hover:bg-amber-900 transition-colors shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.auth.signUpButton}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.nav.login}</span>
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t.nav.signup}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
              >
                <Icon className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-medium bg-amber-800 text-white rounded-lg"
            >
              {t.nav.signup}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
