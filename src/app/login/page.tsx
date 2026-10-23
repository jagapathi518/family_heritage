'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { useTranslation } from '@/lib/i18n/context';
import { TreePine, Lock, Mail, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const { isConfigured } = getSupabaseEnv();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isConfigured) {
      setErrorMessage(
        locale === 'en'
          ? 'Supabase backend is not configured in .env.local yet. Please set your Supabase API credentials or use the Live Demo.'
          : 'సుపాబేస్ బ్యాకెండ్ ఇంకా .env.local లో అమర్చబడలేదు. ప్రత్యక్ష డెమోను ఉపయోగించండి.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-50 flex items-center justify-center shadow-xs">
              <TreePine className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              {t.common.appName}
            </span>
          </Link>
          <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
            {t.auth.signInTitle}
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {t.auth.signInSubtitle}
          </p>
        </div>

        {/* Notice if Supabase not configured */}
        {!isConfigured && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {locale === 'en' ? 'Database Credentials Missing' : 'డేటాబేస్ వివరాలు అమర్చలేదు'}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                  {t.auth.supabaseNotConfiguredNotice}
                </p>
              </div>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100 underline hover:text-amber-700 text-xs pt-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.auth.useDemoInstead}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Login Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t.auth.emailLabel} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                  {t.auth.passwordLabel} *
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-amber-800 dark:text-amber-400 hover:underline"
                >
                  {t.auth.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold rounded-lg text-white bg-amber-800 hover:bg-amber-900 disabled:opacity-50 transition-colors shadow-xs"
            >
              {loading ? t.common.loading : t.auth.signInButton}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
            <span>{t.auth.dontHaveAccount}</span>{' '}
            <Link
              href="/signup"
              className="font-bold text-amber-800 dark:text-amber-400 hover:underline"
            >
              {t.auth.signUpButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
