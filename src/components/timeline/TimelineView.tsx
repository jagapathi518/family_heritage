'use client';

import React, { useState } from 'react';
import { FamilyEvent, Person, EventType } from '@/types/database';
import { useTranslation } from '@/lib/i18n/context';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Filter,
  Sparkles,
  Heart,
  Home,
  Briefcase,
  Flag,
  User,
} from 'lucide-react';

interface TimelineViewProps {
  events: FamilyEvent[];
  people: Person[];
  onAddEvent?: () => void;
  canEdit?: boolean;
}

export function TimelineView({
  events,
  people,
  onAddEvent,
  canEdit = true,
}: TimelineViewProps) {
  const { t, locale } = useTranslation();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('all');

  const peopleMap = new Map<string, Person>(people.map((p) => [p.id, p]));

  // Filter events
  const filteredEvents = events
    .filter((e) => {
      if (selectedType !== 'all' && e.event_type !== selectedType) return false;
      if (
        selectedPersonId !== 'all' &&
        (!e.associated_people_ids || !e.associated_people_ids.includes(selectedPersonId))
      )
        return false;
      return true;
    })
    // Sort chronologically ascending
    .sort((a, b) => {
      const dateA = a.event_date ? new Date(a.event_date).getTime() : (a.event_year || 0) * 31536000000;
      const dateB = b.event_date ? new Date(b.event_date).getTime() : (b.event_year || 0) * 31536000000;
      return dateA - dateB;
    });

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'marriage':
        return <Heart className="w-4 h-4 text-rose-600" />;
      case 'home_built':
      case 'relocation':
        return <Home className="w-4 h-4 text-amber-700" />;
      case 'career':
        return <Briefcase className="w-4 h-4 text-sky-700" />;
      case 'reunion':
      case 'festival':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      default:
        return <Flag className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter by Event Type */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
            >
              <option value="all">{t.timeline.allTypes}</option>
              <option value="marriage">{t.timeline.types.marriage}</option>
              <option value="home_built">{t.timeline.types.home_built}</option>
              <option value="reunion">{t.timeline.types.reunion}</option>
              <option value="festival">{t.timeline.types.festival}</option>
              <option value="career">{t.timeline.types.career}</option>
              <option value="relocation">{t.timeline.types.relocation}</option>
              <option value="milestone">{t.timeline.types.milestone}</option>
            </select>
          </div>

          {/* Filter by Person */}
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
            >
              <option value="all">{t.timeline.filterPerson} (All)</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name || ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {canEdit && onAddEvent && (
          <button
            type="button"
            onClick={onAddEvent}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-800 text-white hover:bg-amber-900 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.timeline.addEvent}</span>
          </button>
        )}
      </div>

      {/* Timeline display */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/50">
          <Clock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {t.timeline.emptyTimeline}
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-200 dark:border-amber-900 space-y-8 my-4 ml-4">
          {filteredEvents.map((evt, idx) => {
            const formattedDate = evt.event_date
              ? new Date(evt.event_date).toLocaleDateString(
                  locale === 'te' ? 'te-IN' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )
              : evt.event_year
              ? `${evt.is_approximate ? '~' : ''}${evt.event_year}`
              : 'Historical milestone';

            const linkedPeople = (evt.associated_people_ids || [])
              .map((id) => peopleMap.get(id))
              .filter(Boolean) as Person[];

            return (
              <div key={evt.id} className="relative group">
                {/* Node icon dot on line */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-stone-900 border-2 border-amber-700 flex items-center justify-center shadow-xs">
                  {getEventIcon(evt.event_type)}
                </div>

                {/* Event Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm group-hover:border-amber-600 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </span>

                    {evt.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        <span>{evt.location}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                    {locale === 'te' && evt.title_telugu ? evt.title_telugu : evt.title}
                  </h4>

                  {evt.description && (
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
                      {locale === 'te' && evt.description_telugu
                        ? evt.description_telugu
                        : evt.description}
                    </p>
                  )}

                  {linkedPeople.length > 0 && (
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">
                        {locale === 'en' ? 'Associated' : 'సంబంధితులు'}:
                      </span>
                      {linkedPeople.map((lp) => (
                        <span
                          key={lp.id}
                          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          <User className="w-3 h-3 text-stone-400" />
                          <span>{lp.first_name} {lp.last_name || ''}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
