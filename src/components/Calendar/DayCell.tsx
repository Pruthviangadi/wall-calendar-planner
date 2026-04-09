'use client';

import { memo, useCallback } from 'react';
import { CalendarDay } from '@/utils/calendar';
import { Holiday } from '@/utils/holidays';
import DayNoteIndicator from './DayNoteIndicator';
import styles from './DayCell.module.css';
import confetti from 'canvas-confetti';

interface Props {
  index: number;
  day: CalendarDay;
  holiday?: Holiday;
  /** Count of notes flagged as important (text contains !, "urgent", or "important") */
  importantNoteCount: number;
  /** Count of regular (non-important) notes */
  regularNoteCount: number;
  edge: 'start' | 'end' | null;
  inRange: boolean;
  inHover: boolean;
  isHoverEdge: boolean;
  isStartEdge: boolean;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  onDayLeave: () => void;
}

const DayCell = memo(function DayCell({
  index, day, holiday, importantNoteCount, regularNoteCount,
  edge, inRange, inHover, isHoverEdge, isStartEdge,
  onDayClick, onDayHover, onDayLeave,
}: Props) {
  const isSelected = edge === 'start' || edge === 'end';
  const isStart = edge === 'start';
  const isEnd = edge === 'end';

  const classNames = [
    styles.cell,
    !day.isCurrentMonth && styles.otherMonth,
    day.isToday && styles.today,
    day.isWeekend && day.isCurrentMonth && styles.weekend,
    isSelected && styles.selected,
    isStart && styles.rangeStart,
    isEnd && styles.rangeEnd,
    inRange && styles.inRange,
    inHover && !isSelected && styles.inHover,
    isHoverEdge && styles.hoverEdge,
    isStartEdge && !isSelected && styles.startEdge,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = useCallback(() => {
    if (!day.isCurrentMonth) return;
    if (holiday) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        disableForReducedMotion: true,
      });
    }
    onDayClick(day.date);
  }, [day.isCurrentMonth, day.date, holiday, onDayClick]);

  const handleMouseEnter = useCallback(() => {
    if (day.isCurrentMonth) onDayHover(day.date);
  }, [day.isCurrentMonth, day.date, onDayHover]);

  return (
    <button
      className={classNames}
      style={{ '--animation-order': index } as React.CSSProperties}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onDayLeave}
      /* Touch: tap immediately without delay, prevent double-tap zoom */
      onTouchEnd={handleClick}
      disabled={!day.isCurrentMonth}
      aria-label={`${day.date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })}${holiday ? `, ${holiday.name}` : ''}${
        importantNoteCount + regularNoteCount > 0
          ? `, ${importantNoteCount + regularNoteCount} note${importantNoteCount + regularNoteCount > 1 ? 's' : ''}`
          : ''
      }`}
      title={holiday ? `${holiday.emoji} ${holiday.name}` : undefined}
    >
      <span className={styles.number}>{day.dayOfMonth}</span>

      <div className={styles.indicators}>
        {holiday && (
          <span className={styles.holidayDot} title={holiday.name}>
            {holiday.emoji}
          </span>
        )}
        <DayNoteIndicator
          importantCount={importantNoteCount}
          regularCount={regularNoteCount}
        />
      </div>
    </button>
  );
});

export default DayCell;
