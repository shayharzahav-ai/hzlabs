// Striped SVG placeholder — film-still treatment with mono caption.
// Uses CSS vars so it adapts to the current theme automatically.
function Placeholder({ label, ratio = "16/9", tone }) {
  // tone: "auto" (default, follows theme), "dark" (force dark), "light" (force light)
  const forced = tone === "light" || tone === "dark";
  const id = `stripes-${Math.random().toString(36).slice(2, 8)}`;
  const style = forced
    ? (tone === "light"
        ? { "--ph-bg": "#E8E2D6", "--ph-stripe": "#DCD4C2", "--ph-fg": "#0E0E0E", "--ph-accent": "#7a5a1f" }
        : { "--ph-bg": "#161616", "--ph-stripe": "#1F1F1F", "--ph-fg": "#F4EFE7", "--ph-accent": "#D4A24C" })
    : {};
  return (
    <div className="placeholder" style={{ aspectRatio: ratio, ...style }}>
      <svg
        width="100%" height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 100 60"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern id={id} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <rect width="3" height="3" className="ph-bg-rect" />
            <line x1="0" y1="0" x2="0" y2="3" className="ph-stripe-line" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect width="100" height="60" fill={`url(#${id})`} />
      </svg>
      <div className="placeholder-frame" aria-hidden="true">
        <span className="placeholder-corner tl"></span>
        <span className="placeholder-corner tr"></span>
        <span className="placeholder-corner bl"></span>
        <span className="placeholder-corner br"></span>
      </div>
      <div className="placeholder-caption">
        <span className="placeholder-dot"></span>
        <span className="placeholder-label">{label}</span>
      </div>
    </div>
  );
}

window.Placeholder = Placeholder;
