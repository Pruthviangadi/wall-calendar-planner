'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSeason, MONTH_NAMES, formatDate, formatDateKey, isSameDay } from '@/utils/calendar';
import { MONTH_THEMES } from '@/utils/themes';
import { getHolidays } from '@/utils/holidays';
import CalendarHeader from './CalendarHeader';
import CalendarHero from './CalendarHero';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import styles from './CalendarWrapper.module.css';
import { RecurringNote, RecurrenceType, checkRecurrence } from '@/utils/recurrence';

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  rangeStart?: string;
  rangeEnd?: string;
  monthKey?: string;
  dayKey?: string;
}

export default function CalendarWrapper() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [recurringNotes, setRecurringNotes] = useState<RecurringNote[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  const season = getSeason(currentMonth);
  const theme = MONTH_THEMES[currentMonth];
  const holidays = getHolidays(currentYear);

  // Load notes + dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('calendar-notes');
    if (saved) setNotes(JSON.parse(saved));
    const savedRecurr = localStorage.getItem('calendar-recurring-notes');
    if (savedRecurr) setRecurringNotes(JSON.parse(savedRecurr));
    const dm = localStorage.getItem('calendar-dark') === 'true';
    setDarkMode(dm);
  }, []);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('calendar-recurring-notes', JSON.stringify(recurringNotes));
  }, [recurringNotes]);

  // Apply theme attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-season', season);
  }, [darkMode, season]);

  const navigateMonth = useCallback((dir: 'prev' | 'next') => {
    if (isFlipping) return;
    setFlipDirection(dir);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMonth(prev => {
        const next = dir === 'next' ? prev + 1 : prev - 1;
        if (next > 11) { setCurrentYear(y => y + 1); return 0; }
        if (next < 0) { setCurrentYear(y => y - 1); return 11; }
        return next;
      });
      setIsFlipping(false);
    }, 350);
  }, [isFlipping]);

  const handleDayClick = useCallback((date: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      if (isSameDay(date, rangeStart)) {
        setRangeStart(null);
        return;
      }
      const start = date < rangeStart ? date : rangeStart;
      const end = date < rangeStart ? rangeStart : date;
      setRangeStart(start);
      setRangeEnd(end);
    }
  }, [rangeStart, rangeEnd]);

  const addNote = useCallback((text: string, type: 'month' | 'range' | 'day') => {
    const note: Note = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      ...(type === 'range' && rangeStart && rangeEnd
        ? { rangeStart: formatDateKey(rangeStart), rangeEnd: formatDateKey(rangeEnd) }
        : type === 'day' && rangeStart && !rangeEnd
        ? { dayKey: formatDateKey(rangeStart) }
        : { monthKey: `${currentYear}-${currentMonth}` }),
    };
    setNotes(prev => [note, ...prev]);
  }, [rangeStart, rangeEnd, currentYear, currentMonth]);

  const deleteNote = useCallback((id: string, isRecurring: boolean = false) => {
    if (isRecurring) {
      setRecurringNotes(prev => prev.filter(n => n.id !== id));
    } else {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  }, []);

  const addRecurringNote = useCallback((text: string, type: RecurrenceType, weekdays?: number[], monthDay?: number) => {
    if (!rangeStart) return;
    const note: RecurringNote = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      type,
      weekdays,
      monthDay,
      startDate: formatDateKey(rangeStart),
      exceptions: []
    };
    setRecurringNotes(prev => [note, ...prev]);
  }, [rangeStart]);

  const skipRecurringOccurrence = useCallback((id: string, dateStr: string) => {
    setRecurringNotes(prev => prev.map(note => {
      if (note.id !== id) return note;
      return { ...note, exceptions: [...(note.exceptions || []), dateStr] };
    }));
  }, []);

  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  const handleDayLeave = useCallback(() => {
    setHoverDate(null);
  }, []);

  const monthNotes = notes.filter(n => n.monthKey === `${currentYear}-${currentMonth}`);
  const rangeNotes = notes.filter(n =>
    rangeStart && rangeEnd &&
    n.rangeStart === formatDateKey(rangeStart) &&
    n.rangeEnd === formatDateKey(rangeEnd)
  );

  const rangeLabel = rangeStart && rangeEnd
    ? `${formatDate(rangeStart)} – ${formatDate(rangeEnd)}`
    : rangeStart
    ? `From ${formatDate(rangeStart)}`
    : null;

  return (
    <div className={styles.wrapper}>
      {/* Top binder rings */}
      <div className={styles.binder}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className={styles.ring} />
        ))}
      </div>

      <div className={`${styles.calendarCard} ${isFlipping ? styles[`flip_${flipDirection}`] : ''}`}>
        {/* LEFT: Hero Panel */}
        <CalendarHero
          theme={theme}
          month={currentMonth}
          year={currentYear}
          darkMode={darkMode}
          onToggleDark={() => {
            setDarkMode(d => {
              localStorage.setItem('calendar-dark', String(!d));
              return !d;
            });
          }}
        />

        {/* RIGHT: Calendar + Notes */}
        <div className={styles.rightPanel}>
          <CalendarHeader
            month={currentMonth}
            year={currentYear}
            onPrev={() => navigateMonth('prev')}
            onNext={() => navigateMonth('next')}
            rangeLabel={rangeLabel}
            onClearRange={clearRange}
          />

          <CalendarGrid
            year={currentYear}
            month={currentMonth}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            hoverDate={hoverDate}
            holidays={holidays}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
            onDayLeave={handleDayLeave}
            notes={notes}
            recurringNotes={recurringNotes}
          />

          <NotesPanel
            monthNotes={monthNotes}
            rangeNotes={rangeNotes}
            recurringNotes={recurringNotes}
            allNotes={notes}
            rangeLabel={rangeLabel}
            selectedDay={rangeStart && !rangeEnd ? rangeStart : null}
            monthLabel={`${MONTH_NAMES[currentMonth]} ${currentYear}`}
            onAddNote={addNote}
            onAddRecurringNote={addRecurringNote}
            onDeleteNote={deleteNote}
            onSkipOccurrence={skipRecurringOccurrence}
            hasRange={!!(rangeStart && rangeEnd)}
          />
        </div>
      </div>
    </div>
  );
}
