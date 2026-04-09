'use client';

import { useState, useRef, useEffect } from 'react';
import { Note } from './CalendarWrapper';
import { RecurringNote, RecurrenceType, checkRecurrence } from '@/utils/recurrence';
import { formatDateKey, formatDate } from '@/utils/calendar';
import styles from './NotesPanel.module.css';

interface Props {
  monthNotes: Note[];
  rangeNotes: Note[];
  recurringNotes: RecurringNote[];
  allNotes: Note[];
  rangeLabel: string | null;
  selectedDay: Date | null;
  monthLabel: string;
  onAddNote: (text: string, type: 'month' | 'range' | 'day') => void;
  onAddRecurringNote: (text: string, type: RecurrenceType, weekdays?: number[], monthDay?: number) => void;
  onDeleteNote: (id: string, isRecurring?: boolean) => void;
  onSkipOccurrence: (id: string, dateStr: string) => void;
  hasRange: boolean;
}

export default function NotesPanel({
  monthNotes, rangeNotes, recurringNotes, allNotes,
  rangeLabel, selectedDay, monthLabel,
  onAddNote, onAddRecurringNote, onDeleteNote, onSkipOccurrence, hasRange,
}: Props) {
  const [activeTab, setActiveTab] = useState<'month' | 'range' | 'day'>('month');
  const [input, setInput] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType | 'none'>('none');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-switch tabs
  useEffect(() => {
    if (selectedDay) setActiveTab('day');
    else if (hasRange) setActiveTab('range');
    else setActiveTab('month');
  }, [selectedDay, hasRange]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    if (activeTab === 'day' && recurrence !== 'none') {
      let weekdays;
      let monthDay;
      if (recurrence === 'weekly' && selectedDay) {
        weekdays = [selectedDay.getDay()];
      } else if (recurrence === 'monthly' && selectedDay) {
        monthDay = selectedDay.getDate();
      }
      onAddRecurringNote(text, recurrence, weekdays, monthDay);
    } else {
      onAddNote(text, activeTab);
    }

    setInput('');
    setRecurrence('none');
  };

  const dayNotes = selectedDay 
    ? allNotes.filter(n => n.dayKey === formatDateKey(selectedDay)) 
    : [];
  
  const activeRecurringNotes = selectedDay
    ? recurringNotes.filter(rn => checkRecurrence(rn, selectedDay))
    : [];

  const getActiveNotes = () => {
    if (activeTab === 'month') return monthNotes;
    if (activeTab === 'range') return rangeNotes;
    return [...dayNotes, ...activeRecurringNotes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const activeNotesList = getActiveNotes();
  const isEmpty = activeNotesList.length === 0;

  return (
    <div className={styles.panel}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'month' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('month')}
        >
          Month Notes
          {monthNotes.length > 0 && <span className={styles.badge}>{monthNotes.length}</span>}
        </button>

        <button
          className={`${styles.tab} ${activeTab === 'range' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('range')}
          disabled={!hasRange && activeTab !== 'range'}
        >
          Range
          {rangeNotes.length > 0 && <span className={styles.badge}>{rangeNotes.length}</span>}
        </button>

        <button
          className={`${styles.tab} ${activeTab === 'day' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('day')}
          disabled={!selectedDay && activeTab !== 'day'}
        >
          Day
          {(dayNotes.length + activeRecurringNotes.length) > 0 && 
            <span className={styles.badge}>{dayNotes.length + activeRecurringNotes.length}</span>
          }
        </button>
      </div>

      {/* Context label */}
      <div className={styles.contextLabel}>
        {activeTab === 'month' && <>📋 Notes for <strong>{monthLabel}</strong></>}
        {activeTab === 'range' && rangeLabel && <>📅 Notes for <strong>{rangeLabel}</strong></>}
        {activeTab === 'day' && selectedDay && <>📌 Notes for <strong>{formatDate(selectedDay)}</strong></>}
        {!['month'].includes(activeTab) && !hasRange && !selectedDay && (
          <span className={styles.hint}>Select a date to add notes</span>
        )}
      </div>

      {/* Note list */}
      <div className={styles.noteList}>
        {isEmpty ? (
          <div className={styles.emptyState}>
            <p>No notes yet</p>
          </div>
        ) : (
          activeNotesList.map(note => {
            const isRecurr = 'type' in note;
            return (
              <div key={note.id} className={styles.noteItem}>
                <p className={styles.noteText}>
                  {isRecurr && <span className={styles.recurrTag}>{(note as RecurringNote).type}</span>}
                  {note.text}
                </p>
                <div className={styles.noteMeta}>
                  <span className={styles.noteDate}>
                    {new Date(note.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric', minute: '2-digit',
                    })}
                  </span>
                  <div className={styles.actions}>
                    {isRecurr && selectedDay && (
                      <button 
                        className={styles.skipBtn} 
                        onClick={() => onSkipOccurrence(note.id, formatDateKey(selectedDay))}
                        title="Skip this occurrence"
                      >
                        Skip
                      </button>
                    )}
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDeleteNote(note.id, isRecurr)}
                      aria-label="Delete note"
                      title={isRecurr ? "Delete all occurrences" : "Delete note"}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input form */}
      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder={
              (activeTab === 'range' && !hasRange) || (activeTab === 'day' && !selectedDay)
                ? 'Select a date to add notes…'
                : 'Write a note… (Enter to save)'
            }
            disabled={(activeTab === 'range' && !hasRange) || (activeTab === 'day' && !selectedDay)}
            rows={1}
          />
          
          {activeTab === 'day' && selectedDay && (
            <select 
              className={styles.recurrenceSelect}
              value={recurrence}
              onChange={e => setRecurrence(e.target.value as RecurrenceType | 'none')}
            >
              <option value="none">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!input.trim() || (activeTab === 'range' && !hasRange) || (activeTab === 'day' && !selectedDay)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
