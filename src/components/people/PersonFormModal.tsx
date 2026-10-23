'use client';

import React, { useState } from 'react';
import { Person, GenderType, ConfidenceType } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';
import { X, Save, User, Calendar, MapPin, Briefcase, Sparkles, BookOpen } from 'lucide-react';

interface PersonFormModalProps {
  person?: Person | null; // If passed, edit mode; otherwise, create mode
  familyId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (personData: Partial<Person>) => void;
}

export function PersonFormModal({
  person,
  familyId,
  isOpen,
  onClose,
  onSave,
}: PersonFormModalProps) {
  const { t, locale } = useTranslation();

  const [firstName, setFirstName] = useState(person?.first_name || '');
  const [lastName, setLastName] = useState(person?.last_name || '');
  const [teluguName, setTeluguName] = useState(person?.telugu_name || '');
  const [nickname, setNickname] = useState(person?.nickname || '');
  const [gender, setGender] = useState<GenderType>(person?.gender || 'unknown');
  const [dateOfBirth, setDateOfBirth] = useState(person?.date_of_birth || '');
  const [isBirthApprox, setIsBirthApprox] = useState(person?.is_birth_date_approximate || false);
  const [isDeceased, setIsDeceased] = useState(person?.is_deceased || false);
  const [dateOfDeath, setDateOfDeath] = useState(person?.date_of_death || '');
  const [isDeathApprox, setIsDeathApprox] = useState(person?.is_death_date_approximate || false);
  const [birthplace, setBirthplace] = useState(person?.birthplace || '');
  const [nativeVillage, setNativeVillage] = useState(person?.native_village || '');
  const [occupation, setOccupation] = useState(person?.occupation || '');
  const [education, setEducation] = useState(person?.education || '');
  const [biography, setBiography] = useState(person?.biography || '');
  const [biographyTelugu, setBiographyTelugu] = useState(person?.biography_telugu || '');
  const [ancestralHome, setAncestralHome] = useState(person?.ancestral_home || '');
  const [favoriteMemories, setFavoriteMemories] = useState(person?.favorite_memories || '');
  const [avatarUrl, setAvatarUrl] = useState(person?.avatar_url || '');
  const [confidenceStatus, setConfidenceStatus] = useState<ConfidenceType>(
    person?.confidence_status || 'oral_history'
  );

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError(locale === 'en' ? 'First name is required' : 'మొదటి పేరు తప్పనిసరి');
      return;
    }

    const payload: Partial<Person> = {
      id: person?.id || `p-${Date.now()}`,
      family_id: familyId,
      first_name: firstName.trim(),
      last_name: lastName.trim() || null,
      telugu_name: teluguName.trim() || null,
      nickname: nickname.trim() || null,
      gender,
      date_of_birth: dateOfBirth || null,
      is_birth_date_approximate: isBirthApprox,
      is_deceased: isDeceased,
      date_of_death: isDeceased ? dateOfDeath || null : null,
      is_death_date_approximate: isDeathApprox,
      birthplace: birthplace.trim() || null,
      native_village: nativeVillage.trim() || null,
      occupation: occupation.trim() || null,
      education: education.trim() || null,
      biography: biography.trim() || null,
      biography_telugu: biographyTelugu.trim() || null,
      ancestral_home: ancestralHome.trim() || null,
      favorite_memories: favoriteMemories.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      confidence_status: confidenceStatus,
      updated_at: new Date().toISOString(),
      created_at: person?.created_at || new Date().toISOString(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              {person ? t.common.edit : t.tree.addFirstPerson}
            </h3>
            <p className="text-xs text-stone-500">
              {locale === 'en'
                ? 'Enter biographical and genealogical details'
                : 'వ్యక్తిగత మరియు వంశవృక్ష వివరాలను నమోదు చేయండి'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Section 1: Names & Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Names & Identity' : 'పేరు & ప్రాథమిక వివరాలు'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.firstName} *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Suryanarayana"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.lastName}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Rao"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-amber-900 dark:text-amber-300 mb-1">
                  {t.person.teluguName}
                </label>
                <input
                  type="text"
                  value={teluguName}
                  onChange={(e) => setTeluguName(e.target.value)}
                  placeholder="ఉదా: రావు సూర్యనారాయణ"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-700 font-telugu"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.nickname}
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Peddayana"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.gender}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as GenderType)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-700"
                >
                  <option value="male">{t.person.genderMale}</option>
                  <option value="female">{t.person.genderFemale}</option>
                  <option value="other">{t.person.genderOther}</option>
                  <option value="unknown">{t.person.genderUnknown}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {locale === 'en' ? 'Photo URL' : 'ఛాయాచిత్రం లంకె (URL)'}
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-700"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dates & Life Span */}
          <div className="space-y-4 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Dates & Lifespan' : 'తేదీలు & కాలం'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.dateOfBirth}
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
                <label className="mt-1.5 flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBirthApprox}
                    onChange={(e) => setIsBirthApprox(e.target.checked)}
                    className="rounded text-amber-700"
                  />
                  <span>{t.person.isApproximateDob}</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-300 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDeceased}
                    onChange={(e) => setIsDeceased(e.target.checked)}
                    className="rounded text-amber-700"
                  />
                  <span>{t.person.isDeceased}</span>
                </label>

                {isDeceased && (
                  <div className="mt-1">
                    <input
                      type="date"
                      value={dateOfDeath}
                      onChange={(e) => setDateOfDeath(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                    <label className="mt-1.5 flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDeathApprox}
                        onChange={(e) => setIsDeathApprox(e.target.checked)}
                        className="rounded text-amber-700"
                      />
                      <span>{t.person.isApproximateDod}</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Native Place & Career */}
          <div className="space-y-4 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Origins & Occupation' : 'మూలాలు & వృత్తి'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.nativeVillage}
                </label>
                <input
                  type="text"
                  value={nativeVillage}
                  onChange={(e) => setNativeVillage(e.target.value)}
                  placeholder="e.g. Kotipalli, East Godavari"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.birthplace}
                </label>
                <input
                  type="text"
                  value={birthplace}
                  onChange={(e) => setBirthplace(e.target.value)}
                  placeholder="e.g. Rajahmundry"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.occupation}
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Principal & Sanskrit Scholar"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.person.education}
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. M.A. Sanskrit, Andhra University"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t.person.ancestralHome}
              </label>
              <input
                type="text"
                value={ancestralHome}
                onChange={(e) => setAncestralHome(e.target.value)}
                placeholder="e.g. Kotipalli Agraharam Manduva House"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Section 4: Biographies & Stories */}
          <div className="space-y-4 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Biographies & Stories' : 'జీవిత విశేషాలు & కథలు'}</span>
            </h4>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t.person.biography}
              </label>
              <textarea
                rows={3}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Chronicle their life achievements, character, and legacy..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-900 dark:text-amber-300 mb-1">
                {t.person.biographyTelugu}
              </label>
              <textarea
                rows={3}
                value={biographyTelugu}
                onChange={(e) => setBiographyTelugu(e.target.value)}
                placeholder="తెలుగులో వారి జీవన ప్రస్థానం, విశేషాలు మరియు జ్ఞాపకాలు..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-telugu"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t.person.confidenceStatus}
              </label>
              <select
                value={confidenceStatus}
                onChange={(e) => setConfidenceStatus(e.target.value as ConfidenceType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="verified">{t.person.confidenceVerified}</option>
                <option value="probable">{t.person.confidenceProbable}</option>
                <option value="oral_history">{t.person.confidenceOral}</option>
                <option value="unverified">{t.person.confidenceUnverified}</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.common.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
