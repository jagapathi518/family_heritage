'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { PersonNodeData } from '@/types/genealogy';
import { useTranslation } from '@/lib/i18n/context';
import { User, MapPin, ShieldCheck, Heart, Plus, Eye, Sparkles } from 'lucide-react';

export const PersonNode = memo(function PersonNode({ data }: { data: any }) {
  const nodeData = data as PersonNodeData;
  const { person, isFocused, onSelectPerson, onAddRelative } = nodeData;
  const { t, locale } = useTranslation();

  // Compute birth/death text
  const birthYear = person.date_of_birth
    ? new Date(person.date_of_birth).getFullYear()
    : person.birth_year_approximate || null;

  const deathYear = person.date_of_death
    ? new Date(person.date_of_death).getFullYear()
    : person.death_year_approximate || null;

  const dateSpan = birthYear
    ? person.is_deceased
      ? `${person.is_birth_date_approximate ? '~' : ''}${birthYear} – ${
          deathYear ? (person.is_death_date_approximate ? '~' : '') + deathYear : '?'
        }`
      : `b. ${person.is_birth_date_approximate ? '~' : ''}${birthYear}`
    : person.is_deceased
    ? t.common.deceased
    : '';

  const displayName = `${person.first_name} ${person.last_name || ''}`.trim();
  const secondaryName = person.telugu_name;

  return (
    <div
      onClick={() => onSelectPerson?.(person)}
      className={`w-64 rounded-xl border-2 transition-all duration-200 select-none cursor-pointer shadow-md bg-stone-50 dark:bg-stone-900 ${
        isFocused
          ? 'border-amber-600 ring-4 ring-amber-500/20 shadow-lg scale-105'
          : 'border-stone-300 dark:border-stone-700 hover:border-amber-600 dark:hover:border-amber-500 hover:shadow-lg'
      }`}
    >
      {/* Top Handle: Connects from parents */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-800 !border-2 !border-stone-50 dark:!border-stone-900"
      />

      {/* Header Accent Bar */}
      <div
        className={`h-2 rounded-t-[10px] ${
          person.gender === 'male'
            ? 'bg-amber-700'
            : person.gender === 'female'
            ? 'bg-rose-700'
            : 'bg-stone-600'
        }`}
      />

      <div className="p-3">
        <div className="flex items-start gap-2.5">
          {/* Avatar or Initial fallback */}
          <div className="relative shrink-0">
            {person.avatar_url ? (
              <img
                src={person.avatar_url}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700 shadow-xs"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-sm border-2 border-stone-200 dark:border-stone-700 shadow-xs ${
                  person.gender === 'male'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                    : person.gender === 'female'
                    ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                    : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
                }`}
              >
                {person.first_name?.[0] || 'P'}
              </div>
            )}
            {person.is_deceased && (
              <span
                className="absolute -bottom-1 -right-1 text-[9px] px-1 py-0.2 bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 rounded-full font-bold"
                title={t.common.deceased}
              >
                †
              </span>
            )}
          </div>

          {/* Name & Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate leading-snug">
              {displayName}
            </h4>

            {secondaryName && (
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium truncate">
                {secondaryName}
              </p>
            )}

            {dateSpan && (
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                {dateSpan}
              </p>
            )}
          </div>
        </div>

        {/* Location & Verification Badges */}
        <div className="mt-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1 truncate max-w-[130px]">
            {person.native_village || person.birthplace ? (
              <>
                <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="truncate">{person.native_village || person.birthplace}</span>
              </>
            ) : (
              <span className="italic text-stone-400 text-[10px]">
                {person.occupation || 'Family Member'}
              </span>
            )}
          </div>

          {person.confidence_status === 'verified' && (
            <span
              className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-medium text-[10px]"
              title={t.person.confidenceVerified}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{t.common.verified}</span>
            </span>
          )}
        </div>

        {/* Action Buttons: Add Relative & View Profile */}
        <div className="mt-2.5 pt-1 flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectPerson?.(person);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 text-[11px] font-medium rounded-md bg-stone-200/70 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
          >
            <Eye className="w-3 h-3 text-stone-500" />
            <span>{t.common.view}</span>
          </button>

          {onAddRelative && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddRelative(person, 'child');
                }}
                className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-semibold"
                title={t.tree.addChild}
              >
                + {locale === 'en' ? 'Child' : 'సంతానం'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddRelative(person, 'parent');
                }}
                className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-semibold"
                title={t.tree.addParent}
              >
                + {locale === 'en' ? 'Parent' : 'తల్లి/తండ్రి'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side handles for spouses */}
      <Handle
        type="source"
        position={Position.Right}
        id="spouse-right"
        className="!w-2.5 !h-2.5 !bg-amber-500 !border-2 !border-stone-50 dark:!border-stone-900"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="spouse-left"
        className="!w-2.5 !h-2.5 !bg-amber-500 !border-2 !border-stone-50 dark:!border-stone-900"
      />

      {/* Bottom Handle: Connects to children */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-amber-800 !border-2 !border-stone-50 dark:!border-stone-900"
      />
    </div>
  );
});
