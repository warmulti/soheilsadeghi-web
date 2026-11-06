import { PlusIcon } from "@/components/icons";

/** Accessible accordion built on native <details>; works without JavaScript. */
type Faq = { q: string; a: string; id?: string | null };

export default function FaqList({ items }: { items?: Faq[] | null }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-3">
      {items.map((f) => (
        <details key={f.id ?? f.q} data-reveal className="faq glass rounded-2xl px-6 py-5">
          <summary className="flex items-center justify-between gap-4 font-bold leading-7 text-white">
            {f.q}
            <span className="faq-icon grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/5 text-neon ring-1 ring-white/10">
              <PlusIcon className="h-4 w-4" />
            </span>
          </summary>
          <p className="mt-4 text-sm leading-7 text-white/60">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
