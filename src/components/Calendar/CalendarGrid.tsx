'use client';

import { useMemo } from 'react';
import { getDaysInMonth, DAY_NAMES, isInRange, isRangeEdge, isSameDay, formatDateKey } from '@/utils/calendar';
import { Holiday } from '@/utils/holidays';
import DayCell from './DayCell';
import styles from './CalendarGrid.module.css';
import { Note } from './CalendarWrapper';
import { RecurringNote, checkRecurrence } from '@/utils/recurrence';

interface Props {
  year: number;
  month: number;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  holidays: Record<string, Holiday>;
  notes: Note[];
  recurringNotes: RecurringNote[];
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  onDayLeave: () => void;
}

export default function CalendarGrid({
  year, month, rangeStart, rangeEnd, hoverDate, holidays, notes, recurringNotes,
  onDayClick, onDayHover, onDayLeave,
}: Props) {
  const days = getDaysInMonth(year, month);

  // For hover preview: treat hoverDate as provisional end
  const previewEnd = rangeStart && !rangeEnd ? hoverDate : null;

  /**
   * Pre-compute note counts per date key as a stable Map.
   * This prevents DayCell's React.memo from seeing a new array reference
   * on every render cycle, which was causing the entire grid to re-render
   * (and trigger the staggerFadeUp animation = visible flicker).
   */
  const noteCountsMap = useMemo(() => {
    const map = new Map<string, { important: number; regular: number }>();

    // Process regular notes with a dayKey
    for (const note of notes) {
      if (!note.dayKey) continue;
      const existing = map.get(note.dayKey) ?? { important: 0, regular: 0 };
      const isImportant =
        note.text.includes('!') ||
        note.text.toLowerCase().includes('urgent') ||
        note.text.toLowerCase().includes('important');
      if (isImportant) existing.important++;
      else existing.regular++;
      map.set(note.dayKey, existing);
    }

    // Recurring notes: check only the days visible in this month view
    for (const day of days) {
      if (!day.isCurrentMonth) continue;
      for (const rn of recurringNotes) {
        if (!checkRecurrence(rn, day.date)) continue;
        const key = formatDateKey(day.date);
        const existing = map.get(key) ?? { important: 0, regular: 0 };
        const isImportant =
          rn.text.includes('!') ||
          rn.text.toLowerCase().includes('urgent') ||
          rn.text.toLowerCase().includes('important');
        if (isImportant) existing.important++;
        else existing.regular++;
        map.set(key, existing);
      }
    }

    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, recurringNotes, year, month]);

  return (
    <div className={styles.gridWrap}>
      {/* Day labels */}
      <div className={styles.dayNames}>
        {DAY_NAMES.map(d => (
          <div
            key={d}
            className={`${styles.dayLabel} ${
              d === 'Sun' || d === 'Sat' ? styles.weekend : ''
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className={styles.grid}>
        {days.map((day, idx) => {
          const holidayKey = `${year}-${month}-${day.dayOfMonth}`;
          const holiday = day.isCurrentMonth ? holidays[holidayKey] : undefined;

          const edge = isRangeEdge(day.date, rangeStart, rangeEnd);
          const inRange = isInRange(day.date, rangeStart, rangeEnd);
          const inHover = previewEnd ? isInRange(day.date, rangeStart, previewEnd) : false;
          const isHoverEdge = !!(previewEnd && isSameDay(day.date, previewEnd));
          const isStartEdge = !!(rangeStart && isSameDay(day.date, rangeStart));

          // Stable primitive counts — React.memo on DayCell only re-renders when these numbers change
          const dateKey = day.isCurrentMonth ? formatDateKey(day.date) : '';
          const counts = noteCountsMap.get(dateKey) ?? { important: 0, regular: 0 };

          return (
            <DayCell
              key={idx}
              index={idx}
              day={day}
              holiday={holiday}
              importantNoteCount={counts.important}
              regularNoteCount={counts.regular}
              edge={edge}
              inRange={inRange}
              inHover={inHover}
              isHoverEdge={isHoverEdge}
              isStartEdge={isStartEdge}
              onDayClick={onDayClick}
              onDayHover={onDayHover}
              onDayLeave={onDayLeave}
            />
          );
        })}
      </div>
    </div>
  );
}
