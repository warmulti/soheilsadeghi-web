/** Admin login-screen logo and nav icon: the site's spinning-vinyl mark. */
function Disc({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="dj-admin-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="#0b0b0e" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#fff" strokeOpacity=".1" strokeWidth="2" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#fff" strokeOpacity=".1" strokeWidth="2" />
      <circle cx="32" cy="32" r="11" fill="url(#dj-admin-g)" />
      <circle cx="32" cy="32" r="2.5" fill="#0b0b0e" />
    </svg>
  );
}

export function Icon() {
  return <Disc size={26} />;
}

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Disc size={52} />
      <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: "0.06em", direction: "ltr" }}>DJ SOHEIL</span>
    </div>
  );
}
