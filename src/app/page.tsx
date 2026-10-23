'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import {
  TreePine,
  Sparkles,
  Users,
  ShieldCheck,
  Globe,
  Clock,
  BookOpen,
  ArrowRight,
  Heart,
  ChevronRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  const { t, locale } = useTranslation();

  const features = [
    {
      icon: TreePine,
      title: locale === 'en' ? 'Intergenerational Tree' : 'తరతరాల వంశవృక్షం',
      desc:
        locale === 'en'
          ? 'Start with your oldest known ancestors and map children, grandchildren, and spouses with intelligent genealogy layout.'
          : 'మీ మూల పురుషులు లేదా తాతయ్యల నుండి ప్రారంభించి పిల్లలు, మనుమలు మరియు వివాహ బంధాలను క్రమపద్ధతిలో నమోదు చేయండి.',
    },
    {
      icon: Globe,
      title: locale === 'en' ? 'English & Telugu Support' : 'తెలుగు మరియు ఆంగ్ల భాషా వేదిక',
      desc:
        locale === 'en'
          ? 'Full Unicode Telugu and English script support. Search people by Telugu name, native village, or family branch.'
          : 'తెలుగు లిపిలో పేర్లు, ఊరి పేర్లు, జీవిత చరిత్రలు మరియు ఆంగ్ల సమాచారాన్ని సమాన ప్రాధాన్యతతో భద్రపరుస్తుంది.',
    },
    {
      icon: Clock,
      title: locale === 'en' ? 'Living Family Timeline' : 'సజీవ కుటుంబ కాలరేఖ',
      desc:
        locale === 'en'
          ? 'Chronicle migrations, marriages, ancestral courtyard homes built, and centennial reunions across decades.'
          : 'వలసలు, వివాహాలు, ప్రాచీన ఇళ్ళ నిర్మాణాలు మరియు కుటుంబ ఆత్మీయ సమ్మేళనాల మైలురాళ్ళను క్రమబద్ధీకరించండి.',
    },
    {
      icon: BookOpen,
      title: locale === 'en' ? 'Oral Lore & Stories' : 'మౌఖిక కథలు & తీపి జ్ఞాపకాలు',
      desc:
        locale === 'en'
          ? 'Save grandfather’s evening tales, festival sweet recipes, and childhood recollections with contributor attribution.'
          : 'తాతయ్యలు చెప్పిన కథలు, పండుగ జ్ఞాపకాలు మరియు పెద్దల అనుభవాలను రాతపూర్వకంగా భావి తరాలకు అందించండి.',
    },
    {
      icon: ShieldCheck,
      title: locale === 'en' ? 'Private by Default' : 'పూర్తి భద్రత & గోప్యత',
      desc:
        locale === 'en'
          ? 'Multi-tenant database row-level security. Every family archive is strictly isolated with Owner, Editor, and Viewer roles.'
          : 'డేటాబేస్ స్థాయిలో రక్షణ. ప్రతి కుటుంబ సమాచారం కేవలం ఆ కుటుంబ సభ్యులకు మాత్రమే కనిపిస్తుంది.',
    },
    {
      icon: Users,
      title: locale === 'en' ? 'No Accounts for Ancestors' : 'పూర్వీకులకు ఈమెయిల్ అవసరం లేదు',
      desc:
        locale === 'en'
          ? 'Centuries of deceased ancestors can be lovingly documented without needing email logins or tech familiarity.'
          : 'ఇంటర్నెట్ ఎరుగని తాతలు, పూర్వీకుల వివరాలను ఎటువంటి ఈమెయిల్ లాగిన్లు లేకుండా సహజంగా నమోదు చేయవచ్చు.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle decorative heritage gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-100/50 via-stone-100/20 to-transparent dark:from-amber-950/20 dark:via-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>
              {locale === 'en'
                ? 'Preserving Intergenerational Roots & Stories'
                : 'తరతరాల మూలాలు & జ్ఞాపకాల పరిరక్షణ వేదిక'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-bold text-4xl sm:text-6xl text-stone-900 dark:text-stone-50 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            {locale === 'en' ? (
              <>
                Preserve your family roots, <br />
                <span className="text-amber-800 dark:text-amber-400">
                  from ancestors to future generations.
                </span>
              </>
            ) : (
              <>
                మీ కుటుంబ మూలాలు, పూర్వీకుల చరిత్రలు <br />
                <span className="text-amber-800 dark:text-amber-400">
                  రాబోయే తరాలకు చేరేలా భద్రపరచండి.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            {locale === 'en'
              ? 'An elegant, private heritage platform where you can build interactive family trees, chronicle ancestral village roots, record oral lore, and safeguard family photographs across generations.'
              : 'ఇంటరాక్టివ్ వంశవృక్షం, పూర్వీకుల స్వగ్రామం వివరాలు, మధుర జ్ఞాపకాలు మరియు ఛాయాచిత్రాలను అత్యంత గౌరవప్రదంగా మరియు సురక్షితంగా భద్రపరిచే వేదిక.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{t.auth.useDemoInstead}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold text-sm shadow-xs transition-colors"
            >
              <Users className="w-4 h-4 text-amber-700" />
              <span>{t.auth.signUpButton}</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{locale === 'en' ? 'Private by Default' : 'ప్రైవేట్ భాండాగారం'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{locale === 'en' ? 'Bilingual English & Telugu' : 'తెలుగు మరియు ఆంగ్ల భాషా మద్దతు'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{locale === 'en' ? 'Interactive React Flow Tree' : 'సజీవ వంశవృక్షం'}</span>
            </span>
          </div>

          {/* Interactive Preview Card Mockup */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl border-2 border-stone-300 dark:border-stone-800 p-3 sm:p-4 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-2xl">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-100 dark:bg-stone-950 p-6 sm:p-8 text-left">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 tracking-wider">
                    {locale === 'en' ? 'Featured Archive Showcase' : 'వంశవృక్ష నమూనా'}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                    Suryanarayana Heritage Archive (గోదావరి సీమ సూర్యనారాయణ వంశం)
                  </h3>
                </div>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors shadow-xs"
                >
                  <span>{locale === 'en' ? 'Open Full Interactive Tree' : 'పూర్తి చెట్టును చూడండి'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Mini visual mockup of nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Gen 1 */}
                <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900 bg-white dark:bg-stone-900 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center font-serif font-bold">
                      S
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                        Suryanarayana Rao
                      </h4>
                      <p className="text-[11px] text-amber-800 font-medium">రావు సూర్యనారాయణ</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono">1932 – 2012 (Kotipalli)</p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                    Principal & Sanskrit Scholar. Pillar of the family roots along the Godavari river.
                  </p>
                </div>

                {/* Gen 2 */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-serif font-bold">
                      V
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                        Venkateswara Rao
                      </h4>
                      <p className="text-[11px] text-amber-800 font-medium">రావు వెంకటేశ్వరరావు</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono">b. 1960 (Kotipalli)</p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                    Chief Irrigation Engineer. Preserver of ancestral brass heirlooms and palm leaves.
                  </p>
                </div>

                {/* Gen 3 */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-900 text-white flex items-center justify-center font-serif font-bold">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                        Aditya Rao
                      </h4>
                      <p className="text-[11px] text-amber-800 font-medium">రావు ఆదిత్య</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono">b. 1992 (Hyderabad)</p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                    Software Architect & Historian. Passionate about digitizing oral folklore.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 sm:py-24 bg-stone-100/70 dark:bg-stone-900/50 border-t border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-800 dark:text-amber-400">
              {locale === 'en' ? 'Thoughtfully Engineered' : 'విశిష్ట లక్షణాలు'}
            </span>
            <h2 className="font-serif font-bold text-3xl text-stone-900 dark:text-stone-100">
              {locale === 'en'
                ? 'Everything needed to safeguard your family heritage'
                : 'మీ వంశ చరిత్రను సజీవంగా నిలిపేందుకు అవసరమైన అన్ని సదుపాయాలు'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-700 transition-colors space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            {locale === 'en'
              ? 'Ready to trace your ancestral journey?'
              : 'మీ కుటుంబ మూలాలను శోధించడానికి సిద్ధమా?'}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
            {locale === 'en'
              ? 'Join today, invite your parents and relatives, and preserve your family memories for generations to come.'
              : 'ఈరోజే ఖాతా తెరవండి, మీ బంధువులను ఆహ్వానించండి మరియు మీ కుటుంబ చరిత్రను పదిలంగా ఉంచండి.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-md transition-colors"
            >
              {t.auth.signUpButton}
            </Link>
            <Link
              href="/demo"
              className="px-6 py-3 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-semibold text-sm transition-colors"
            >
              {t.auth.useDemoInstead}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
