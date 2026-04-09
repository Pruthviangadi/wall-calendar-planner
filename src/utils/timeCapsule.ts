import { formatDateKey } from './calendar';

export interface TimeCapsuleNote {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  unlockDate: string; // YYYY-MM-DD format
}

/**
 * Checks whether a given time capsule is unlocked based on the current date.
 * Relies exclusively on local midnight constraints to avoid timezone bugs.
 */
export function isCapsuleUnlocked(capsule: TimeCapsuleNote, testDate: Date = new Date()): boolean {
  const [lockY, lockM, lockD] = capsule.unlockDate.split('-').map(Number);
  
  // Date constructor treats months as 0-indexed
  const unlockObj = new Date(lockY, lockM - 1, lockD);
  
  // Create a normalized "today" date at local 00:00:00
  const todayObj = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate());

  // If today matches or has passed the unlock obj date, it unlocks.
  return todayObj >= unlockObj;
}
