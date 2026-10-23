'use client';

import React, { useState } from 'react';
import { Family, FamilyRole, Invitation } from '@/types/database';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n/context';
import {
  ShieldCheck,
  UserPlus,
  Mail,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Users,
} from 'lucide-react';

interface MembersManagementProps {
  family: Family;
  currentUserRole?: FamilyRole;
  onExportData?: () => void;
}

export function MembersManagement({
  family,
  currentUserRole = 'owner',
  onExportData,
}: MembersManagementProps) {
  const { t, locale, setLocale } = useTranslation();

  const [familyName, setFamilyName] = useState(family.name);
  const [familyDesc, setFamilyDesc] = useState(family.description || '');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<FamilyRole>('editor');
  const [inviteStatusMessage, setInviteStatusMessage] = useState<string | null>(null);

  // Mock members for management UI
  const [members, setMembers] = useState([
    {
      id: 'm-1',
      name: 'Archive Creator',
      email: 'creator@example.com',
      role: 'owner' as FamilyRole,
      joined_at: '2026-01-01',
    },
    {
      id: 'm-2',
      name: 'Venkateswara Rao',
      email: 'venkat@example.com',
      role: 'editor' as FamilyRole,
      joined_at: '2026-01-10',
    },
    {
      id: 'm-3',
      name: 'Aditya Rao',
      email: 'aditya@example.com',
      role: 'viewer' as FamilyRole,
      joined_at: '2026-02-01',
    },
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const token = Math.random().toString(36).substring(2, 12);
    setInviteStatusMessage(
      locale === 'en'
        ? `Invitation generated for ${inviteEmail} with token [${token}]. In production, Supabase sends this secure invite link via email.`
        : `${inviteEmail} కొరకు ఆహ్వాన లింక్ సిద్ధమైంది [${token}]. సుపాబేస్ ద్వారా ఇది ఈమెయిల్ చేయబడుతుంది.`
    );
    setInviteEmail('');
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const isOwner = currentUserRole === 'owner';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Archive Details */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-700" />
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            {t.settings.familySettings}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              {t.settings.familyName}
            </label>
            <input
              type="text"
              disabled={!isOwner}
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              {t.settings.familyDesc}
            </label>
            <textarea
              rows={2}
              disabled={!isOwner}
              value={familyDesc}
              onChange={(e) => setFamilyDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 disabled:opacity-60"
            />
          </div>

          {isOwner && (
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors"
              >
                {t.common.save}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Members & Invitations */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-700" />
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            {t.settings.membersTitle}
          </h3>
        </div>

        {/* Invite Form */}
        {isOwner && (
          <form
            onSubmit={handleSendInvite}
            className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3"
          >
            <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              {t.settings.inviteMember}
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder={t.settings.inviteEmailPlaceholder}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as FamilyRole)}
                className="px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="editor">{locale === 'en' ? 'Editor' : 'ఎడిటర్'}</option>
                <option value="viewer">{locale === 'en' ? 'Viewer' : 'వీక్షకుడు'}</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{locale === 'en' ? 'Send Invite' : 'ఆహ్వానం పంపు'}</span>
              </button>
            </div>

            {inviteStatusMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-200">
                {inviteStatusMessage}
              </div>
            )}
          </form>
        )}

        {/* Members Roster Table */}
        <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-3.5 flex items-center justify-between gap-4 bg-white dark:bg-stone-900"
            >
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {member.name}
                </p>
                <p className="text-[11px] text-stone-500 font-mono">{member.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    member.role === 'owner'
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      : member.role === 'editor'
                      ? 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300'
                      : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  {member.role}
                </span>

                {isOwner && member.role !== 'owner' && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. User Preferences & Localization */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
          {t.settings.userSettings}
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
          <div>
            <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {t.settings.languagePreference}
            </p>
            <p className="text-[11px] text-stone-500">
              {locale === 'en'
                ? 'Switch between English and Unicode Telugu interface'
                : 'ఆంగ్ల మరియు తెలుగు భాషల మధ్య మార్చుకోండి'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocale('en')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                locale === 'en'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-white dark:bg-stone-800 border-stone-300 text-stone-700 dark:text-stone-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLocale('te')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                locale === 'te'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-white dark:bg-stone-800 border-stone-300 text-stone-700 dark:text-stone-300'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* Data Export Button */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
          <div>
            <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {t.common.export}
            </p>
            <p className="text-[11px] text-stone-500">
              {locale === 'en'
                ? 'Download complete JSON backup of family tree, people, relationships, and timeline records.'
                : 'వంశవృక్షం, సంబంధాలు మరియు కాలరేఖ వివరాల పూర్తి బ్యాకప్‌ను డౌన్‌లోడ్ చేసుకోండి.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onExportData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Export JSON' : 'ఎగుమతి చేయి'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
