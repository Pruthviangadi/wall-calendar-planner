// ── US Public Holidays ────────────────────────

export interface Holiday {
  name: string;
  emoji: string;
}

// Returns holidays keyed by "YYYY-M-D" (no zero-pad)
export function getHolidays(year: number): Record<string, Holiday> {
  return {
    [`${year}-0-1`]:   { name: "New Year's Day",       emoji: '🎆' },
    [`${year}-0-15`]:  { name: 'MLK Day',               emoji: '✊' },
    [`${year}-1-14`]:  { name: "Valentine's Day",       emoji: '❤️' },
    [`${year}-1-19`]:  { name: "Presidents' Day",       emoji: '🇺🇸' },
    [`${year}-2-17`]:  { name: 'St. Patrick\'s Day',    emoji: '☘️' },
    [`${year}-3-22`]:  { name: 'Earth Day',             emoji: '🌍' },
    [`${year}-4-12`]:  { name: "Mother's Day",          emoji: '💐' },
    [`${year}-4-27`]:  { name: 'Memorial Day',          emoji: '🎖️' },
    [`${year}-5-19`]:  { name: 'Juneteenth',            emoji: '✊' },
    [`${year}-6-4`]:   { name: 'Independence Day',      emoji: '🎇' },
    [`${year}-8-1`]:   { name: 'Labor Day',             emoji: '⚒️' },
    [`${year}-9-14`]:  { name: 'Columbus Day',          emoji: '⚓' },
    [`${year}-9-31`]:  { name: 'Halloween',             emoji: '🎃' },
    [`${year}-10-11`]: { name: "Veterans' Day",         emoji: '🎖️' },
    [`${year}-10-27`]: { name: 'Thanksgiving',          emoji: '🦃' },
    [`${year}-11-25`]: { name: 'Christmas Day',         emoji: '🎄' },
    [`${year}-11-31`]: { name: "New Year's Eve",        emoji: '🥂' },
  };
}
