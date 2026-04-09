import { memo } from 'react';
import styles from './DayNoteIndicator.module.css';

interface Props {
  importantCount: number;
  regularCount: number;
}

/**
 * Renders up to 3 small dot indicators inside a calendar day cell.
 * Important notes → red dots (rendered first).
 * Regular notes → accent-colored dots.
 */
const DayNoteIndicator = memo(function DayNoteIndicator({ importantCount, regularCount }: Props) {
  if (importantCount === 0 && regularCount === 0) return null;

  // Cap total visible at 3 dots
  const total = importantCount + regularCount;
  const visibleImportant = Math.min(importantCount, 3);
  const visibleRegular = Math.min(regularCount, Math.max(0, 3 - visibleImportant));

  const dots: { important: boolean }[] = [
    ...Array.from({ length: visibleImportant }, () => ({ important: true })),
    ...Array.from({ length: visibleRegular }, () => ({ important: false })),
  ];

  return (
    <div className={styles.wrapper} aria-hidden="true">
      {dots.map((dot, i) => (
        <span
          key={i}
          className={`${styles.dot} ${dot.important ? styles.important : styles.regular}`}
        />
      ))}
      {total > 3 && <span className={styles.overflow}>+</span>}
    </div>
  );
});

export default DayNoteIndicator;
