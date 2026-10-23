'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n/context';
import {
  TreePine,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  LogIn,
} from 'lucide-react';

export default function LoginPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-radial from-amber-900/10 via-stone-50 to-stone-100 dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-50 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <TreePine className="w-6 h-6 text-amber-100" />
            </div>
          </Link>
          <h2 className="font-serif font-bold text-3xl text-stone-900 dark:text-stone-50 tracking-tight">
            {t.auth.signInTitle}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xs mx-auto">
            {t.auth.signInSubtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="p-7 rounded-3xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/90 dark:border-stone-800 shadow-xl dark:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700" />

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.auth.emailLabel} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t.auth.passwordLabel} *
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  {t.auth.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? t.common.loading : t.auth.signInButton}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
            <span>{t.auth.dontHaveAccount}</span>{' '}
            <Link
              href="/signup"
              className="font-bold text-amber-800 dark:text-amber-400 hover:underline"
            >
              {t.auth.signUpButton}
            </Link>
          </div>
        </div>

        {/* Live Demo Link */}
        <div className="text-center">
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.auth.useDemoInstead}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
