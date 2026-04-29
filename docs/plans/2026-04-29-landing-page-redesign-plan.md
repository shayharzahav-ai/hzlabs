# Landing Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite `landing_page.html` based on the premium editorial design in `hzlabs-design/`, converting React JSX → single self-contained HTML file with inline CSS + vanilla JS.

**Architecture:** Single `landing_page.html` file with all CSS in a `<style>` block and all JS in a `<script>` block. No build step, no React. CSS design tokens drive dark-ink/light-paper theming. Code/terminal visuals replace all photography placeholders.

**Tech Stack:** Vanilla HTML5, CSS custom properties, vanilla JS (ES6), Google Fonts (Heebo + JetBrains Mono), `localStorage` for theme persistence.

**Source files to reference:**
- `hzlabs-design/styles.css` — full CSS design system (copy and adapt)
- `hzlabs-design/app.jsx` — all section content and text
- Current `landing_page.html` — customer portal links to preserve

---

## Task 1: HTML Shell + CSS Design Tokens

**Files:**
- Modify: `landing_page.html` (full rewrite)

**Step 1: Replace landing_page.html with bare shell**

```html
<!DOCTYPE html>
<html lang="he" dir="rtl" data-theme="dark-ink">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HZ Labs — סטודיו פיתוח · מערכות בקנה מידה אנושי</title>
  <meta name="description" content="HZ Labs — סטודיו פיתוח לבניית פלטפורמות תוכן, פורטלי לקוחות ומערכות מנויים. מהאפיון ועד הייצור, עם דגש על נגישות, ביצועים ויחס אנושי.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* TOKENS HERE */
  </style>
</head>
<body>
  <p>shell</p>
  <script>/* JS HERE */</script>
</body>
</html>
```

**Step 2: Add CSS design tokens inside `<style>`**

Copy verbatim from `hzlabs-design/styles.css` lines 1–65 (`:root`, all `[data-theme]` blocks, `[data-density]`). Then add base reset:

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  color: var(--fg);
  font-family: var(--t-sans);
  font-feature-settings: "kern", "ss01";
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  transition: background-color 0.4s var(--ease), color 0.4s var(--ease);
  direction: rtl;
  font-size: 17px;
  line-height: 1.55;
  overflow-x: hidden;
}
html[data-theme], html[data-theme] body { background: var(--bg); }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }
ul, ol { padding: 0; margin: 0; list-style: none; }
.mono {
  font-family: var(--t-mono);
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--fg-3);
  font-weight: 500;
}
.container {
  max-width: var(--max);
  margin: 0 auto;
  padding-inline: var(--pad-x);
}
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--line); border-radius: 10px; }
```

**Step 3: Open `landing_page.html` directly in browser**

Verify: dark background (`#0E0E0E`), "shell" text in foreground color, no console errors.

**Step 4: Commit**

```bash
git add landing_page.html
git commit -m "Redesign: HTML shell and CSS design tokens"
```

---

## Task 2: Header / Nav

**Files:**
- Modify: `landing_page.html` — add header CSS + HTML

**Step 1: Add header CSS** (copy from `hzlabs-design/styles.css` lines 107–215, the HEADER block). Add it inside `<style>`.

**Step 2: Add header HTML** (replace `<p>shell</p>` with):

```html
<header class="site-header" id="top">
  <div class="container header-inner">
    <a href="#top" class="brand">
      <span class="brand-mark"></span>
      <span class="brand-name">HZ Labs</span>
    </a>
    <nav class="site-nav" id="siteNav" aria-label="ניווט ראשי">
      <a href="#case">פרויקט</a>
      <a href="#services">שירותים</a>
      <a href="#about">אודות</a>
      <a href="#contact">צור קשר</a>
      <a href="/customers.html" class="nav-portal">
        אזור לקוחות
        <span class="nav-portal-icon" aria-hidden="true">↗</span>
      </a>
      <button class="theme-toggle" id="themeToggle" aria-label="החלף ערכת נושא">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" id="themeIcon">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      </button>
    </nav>
    <button class="nav-toggle" id="navToggle" aria-label="פתח תפריט" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<main></main>
<footer></footer>
```

**Step 3: Add theme + nav JS** inside `<script>`:

```javascript
// Theme
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const DARK_THEMES = ['dark-ink', 'light-paper'];
const THEME_PAIR = { 'dark-ink': 'light-paper', 'light-paper': 'dark-ink' };

const SUN_SVG = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
const MOON_SVG = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

function applyTheme(theme) {
  html.dataset.theme = theme;
  localStorage.setItem('hzlabs-theme', theme);
  const isDark = theme.startsWith('dark');
  themeIcon.innerHTML = isDark ? SUN_SVG : MOON_SVG;
  themeToggle.setAttribute('aria-label', isDark ? 'החלף למצב בהיר' : 'החלף למצב כהה');
}

const saved = localStorage.getItem('hzlabs-theme') || 'dark-ink';
applyTheme(saved);

themeToggle.addEventListener('click', () => {
  applyTheme(THEME_PAIR[html.dataset.theme] || 'dark-ink');
});

// Mobile nav
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
siteNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});
```

**Step 4: Verify in browser**

- Header visible, sticky, blurred background
- Brand mark amber square visible
- Theme toggle works (dark ↔ light)
- On narrow viewport: hamburger appears, nav opens/closes

**Step 5: Commit**

```bash
git add landing_page.html
git commit -m "Redesign: header, nav, theme toggle"
```

---

## Task 3: Hero Section

**Files:**
- Modify: `landing_page.html` — add hero CSS + HTML

**Step 1: Add hero CSS** (copy from `hzlabs-design/styles.css` lines 217–395, the HERO block). Add inside `<style>`.

**Step 2: Add terminal visual CSS** — the hero right column uses a code window instead of a photo:

```css
/* ── Terminal Visual ─────────────────────────── */
.terminal-wrap {
  position: relative;
  width: 100%;
  border: 1px solid var(--line);
  background: var(--bg-2);
  border-radius: 4px;
  overflow: hidden;
}
.terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
  background: var(--bg-3);
}
.t-dot { width: 10px; height: 10px; border-radius: 50%; }
.t-dot-r { background: #ff5f57; }
.t-dot-y { background: #febc2e; }
.t-dot-g { background: #28c840; }
.terminal-title {
  font-family: var(--t-mono);
  font-size: 11px;
  color: var(--fg-3);
  margin-inline-start: 6px;
  letter-spacing: 0.05em;
}
.terminal-body {
  padding: 20px 20px 28px;
  font-family: var(--t-mono);
  font-size: 13px;
  line-height: 1.75;
  direction: ltr;
  text-align: left;
}
.t-comment { color: var(--fg-3); }
.t-key { color: var(--accent); }
.t-val { color: var(--fg-2); }
.t-str { color: #a3be8c; }
.t-num { color: #b48ead; }
.t-cursor {
  display: inline-block;
  width: 8px; height: 15px;
  background: var(--accent);
  vertical-align: text-bottom;
  animation: blink 1.1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }
```

**Step 3: Add hero HTML** inside `<main>`:

```html
<section class="hero" id="hero">
  <div class="container hero-grid">
    <div class="hero-content">
      <div class="eyebrow">
        <span class="eyebrow-dot" aria-hidden="true"></span>
        סטודיו פיתוח · ת״א
      </div>
      <h1 class="hero-title">
        <span class="hero-title-line" style="animation-delay:100ms">טכנולוגיה,</span>
        <span class="hero-title-line" style="animation-delay:190ms">בקנה מידה אנושי.</span>
      </h1>
      <p class="hero-sub">מערכת אחת בייצור עם אלפי משתמשים. צוות קטן. גישה אישית. אפיון, פיתוח, ליווי שוטף — תחת קורת גג אחת.</p>
      <div class="hero-actions">
        <a href="#case" class="btn btn-primary">
          מקרה הבוחן שלנו
          <span class="btn-arrow" aria-hidden="true">←</span>
        </a>
        <a href="mailto:harzahav.labs@gmail.com" class="btn btn-ghost">שיחה ראשונית</a>
      </div>
      <dl class="hero-meta">
        <div><dt>מערכת בייצור</dt><dd>שותפים למסע</dd></div>
        <div><dt>תחום</dt><dd>פלטפורמות תוכן ומנויים</dd></div>
        <div><dt>זמינות</dt><dd>לפרויקטים חדשים · 2026</dd></div>
      </dl>
    </div>
    <aside class="hero-visual" aria-hidden="true">
      <div class="terminal-wrap">
        <div class="terminal-bar">
          <span class="t-dot t-dot-r"></span>
          <span class="t-dot t-dot-y"></span>
          <span class="t-dot t-dot-g"></span>
          <span class="terminal-title">hz-labs / architecture.ts</span>
        </div>
        <div class="terminal-body">
          <div><span class="t-comment">// HZ Labs — platform stack</span></div>
          <div>&nbsp;</div>
          <div><span class="t-key">const</span> <span class="t-val">platform</span> = {</div>
          <div>&nbsp;&nbsp;<span class="t-key">auth</span>: <span class="t-str">"roles + subscriptions"</span>,</div>
          <div>&nbsp;&nbsp;<span class="t-key">content</span>: <span class="t-str">"video · audio · text"</span>,</div>
          <div>&nbsp;&nbsp;<span class="t-key">live</span>: <span class="t-str">"events + streaming"</span>,</div>
          <div>&nbsp;&nbsp;<span class="t-key">users</span>: <span class="t-num">4200</span>,</div>
          <div>&nbsp;&nbsp;<span class="t-key">uptime</span>: <span class="t-str">"99.9%"</span>,</div>
          <div>};</div>
          <div>&nbsp;</div>
          <div><span class="t-comment">// currently available</span></div>
          <div><span class="t-key">export default</span> <span class="t-val">platform</span>;<span class="t-cursor"></span></div>
        </div>
      </div>
      <div class="hero-visual-tag">
        <span class="mono">/01</span>
        <span>מערכת בייצור</span>
      </div>
    </aside>
  </div>
  <div class="hero-marquee" aria-hidden="true">
    <div class="marquee-track" id="marqueeTrack">
      <span>
        <em>פלטפורמות תוכן</em><i>·</i>
        <em>פורטלי לקוחות</em><i>·</i>
        <em>מערכות מנויים</em><i>·</i>
        <em>ניהול אירועים חיים</em><i>·</i>
        <em>הרשאות ותפקידים</em><i>·</i>
        <em>אינטגרציות API</em><i>·</i>
      </span>
      <span aria-hidden="true">
        <em>פלטפורמות תוכן</em><i>·</i>
        <em>פורטלי לקוחות</em><i>·</i>
        <em>מערכות מנויים</em><i>·</i>
        <em>ניהול אירועים חיים</em><i>·</i>
        <em>הרשאות ותפקידים</em><i>·</i>
        <em>אינטגרציות API</em><i>·</i>
      </span>
      <span aria-hidden="true">
        <em>פלטפורמות תוכן</em><i>·</i>
        <em>פורטלי לקוחות</em><i>·</i>
        <em>מערכות מנויים</em><i>·</i>
        <em>ניהול אירועים חיים</em><i>·</i>
        <em>הרשאות ותפקידים</em><i>·</i>
        <em>אינטגרציות API</em><i>·</i>
      </span>
    </div>
  </div>
</section>
```

**Step 4: Verify in browser**

- Hero title animates in (staggered rise)
- Terminal window visible on right with blinking cursor
- Marquee scrolls horizontally
- Buttons styled, amber accent visible

**Step 5: Commit**

```bash
git add landing_page.html
git commit -m "Redesign: hero section with terminal visual"
```

---

## Task 4: Case Study Section

**Files:**
- Modify: `landing_page.html` — add case study CSS + HTML

**Step 1: Add section-header + case study CSS** (copy from `hzlabs-design/styles.css` lines 448–585). Add inside `<style>`.

**Step 2: Add browser mockup CSS** — replaces the screenshot photo:

```css
/* ── Browser Mockup ──────────────────────────── */
.browser-mockup {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
  background: var(--bg-2);
}
.browser-chrome {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
  background: var(--bg-3);
}
.browser-dots { display: flex; gap: 6px; }
.b-dot { width: 10px; height: 10px; border-radius: 50%; }
.b-dot-r { background: #ff5f57; }
.b-dot-y { background: #febc2e; }
.b-dot-g { background: #28c840; }
.browser-url-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 4px 10px;
  font-family: var(--t-mono);
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.03em;
}
.browser-url-bar svg { flex-shrink: 0; color: var(--fg-3); }
.browser-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16/9;
  background: repeating-linear-gradient(
    -45deg,
    var(--bg-2),
    var(--bg-2) 10px,
    var(--bg-3) 10px,
    var(--bg-3) 20px
  );
  position: relative;
}
.browser-screen-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: color-mix(in oklch, var(--bg) 85%, transparent);
  border: 1px solid var(--line);
  backdrop-filter: blur(8px);
  font-family: var(--t-mono);
  font-size: 12px;
  color: var(--fg-2);
  letter-spacing: 0.06em;
}
/* Code panel stills */
.code-panel {
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
  background: var(--bg-2);
}
.code-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--line);
  background: var(--bg-3);
  font-family: var(--t-mono);
  font-size: 11px;
  color: var(--fg-3);
}
.code-panel-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.code-panel-body {
  padding: 16px;
  font-family: var(--t-mono);
  font-size: 12px;
  line-height: 1.7;
  direction: ltr;
  text-align: left;
  aspect-ratio: 4/3;
  color: var(--fg-2);
  overflow: hidden;
}
.cp-accent { color: var(--accent); }
.cp-dim { color: var(--fg-3); }
.cp-green { color: #a3be8c; }
```

**Step 3: Add case study HTML** inside `<main>` after hero:

```html
<section class="case" id="case">
  <div class="container">
    <header class="section-header">
      <div class="section-meta">
        <span class="mono section-num">02</span>
        <span class="mono section-kicker">— פרויקט דגל</span>
      </div>
      <h2 class="section-title">הספרייה — שותפים למסע</h2>
      <p class="section-lede">פלטפורמת תוכן וקהילה לליווי רוחני, לתמיכה במתמודדים עם מחלה, אובדן ואבל. מאות שעות תוכן, מפגשים חיים, ומרחב נגיש — בייצור.</p>
    </header>

    <div class="case-hero">
      <div class="browser-mockup">
        <div class="browser-chrome">
          <div class="browser-dots">
            <span class="b-dot b-dot-r"></span>
            <span class="b-dot b-dot-y"></span>
            <span class="b-dot b-dot-g"></span>
          </div>
          <div class="browser-url-bar">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            shutafimlamasa.online
          </div>
        </div>
        <div class="browser-screen">
          <div class="browser-screen-label">
            <span class="mono" style="color:var(--accent)">● LIVE</span>
            SHUTAFIMLAMASA.ONLINE
          </div>
        </div>
      </div>
      <a href="https://shutafimlamasa.online/" target="_blank" rel="noopener" class="case-link">
        <span>לצפייה במערכת החיה</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>

    <div class="case-body">
      <div class="case-side">
        <div class="kv"><span class="mono">לקוח</span><strong>שותפים למסע (ע״ר)</strong></div>
        <div class="kv"><span class="mono">תחום</span><strong>פלטפורמת תוכן וקהילה</strong></div>
        <div class="kv"><span class="mono">סטטוס</span><strong>בייצור · התרחבות שוטפת</strong></div>
        <div class="kv"><span class="mono">סטאק</span><strong>Web · Streaming · Auth · CMS</strong></div>
      </div>
      <div class="case-main">
        <div class="case-block">
          <h3>האתגר</h3>
          <p>לרכז מאות מפגשים, שיחות וסדרות תוכן במרחב דיגיטלי שבטוח לחזור אליו — גם ברגעים הקשים ביותר. נגיש לקהל מבוגר, עובד מהר על חיבור איטי, ומכבד את הפרטיות של מי שמשתמש בו.</p>
        </div>
        <div class="case-block">
          <h3>מה בנינו</h3>
          <ul class="case-list">
            <li><span class="mono">01</span> מאגר תוכן רב־פורמטי — וידאו, שמע, טקסט — עם חיפוש וקטלוג</li>
            <li><span class="mono">02</span> מערכת הרשאות ומנויים מדורגת לפי קהל יעד</li>
            <li><span class="mono">03</span> שידור חי וניהול אירועים בזמן אמת</li>
            <li><span class="mono">04</span> חוויה נגישה (WCAG AA), ימינה־לשמאל, תמיכה במסכים מבוגרים</li>
          </ul>
        </div>
        <div class="case-block">
          <h3>תוצאה</h3>
          <p>פלטפורמה שהפכה לבית דיגיטלי לאלפי משתמשים. קהילה פעילה, צריכה שוטפת של תוכן, ותשתית שמאפשרת לארגון להתרחב בלי להוסיף מורכבות תפעולית.</p>
        </div>
      </div>
    </div>

    <div class="case-stills">
      <div class="code-panel">
        <div class="code-panel-header"><span class="code-panel-dot"></span>ספריית תוכן</div>
        <div class="code-panel-body">
          <div><span class="cp-accent">GET</span> <span class="cp-green">/api/library</span></div>
          <div><span class="cp-dim">─────────────────</span></div>
          <div>videos: <span class="cp-accent">847</span></div>
          <div>audio:  <span class="cp-accent">312</span></div>
          <div>series: <span class="cp-accent">64</span></div>
          <div><span class="cp-dim">─────────────────</span></div>
          <div>search: <span class="cp-green">"אבל"</span></div>
          <div>results: <span class="cp-accent">38</span> items</div>
          <div><span class="cp-dim">filtered by role</span></div>
        </div>
      </div>
      <div class="code-panel">
        <div class="code-panel-header"><span class="code-panel-dot"></span>אירוע חי</div>
        <div class="code-panel-body">
          <div><span class="cp-accent">● LIVE</span> <span class="cp-green">event #142</span></div>
          <div><span class="cp-dim">─────────────────</span></div>
          <div>viewers: <span class="cp-accent">214</span></div>
          <div>duration: <span class="cp-accent">01:24:07</span></div>
          <div>chat: <span class="cp-green">enabled</span></div>
          <div><span class="cp-dim">─────────────────</span></div>
          <div>recording: <span class="cp-green">auto-save</span></div>
          <div>notify: <span class="cp-accent">1,840</span></div>
        </div>
      </div>
      <div class="code-panel">
        <div class="code-panel-header"><span class="code-panel-dot"></span>ניהול הרשאות</div>
        <div class="code-panel-body">
          <div><span class="cp-accent">roles</span> <span class="cp-dim">/ config</span></div>
          <div><span class="cp-dim">─────────────────</span></div>
          <div>guest:    <span class="cp-green">preview</span></div>
          <div>member:   <span class="cp-green">full lib</span></div>
          <div>premium:  <span class="cp-green">live + dl</span></div>
          <div>admin:    <span class="cp-accent">all</span></div>
          <div><span class="cp-dim">─────────────────</span></div>
          <div>active:   <span class="cp-accent">4,200</span></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 4: Verify in browser**

- Section header with number + kicker visible
- Browser mockup with URL bar
- Two-column case body (sidebar + content)
- Three code panels at bottom

**Step 5: Commit**

```bash
git add landing_page.html
git commit -m "Redesign: case study section with browser mockup and code panels"
```

---

## Task 5: Services Section

**Files:**
- Modify: `landing_page.html` — add services CSS + HTML

**Step 1: Add services CSS** (copy from `hzlabs-design/styles.css` lines 587–644). Add inside `<style>`.

**Step 2: Add services HTML** inside `<main>` after case study:

```html
<section class="services" id="services">
  <div class="container">
    <header class="section-header">
      <div class="section-meta">
        <span class="mono section-num">03</span>
        <span class="mono section-kicker">— מה שאנחנו עושים</span>
      </div>
      <h2 class="section-title">ארבע קטגוריות. עומק בכל אחת.</h2>
      <p class="section-lede">לא סוכנות שבונה הכל. סטודיו שמתמחה בארבעה תחומים, ויודע אותם לעומק — מהאפיון ועד הליווי בייצור.</p>
    </header>
    <ol class="services-grid">
      <li class="service">
        <div class="service-head"><span class="mono service-n">01</span><h3>פלטפורמות תוכן</h3></div>
        <p>ספריות וידאו ושמע, מערכות חיפוש וקטלוג, ניהול עורכים. מותאם לקהל ולכמויות שלכם — לא Off-the-shelf.</p>
        <ul class="service-tags"><li class="mono">CMS מותאם</li><li class="mono">סטרימינג</li><li class="mono">חיפוש</li></ul>
      </li>
      <li class="service">
        <div class="service-head"><span class="mono service-n">02</span><h3>פורטלי לקוחות ומנויים</h3></div>
        <p>אזורים אישיים מאובטחים, ניהול תפקידים, חשבוניות ומסמכים. הלקוחות שלכם נכנסים, רואים בדיוק מה שצריך, ולא יותר.</p>
        <ul class="service-tags"><li class="mono">Auth</li><li class="mono">תפקידים</li><li class="mono">Self-service</li></ul>
      </li>
      <li class="service">
        <div class="service-head"><span class="mono service-n">03</span><h3>ניהול אירועים חיים</h3></div>
        <p>שידורים, מפגשים, סדנאות — עם לוח זמנים, הרשמה, התראות וצפייה ישירה. נבדק מול עומס אמיתי.</p>
        <ul class="service-tags"><li class="mono">Live</li><li class="mono">RSVP</li><li class="mono">התראות</li></ul>
      </li>
      <li class="service">
        <div class="service-head"><span class="mono service-n">04</span><h3>אינטגרציות וצנרת נתונים</h3></div>
        <p>חיבור בין המערכות שכבר יש לכם — סליקה, CRM, מייל, אנליטיקס. בלי דאטה שיוצא ושוקע במקומות לא ברורים.</p>
        <ul class="service-tags"><li class="mono">API</li><li class="mono">Webhooks</li><li class="mono">ETL</li></ul>
      </li>
    </ol>
  </div>
</section>
```

**Step 3: Verify in browser** — 2×2 grid of service cards, hover background change, tags visible.

**Step 4: Commit**

```bash
git add landing_page.html
git commit -m "Redesign: services section"
```

---

## Task 6: About Section

**Files:**
- Modify: `landing_page.html` — add about CSS + HTML

**Step 1: Add about CSS** (copy from `hzlabs-design/styles.css` lines 648–698). Add inside `<style>`.

**Step 2: Add HZ geometric visual CSS** — replaces the portrait photo:

```css
/* ── HZ Geometric Visual ─────────────────────── */
.hz-geo {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: var(--bg-3);
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hz-geo-inner {
  position: relative;
  width: 180px; height: 180px;
}
.hz-geo svg { width: 100%; height: 100%; }
.hz-geo-label {
  position: absolute;
  bottom: 16px;
  inset-inline-end: 16px;
  font-family: var(--t-mono);
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.08em;
}
.hz-geo-corner {
  position: absolute;
  width: 16px; height: 16px;
  border: 1px solid var(--accent);
}
.hz-geo-corner.tl { top: 14px; left: 14px; border-right: 0; border-bottom: 0; }
.hz-geo-corner.tr { top: 14px; right: 14px; border-left: 0; border-bottom: 0; }
.hz-geo-corner.bl { bottom: 14px; left: 14px; border-right: 0; border-top: 0; }
.hz-geo-corner.br { bottom: 14px; right: 14px; border-left: 0; border-top: 0; }
```

**Step 3: Add about HTML** inside `<main>` after services:

```html
<section class="about" id="about">
  <div class="container about-grid">
    <div class="about-side">
      <div class="hz-geo">
        <span class="hz-geo-corner tl"></span>
        <span class="hz-geo-corner tr"></span>
        <span class="hz-geo-corner bl"></span>
        <span class="hz-geo-corner br"></span>
        <div class="hz-geo-inner">
          <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="90" cy="90" r="72" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 3"/>
            <circle cx="90" cy="90" r="48" stroke="var(--line)" stroke-width="1"/>
            <circle cx="90" cy="18" r="4" fill="var(--accent)"/>
            <circle cx="162" cy="90" r="4" fill="var(--accent)"/>
            <circle cx="90" cy="162" r="4" fill="var(--accent)"/>
            <circle cx="18" cy="90" r="4" fill="var(--accent)"/>
            <!-- H -->
            <line x1="56" y1="66" x2="56" y2="114" stroke="var(--fg)" stroke-width="3" stroke-linecap="round"/>
            <line x1="56" y1="90" x2="78" y2="90" stroke="var(--fg)" stroke-width="3" stroke-linecap="round"/>
            <line x1="78" y1="66" x2="78" y2="114" stroke="var(--fg)" stroke-width="3" stroke-linecap="round"/>
            <!-- Z -->
            <polyline points="96,66 124,66 96,114 124,114" stroke="var(--accent)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="hz-geo-label">HZ LABS / EST. 2024</span>
      </div>
    </div>
    <div class="about-main">
      <header class="section-header">
        <div class="section-meta">
          <span class="mono section-num">04</span>
          <span class="mono section-kicker">— אודות</span>
        </div>
        <h2 class="section-title">צוות קטן. תוצרים בקנה מידה גדול.</h2>
      </header>
      <div class="about-prose">
        <p>HZ Labs הוא סטודיו פיתוח קטן עם גישה אחת ברורה: מערכות טובות נבנות מתוך הקשבה. אנחנו לא מתחילים מהסטאק — אנחנו מתחילים מהאנשים שישתמשו במערכת, ומהבעיה שצריך לפתור.</p>
        <p>עבדנו עם עמותות, יוצרי תוכן ומנהלי קהילות שביקשו תשתית טכנולוגית שמתאימה להם — לא להפך. הצוות מביא ניסיון בבניית מערכות מורכבות, ועובד ישירות מול המייסדים — בלי תיווך, בלי שכבות ניהול.</p>
        <p>אם יש לכם רעיון, או מערכת קיימת שצריכה לעבור שלב — נשמח לשמוע.</p>
      </div>
      <div class="about-pillars">
        <div class="pillar"><span class="mono">/A</span><h4>אדם במרכז</h4><p>נגישות, חוויית משתמש, אמפתיה — לא buzzwords. תהליך עבודה.</p></div>
        <div class="pillar"><span class="mono">/B</span><h4>קוד שעובד</h4><p>מערכות יציבות, מתועדות, נמסרות — לא פרוטוטיפים שמתפרקים.</p></div>
        <div class="pillar"><span class="mono">/C</span><h4>שותפות ארוכה</h4><p>אחרי השקה, ממשיכים. תמיכה, פיתוח שוטף, ליווי טכני אמיתי.</p></div>
      </div>
    </div>
  </div>
</section>
```

**Step 4: Verify in browser** — about section has HZ geometric visual on left, prose + pillars on right.

**Step 5: Commit**

```bash
git add landing_page.html
git commit -m "Redesign: about section with HZ geometric visual"
```

---

## Task 7: Contact Section + Footer

**Files:**
- Modify: `landing_page.html` — add contact + footer CSS + HTML

**Step 1: Add contact + footer CSS** (copy from `hzlabs-design/styles.css` lines 700–815). Add inside `<style>`.

**Step 2: Add contact + footer HTML** inside `<main>` and `<footer>`:

```html
<!-- inside <main>, after about -->
<section class="contact" id="contact">
  <div class="container contact-inner">
    <span class="mono contact-num">05 — צור קשר</span>
    <h2 class="contact-title">
      יש לכם פרויקט.
      <br>
      <span class="contact-title-accent">בואו נדבר עליו.</span>
    </h2>
    <p class="contact-sub">תיאור קצר של מה שאתם רוצים לבנות, ומי הקהל. נחזור אליכם תוך יום עבודה עם שאלות ראשונות.</p>
    <a href="mailto:harzahav.labs@gmail.com?subject=פרויקט חדש — HZ Labs" class="contact-mail">
      <span class="mono">→</span>
      <span class="contact-mail-addr">harzahav.labs@gmail.com</span>
    </a>
    <div class="contact-meta">
      <div><span class="mono">זמינות</span><strong>פרויקטים חדשים · 2026</strong></div>
      <div><span class="mono">איפה</span><strong>תל אביב · עובדים מרחוק</strong></div>
      <div><span class="mono">תגובה</span><strong>תוך יום עבודה</strong></div>
    </div>
  </div>
</section>

<!-- inside <footer> -->
<div class="container footer-inner">
  <div class="footer-brand">
    <span class="brand-name">HZ Labs</span>
    <span class="footer-tagline">סטודיו פיתוח · מערכות בקנה מידה אנושי</span>
  </div>
  <nav class="footer-nav" aria-label="קישורים בתחתית">
    <a href="#case">פרויקט</a>
    <a href="#services">שירותים</a>
    <a href="#about">אודות</a>
    <a href="mailto:harzahav.labs@gmail.com">מייל</a>
    <a href="/customers.html">אזור לקוחות</a>
  </nav>
  <div class="footer-legal">
    <span class="mono">© 2026 HZ LABS</span>
    <span>כל הזכויות שמורות.</span>
  </div>
</div>
```

**Step 3: Add `contact-title-accent` CSS** inside `<style>`:

```css
.contact-title-accent {
  font-style: italic;
  font-weight: 300;
  color: var(--accent);
}
```

**Step 4: Verify in browser** — large contact title with italic accent color, email CTA, footer with 3-column layout.

**Step 5: Commit**

```bash
git add landing_page.html
git commit -m "Redesign: contact section and footer"
```

---

## Task 8: Responsive Styles + Scroll Animations

**Files:**
- Modify: `landing_page.html` — add responsive CSS + scroll JS

**Step 1: Add responsive CSS** (copy from `hzlabs-design/styles.css` lines 818–860). Add at end of `<style>`.

**Step 2: Add scroll-reveal JS** — animate sections in on scroll:

```javascript
// Scroll reveal
const revealEls = document.querySelectorAll('.case, .services, .about, .contact');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.style.opacity = '1';
      el.target.style.transform = 'translateY(0)';
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = 'opacity 0.7s var(--ease), transform 0.7s var(--ease)';
  observer.observe(el);
});
```

**Step 3: Test on mobile viewport** (Chrome DevTools → 390px wide)

- Hamburger nav works
- Hero single column (visual stacks above content)
- Services single column
- About single column
- Footer single column

**Step 4: Commit**

```bash
git add landing_page.html
git commit -m "Redesign: responsive styles and scroll reveal animations"
```

---

## Task 9: Deploy

**Step 1: Full visual review** — open `landing_page.html` in browser, scroll through all sections, toggle theme, test mobile.

**Step 2: Push to GitHub**

```bash
git push origin main
```

**Step 3: Deploy to VPS**

```bash
sshpass -p 'Shay28606515#' scp -o PubkeyAuthentication=no -o StrictHostKeyChecking=no \
  landing_page.html root@76.13.130.45:/opt/hzlabs/

sshpass -p 'Shay28606515#' ssh -o PubkeyAuthentication=no -o StrictHostKeyChecking=no root@76.13.130.45 \
  'cd /opt/hzlabs && docker build -t hzlabs-web . && docker rm -f hzlabs-web && docker run -d --name hzlabs-web --restart unless-stopped -p 127.0.0.1:8085:80 hzlabs-web'
```

**Step 4: Verify live at https://harzahav.online**
