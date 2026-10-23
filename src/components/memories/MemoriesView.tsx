'use client';

import React, { useState } from 'react';
import { Memory, Person } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';
import {
  BookOpen,
  Image as ImageIcon,
  Plus,
  Upload,
  User,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface MemoriesViewProps {
  memories: Memory[];
  people: Person[];
  onAddMemory?: () => void;
  canEdit?: boolean;
}

export function MemoriesView({
  memories,
  people,
  onAddMemory,
  canEdit = true,
}: MemoriesViewProps) {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'stories' | 'photos'>('stories');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const peopleMap = new Map<string, Person>(people.map((p) => [p.id, p]));

  // Handle local photo upload preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadMessage(
        locale === 'en'
          ? 'Error: Only JPEG, PNG, and WebP images are allowed.'
          : 'లోపం: కేవలం JPEG, PNG మరియు WebP చిత్రాలు మాత్రమే అనుమతించబడతాయి.'
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage(
        locale === 'en'
          ? 'Error: File size must be under 10MB.'
          : 'లోపం: ఫైల్ పరిమాణం 10MB లోపు ఉండాలి.'
      );
      return;
    }

    setUploadMessage(
      locale === 'en'
        ? `Success: "${file.name}" selected. In production with Supabase Storage, this uploads to the private family-photos bucket.`
        : `విజయవంతమైంది: "${file.name}" ఎంపిక చేయబడింది. సుపాబేస్ స్టోరేజ్‌లో ఇది ప్రైవేట్ బకెట్‌కు అప్‌లోడ్ అవుతుంది.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Action button */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('stories')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'stories'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.memories.title} ({memories.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.nav.gallery}</span>
          </button>
        </div>

        {canEdit && activeTab === 'stories' && onAddMemory && (
          <button
            type="button"
            onClick={onAddMemory}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-800 text-white hover:bg-amber-900 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.memories.addMemory}</span>
          </button>
        )}
      </div>

      {/* STORIES TAB */}
      {activeTab === 'stories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.length === 0 ? (
            <div className="md:col-span-2 text-center py-16 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/50">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {t.memories.emptyMemories}
              </p>
            </div>
          ) : (
            memories.map((mem) => {
              const linkedPerson = mem.person_id ? peopleMap.get(mem.person_id) : null;

              return (
                <div
                  key={mem.id}
                  className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-700 transition-colors flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-stone-400">
                        {mem.memory_date || 'Oral History'}
                      </span>
                      {linkedPerson && (
                        <span className="text-[11px] font-medium text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
                          About {linkedPerson.first_name} {linkedPerson.last_name || ''}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {mem.title}
                    </h4>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
                      &ldquo;
                      {locale === 'te' && mem.content_telugu
                        ? mem.content_telugu
                        : mem.content}
                      &rdquo;
                    </p>
                  </div>

                  {mem.contributor_name && (
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 text-xs text-stone-500">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t.memories.contributedBy} <strong>{mem.contributor_name}</strong></span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* PHOTOS TAB */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* Upload card */}
          {canEdit && (
            <div className="p-8 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl text-center bg-stone-50/50 dark:bg-stone-900/40 hover:bg-stone-50 transition-colors">
              <Upload className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                {t.memories.uploadPhoto}
              </h4>
              <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                {t.memories.dragDropPhoto}
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs cursor-pointer shadow-xs">
                <span>Select from Device</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {uploadMessage && (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 max-w-lg mx-auto text-left">
                  {uploadMessage}
                </div>
              )}
            </div>
          )}

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {people
              .filter((p) => p.avatar_url)
              .map((p) => (
                <div
                  key={p.id}
                  className="group relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs"
                >
                  <img
                    src={p.avatar_url!}
                    alt={p.first_name}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-2.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs">
                    <p className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {p.first_name} {p.last_name || ''}
                    </p>
                    {p.native_village && (
                      <p className="text-[10px] text-stone-500 truncate">{p.native_village}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
