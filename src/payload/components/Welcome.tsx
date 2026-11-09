import type { ServerProps } from "payload";

const LINKS = {
  fa: [
    ["/admin/globals/home", "ویرایش صفحه اصلی"],
    ["/admin/collections/downloads/create", "افزودن دانلود جدید"],
    ["/admin/collections/materials/create", "افزودن محتوای دوره"],
    ["/admin/collections/users", "هنرجوها و گروه‌ها"],
    ["/admin/collections/requests", "درخواست‌های فرم تماس"],
    ["/admin/globals/navigation", "ویرایش منو"],
    ["/", "مشاهده سایت ↗"],
  ],
  en: [
    ["/admin/globals/home", "Edit homepage"],
    ["/admin/collections/downloads/create", "Add a download"],
    ["/admin/collections/materials/create", "Add course material"],
    ["/admin/collections/users", "Students & groups"],
    ["/admin/collections/requests", "Contact requests"],
    ["/admin/globals/navigation", "Edit menu"],
    ["/", "View site ↗"],
  ],
} as const;

/** Dashboard welcome panel with shortcuts — the WordPress “At a glance” feel. */
export async function Welcome({ i18n, payload, user }: ServerProps) {
  const lang = i18n?.language === "en" ? "en" : "fa";
  const [requests, downloads, students] = await Promise.all([
    payload.count({ collection: "requests", where: { status: { equals: "new" } } }),
    payload.count({ collection: "downloads" }),
    payload.count({ collection: "users", where: { role: { equals: "student" } } }),
  ]);
  const name = (user as { name?: string } | undefined)?.name;
  const isAdmin = (user as { role?: string } | undefined)?.role === "admin";
  const backup =
    lang === "fa"
      ? { title: "پشتیبان‌گیری", full: "دانلود بکاپ کامل (zip)", db: "دانلود بکاپ دیتابیس (zip)" }
      : { title: "Backup", full: "Download full backup (zip)", db: "Download database backup (zip)" };
  const stats =
    lang === "fa"
      ? [
          ["درخواست جدید", requests.totalDocs],
          ["آیتم دانلود", downloads.totalDocs],
          ["هنرجو", students.totalDocs],
        ]
      : [
          ["New requests", requests.totalDocs],
          ["Downloads", downloads.totalDocs],
          ["Students", students.totalDocs],
        ];

  return (
    <div className="dj-welcome">
      <h2>{lang === "fa" ? `خوش آمدید${name ? `، ${name}` : ""} 👋` : `Welcome${name ? `, ${name}` : ""} 👋`}</h2>
      <p>
        {lang === "fa"
          ? "همه متن‌ها و بخش‌های سایت از همین‌جا قابل ویرایش است. برای ویرایش نسخه انگلیسی، زبان محتوا را از بالای هر صفحه روی English بگذارید."
          : "Every text and section of the site is editable here. To edit the English version, switch the content locale at the top of each document."}
      </p>
      <div className="dj-welcome__stats">
        {stats.map(([label, value]) => (
          <div key={String(label)}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="dj-welcome__links">
        {LINKS[lang].map(([href, label]) => (
          <a key={href} href={href} target={href === "/" ? "_blank" : undefined} rel="noreferrer">
            {label}
          </a>
        ))}
      </div>
      {isAdmin && (
        <div className="dj-welcome__backup">
          <span>{backup.title}:</span>
          <a href="/api/admin/backup?scope=full" download>
            {backup.full}
          </a>
          <a href="/api/admin/backup?scope=db" download>
            {backup.db}
          </a>
        </div>
      )}
    </div>
  );
}
