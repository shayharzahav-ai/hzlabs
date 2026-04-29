# Landing Page Redesign — Design Document
Date: 2026-04-29

## Goal
Replace the current `landing_page.html` with the new premium editorial design from `hzlabs-design/`.

## Source Design
Located at `hzlabs-design/` — a React prototype with:
- `HZ Labs Homepage.html` — entry point
- `app.jsx` — all sections and content
- `styles.css` — full design system
- `placeholder.jsx` / `tweaks-panel.jsx` — prototyping tools (not for production)

## Implementation Approach
Convert the React prototype to a **single self-contained `landing_page.html`** with inline CSS + vanilla JS. No build step, no React dependency, no changes to Dockerfile or deploy pipeline.

## Design Decisions

### Theme & Colors
- Default: `dark-ink` (`--bg: #0E0E0E`, `--bg-2: #161616`, `--bg-3: #1B1B1B`)
- Accent: amber `oklch(0.74 0.13 70)`
- Light mode: `light-paper` (`--bg: #F4EFE7`)
- Toggle: dark ↔ light, persisted to `localStorage` under `hzlabs-theme`

### Typography
- Display/body: **Heebo** (Google Fonts, Hebrew + Latin)
- Mono/labels: **JetBrains Mono** (Google Fonts)

### Hero
- Variant: **B — Statement**
  - Title: "טכנולוגיה, / בקנה מידה אנושי."
  - Sub: "מערכת אחת בייצור עם אלפי משתמשים. צוות קטן. גישה אישית. אפיון, פיתוח, ליווי שוטף — תחת קורת גג אחת."
  - CTA primary: "מקרה הבוחן שלנו" → `#case`
  - CTA secondary: "שיחה ראשונית" → `mailto:harzahav.labs@gmail.com`
- Right column visual: **animated terminal window** (code/architecture diagram, no photography)

### Sections
1. **Hero** — two-column grid (content + terminal visual), marquee ticker below
2. **Case Study (02)** — שותפים למסע; browser mockup instead of screenshot; 3 stills as code editor / data panel visuals
3. **Services (03)** — 4-cell grid; פלטפורמות תוכן, פורטלי לקוחות, ניהול אירועים, אינטגרציות
4. **About (04)** — prose + 3 pillars; portrait slot replaced with abstract HZ geometric composition
5. **Contact (05)** — text-only, large title, email CTA
6. **Footer** — brand, nav links, legal

### Image Placeholders → Code Visuals
No photography available. Replacements:
- **Hero right column**: animated terminal/code window (CSS-drawn, shows architecture diagram)
- **Case study hero**: browser chrome mockup with URL bar (`shutafimlamasa.online`)
- **Case study stills (×3)**: styled code panels (library view, live event, admin)
- **About portrait**: abstract geometric HZ mark composition

### Content
- Contact email: `harzahav.labs@gmail.com`
- Customer portal link in nav and footer: `https://harzahav.online/customers.html`

### What Gets Removed
- Tweaks panel (design tool only)
- Hero variant picker, accent picker, density picker
- Design templates section from current site (already removed)

### What Gets Kept from Current Site
- Dark/light theme toggle with localStorage persistence
- Customer portal nav link
- Same Dockerfile / deploy pipeline

## Files Changed
- `landing_page.html` — full rewrite
- No other files change

## Deploy
Same as current: `scp` to VPS → `docker build` → `docker run`
