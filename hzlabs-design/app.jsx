const { useState, useEffect, useRef } = React;

const HERO_VARIANTS = {
  editorial: {
    eyebrow: "HZ LABS / EST. 2024",
    title: ["מערכות מותאמות", "לעמותות, יוצרים", "ובוני קהילה."],
    sub: "אנחנו מפתחים פלטפורמות תוכן, פורטלי לקוחות ומערכות מנויים — מהאפיון ועד הייצור. עם דגש על נגישות, ביצועים, ויחס אנושי.",
    primary: "ראו את העבודה",
    primaryHref: "#case",
    secondary: "צרו קשר",
    secondaryHref: "mailto:harzahav.labs@gmail.com",
  },
  statement: {
    eyebrow: "סטודיו פיתוח · ת״א",
    title: ["טכנולוגיה,", "בקנה מידה אנושי."],
    sub: "מערכת אחת בייצור עם אלפי משתמשים. צוות קטן. גישה אישית. אפיון, פיתוח, ליווי שוטף — תחת קורת גג אחת.",
    primary: "מקרה הבוחן שלנו",
    primaryHref: "#case",
    secondary: "שיחה ראשונית",
    secondaryHref: "mailto:harzahav.labs@gmail.com",
  },
  question: {
    eyebrow: "HZ LABS",
    title: ["יש לכם רעיון", "למערכת.", "יש לכם רעיון"],
    sub: "מהסקיצה הראשונה ועד הייצור — בלי מתווכים, בלי בלגן. עובדים ישירות עם המייסדים, מספקים מערכות שעובדות ביום־יום.",
    primary: "התחילו פרויקט",
    primaryHref: "mailto:harzahav.labs@gmail.com",
    secondary: "ראו דוגמה",
    secondaryHref: "#case",
  },
};

function Header({ accent, theme, onToggleMode }) {
  const [open, setOpen] = useState(false);
  const isDark = theme.startsWith("dark");
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <span className="brand-mark" style={{ background: accent }}></span>
          <span className="brand-name">HZ Labs</span>
        </a>
        <nav className={`site-nav ${open ? "open" : ""}`} aria-label="ניווט ראשי">
          <a href="#case" onClick={() => setOpen(false)}>פרויקט</a>
          <a href="#services" onClick={() => setOpen(false)}>שירותים</a>
          <a href="#about" onClick={() => setOpen(false)}>אודות</a>
          <a href="#contact" onClick={() => setOpen(false)}>צור קשר</a>
          <a href="https://harzahav.online/customers.html" className="nav-portal">
            אזור לקוחות
            <span className="nav-portal-icon" aria-hidden="true">↗</span>
          </a>
          <button
            className="theme-toggle"
            onClick={onToggleMode}
            aria-label={isDark ? "החלף למצב בהיר" : "החלף למצב כהה"}
            title={isDark ? "מצב בהיר" : "מצב כהה"}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {isDark ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </>
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              )}
            </svg>
          </button>
        </nav>
        <button
          className="nav-toggle"
          aria-label="פתח תפריט"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}

function Hero({ variant }) {
  const v = HERO_VARIANTS[variant] || HERO_VARIANTS.editorial;
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true"></span>
            {v.eyebrow}
          </div>
          <h1 className="hero-title">
            {v.title.map((line, i) => (
              <span key={i} className="hero-title-line" style={{ animationDelay: `${i * 90 + 100}ms` }}>
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-sub">{v.sub}</p>
          <div className="hero-actions">
            <a href={v.primaryHref} className="btn btn-primary">
              {v.primary}
              <span className="btn-arrow" aria-hidden="true">←</span>
            </a>
            <a href={v.secondaryHref} className="btn btn-ghost">
              {v.secondary}
            </a>
          </div>
          <dl className="hero-meta">
            <div>
              <dt>מערכת בייצור</dt>
              <dd>שותפים למסע</dd>
            </div>
            <div>
              <dt>תחום</dt>
              <dd>פלטפורמות תוכן ומנויים</dd>
            </div>
            <div>
              <dt>זמינות</dt>
              <dd>לפרויקטים חדשים · {new Date().getFullYear()}</dd>
            </div>
          </dl>
        </div>
        <aside className="hero-visual" aria-hidden="true">
          <Placeholder label="STILL · WORKSPACE / B&W" ratio="3/4" />
          <div className="hero-visual-tag">
            <span className="mono">/01</span>
            <span>צילום מהסטודיו</span>
          </div>
        </aside>
      </div>
      <div className="hero-marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array(3).fill(0).map((_, i) => (
            <span key={i}>
              <em>פלטפורמות תוכן</em><i>·</i>
              <em>פורטלי לקוחות</em><i>·</i>
              <em>מערכות מנויים</em><i>·</i>
              <em>ניהול אירועים חיים</em><i>·</i>
              <em>הרשאות ותפקידים</em><i>·</i>
              <em>אינטגרציות API</em><i>·</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ num, kicker, title, lede }) {
  return (
    <header className="section-header">
      <div className="section-meta">
        <span className="mono section-num">{num}</span>
        <span className="mono section-kicker">— {kicker}</span>
      </div>
      <h2 className="section-title">{title}</h2>
      {lede && <p className="section-lede">{lede}</p>}
    </header>
  );
}

function CaseStudy() {
  return (
    <section className="case" id="case" data-screen-label="02 Case Study">
      <div className="container">
        <SectionHeader
          num="02"
          kicker="פרויקט דגל"
          title={<>הספרייה — שותפים למסע</>}
          lede="פלטפורמת תוכן וקהילה לליווי רוחני, לתמיכה במתמודדים עם מחלה, אובדן ואבל. מאות שעות תוכן, מפגשים חיים, ומרחב נגיש — בייצור."
        />

        <div className="case-hero">
          <Placeholder label="HOMEPAGE · SHUTAFIMLAMASA.ONLINE" ratio="16/9" />
          <a href="https://shutafimlamasa.online/" target="_blank" rel="noopener" className="case-link">
            <span>לצפייה במערכת החיה</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="case-body">
          <div className="case-side">
            <div className="kv">
              <span className="mono">לקוח</span>
              <strong>שותפים למסע (ע״ר)</strong>
            </div>
            <div className="kv">
              <span className="mono">תחום</span>
              <strong>פלטפורמת תוכן וקהילה</strong>
            </div>
            <div className="kv">
              <span className="mono">סטטוס</span>
              <strong>בייצור · התרחבות שוטפת</strong>
            </div>
            <div className="kv">
              <span className="mono">סטאק</span>
              <strong>Web · Streaming · Auth · CMS</strong>
            </div>
          </div>

          <div className="case-main">
            <div className="case-block">
              <h3>האתגר</h3>
              <p>לרכז מאות מפגשים, שיחות וסדרות תוכן במרחב דיגיטלי שבטוח לחזור אליו — גם ברגעים הקשים ביותר. נגיש לקהל מבוגר, עובד מהר על חיבור איטי, ומכבד את הפרטיות של מי שמשתמש בו.</p>
            </div>
            <div className="case-block">
              <h3>מה בנינו</h3>
              <ul className="case-list">
                <li><span className="mono">01</span> מאגר תוכן רב־פורמטי — וידאו, שמע, טקסט — עם חיפוש וקטלוג</li>
                <li><span className="mono">02</span> מערכת הרשאות ומנויים מדורגת לפי קהל יעד</li>
                <li><span className="mono">03</span> שידור חי וניהול אירועים בזמן אמת</li>
                <li><span className="mono">04</span> חוויה נגישה (WCAG AA), ימינה־לשמאל, תמיכה במסכים מבוגרים</li>
              </ul>
            </div>
            <div className="case-block">
              <h3>תוצאה</h3>
              <p>פלטפורמה שהפכה לבית דיגיטלי לאלפי משתמשים. קהילה פעילה, צריכה שוטפת של תוכן, ותשתית שמאפשרת לארגון להתרחב בלי להוסיף מורכבות תפעולית.</p>
            </div>
          </div>
        </div>

        <div className="case-stills">
          <Placeholder label="LIBRARY · קטלוג תוכן" ratio="4/3" />
          <Placeholder label="LIVE · אירוע חי" ratio="4/3" />
          <Placeholder label="ADMIN · ניהול הרשאות" ratio="4/3" />
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    n: "01",
    title: "פלטפורמות תוכן",
    body: "ספריות וידאו ושמע, מערכות חיפוש וקטלוג, ניהול עורכים. מותאם לקהל ולכמויות שלכם — לא Off-the-shelf.",
    deliverables: ["CMS מותאם", "סטרימינג", "חיפוש"],
  },
  {
    n: "02",
    title: "פורטלי לקוחות ומנויים",
    body: "אזורים אישיים מאובטחים, ניהול תפקידים, חשבוניות ומסמכים. הלקוחות שלכם נכנסים, רואים בדיוק מה שצריך, ולא יותר.",
    deliverables: ["Auth", "תפקידים", "Self-service"],
  },
  {
    n: "03",
    title: "ניהול אירועים חיים",
    body: "שידורים, מפגשים, סדנאות — עם לוח זמנים, הרשמה, התראות וצפייה ישירה. נבדק מול עומס אמיתי.",
    deliverables: ["Live", "RSVP", "התראות"],
  },
  {
    n: "04",
    title: "אינטגרציות וצנרת נתונים",
    body: "חיבור בין המערכות שכבר יש לכם — סליקה, CRM, מייל, אנליטיקס. בלי דאטה שיוצא ושוקע במקומות לא ברורים.",
    deliverables: ["API", "Webhooks", "ETL"],
  },
];

function Services() {
  return (
    <section className="services" id="services" data-screen-label="03 Services">
      <div className="container">
        <SectionHeader
          num="03"
          kicker="מה שאנחנו עושים"
          title="ארבע קטגוריות. עומק בכל אחת."
          lede="לא סוכנות שבונה הכל. סטודיו שמתמחה בארבעה תחומים, ויודע אותם לעומק — מהאפיון ועד הליווי בייצור."
        />
        <ol className="services-grid">
          {SERVICES.map((s) => (
            <li key={s.n} className="service">
              <div className="service-head">
                <span className="mono service-n">{s.n}</span>
                <h3>{s.title}</h3>
              </div>
              <p>{s.body}</p>
              <ul className="service-tags">
                {s.deliverables.map((d) => (
                  <li key={d} className="mono">{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about" data-screen-label="04 About">
      <div className="container about-grid">
        <div className="about-side">
          <Placeholder label="PORTRAIT · STUDIO" ratio="3/4" tone="light" />
        </div>
        <div className="about-main">
          <SectionHeader
            num="04"
            kicker="אודות"
            title="צוות קטן. תוצרים בקנה מידה גדול."
          />
          <div className="about-prose">
            <p>HZ Labs הוא סטודיו פיתוח קטן עם גישה אחת ברורה: מערכות טובות נבנות מתוך הקשבה. אנחנו לא מתחילים מהסטאק — אנחנו מתחילים מהאנשים שישתמשו במערכת, ומהבעיה שצריך לפתור.</p>
            <p>עבדנו עם עמותות, יוצרי תוכן ומנהלי קהילות שביקשו תשתית טכנולוגית שמתאימה להם — לא להפך. הצוות מביא ניסיון בבניית מערכות מורכבות, ועובד ישירות מול המייסדים — בלי תיווך, בלי שכבות ניהול.</p>
            <p>אם יש לכם רעיון, או מערכת קיימת שצריכה לעבור שלב — נשמח לשמוע.</p>
          </div>
          <div className="about-pillars">
            <div className="pillar">
              <span className="mono">/A</span>
              <h4>אדם במרכז</h4>
              <p>נגישות, חוויית משתמש, אמפתיה — לא buzzwords. תהליך עבודה.</p>
            </div>
            <div className="pillar">
              <span className="mono">/B</span>
              <h4>קוד שעובד</h4>
              <p>מערכות יציבות, מתועדות, נמסרות — לא פרוטוטיפים שמתפרקים.</p>
            </div>
            <div className="pillar">
              <span className="mono">/C</span>
              <h4>שותפות ארוכה</h4>
              <p>אחרי השקה, ממשיכים. תמיכה, פיתוח שוטף, ליווי טכני אמיתי.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ accent }) {
  return (
    <section className="contact" id="contact" data-screen-label="05 Contact">
      <div className="container contact-inner">
        <span className="mono contact-num">05 — צור קשר</span>
        <h2 className="contact-title">
          יש לכם פרויקט.
          <br />
          <span className="contact-title-accent" style={{ color: accent }}>בואו נדבר עליו.</span>
        </h2>
        <p className="contact-sub">תיאור קצר של מה שאתם רוצים לבנות, ומי הקהל. נחזור אליכם תוך יום עבודה עם שאלות ראשונות.</p>
        <a href="mailto:harzahav.labs@gmail.com?subject=פרויקט חדש — HZ Labs" className="contact-mail">
          <span className="mono">→</span>
          <span className="contact-mail-addr">harzahav.labs@gmail.com</span>
        </a>
        <div className="contact-meta">
          <div>
            <span className="mono">זמינות</span>
            <strong>פרויקטים חדשים · {new Date().getFullYear()}</strong>
          </div>
          <div>
            <span className="mono">איפה</span>
            <strong>תל אביב · עובדים מרחוק</strong>
          </div>
          <div>
            <span className="mono">תגובה</span>
            <strong>תוך יום עבודה</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-name">HZ Labs</span>
          <span className="footer-tagline">סטודיו פיתוח · מערכות בקנה מידה אנושי</span>
        </div>
        <nav className="footer-nav" aria-label="קישורים בתחתית">
          <a href="#case">פרויקט</a>
          <a href="#services">שירותים</a>
          <a href="#about">אודות</a>
          <a href="mailto:harzahav.labs@gmail.com">מייל</a>
          <a href="https://harzahav.online/customers.html">אזור לקוחות</a>
        </nav>
        <div className="footer-legal">
          <span className="mono">© {new Date().getFullYear()} HZ LABS</span>
          <span>כל הזכויות שמורות.</span>
        </div>
      </div>
    </footer>
  );
}

const ACCENTS = {
  amber: "oklch(0.74 0.13 70)",
  copper: "oklch(0.65 0.13 45)",
  sage: "oklch(0.72 0.08 145)",
  ink: "oklch(0.68 0.10 240)",
};

const THEMES = {
  "dark-ink": { label: "Ink", mode: "dark" },
  "dark-aubergine": { label: "Aubergine", mode: "dark" },
  "dark-forest": { label: "Forest", mode: "dark" },
  "dark-night": { label: "Midnight", mode: "dark" },
  "light-paper": { label: "Paper", mode: "light" },
  "light-bone": { label: "Bone", mode: "light" },
  "light-sand": { label: "Sand", mode: "light" },
};

// Pair each theme with its counterpart for the toggle
const MODE_PAIR = {
  "dark-ink": "light-paper",
  "dark-aubergine": "light-bone",
  "dark-forest": "light-bone",
  "dark-night": "light-bone",
  "light-paper": "dark-ink",
  "light-bone": "dark-ink",
  "light-sand": "dark-aubergine",
};

function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "heroVariant": "editorial",
    "accent": "amber",
    "density": "comfortable",
    "theme": "dark-ink"
  }/*EDITMODE-END*/);

  const accent = ACCENTS[tweaks.accent] || ACCENTS.amber;
  const theme = THEMES[tweaks.theme] ? tweaks.theme : "dark-ink";

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.dataset.density = tweaks.density;
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mode = THEMES[theme].mode;
  }, [accent, tweaks.density, theme]);

  const toggleMode = () => {
    const next = MODE_PAIR[theme] || "light-paper";
    setTweak("theme", next);
  };

  return (
    <>
      <Header accent={accent} theme={theme} onToggleMode={toggleMode} />
      <main>
        <Hero variant={tweaks.heroVariant} />
        <CaseStudy />
        <Services />
        <About />
        <Contact accent={accent} />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakSelect
            label="ערכת נושא"
            value={theme}
            onChange={(v) => setTweak("theme", v)}
            options={Object.entries(THEMES).map(([value, { label, mode }]) => ({
              value,
              label: `${mode === "dark" ? "🌙" : "☀"}  ${label}`,
            }))}
          />
        </TweakSection>
        <TweakSection label="Hero">
          <TweakRadio
            label="גרסה"
            value={tweaks.heroVariant}
            onChange={(v) => setTweak("heroVariant", v)}
            options={[
              { value: "editorial", label: "Editorial" },
              { value: "statement", label: "Statement" },
              { value: "question", label: "Direct" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Accent">
          <TweakRadio
            label="צבע"
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={[
              { value: "amber", label: "Amber" },
              { value: "copper", label: "Copper" },
              { value: "sage", label: "Sage" },
              { value: "ink", label: "Ink" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Density">
          <TweakRadio
            label="צפיפות"
            value={tweaks.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
              { value: "spacious", label: "Spacious" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
