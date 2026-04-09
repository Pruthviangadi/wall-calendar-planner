'use client';

import { MONTH_NAMES } from '@/utils/calendar';
import styles from './CalendarHeader.module.css';

interface Props {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  rangeLabel: string | null;
  onClearRange: () => void;
}

export default function CalendarHeader({ month, year, onPrev, onNext, rangeLabel, onClearRange }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.top}>
        <button className={styles.navBtn} onClick={onPrev} aria-label="Previous month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.titleBlock}>
          <h2 className={styles.monthTitle}>{MONTH_NAMES[month]}</h2>
          <span className={styles.yearLabel}>{year}</span>
        </div>

        <button className={styles.navBtn} onClick={onNext} aria-label="Next month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {rangeLabel && (
        <div className={styles.rangePill}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{rangeLabel}</span>
          <button className={styles.clearBtn} onClick={onClearRange} aria-label="Clear range">✕</button>
        </div>
      )}
    </div>
  );
}
