'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv, SUPABASE_SETUP_INSTRUCTIONS } from '@/lib/supabase/config';
import { useTranslation } from '@/lib/i18n/context';
import { TreePine, Lock, Mail, User, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const { isConfigured } = getSupabaseEnv();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isConfigured) {
      setErrorMessage(
        locale === 'en'
          ? 'Supabase backend is not configured in .env.local yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live authentication, or explore the full interactive demo.'
          : 'సుపాబేస్ బ్యాకెండ్ ఇంకా .env.local లో అమర్చబడలేదు. ప్రత్యక్ష డెమో ద్వారా పరిశీలించవచ్చు.'
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        locale === 'en'
          ? 'Password must be at least 6 characters long.'
          : 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            preferred_language: locale,
            initial_family_name: familyName || `${fullName}'s Family Archive`,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        router.push('/dashboard');
      } else {
        setSuccessMessage(
          locale === 'en'
            ? 'Registration successful! Please check your email to verify your account.'
            : 'నమోదు విజయవంతమైంది! మీ ఖాతాను ధృవీకరించడానికి దయచేసి మీ ఈమెయిల్‌ను తనిఖీ చేయండి.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
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
            {t.auth.signUpTitle}
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {t.auth.signUpSubtitle}
          </p>
        </div>

        {/* Notice if Supabase not configured */}
        {!isConfigured && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {locale === 'en' ? 'Database Configuration Note' : 'డేటాబేస్ గమనిక'}
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

        {/* Signup Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
          <form onSubmit={handleSignUp} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                {successMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t.auth.fullNameLabel} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aditya Rao"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {locale === 'en' ? 'Family Archive Name' : 'కుటుంబ వంశం పేరు'}
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g. Suryanarayana Heritage Archive"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>

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
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t.auth.passwordLabel} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold rounded-lg text-white bg-amber-800 hover:bg-amber-900 disabled:opacity-50 transition-colors shadow-xs"
            >
              {loading ? t.common.loading : t.auth.signUpButton}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
            <span>{t.auth.alreadyHaveAccount}</span>{' '}
            <Link
              href="/login"
              className="font-bold text-amber-800 dark:text-amber-400 hover:underline"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
