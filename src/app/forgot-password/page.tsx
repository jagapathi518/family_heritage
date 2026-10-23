'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { useTranslation } from '@/lib/i18n/context';
import { TreePine, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t, locale } = useTranslation();
  const supabase = createClient();
  const { isConfigured } = getSupabaseEnv();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConfigured) {
      setError(
        locale === 'en'
          ? 'Supabase backend is not configured in .env.local yet.'
          : 'సుపాబేస్ బ్యాకెండ్ ఇంకా .env.local లో అమర్చబడలేదు.'
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <div className="w-full max-w-md space-y-6">
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
            {t.auth.resetPassword}
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {locale === 'en'
              ? 'Enter your account email to receive a secure recovery link'
              : 'పాస్‌వర్డ్ పునరుద్ధరణ లింక్ కోసం మీ ఈమెయిల్‌ను నమోదు చేయండి'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
          {success ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {locale === 'en' ? 'Check your email' : 'మీ ఈమెయిల్‌ను తనిఖీ చేయండి'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {locale === 'en'
                  ? `We've sent a password reset link to ${email}. Follow the instructions in the email to regain access.`
                  : `${email} కు రీసెట్ లింక్ పంపబడింది.`}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.common.back} to {t.nav.login}</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.auth.emailLabel}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-lg text-white bg-amber-800 hover:bg-amber-900 disabled:opacity-50 transition-colors shadow-xs"
              >
                {loading ? t.common.loading : t.auth.resetButton}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.common.back} to {t.nav.login}</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
