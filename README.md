# 📅 Interactive Wall Calendar

A polished, interactive **React/Next.js** calendar component inspired by a physical wall calendar aesthetic.

## ✨ Features

| Feature | Details |
|---|---|
| **Wall Calendar Aesthetic** | Binder rings, hero image, month overlay, paper-card design |
| **Day Range Selector** | Click start → click end. Visual states: start, end, in-range, hover preview |
| **Integrated Notes** | Month notes + range-specific notes, persisted via `localStorage` |
| **Fully Responsive** | Desktop: side-by-side. Mobile: stacked vertically |
| **Seasonal Themes** | Auto color palette per season (spring/summer/autumn/winter) |
| **Page-Flip Animation** | Smooth flip transition when navigating months |
| **Holiday Markers** | US public holidays with emoji indicators |
| **Dark Mode** | Toggle via 🌙 button on the hero image |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + Google Fonts
│   ├── page.tsx          # Home page
│   └── globals.css       # Design tokens, themes, reset
├── components/Calendar/
│   ├── CalendarWrapper   # Main state orchestrator
│   ├── CalendarHero      # Hero image panel
│   ├── CalendarHeader    # Month nav + range pill
│   ├── CalendarGrid      # Day grid
│   ├── DayCell           # Individual day cell
│   └── NotesPanel        # Notes with month/range tabs
└── utils/
    ├── calendar.ts        # Date helpers
    ├── holidays.ts        # US holiday data
    └── themes.ts          # Month/season themes
```

## 🎨 Design Decisions

- **CSS Modules** — scoped, no runtime overhead, no Tailwind dependency
- **localStorage** — no backend required, notes persist across sessions
- **`next/image`** — optimized hero images from Unsplash
- **`memo`** on DayCell — prevents unnecessary re-renders during range hover
- **Seasonal theming** via CSS custom properties — zero JS cost

## 📱 Responsive Behaviour

- **≥ 768px** — Hero left (40%) | Calendar + Notes right (60%)
- **< 768px** — Hero top → Calendar → Notes stacked
