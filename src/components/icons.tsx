import type { ServiceIcon } from "@/content/site";

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Custom line icons for DJ education services. */
export function ServiceGlyph({ name, className = "h-12 w-12" }: { name: ServiceIcon; className?: string }) {
  switch (name) {
    case "controller":
      // DJ controller: two jog wheels + mixer faders
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...common}>
          <rect x="3" y="12" width="42" height="24" rx="4" />
          <circle cx="13" cy="24" r="6.5" />
          <circle cx="13" cy="24" r="1.5" />
          <circle cx="35" cy="24" r="6.5" />
          <circle cx="35" cy="24" r="1.5" />
          <path d="M22 17v14M26 17v14" />
          <path d="M20.5 22h3M24.5 27h3" strokeWidth="2.4" />
        </svg>
      );
    case "masterclass":
      // Headphones with star
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...common}>
          <path d="M8 30v-6a16 16 0 0 1 32 0v6" />
          <rect x="5" y="28" width="8" height="13" rx="3" />
          <rect x="35" y="28" width="8" height="13" rx="3" />
          <path d="m24 12 1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6Z" />
        </svg>
      );
    case "ableton":
      // Session-view clip grid + waveform
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...common}>
          <rect x="4" y="6" width="40" height="36" rx="3" />
          <path d="M14 6v36M24 6v36M34 6v36M4 18h40M4 30h40" strokeOpacity=".45" />
          <rect x="6" y="20" width="6" height="8" rx="1" fill="currentColor" fillOpacity=".5" />
          <rect x="26" y="8" width="6" height="8" rx="1" fill="currentColor" fillOpacity=".5" />
          <path d="M16 36l2-3 2 5 2-6 2 4" />
          <path d="m37 10 4 3-4 3Z" fill="currentColor" />
        </svg>
      );
    case "gear":
      // Laptop with a turntable on screen
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...common}>
          <rect x="8" y="9" width="32" height="22" rx="2" />
          <path d="M3 37h42l-3-6H6Z" />
          <circle cx="21" cy="20" r="6" />
          <circle cx="21" cy="20" r="1.2" />
          <path d="M33 13v8l-4 3" />
        </svg>
      );
  }
}

/** "Forward" arrow: points left in RTL (Persian) and right in LTR (English). */
export function ArrowLeft({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} ltr:-scale-x-100`} aria-hidden="true" {...common} strokeWidth={2}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function CrossfaderIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-hidden="true" {...common}>
      <rect x="2" y="8" width="44" height="8" rx="4" />
      <rect x="18" y="3" width="12" height="18" rx="2" fill="currentColor" fillOpacity=".25" />
      <path d="M24 6v12" />
    </svg>
  );
}


type IconProps = { className?: string };

const ui = { ...common, strokeWidth: 1.8 };

export function TelegramIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <path d="M21.5 4.5 2.8 11.7c-.9.4-.9 1.6.1 1.9l4.6 1.5 1.8 5.5c.3.8 1.3 1 1.9.4l2.6-2.5 4.8 3.5c.7.5 1.7.1 1.9-.7l3.2-15.3c.2-1-.8-1.9-1.8-1.5Z" />
      <path d="m7.5 15.1 10-7.3-7.7 8.6" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.3Z" />
      <path d="M9 8.3c.2-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.3.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.7.8c.2.1.4.3.3.6 0 .9-.8 1.7-1.7 1.8-1.2.1-3-.4-4.8-2.2C9 12.6 8.6 10.8 8.7 9.6c0-.5.1-.9.3-1.3Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Speech bubble with a small vinyl — chat launcher. */
export function ChatVinylIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.2A8.5 8.5 0 1 1 20.5 11.5Z" />
      <circle cx="12" cy="11.5" r="3.6" />
      <circle cx="12" cy="11.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui} strokeWidth={2}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** Paper plane pointing in the reading direction (left in RTL, right in LTR). */
export function SendIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} ltr:-scale-x-100`} aria-hidden="true" {...ui}>
      <path d="M20.5 3.5 3.6 10.4c-.8.3-.8 1.5.1 1.8l6.3 2 2 6.3c.3.9 1.5.9 1.8.1Z" transform="matrix(-1 0 0 1 24 0)" />
      <path d="m10 14 4.6-4.6" transform="matrix(-1 0 0 1 24 0)" />
    </svg>
  );
}

export function CopyIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui} strokeWidth={2.2}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function PlusIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui} strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ClockIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function CalendarIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

/** Location pin + screen: in-person / online. */
export function FormatIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <path d="M8 21s-5-4.6-5-9a5 5 0 0 1 10 0c0 4.4-5 9-5 9Z" />
      <circle cx="8" cy="12" r="1.6" />
      <rect x="14" y="4" width="7.5" height="5.5" rx="1" />
      <path d="M16.5 12h2.5" />
    </svg>
  );
}

export function LayersIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <path d="m12 3 9 5-9 5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

export function HeadphonesIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="2.5" y="14" width="5" height="7" rx="2" />
      <rect x="16.5" y="14" width="5" height="7" rx="2" />
    </svg>
  );
}

export function SpeakerIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <circle cx="12" cy="14.5" r="3.8" />
      <circle cx="12" cy="7" r="1.5" />
    </svg>
  );
}

export function SparkIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
      <path d="M19 16.5c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z" />
    </svg>
  );
}

export function QuoteIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M14.5 6h5v5.5c0 3.6-1.7 5.9-5 6.5v-2.4c1.6-.5 2.4-1.7 2.5-3.6h-2.5Zm-10 0h5v5.5c0 3.6-1.7 5.9-5 6.5v-2.4c1.6-.5 2.4-1.7 2.5-3.6H4.5Z" />
    </svg>
  );
}

export function SearchIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui} strokeWidth={2}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function UserIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5c1.2-3.8 4-5.8 7.5-5.8s6.3 2 7.5 5.8" />
    </svg>
  );
}

export function ChevronDown({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui} strokeWidth={2}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function DownloadIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui} strokeWidth={2}>
      <path d="M12 4v11M7 10.5 12 15.5l5-5M5 20h14" />
    </svg>
  );
}

export function LockIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function GlobeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z" />
    </svg>
  );
}

export function PlayIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M8 5.5v13l10-6.5Z" />
    </svg>
  );
}

export function FileIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
      <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3.5V8h4.5" />
    </svg>
  );
}

/** Category glyphs for the downloads section. */
export function CategoryIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  switch (name) {
    case "mashups":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
          <circle cx="8" cy="12" r="5" />
          <circle cx="16" cy="12" r="5" />
        </svg>
      );
    case "podcasts":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" />
        </svg>
      );
    case "tracks":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
          <path d="M9 18V5.5l10-2v12.5" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
      );
    case "software":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
          <rect x="3" y="4.5" width="18" height="13" rx="2" />
          <path d="M8 21h8M12 17.5V21M9 9.5l-2 1.75L9 13M15 9.5l2 1.75L15 13" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ui}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <circle cx="8.5" cy="10" r="2" />
          <circle cx="15.5" cy="10" r="2" />
          <path d="M7 15.5h10" />
        </svg>
      );
  }
}
