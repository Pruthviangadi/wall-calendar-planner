import { formatDateKey } from './calendar';

export type RecurrenceType = 'daily' | 'weekly' | 'monthly';

export interface RecurringNote {
  id: string;
  text: string;
  createdAt: string;
  type: RecurrenceType;
  weekdays?: number[]; // 0-6 (0=Sun ... 6=Sat) for weekly
  monthDay?: number; // 1-31 for monthly
  startDate: string; // YYYY-MM-DD format
  exceptions?: string[]; // Array of YYYY-MM-DD that should be skipped
}

/**
 * Checks whether a given recurring note should occur on the targetDate.
 */
export function checkRecurrence(note: RecurringNote, targetDate: Date): boolean {
  const targetDateStr = formatDateKey(targetDate);

  // 1. Check for skipped exception dates
  if (note.exceptions?.includes(targetDateStr)) {
    return false;
  }

  // 2. We use local midnight boundaries to accurately compare plain dates 
  // without timezone shifts breaking the logic.
  const [startY, startM, startD] = note.startDate.split('-').map(Number);
  const startObj = new Date(startY, startM - 1, startD); // local midnight
  const targetObj = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  // Recurring notes don't happen BEFORE their start date.
  if (targetObj < startObj) {
    return false;
  }

  // 3. Evaluate based on type
  if (note.type === 'daily') {
    return true;
  }

  if (note.type === 'weekly' && note.weekdays) {
    return note.weekdays.includes(targetObj.getDay());
  }

  if (note.type === 'monthly' && note.monthDay) {
    // If a month has fewer days than `monthDay` (e.g. Feb 30th), we might want to clamp or skip.
    // For simplicity, if they scheduled it for the 31st and this month has 30 days, it skips it.
    // (A more advanced logic would roll back to the last day of the month).
    return targetObj.getDate() === note.monthDay;
  }

  return false;
}
