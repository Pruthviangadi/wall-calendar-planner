// ── Month/Season theme config ──────────────────

export interface MonthTheme {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  imageUrl: string;
  imageAlt: string;
  gradient: string;
  tagline: string;
}

export const MONTH_THEMES: MonthTheme[] = [
  {
    season: 'winter',
    imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80',
    imageAlt: 'Snowy winter landscape',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
    tagline: 'New beginnings await',
  },
  {
    season: 'winter',
    imageUrl: 'https://images.unsplash.com/photo-1548777123-e216912df78a?w=800&q=80',
    imageAlt: 'Frozen lake in February',
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #7c3aed 100%)',
    tagline: 'Love is in the cold air',
  },
  {
    season: 'spring',
    imageUrl: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&q=80',
    imageAlt: 'Cherry blossoms in spring',
    gradient: 'linear-gradient(135deg, #065f46 0%, #16a34a 100%)',
    tagline: 'Bloom where you are planted',
  },
  {
    season: 'spring',
    imageUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80',
    imageAlt: 'Spring meadow in April',
    gradient: 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',
    tagline: 'April showers bring May flowers',
  },
  {
    season: 'spring',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
    imageAlt: 'Vibrant flowers in May',
    gradient: 'linear-gradient(135deg, #166534 0%, #4ade80 100%)',
    tagline: 'Let things bloom',
  },
  {
    season: 'summer',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    imageAlt: 'Sunny beach in summer',
    gradient: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)',
    tagline: 'Sun, sand, and endless days',
  },
  {
    season: 'summer',
    imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    imageAlt: 'Mountain peak in July',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #fb923c 100%)',
    tagline: 'Reach new heights',
  },
  {
    season: 'summer',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    imageAlt: 'Golden sunset in August',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',
    tagline: 'Every sunset is a new promise',
  },
  {
    season: 'autumn',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
    imageAlt: 'Autumn forest in September',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    tagline: 'Let the leaves fall where they may',
  },
  {
    season: 'autumn',
    imageUrl: 'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800&q=80',
    imageAlt: 'Fall foliage in October',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    tagline: 'Change is beautiful',
  },
  {
    season: 'autumn',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    imageAlt: 'Misty mountains in November',
    gradient: 'linear-gradient(135deg, #422006 0%, #a16207 100%)',
    tagline: 'Gratitude changes everything',
  },
  {
    season: 'winter',
    imageUrl: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80',
    imageAlt: 'Snowy village at Christmas',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%)',
    tagline: 'Magic is all around us',
  },
];
