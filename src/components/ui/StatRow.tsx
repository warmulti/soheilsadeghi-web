export type Stat = { label: string; value: string };

export default function StatRow({ items }: { items: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="glass rounded-2xl px-5 py-4">
          <dt className="text-xs text-white/45">{s.label}</dt>
          <dd className="mt-1 text-lg font-black text-white md:text-xl">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
