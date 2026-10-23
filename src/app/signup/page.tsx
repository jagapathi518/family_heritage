'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n/context';
import {
  TreePine,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderHeart,
} from 'lucide-react';

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
            initial_family_name: familyName || `${fullName}'s Heritage Archive`,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        // Active session established! Create family archive
        const effectiveFamilyName = familyName.trim() || `${fullName}'s Family Archive`;
        try {
          const { data: newFam } = await supabase
            .from('families')
            .insert({
              name: effectiveFamilyName,
              description: `Family heritage archive created by ${fullName}`,
              created_by: data.user?.id,
            })
            .select()
            .single();

          if (newFam && data.user) {
            await supabase.from('family_memberships').insert({
              family_id: newFam.id,
              user_id: data.user.id,
              role: 'owner',
            });
          }
        } catch (dbErr) {
          console.warn('Family creation after signup:', dbErr);
        }

        router.push('/dashboard');
      } else {
        setSuccessMessage(
          locale === 'en'
            ? 'Registration successful! If email confirmation is enabled on your Supabase project, check your inbox to confirm. Otherwise, you can now sign in.'
            : 'నమోదు విజయవంతమైంది! మీ ఖాతాను ధృవీకరించిన తర్వాత లాగిన్ అవ్వవచ్చు.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
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
            {t.auth.signUpTitle}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xs mx-auto">
            {t.auth.signUpSubtitle}
          </p>
        </div>

        {/* Signup Card */}
        <div className="p-7 rounded-3xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/90 dark:border-stone-800 shadow-xl dark:shadow-2xl relative overflow-hidden">
          {/* Top subtle golden gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700" />

          <form onSubmit={handleSignUp} className="space-y-4 pt-2">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.auth.fullNameLabel} *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Chinna Rao"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {locale === 'en' ? 'Family Archive Name' : 'కుటుంబ వంశం పేరు'} *
              </label>
              <div className="relative">
                <FolderHeart className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. The Roots Heritage Archive"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 transition-all shadow-inner"
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.auth.passwordLabel} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 transition-all shadow-inner"
                />
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                {locale === 'en' ? 'Minimum 6 characters' : 'కనీసం 6 అక్షరాలు'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? t.common.loading : t.auth.signUpButton}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
            <span>{t.auth.alreadyHaveAccount}</span>{' '}
            <Link
              href="/login"
              className="font-bold text-amber-800 dark:text-amber-400 hover:underline"
            >
              {t.nav.login}
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
