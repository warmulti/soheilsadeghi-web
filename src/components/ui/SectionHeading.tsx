/** English display label above headings. The inline LTR span keeps it right-aligned in RTL blocks. */
export function Kicker({ children, className = "" }: { children?: string | null; className?: string }) {
  if (!children) return null;
  return (
    <p className={`font-display text-base tracking-[0.35em] text-cyan ${className}`}>
      <span dir="ltr">{children}</span>
    </p>
  );
}

type Props = {
  kicker?: string | null;
  title?: string | null;
  accent?: string | null;
  lead?: string | null;
  id?: string;
  center?: boolean;
  as?: "h2" | "h3";
};

/** Section header for inner pages. Animated in by the surrounding <RevealScope>. */
export default function SectionHeading({ kicker, title, accent, lead, id, center = false, as: H = "h2" }: Props) {
  return (
    <div data-reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Kicker>{kicker}</Kicker>
      <H id={id} className="mt-3 text-3xl font-black leading-[1.35] text-white md:text-5xl">
        {title}
        {accent && (
          <>
            {" "}
            <span className="text-gradient">{accent}</span>
          </>
        )}
      </H>
      {lead && <p className="mt-5 leading-8 text-white/60">{lead}</p>}
    </div>
  );
}
