'use client';

import Image from 'next/image';
import { MONTH_NAMES } from '@/utils/calendar';
import { MonthTheme } from '@/utils/themes';
import styles from './CalendarHero.module.css';

interface Props {
  theme: MonthTheme;
  month: number;
  year: number;
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function CalendarHero({ theme, month, year, darkMode, onToggleDark }: Props) {
  return (
    <div className={styles.hero} style={{ background: theme.gradient }}>
      {/* Hero image */}
      <div className={styles.imageWrap}>
        <Image
          src={theme.imageUrl}
          alt={theme.imageAlt}
          fill
          style={{ objectFit: 'cover' }}
          className={styles.heroImage}
          priority
          unoptimized
        />
        <div className={styles.overlay} />
      </div>

      {/* Dark mode toggle */}
      <button
        className={styles.darkToggle}
        onClick={onToggleDark}
        aria-label="Toggle dark mode"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Content overlay */}
      <div className={styles.content}>
        <div className={styles.seasonBadge}>
          {theme.season === 'spring' && '🌸 Spring'}
          {theme.season === 'summer' && '☀️ Summer'}
          {theme.season === 'autumn' && '🍂 Autumn'}
          {theme.season === 'winter' && '❄️ Winter'}
        </div>
        <h1 className={styles.monthName}>{MONTH_NAMES[month]}</h1>
        <p className={styles.year}>{year}</p>
        <p className={styles.tagline}>{theme.tagline}</p>
      </div>

    </div>
  );
}
