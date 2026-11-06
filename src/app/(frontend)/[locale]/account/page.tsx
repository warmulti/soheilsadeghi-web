import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, UserIcon } from "@/components/icons";
import { Kicker } from "@/components/ui/SectionHeading";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser, getPayloadClient } from "@/lib/cms";
import { logoutAction } from "@/lib/auth-actions";
import { groupIdsOf, isStaffUser } from "@/payload/access";
import type { Group, Material } from "@/payload-types";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).account.title, robots: { index: false } } : {};
}

export default async function AccountPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`${href(locale, "/login")}?next=${encodeURIComponent(href(locale, "/account"))}`);

  const d = getDictionary(locale);
  const t = d.account;
  const payload = await getPayloadClient();
  const [groups, materials] = await Promise.all([
    payload.find({ collection: "groups", locale, user, overrideAccess: false, depth: 0, limit: 100, pagination: false }),
    payload.find({ collection: "materials", locale, user, overrideAccess: false, depth: 0, sort: "order", limit: 300, pagination: false }),
  ]);
  const mine = groupIdsOf(user);
  const myGroups = (groups.docs as Group[]).filter((g) => mine.includes(g.id));

  // Group materials by course.
  const byCourse = new Map<string, Material[]>();
  for (const m of materials.docs as Material[]) {
    const list = byCourse.get(m.course) ?? [];
    list.push(m);
    byCourse.set(m.course, list);
  }

  return (
    <section className="px-5 pt-32 pb-28 md:px-8 md:pt-40">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>{t.kicker}</Kicker>
            <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
              {t.welcome} <span className="text-gradient">{user.name}</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {isStaffUser(user) && (
              <a href="/admin" className="btn-neon">
                {d.auth.adminPanel}
              </a>
            )}
            <form action={logoutAction}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn-ghost">
                {d.auth.logout}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <aside className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <h2 className="flex items-center gap-2 font-bold text-white">
                <UserIcon className="h-5 w-5 text-cyan" />
                {t.profile}
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-white/40">{d.auth.name}</dt>
                  <dd className="text-white/85">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-white/40">{d.auth.email}</dt>
                  <dd className="text-white/85">
                    <bdi>{user.email}</bdi>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="glass rounded-3xl p-6">
              <h2 className="font-bold text-white">{t.groups}</h2>
              {myGroups.length ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {myGroups.map((g) => (
                    <li key={g.id} className="rounded-full bg-neon/10 px-3 py-1 text-sm text-neon ring-1 ring-neon/25">
                      {g.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-7 text-white/50">{t.noGroups}</p>
              )}
            </div>
            <Link href={href(locale, "/downloads")} className="glass neon-card flex items-center justify-between rounded-3xl p-6 text-white">
              {t.memberDownloads}
              <ArrowLeft />
            </Link>
          </aside>

          <div>
            <h2 className="text-2xl font-black text-white">{t.materials}</h2>
            {byCourse.size === 0 ? (
              <p className="glass mt-6 rounded-3xl p-8 text-center text-white/50">{t.noMaterials}</p>
            ) : (
              <div className="mt-6 space-y-8">
                {[...byCourse.entries()].map(([course, list]) => (
                  <div key={course}>
                    <h3 className="mb-3 text-sm font-bold tracking-wide text-cyan">{t.courses[course] ?? course}</h3>
                    <ul className="grid gap-3">
                      {list.map((m) => (
                        <li key={m.id}>
                          <Link href={href(locale, `/account/materials/${m.id}`)} className="glass neon-card flex items-center justify-between gap-4 rounded-2xl p-5">
                            <span>
                              <span className="block font-bold text-white">{m.title}</span>
                              {m.summary && <span className="mt-1 line-clamp-1 block text-sm text-white/50">{m.summary}</span>}
                            </span>
                            <span className="flex shrink-0 items-center gap-2 text-sm text-neon">
                              {t.open}
                              <ArrowLeft />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
