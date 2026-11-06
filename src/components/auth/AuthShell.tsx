import Vinyl from "@/components/Vinyl";

/** Centered glass card with a spinning vinyl behind — shared by login / register / reset pages. */
export default function AuthShell({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-28 pb-16">
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-15" aria-hidden="true">
        <Vinyl showArm={false} />
      </div>
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-ink-2/90 p-7 shadow-[0_30px_100px_rgba(0,0,0,.5)] backdrop-blur-xl md:p-9">
        <h1 className="text-2xl font-black text-white md:text-3xl">{title}</h1>
        {lead && <p className="mt-3 text-sm leading-7 text-white/55">{lead}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
