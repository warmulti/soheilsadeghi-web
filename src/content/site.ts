/**
 * ─────────────────────────────────────────────────────────────────────
 *  محتوای اولیه فارسی سایت DJ SOHEIL
 *
 *  ⚠️ از این به بعد همه متن‌ها از «پنل مدیریت» (/admin) ویرایش می‌شوند.
 *     این فایل فقط یک بار، در اولین اجرای سایت روی یک پایگاه داده خالی،
 *     برای پر کردن پنل استفاده می‌شود (src/payload/seed). تغییر آن روی
 *     سایتی که قبلاً راه‌اندازی شده اثری ندارد.
 *  نسخه انگلیسی محتوای اولیه: src/payload/seed/en.ts
 * ─────────────────────────────────────────────────────────────────────
 */

/* ═════════════════════════════ عمومی ═════════════════════════════ */

export const site = {
  name: "DJ SOHEIL",
  nameFa: "دی‌جی سهیل",
  /** عکس Hero — با پس‌زمینه حذف‌شده (WebP یا PNG شفاف)، نسبت عمودی */
  photo: "/images/soheil.webp",
  /** محل خط چشم در عکس (کسری از ارتفاع عکس، ۰ = بالا، ۱ = پایین). با عوض کردن عکس، این عدد را هم تنظیم کنید. */
  photoEyeLine: 0.47,
  photoAlt: "تصویر دی‌جی سهیل",
  roles: ["DJ", "Turntablist", "Educator"],
  /** بیوگرافی کوتاه روی عکس */
  bioShort:
    "بیش از یک دهه پشت دک؛ از کلاب‌ها و رویدادهای زنده تا کلاس‌های آموزشی. عاشق وینیل، اسکرچ و انتقال تجربه به نسل بعدی دی‌جی‌ها.",
  description:
    "آموزش مبتدی و حرفه‌ای DJing، Master Class، آموزش پادکست و Mashup با Ableton Live، مشاوره خرید دستگاه دی‌جی و لپ‌تاپ، و آشنایی با هنر Turntablism.",
  footerText: "آموزش DJing، Ableton Live و مشاوره تخصصی تجهیزات — برای هر کسی که می‌خواهد پشت دک بایستد.",
};

/** راه‌های ارتباطی — همه لینک‌های تلگرام، واتس‌اپ و اینستاگرام سایت از اینجا ساخته می‌شوند. */
export const contact = {
  /** TODO: آیدی تلگرام بدون @ */
  telegram: "djsoheil",
  /** TODO: آیدی اینستاگرام بدون @ */
  instagram: "djsoheil",
  /** TODO: شماره واتس‌اپ با کد کشور، بدون + و بدون صفر اول (مثال: 989121234567) */
  whatsapp: "989000000000",
  /** TODO */
  responseTime: "معمولاً در کمتر از ۲۴ ساعت پاسخ می‌دهم.",
  /** TODO */
  hours: "شنبه تا پنجشنبه، ساعت ۱۰ تا ۲۰",
};

export type NavItem = { href: string; label: string; short?: string };

export const nav: NavItem[] = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/courses/djing", label: "دوره آموزشی DJing" },
  { href: "/courses/ableton", label: "دوره آموزشی Ableton Live" },
  {
    href: "/buying-guide",
    label: "راهنمای خرید دستگاه دی‌جی و لپ‌تاپ",
    short: "راهنمای خرید",
  },
  { href: "/biography", label: "بیوگرافی" },
  { href: "/contact", label: "تماس با ما" },
];

/** باکس دعوت به اقدام انتهای صفحات */
export const ctaBand = {
  title: "آماده‌ای پشت",
  titleAccent: "دک",
  titleEnd: "بایستی؟",
  text: "برای مشاوره رایگان انتخاب دوره یا خرید تجهیزات، همین حالا پیام بده.",
  primary: "شروع کن",
  secondary: "راهنمای خرید",
};

/** برچسب‌های کوتاه مشترک رابط کاربری */
export const ui = {
  mainNav: "منوی اصلی",
  footerNav: "لینک‌های فوتر",
  openMenu: "باز کردن منو",
  closeMenu: "بستن منو",
  quickLinks: "دسترسی سریع",
  stayInTouch: "در ارتباط باشید",
  sendMessage: "ارسال پیام",
  rights: "تمامی حقوق محفوظ است.",
  session: "جلسه",
  minute: "دقیقه",
  levelsCount: "سطح آموزشی",
  totalSessions: "جلسه در کل مسیر",
  totalHours: "ساعت آموزش عملی",
  classFormat: "نوع کلاس",
  sessions: "جلسات",
  perSession: "هر جلسه",
  level: "سطح",
  sessionCount: "تعداد جلسات",
  sessionLength: "مدت هر جلسه",
  prerequisite: "پیش‌نیاز",
  faqTitle: "سؤالات",
  faqAccent: "پرتکرار",
  coursePath: "مسیر دوره",
  modules: "ماژول",
  toDjing: "دوره DJing",
  toAbleton: "دوره Ableton Live",
  gearGuideLink: "راهنمای انتخاب لپ‌تاپ و هدفون",
  heroIntro: "معرفی",
  notFoundTitle: "این صفحه پیدا نشد",
  notFoundText: "شاید آدرس اشتباه است یا صفحه جابه‌جا شده. از صفحه اصلی دوباره شروع کنید.",
  backHome: "بازگشت به صفحه اصلی",
};

/* ═════════════════════════════ صفحه اصلی ═════════════════════════════ */

export const home = {
  heroPrimary: "مشاهده دوره‌ها",
  heroSecondary: "بیوگرافی کامل",
  scrollHint: "اسکرول کنید",
  servicesKicker: "SERVICES",
  servicesTitle: "خدمات و",
  servicesAccent: "دوره‌ها",
  servicesLead:
    "از اولین لمس جاگ‌ویل تا اجرای حرفه‌ای روی صحنه؛ هر مسیری که انتخاب کنید، قدم‌به‌قدم همراهتان هستم.",
  moreInfo: "اطلاعات بیشتر",
  techniquesTitle: "آشنایی با",
  techniquesAccent: "تکنیک‌های اسکرچ",
  techniquesLead: "هر ترن‌تیبلیست با این حرکات شروع می‌کند؛ از ساده‌ترین حرکت دست تا ترکیب‌های سریع کراس‌فیدر.",
};

export type ServiceIcon = "controller" | "masterclass" | "ableton" | "gear";

export const services: {
  icon: ServiceIcon;
  title: string;
  description: string;
  tags: string[];
  href: string;
}[] = [
  {
    icon: "controller",
    title: "آموزش مبتدی و حرفه‌ای DJing",
    description:
      "از شناخت تجهیزات و بیت‌مچینگ تا فریزبندی، EQ، افکت و اجرای زنده؛ قدم‌به‌قدم و متناسب با سطح شما.",
    tags: ["Beatmatching", "Phrasing", "EQ & FX", "Rekordbox / Serato"],
    href: "/courses/djing",
  },
  {
    icon: "masterclass",
    title: "Master Class DJ",
    description:
      "کلاس پیشرفته برای دی‌جی‌های فعال: تکنیک‌های اسکرچ، ست‌سازی حرفه‌ای، خواندن حال‌وهوای جمعیت و ساخت برند شخصی.",
    tags: ["Scratch", "Set Building", "Crowd Reading", "Branding"],
    href: "/courses/djing#tiers",
  },
  {
    icon: "ableton",
    title: "آموزش Podcast و Mashup با Ableton Live",
    description:
      "Warp کردن، ساخت Mashup و Edit اختصاصی، ضبط، میکس و مستر پادکست حرفه‌ای در محیط Ableton Live.",
    tags: ["Warping", "Mashup & Edit", "Podcast", "Mix & Master"],
    href: "/courses/ableton",
  },
  {
    icon: "gear",
    title: "مشاوره خرید دستگاه دی‌جی، لپ‌تاپ و Equipment",
    description:
      "انتخاب کنترلر، میکسر، پلیر، ترن‌تیبل، هدفون، اسپیکر و لپ‌تاپ مناسب؛ دقیقاً بر اساس بودجه و هدف شما.",
    tags: ["Controller", "Mixer", "Laptop", "Monitors"],
    href: "/buying-guide",
  },
];

export type TechniqueLevel = "مبتدی" | "متوسط" | "پیشرفته";

export const turntablism: {
  kicker: string;
  title: string;
  titleAccent: string;
  intro: string;
  timeline: { year: string; title: string; text: string }[];
  techniques: { name: string; fa: string; level: TechniqueLevel; text: string }[];
} = {
  kicker: "THE ART OF TURNTABLISM",
  title: "تاریخچه",
  titleAccent: "Turntablism",
  intro:
    "Turntablism یعنی استفاده از ترن‌تیبل نه فقط برای پخش موسیقی، بلکه به‌عنوان یک «ساز». دی‌جی ترن‌تیبلیست با دست‌کاری صفحه و کراس‌فیدر، صداها، ریتم‌ها و جمله‌های موسیقایی تازه خلق می‌کند؛ هنری که از مهمانی‌های برانکس نیویورک شروع شد و امروز در صحنه‌های جهانی اجرا می‌شود.",
  timeline: [
    {
      year: "1973",
      title: "DJ Kool Herc و تولد Break-beat",
      text: "Kool Herc در برانکس با دو نسخه از یک صفحه، بخش «بریک» آهنگ‌ها را تکرار و طولانی کرد؛ نقطه شروع فرهنگ هیپ‌هاپ.",
    },
    {
      year: "1975",
      title: "کشف اسکرچ",
      text: "Grand Wizzard Theodore به‌طور تصادفی با حرکت دادن صفحه زیر سوزن، صدای «اسکرچ» را کشف کرد و آن را به یک تکنیک تبدیل کرد.",
    },
    {
      year: "1977",
      title: "Grandmaster Flash",
      text: "با «Quick Mix Theory»، Backspin و Punch Phrasing، دقت و سرعت را به میکس آورد و پایه‌های تکنیکی این هنر را گذاشت.",
    },
    {
      year: "1981",
      title: "The Wheels of Steel",
      text: "قطعه «The Adventures of Grandmaster Flash on the Wheels of Steel»؛ از اولین آثار ضبط‌شده که تماماً با ترن‌تیبل ساخته شد.",
    },
    {
      year: "1983",
      title: "Rockit",
      text: "اسکرچ‌های Grandmixer D.ST در آهنگ Rockit از Herbie Hancock، ترن‌تیبل را به‌عنوان ساز به جریان اصلی موسیقی جهان معرفی کرد.",
    },
    {
      year: "1985",
      title: "مسابقات DMC",
      text: "آغاز مسابقات DMC؛ رقابتی جهانی که تا امروز مهم‌ترین صحنه برای نمایش مهارت دی‌جی‌های ترن‌تیبلیست است.",
    },
    {
      year: "1995",
      title: "ابداع واژه Turntablism",
      text: "DJ Babu واژه «Turntablist» را برای تمایز دی‌جی‌هایی به کار برد که ترن‌تیبل را مانند یک ساز می‌نوازند.",
    },
    {
      year: "1990s",
      title: "عصر طلایی",
      text: "گروه‌هایی مثل Invisibl Skratch Piklz با DJ QBert و Mix Master Mike، اسکرچ را به سطح بی‌سابقه‌ای از پیچیدگی رساندند.",
    },
    {
      year: "2004",
      title: "دوران دیجیتال",
      text: "با Serato Scratch Live و سیستم‌های DVS، دی‌جی‌ها توانستند فایل‌های دیجیتال را با حس واقعی وینیل اسکرچ کنند.",
    },
    {
      year: "امروز",
      title: "نسل جدید",
      text: "میکسرهای حرفه‌ای Battle، کنترلرهای پیشرفته و ترن‌تیبل‌های قابل حمل؛ Turntablism زنده‌تر از همیشه است.",
    },
  ],
  techniques: [
    {
      name: "Baby Scratch",
      fa: "بیبی اسکرچ",
      level: "مبتدی",
      text: "پایه‌ای‌ترین اسکرچ: حرکت رفت‌وبرگشتی صفحه با دست، بدون استفاده از کراس‌فیدر.",
    },
    {
      name: "Chirp",
      fa: "چیرپ",
      level: "مبتدی",
      text: "هماهنگی حرکت صفحه و بستن کراس‌فیدر برای ساخت صدایی شبیه جیک‌جیک پرنده.",
    },
    {
      name: "Transformer",
      fa: "ترنسفورمر",
      level: "متوسط",
      text: "باز و بسته کردن سریع و ریتمیک کراس‌فیدر در حین حرکت آرام صفحه.",
    },
    {
      name: "Flare",
      fa: "فلر",
      level: "پیشرفته",
      text: "ابداع DJ Flare؛ بستن لحظه‌ای کراس‌فیدر از حالت باز برای ساخت چند «کلیک» در هر حرکت.",
    },
    {
      name: "Crab",
      fa: "کرب",
      level: "پیشرفته",
      text: "ضربه‌زدن پشت‌سرهم چند انگشت روی کراس‌فیدر؛ تکنیک مشهور DJ QBert با سرعت بسیار بالا.",
    },
    {
      name: "Beat Juggling",
      fa: "بیت جاگلینگ",
      level: "پیشرفته",
      text: "ساخت ریتم و الگوی جدید با جابه‌جایی بین دو نسخه از یک صفحه روی دو ترن‌تیبل.",
    },
  ],
};

/* ═════════════════════════════ انواع داده دوره‌ها ═════════════════════════════ */

export type CourseTier = {
  /** شناسه — در لینک رزرو (/contact?service=...) استفاده می‌شود */
  id: string;
  en: string;
  title: string;
  level: string;
  sessions: number;
  /** مدت هر جلسه به دقیقه */
  minutes: number;
  format: string;
  audience: string;
  price: string;
  highlights: string[];
  featured?: boolean;
};

export type CourseModule = { title: string; sessions: string; topics: string[] };

export type ModuleGroup = {
  id: string;
  label: string;
  en: string;
  summary: string;
  modules: CourseModule[];
};

export type Faq = { q: string; a: string };

/* ═════════════════════════════ دوره DJing ═════════════════════════════ */

export const djCourse: {
  kicker: string;
  title: string;
  titleAccent: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  featuredBadge: string;
  bookLabel: string;
  tiersKicker: string;
  tiersTitle: string;
  tiersLead: string;
  tiers: CourseTier[];
  syllabusKicker: string;
  syllabusTitle: string;
  syllabus: ModuleGroup[];
  methodKicker: string;
  methodTitle: string;
  method: { title: string; text: string }[];
  faq: Faq[];
} = {
  kicker: "DJING ACADEMY",
  title: "دوره آموزشی",
  titleAccent: "DJing",
  lead: "از اولین لمس جاگ‌ویل تا یک ست کامل جلوی جمعیت. دوره DJing در سه سطح طراحی شده تا هر کس، از هر نقطه‌ای که هست، مسیری روشن و قدم‌به‌قدم داشته باشد.",
  primaryCta: "رزرو جلسه مشاوره",
  secondaryCta: "مقایسه سطح‌ها",
  featuredBadge: "پیشنهاد ما",
  bookLabel: "رزرو و ثبت‌نام",
  tiersKicker: "LEVELS",
  tiersTitle: "سه سطح، یک مسیر",
  tiersLead: "سطح خود را انتخاب کنید؛ اگر مطمئن نیستید، جلسه اول ارزیابی می‌کنیم و از نقطه درست شروع می‌کنیم.",
  tiers: [
    {
      id: "djing-beginner",
      en: "BEGINNER",
      title: "دوره مبتدی",
      level: "مبتدی",
      sessions: 12,
      minutes: 90,
      format: "حضوری / آنلاین",
      audience: "برای کسی که تا حالا پشت دستگاه دی‌جی نبوده یا فقط کمی با نرم‌افزار کار کرده است.",
      price: "استعلام شهریه",
      highlights: [
        "آشنایی کامل با کنترلر، میکسر و نرم‌افزار",
        "بیت‌مچینگ با گوش و با Sync",
        "ساختار آهنگ، Phrase و Cue Point",
        "اجرای اولین میکس کامل ۳۰ دقیقه‌ای",
      ],
    },
    {
      id: "djing-pro",
      en: "PRO",
      title: "دوره حرفه‌ای",
      level: "متوسط تا حرفه‌ای",
      sessions: 12,
      minutes: 90,
      format: "حضوری / آنلاین",
      audience: "برای دی‌جی‌هایی که اصول را بلدند و می‌خواهند تمیزتر، خلاق‌تر و مطمئن‌تر اجرا کنند.",
      price: "استعلام شهریه",
      featured: true,
      highlights: [
        "EQ حرفه‌ای، Gain Staging و میکس هارمونیک",
        "افکت، لوپ و ترنزیشن‌های خلاق",
        "کار با پلیرهای کلاب (CDJ / XDJ) و خروجی USB",
        "ضبط و آنالیز ست با فیدبک دقیق",
      ],
    },
    {
      id: "djing-masterclass",
      en: "MASTER CLASS",
      title: "Master Class DJ",
      level: "پیشرفته",
      sessions: 8,
      minutes: 120,
      format: "حضوری، گروه کوچک",
      audience: "برای دی‌جی‌های فعال که می‌خواهند امضای شخصی، تکنیک اسکرچ و برند خودشان را بسازند.",
      price: "استعلام شهریه",
      highlights: [
        "تکنیک‌های اسکرچ از Baby تا Flare و Crab",
        "ست‌سازی و مدیریت قوس انرژی (Energy Arc)",
        "خواندن جمعیت و تصمیم‌گیری زنده",
        "برندینگ، Press Kit و مسیر حرفه‌ای",
      ],
    },
  ],
  syllabusKicker: "SYLLABUS",
  syllabusTitle: "سرفصل‌های دوره",
  syllabus: [
    {
      id: "beginner",
      label: "مبتدی",
      en: "BEGINNER",
      summary: "از صفر تا اولین ست کامل؛ پایه‌هایی که تا آخر مسیر همراهتان می‌مانند.",
      modules: [
        {
          title: "شناخت تجهیزات و نرم‌افزار",
          sessions: "جلسه ۱–۲",
          topics: [
            "آناتومی کنترلر و میکسر: Channel، Gain، EQ و Crossfader",
            "نصب و تنظیم Rekordbox یا Serato، درایور و Buffer Size",
            "مدیریت کتابخانه، پلی‌لیست و آنالیز آهنگ‌ها",
          ],
        },
        {
          title: "ریتم، BPM و بیت‌مچینگ",
          sessions: "جلسه ۳–۵",
          topics: [
            "شمارش ضرب، میزان و Phrase",
            "بیت‌مچینگ با گوش و تنظیم Tempo",
            "Sync: کجا کمک می‌کند و کجا نه",
          ],
        },
        {
          title: "اولین ترنزیشن‌ها",
          sessions: "جلسه ۶–۸",
          topics: [
            "Cue Point و Hot Cue",
            "میکس با EQ: جابه‌جایی Bass بین دو دک",
            "ترنزیشن‌های پایه: Blend، Cut و Echo Out",
          ],
        },
        {
          title: "اولین ست کامل",
          sessions: "جلسه ۹–۱۲",
          topics: [
            "انتخاب آهنگ و چیدن پلی‌لیست برای یک ست",
            "ضبط ست و بازبینی با مدرس",
            "اجرای ست نهایی ۳۰ دقیقه‌ای",
          ],
        },
      ],
    },
    {
      id: "pro",
      label: "حرفه‌ای",
      en: "PRO",
      summary: "صدای تمیز، خلاقیت در ترنزیشن و آمادگی کامل برای تجهیزات کلاب.",
      modules: [
        {
          title: "صدای تمیز و حرفه‌ای",
          sessions: "جلسه ۱–۳",
          topics: [
            "Gain Staging و مدیریت Headroom",
            "EQ پیشرفته و Filter",
            "میکس هارمونیک با Camelot Wheel",
          ],
        },
        {
          title: "افکت، لوپ و خلاقیت",
          sessions: "جلسه ۴–۶",
          topics: [
            "Beat FX و Color FX در جای درست",
            "Loop Roll، Slip Mode و Hot Cue Juggling",
            "ترنزیشن بین ژانرها و BPMهای متفاوت",
          ],
        },
        {
          title: "تجهیزات کلاب",
          sessions: "جلسه ۷–۹",
          topics: [
            "کار با پلیرهای CDJ / XDJ و میکسرهای DJM",
            "خروجی USB از Rekordbox و آماده‌سازی فلش",
            "Booth Monitor و مدیریت صدای محیط",
          ],
        },
        {
          title: "ست‌سازی و اجرا",
          sessions: "جلسه ۱۰–۱۲",
          topics: [
            "ساختار ست: Warm-up، Peak Time و Closing",
            "ضبط ست، آنالیز و رفع نقاط ضعف",
            "اجرای ست ۶۰ دقیقه‌ای با فیدبک کامل",
          ],
        },
      ],
    },
    {
      id: "masterclass",
      label: "Master Class",
      en: "MASTER CLASS",
      summary: "برای دی‌جی‌های فعال: تکنیک، هویت و حرفه.",
      modules: [
        {
          title: "Turntablism و اسکرچ",
          sessions: "جلسه ۱–۳",
          topics: [
            "Baby، Chirp و Transformer",
            "Flare، Crab و ترکیب حرکات",
            "تنظیم کراس‌فیدر: Curve، Cut-in و Hamster",
          ],
        },
        {
          title: "ست‌سازی پیشرفته",
          sessions: "جلسه ۴–۵",
          topics: [
            "قوس انرژی و داستان‌گویی با موسیقی",
            "Edit و Mashup اختصاصی برای ست",
            "آماده‌سازی برای اجرای Back-to-Back",
          ],
        },
        {
          title: "خواندن جمعیت",
          sessions: "جلسه ۶–۷",
          topics: [
            "تشخیص حال‌وهوای سالن و واکنش سریع",
            "برنامه B و مدیریت شرایط غیرمنتظره",
            "رفتار حرفه‌ای در بوث و هماهنگی با تیم فنی",
          ],
        },
        {
          title: "برند شخصی",
          sessions: "جلسه ۸",
          topics: [
            "هویت صوتی و تصویری",
            "Press Kit، میکس‌تیپ و حضور در شبکه‌های اجتماعی",
            "مسیر گرفتن اجرا و همکاری‌ها",
          ],
        },
      ],
    },
  ],
  methodKicker: "METHOD",
  methodTitle: "روش آموزش",
  method: [
    {
      title: "ارزیابی سطح",
      text: "جلسه اول سطح شما را می‌سنجیم تا از نقطه درست شروع کنیم؛ نه تکرار چیزهایی که بلدید، نه پرش از پایه‌ها.",
    },
    {
      title: "تمرین روی دستگاه واقعی",
      text: "بیشتر زمان هر جلسه پشت دستگاه می‌گذرد؛ تئوری فقط به اندازه‌ای که اجرا را بهتر کند.",
    },
    {
      title: "تکلیف و فیدبک",
      text: "بین جلسات میکس ضبط می‌کنید و فیدبک دقیق و زمان‌دار می‌گیرید.",
    },
    {
      title: "ست پایانی",
      text: "هر سطح با اجرای یک ست کامل و بررسی جزءبه‌جزء آن به پایان می‌رسد.",
    },
  ],
  faq: [
    {
      q: "برای شروع حتماً باید دستگاه داشته باشم؟",
      a: "نه. جلسات حضوری روی تجهیزات کلاس برگزار می‌شود. برای تمرین در خانه هم، قبل از خرید، مشاوره رایگان انتخاب دستگاه دارید.",
    },
    {
      q: "کلاس‌ها حضوری است یا آنلاین؟",
      a: "دوره‌های مبتدی و حرفه‌ای به هر دو صورت برگزار می‌شوند. Master Class به‌خاطر ماهیت عملی اسکرچ، حضوری و در گروه‌های کوچک است.",
    },
    {
      q: "با چه نرم‌افزاری آموزش می‌دهید؟",
      a: "Rekordbox و Serato DJ. مفاهیم طوری آموزش داده می‌شوند که روی هر نرم‌افزار و دستگاهی قابل اجرا باشند.",
    },
    {
      q: "از چه سنی می‌شود شروع کرد؟",
      a: "محدودیت سنی خاصی وجود ندارد؛ مهم علاقه و تمرین منظم است. برای نوجوانان، هماهنگی لازم با خانواده انجام می‌شود.",
    },
    {
      q: "بعد از دوره چه پشتیبانی دارم؟",
      a: "پس از پایان دوره هم می‌توانید میکس‌هایتان را برای فیدبک بفرستید و سؤال‌هایتان را بپرسید.",
    },
  ],
};

/* ═════════════════════════════ دوره Ableton Live ═════════════════════════════ */

export const abletonCourse: {
  kicker: string;
  title: string;
  titleAccent: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  meta: { sessions: number; minutes: number; format: string; level: string };
  pipeline: string[];
  curriculumKicker: string;
  curriculumTitle: string;
  curriculumLead: string;
  tracks: ModuleGroup[];
  outcomesKicker: string;
  outcomesTitle: string;
  outcomes: { title: string; text: string }[];
  requirementsTitle: string;
  requirements: string[];
  faq: Faq[];
} = {
  kicker: "ABLETON LIVE STUDIO",
  title: "دوره آموزشی",
  titleAccent: "Ableton Live",
  lead: "Ableton Live برای دی‌جی یعنی آزادی: آهنگ‌ها را همان‌طور که ستت لازم دارد Edit کنی، Mashupهای اختصاصی بسازی و پادکستی منتشر کنی که صدایش هم‌سطح کارهای حرفه‌ای باشد.",
  primaryCta: "ثبت‌نام دوره Ableton",
  secondaryCta: "دیدن سرفصل‌ها",
  meta: { sessions: 14, minutes: 90, format: "حضوری / آنلاین", level: "بدون نیاز به تجربه Ableton" },
  pipeline: ["Warp", "Edit", "Mashup", "Record", "Mix", "Master"],
  curriculumKicker: "CURRICULUM",
  curriculumTitle: "سه مسیر، یک استودیو",
  curriculumLead: "دوره از Warping شروع می‌شود، با ساخت Edit و Mashup ادامه پیدا می‌کند و با تولید یک پادکست کامل تمام می‌شود.",
  tracks: [
    {
      id: "warping",
      label: "Warping",
      en: "WARPING",
      summary: "پایه همه‌چیز: هر آهنگی را روی گرید بیاور و تمپو را در اختیار بگیر.",
      modules: [
        {
          title: "محیط Ableton Live",
          sessions: "جلسه ۱",
          topics: [
            "Session View و Arrangement View",
            "Browser، Clip و Device",
            "تنظیمات Audio، Buffer Size و Sample Rate",
          ],
        },
        {
          title: "Warp از صفر",
          sessions: "جلسه ۲–۳",
          topics: [
            "Warp Marker، فرمان Set 1.1.1 Here و دکمه‌های ‎:2 و ‎*2",
            "انتخاب Warp Mode: Beats، Tones، Texture، Re-Pitch، Complex و Complex Pro",
            "Warp آهنگ‌های با تمپوی متغیر و اجراهای ضبط‌شده زنده",
          ],
        },
        {
          title: "تمپو، Key و آماده‌سازی",
          sessions: "جلسه ۴",
          topics: [
            "Transpose و تغییر تمپو بدون افت کیفیت",
            "تشخیص Key و میکس هارمونیک",
            "خروجی تمیز برای استفاده در Rekordbox و Serato",
          ],
        },
      ],
    },
    {
      id: "mashup",
      label: "Mashup & Edit",
      en: "MASHUP & EDIT",
      summary: "آهنگ‌ها را برای ست خودت بازسازی کن؛ Edit و Mashupهایی که فقط در ست تو شنیده می‌شوند.",
      modules: [
        {
          title: "Edit اختصاصی دی‌جی",
          sessions: "جلسه ۵–۶",
          topics: [
            "ساخت Intro و Outro قابل میکس",
            "Extended Mix، Radio Edit و کوتاه‌سازی",
            "ساختار و Cue Point مناسب ست",
          ],
        },
        {
          title: "ساخت Mashup",
          sessions: "جلسه ۷–۸",
          topics: [
            "انتخاب آهنگ‌های سازگار از نظر Key و انرژی",
            "جداسازی Stems، Acapella و Instrumental",
            "EQ و Sidechain برای جا انداختن دو آهنگ در هم",
          ],
        },
        {
          title: "پرداخت نهایی",
          sessions: "جلسه ۹",
          topics: [
            "ترنزیشن، Riser و افکت با Automation",
            "میکس و Loudness مناسب کلاب",
            "Export با فرمت و کیفیت درست",
          ],
        },
      ],
    },
    {
      id: "podcast",
      label: "Podcast",
      en: "PODCAST",
      summary: "ضبط، ادیت، میکس و مستر؛ یک اپیزود کامل و آماده انتشار.",
      modules: [
        {
          title: "ضبط",
          sessions: "جلسه ۱۰–۱۱",
          topics: [
            "انتخاب میکروفون، کارت صدا و آکوستیک اتاق",
            "ضبط میکس دی‌جی و صدای گوینده در Live",
            "Gain Staging و جلوگیری از Clip",
          ],
        },
        {
          title: "ادیت و میکس",
          sessions: "جلسه ۱۲–۱۳",
          topics: [
            "ادیت گفتار: حذف نویز، سکوت‌های اضافه و اشتباه‌ها",
            "EQ، Compressor و De-esser برای صدا",
            "میکس موسیقی و گفتار با Ducking",
          ],
        },
        {
          title: "مستر و انتشار",
          sessions: "جلسه ۱۴",
          topics: [
            "Limiter و رسیدن به Loudness استاندارد پادکست (حدود ‎-16 LUFS)",
            "True Peak، فرمت خروجی و متادیتا",
            "انتشار در پلتفرم‌های پادکست و SoundCloud",
          ],
        },
      ],
    },
  ],
  outcomesKicker: "WHAT YOU BUILD",
  outcomesTitle: "خروجی دوره",
  outcomes: [
    { title: "Edit اختصاصی", text: "حداقل یک Edit آماده اجرا با Intro و Outro قابل میکس برای ست خودتان." },
    { title: "Mashup امضادار", text: "یک Mashup کامل که فقط در ست شما شنیده می‌شود." },
    { title: "اپیزود پادکست", text: "یک اپیزود ضبط‌شده، میکس و مسترشده، آماده انتشار." },
  ],
  requirementsTitle: "پیش‌نیازها",
  requirements: [
    "لپ‌تاپ با حداقل ۸ گیگابایت RAM و حافظه SSD (۱۶ گیگابایت پیشنهاد می‌شود)",
    "Ableton Live نسخه ۱۱ یا جدیدتر (نسخه Standard یا Suite پیشنهاد می‌شود)",
    "هدفون مانیتورینگ یا اسپیکر مانیتور",
    "برای پادکست: میکروفون USB، یا میکروفون XLR همراه کارت صدا",
  ],
  faq: [
    {
      q: "قبلاً با Ableton کار نکرده‌ام؛ می‌توانم شرکت کنم؟",
      a: "بله. دوره از محیط نرم‌افزار شروع می‌شود. فقط آشنایی پایه با کامپیوتر و علاقه به موسیقی کافی است.",
    },
    {
      q: "دی‌جی نیستم و فقط پادکست می‌خواهم؛ مناسب من است؟",
      a: "بله. بخش Warping برای همه مفید است و می‌توانید روی بخش پادکست تمرکز بیشتری داشته باشید؛ این را در جلسه اول هماهنگ می‌کنیم.",
    },
    {
      q: "کدام نسخه Ableton Live را نصب کنم؟",
      a: "Warp و ابزارهای اصلی در همه نسخه‌ها هست. برای دسترسی به افکت‌ها و ابزارهای بیشتر، نسخه Standard یا Suite پیشنهاد می‌شود.",
    },
  ],
};

/* ═════════════════════════════ راهنمای خرید ═════════════════════════════ */

export type GearItem = {
  name: string;
  brand: string;
  kind: string;
  tags?: string[];
  points: string[];
};

export type BudgetTierId = "beginner" | "intermediate" | "pro";

export type BudgetTier = {
  id: BudgetTierId;
  label: string;
  en: string;
  budget: string;
  who: string;
  tip: string;
  controllers: GearItem[];
  headphones: GearItem[];
  monitors: GearItem[];
};

export const buyingGuide: {
  kicker: string;
  title: string;
  titleAccent: string;
  lead: string;
  filterLabel: string;
  budgetLabel: string;
  priceNote: string;
  categories: { controllers: string; headphones: string; monitors: string };
  tiers: BudgetTier[];
  laptop: {
    kicker: string;
    title: string;
    lead: string;
    minLabel: string;
    recLabel: string;
    rows: { label: string; min: string; rec: string }[];
    windowsTitle: string;
    windowsTips: string[];
    macTitle: string;
    macTips: string[];
  };
  checklistTitle: string;
  checklist: string[];
  consultCta: string;
} = {
  kicker: "GEAR GUIDE",
  title: "راهنمای خرید دستگاه دی‌جی و",
  titleAccent: "لپ‌تاپ",
  lead: "خرید اول، مسیر چند سال تمرین شما را تعیین می‌کند. سطح و بودجه‌تان را انتخاب کنید تا کنترلر، هدفون و اسپیکر مناسب را ببینید؛ و در انتها، مشخصات لپ‌تاپی که پشت دک کم نیاورد.",
  filterLabel: "سطح و بودجه شما",
  budgetLabel: "بودجه تقریبی کنترلر",
  priceNote:
    "قیمت‌ها تقریبی و بر اساس بازار جهانی (دلار) است. برای قیمت روز و خرید مطمئن در ایران، مشاوره بگیرید.",
  categories: { controllers: "کنترلر و دستگاه", headphones: "هدفون", monitors: "اسپیکر مانیتور" },
  tiers: [
    {
      id: "beginner",
      label: "مبتدی",
      en: "STARTER",
      budget: "حدود ۲۵۰ تا ۴۵۰ دلار",
      who: "برای شروع یادگیری در خانه؛ دو کانال، نرم‌افزار رایگان و هر چیزی که برای یادگیری اصول لازم دارید.",
      tip: "در این سطح، کنترلری بخرید که با Rekordbox یا Serato کار کند تا مهارت‌تان بعداً به تجهیزات کلاب منتقل شود.",
      controllers: [
        {
          name: "DDJ-FLX4",
          brand: "Pioneer DJ",
          kind: "کنترلر ۲ کانال",
          tags: ["rekordbox", "Serato DJ Lite"],
          points: [
            "محبوب‌ترین انتخاب برای شروع",
            "Smart CFX و Smart Fader برای ترنزیشن ساده",
            "تغذیه و اتصال با یک کابل USB-C",
          ],
        },
        {
          name: "Mixtrack Pro FX",
          brand: "Numark",
          kind: "کنترلر ۲ کانال",
          tags: ["Serato DJ Lite"],
          points: ["جاگ‌ویل‌های بزرگ و پدال‌های افکت", "قیمت اقتصادی", "کارت صدای داخلی"],
        },
        {
          name: "DJControl Inpulse 500",
          brand: "Hercules",
          kind: "کنترلر ۲ کانال",
          tags: ["Serato DJ Lite", "DJUCED"],
          points: [
            "چراغ‌های راهنمای Beatmatch برای یادگیری",
            "پدهای پرفورمنس و ورودی میکروفون",
            "بدنه بزرگ‌تر با حسی نزدیک به ستاپ حرفه‌ای",
          ],
        },
      ],
      headphones: [
        {
          name: "HDJ-CUE1",
          brand: "Pioneer DJ",
          kind: "هدفون دی‌جی",
          points: ["سبک، مقاوم و اقتصادی", "طراحی مخصوص مانیتورینگ دی‌جی"],
        },
        {
          name: "ATH-M40x",
          brand: "Audio-Technica",
          kind: "هدفون مانیتورینگ",
          points: ["صدای متعادل برای دی‌جی و تولید", "کابل جداشونده"],
        },
      ],
      monitors: [
        {
          name: "DM-40D",
          brand: "Pioneer DJ",
          kind: "اسپیکر رومیزی ۴ اینچ",
          points: ["جمع‌وجور و مناسب میز کوچک", "نسخه بلوتوث (DM-40D-BT) هم دارد"],
        },
        {
          name: "Eris 3.5",
          brand: "PreSonus",
          kind: "اسپیکر مانیتور ۳.۵ اینچ",
          points: ["صدای شفاف در ابعاد کوچک", "خروجی هدفون روی اسپیکر"],
        },
      ],
    },
    {
      id: "intermediate",
      label: "متوسط",
      en: "INTERMEDIATE",
      budget: "حدود ۵۰۰ تا ۱۲۰۰ دلار",
      who: "برای کسی که اصول را بلد است و ست‌های طولانی‌تر، مهمانی‌ها یا اجرای چهار کاناله می‌خواهد.",
      tip: "اگر قصد اجرا در مهمانی را دارید، به خروجی Booth، ورودی میکروفون و کیفیت ساخت دستگاه دقت کنید.",
      controllers: [
        {
          name: "DDJ-GRV6",
          brand: "Pioneer DJ",
          kind: "کنترلر ۴ کانال",
          tags: ["rekordbox", "Serato DJ Pro"],
          points: ["۴ کانال برای ست‌های خلاق", "قابلیت‌های Groove Circuit و Drum Swap", "چیدمان نزدیک به ستاپ کلاب"],
        },
        {
          name: "DDJ-FLX6-GT",
          brand: "Pioneer DJ",
          kind: "کنترلر ۴ کانال",
          tags: ["rekordbox", "Serato DJ Pro", "VirtualDJ"],
          points: ["Merge FX و Jog Cutter", "جاگ‌ویل‌های بزرگ", "مناسب ست‌های مهمانی و Open Format"],
        },
        {
          name: "SC Live 4",
          brand: "Denon DJ",
          kind: "دستگاه استندالون ۴ دک",
          tags: ["Engine DJ"],
          points: ["اجرا بدون لپ‌تاپ", "صفحه لمسی ۷ اینچ و اسپیکر داخلی", "استریم موسیقی با Wi-Fi"],
        },
      ],
      headphones: [
        {
          name: "HDJ-X7",
          brand: "Pioneer DJ",
          kind: "هدفون دی‌جی",
          points: ["صدای قدرتمند در محیط پرسروصدا", "ساخت مقاوم و قابل حمل"],
        },
        {
          name: "ATH-M50x",
          brand: "Audio-Technica",
          kind: "هدفون مانیتورینگ",
          points: ["باس دقیق و قدرتمند", "مناسب دی‌جی و کار در Ableton"],
        },
      ],
      monitors: [
        {
          name: "Rokit 5 G4",
          brand: "KRK",
          kind: "اسپیکر مانیتور ۵ اینچ",
          points: ["باس پرانرژی برای موسیقی الکترونیک", "EQ داخلی با نمایشگر"],
        },
        {
          name: "HS5",
          brand: "Yamaha",
          kind: "اسپیکر مانیتور ۵ اینچ",
          points: ["صدای صادق و بی‌رنگ", "تنظیمات تطبیق با اتاق"],
        },
      ],
    },
    {
      id: "pro",
      label: "حرفه‌ای",
      en: "PRO",
      budget: "از حدود ۱۳۰۰ دلار به بالا",
      who: "برای دی‌جی فعال، ترن‌تیبلیست یا کسی که می‌خواهد در خانه دقیقاً روی چیدمان کلاب تمرین کند.",
      tip: "اگر هدف شما اجرا در کلاب است، تمرین روی ستاپ استاندارد کلاب یعنی پلیرهای CDJ-3000 و میکسرهای DJM را هم در برنامه داشته باشید.",
      controllers: [
        {
          name: "XDJ-RX3",
          brand: "Pioneer DJ",
          kind: "سیستم آل‌این‌وان ۲ کانال",
          tags: ["rekordbox", "Serato DJ Pro"],
          points: ["چیدمان و حسی مشابه CDJ و DJM کلاب", "صفحه لمسی ۱۰.۱ اینچ", "اجرا با فلش USB بدون لپ‌تاپ"],
        },
        {
          name: "DDJ-REV7",
          brand: "Pioneer DJ",
          kind: "کنترلر Battle",
          tags: ["Serato DJ Pro"],
          points: ["جاگ‌ویل موتوری ۷ اینچ با صفحه وینیل واقعی", "چیدمان Battle برای اسکرچ", "فیدر Magvel Fader Pro"],
        },
        {
          name: "Rane ONE",
          brand: "Rane",
          kind: "کنترلر Battle",
          tags: ["Serato DJ Pro"],
          points: ["پلاترهای موتوری با صفحه وینیل", "کراس‌فیدر MAG FOUR", "انتخابی جدی برای Turntablism"],
        },
      ],
      headphones: [
        {
          name: "HD 25",
          brand: "Sennheiser",
          kind: "هدفون دی‌جی",
          points: ["استاندارد چنددهه‌ای بوث‌ها", "بسیار سبک با ایزولاسیون عالی و قطعات قابل تعویض"],
        },
        {
          name: "HDJ-X10",
          brand: "Pioneer DJ",
          kind: "هدفون دی‌جی حرفه‌ای",
          points: ["پرچم‌دار هدفون‌های Pioneer DJ", "ساخت مقاوم برای بوث‌های پرصدا"],
        },
      ],
      monitors: [
        {
          name: "HS8",
          brand: "Yamaha",
          kind: "اسپیکر مانیتور ۸ اینچ",
          points: ["پاسخ فرکانسی دقیق با باس کامل", "استاندارد استودیوهای حرفه‌ای"],
        },
        {
          name: "T7V",
          brand: "ADAM Audio",
          kind: "اسپیکر مانیتور ۷ اینچ",
          points: ["توییتر U-ART با جزئیات بالا", "مناسب میکس و تولید جدی"],
        },
      ],
    },
  ],
  laptop: {
    kicker: "LAPTOP SPECS",
    title: "لپ‌تاپ مناسب دی‌جی",
    lead: "لپ‌تاپ قلب ستاپ دیجیتال شماست. پردازنده سریع مهم است، اما پایداری درایورها و تأخیر پایین (Latency) از آن هم مهم‌تر است.",
    minLabel: "حداقل",
    recLabel: "پیشنهادی",
    rows: [
      {
        label: "پردازنده (CPU)",
        min: "Intel Core i5 نسل ۸ به بعد، AMD Ryzen 5 یا Apple M1",
        rec: "Intel Core i7 / Core Ultra 7، AMD Ryzen 7 یا Apple M2 و جدیدتر",
      },
      { label: "حافظه (RAM)", min: "۸ گیگابایت", rec: "۱۶ گیگابایت (برای Ableton و Stems، ۱۶ تا ۳۲ گیگابایت)" },
      { label: "ذخیره‌سازی (SSD)", min: "SSD با ظرفیت ۲۵۶ گیگابایت", rec: "NVMe SSD با ظرفیت ۵۱۲ گیگابایت تا ۱ ترابایت" },
      {
        label: "پورت‌های USB",
        min: "دست‌کم ۲ پورت: یکی برای دستگاه، یکی برای فلش پشتیبان",
        rec: "پورت‌های USB-A و USB-C جداگانه، بدون نیاز به هاب",
      },
      { label: "نمایشگر", min: "۱۳ اینچ Full HD", rec: "۱۴ تا ۱۶ اینچ با روشنایی بالا برای محیط تاریک" },
      {
        label: "سیستم‌عامل",
        min: "نسخه‌ای که نرم‌افزار و درایور دستگاه رسماً پشتیبانی کنند",
        rec: "قبل از هر آپدیت، سازگاری نرم‌افزار و درایور را بررسی کنید",
      },
    ],
    windowsTitle: "ویندوز: کاهش DPC Latency",
    windowsTips: [
      "با برنامه رایگان LatencyMon درایورهای عامل تأخیر را پیدا کنید؛ معمولاً Wi-Fi، بلوتوث، کارت گرافیک یا ACPI.",
      "Power Plan را روی High / Best Performance بگذارید و USB Selective Suspend را غیرفعال کنید.",
      "هنگام اجرا Wi-Fi و بلوتوث را خاموش و آنتی‌ویروس، OneDrive و Windows Update را متوقف کنید.",
      "همیشه از درایور ASIO رسمی دستگاه استفاده کنید، نه ASIO4ALL یا درایور عمومی.",
      "شارژر را وصل نگه دارید؛ بسیاری از لپ‌تاپ‌ها روی باتری سرعت پردازنده را محدود می‌کنند.",
    ],
    macTitle: "مک: پایداری حین اجرا",
    macTips: [
      "Low Power Mode را خاموش کنید و لپ‌تاپ را به شارژر وصل نگه دارید.",
      "برنامه‌های پس‌زمینه مثل iCloud Drive، Dropbox و مرورگر را قبل از اجرا ببندید.",
      "در Audio MIDI Setup، Sample Rate دستگاه را با نرم‌افزار یکی نگه دارید (معمولاً 44.1kHz).",
      "قبل از آپدیت macOS، سازگاری Rekordbox / Serato و درایور دستگاه را بررسی کنید.",
    ],
  },
  checklistTitle: "قبل از خرید، این‌ها را چک کنید",
  checklist: [
    "خرید از فروشنده معتبر با گارانتی رسمی",
    "بررسی لایسنس نرم‌افزار همراه دستگاه (نسخه Lite یا Pro)",
    "در خرید دست‌دوم: تست جاگ‌ویل، فیدرها، پدها و پورت USB",
    "بخشی از بودجه را برای هدفون، کابل و کیف حمل کنار بگذارید",
  ],
  consultCta: "مشاوره خرید شخصی",
};

/* ═════════════════════════════ بیوگرافی ═════════════════════════════ */
/* TODO: متن‌های این بخش پیش‌نویس هستند؛ با داستان، سوابق و ستاپ واقعی خودتان جایگزین کنید. */

export const biography = {
  kicker: "THE STORY",
  title: "بیوگرافی",
  lead: "داستان دی‌جی‌ای که با یک جفت ترن‌تیبل و صدای خش‌دار یک صفحه قدیمی شروع کرد و امروز تجربه‌اش را به نسل بعدی منتقل می‌کند.",
  storyTitle: "از صفحه‌های قدیمی تا صحنه",
  story: [
    "همه‌چیز با صدای یک صفحه وینیل شروع شد؛ صدایی گرم و زنده که هیچ فایل دیجیتالی نمی‌توانست جایش را بگیرد. ساعت‌ها تمرین روی ترن‌تیبل، گوش دادن به میکس‌تیپ‌های قدیمی و تلاش برای تقلید اسکرچ‌هایی که فقط در ویدیوها دیده بودم، نقطه شروع مسیری شد که هنوز ادامه دارد.",
    "طی بیش از یک دهه، پشت دک کلاب‌ها، رویدادهای خصوصی و اجراهای زنده ایستاده‌ام. هر اجرا درس تازه‌ای داشت: اینکه جمعیت را چطور بخوانم، کی انرژی را بالا ببرم و کی فضا بدهم، و اینکه یک دی‌جی خوب پیش از هر چیز، شنونده خوبی است.",
    "در کنار اجرا، عشق به Turntablism همیشه همراهم بوده؛ ترن‌تیبل برای من فقط وسیله پخش نیست، یک ساز است. همین نگاه باعث شد آموزش را شروع کنم تا تجربه‌هایی را که با آزمون و خطا به دست آوردم، کوتاه‌تر و روشن‌تر به دیگران منتقل کنم.",
  ],
  chaptersKicker: "JOURNEY",
  chaptersTitle: "مسیر",
  chapters: [
    { tag: "شروع", title: "اولین صفحه‌ها", text: "کشف وینیل، تمرین شبانه روی ترن‌تیبل و آشنایی با فرهنگ هیپ‌هاپ و موسیقی الکترونیک." },
    { tag: "کلاب", title: "شب‌های پشت دک", text: "اولین اجراهای جدی در کلاب‌ها و مهمانی‌ها؛ یادگرفتن هنر خواندن جمعیت در عمل." },
    { tag: "Turntablism", title: "ترن‌تیبل به‌عنوان ساز", text: "تمرکز بر اسکرچ، Beat Juggling و اجراهای Showcase؛ جایی که دی‌جی به نوازنده تبدیل می‌شود." },
    { tag: "آموزش", title: "انتقال تجربه", text: "شروع کلاس‌های DJing و Ableton Live با روشی عملی، شخصی‌سازی‌شده و بدون حاشیه." },
    { tag: "امروز", title: "اجرا، آموزش و مشاوره", text: "اجرا در رویدادها، برگزاری دوره‌ها و کمک به دی‌جی‌ها برای انتخاب درست تجهیزات." },
  ],
  philosophyKicker: "PHILOSOPHY",
  philosophyTitle: "فلسفه هنری",
  quote: "دی‌جی خوب آهنگ پخش نمی‌کند؛ لحظه می‌سازد.",
  philosophy: [
    "برای من موسیقی گفت‌وگوست؛ بین دی‌جی و جمعیت، بین دو آهنگی که با هم میکس می‌شوند، و بین گذشته و آینده. تکنیک مهم است، اما فقط وقتی در خدمت حس باشد.",
    "به ریشه‌ها احترام می‌گذارم — وینیل، اسکرچ، فرهنگ هیپ‌هاپ — و هم‌زمان از ابزارهای امروز مثل DVS، Stems و Ableton Live برای خلق چیزهای تازه استفاده می‌کنم.",
  ],
  stageKicker: "ON STAGE",
  stageTitle: "سابقه کلاب و رویدادها",
  stageLead: "تجربه اجرا در فضاهای مختلف، از سالن‌های کوچک و صمیمی تا رویدادهای بزرگ.",
  stage: [
    { title: "کلاب و لانژ", text: "ست‌های طولانی با تمرکز بر جریان انرژی و هماهنگی با حال‌وهوای سالن." },
    { title: "رویدادهای خصوصی", text: "جشن‌ها، رویدادهای برندها و مهمانی‌ها با سلیقه‌ای متناسب با میزبان و مهمانان." },
    { title: "Showcase اسکرچ", text: "اجراهای زنده Turntablism که در آن ترن‌تیبل نقش ساز اصلی را دارد." },
    { title: "میکس‌تیپ و پادکست", text: "تولید میکس‌تیپ و پادکست‌های موسیقی با Ableton Live." },
  ],
  teachingKicker: "TEACHING",
  teachingTitle: "متد آموزشی",
  teaching: [
    { title: "شخصی‌سازی‌شده", text: "هیچ دو هنرجویی شبیه هم نیستند؛ سرعت، سلیقه و هدف هر نفر در برنامه لحاظ می‌شود." },
    { title: "عملی از جلسه اول", text: "از همان جلسه اول دست‌تان روی دستگاه است؛ تئوری فقط وقتی که لازم است." },
    { title: "گوش، قبل از Sync", text: "یاد می‌گیرید با گوش بیت‌مچ کنید؛ Sync ابزار کمکی است، نه جایگزین مهارت." },
    { title: "فیدبک مستمر", text: "میکس‌های ضبط‌شده بررسی می‌شوند و فیدبک دقیق و زمان‌دار می‌گیرید." },
  ],
  setupKicker: "SETUP",
  setupTitle: "ستاپ و تجهیزات",
  setupNote: "تجهیزاتی که در اجرا و کلاس‌ها استفاده می‌کنم.",
  setup: [
    { group: "Turntables", items: ["Technics SL-1200 ×2", "Ortofon Concorde MKII Scratch"] },
    { group: "Mixer & Players", items: ["Pioneer DJ DJM-S11", "Pioneer DJ CDJ-3000"] },
    { group: "Software", items: ["Serato DJ Pro", "rekordbox", "Ableton Live Suite"] },
    { group: "Monitoring", items: ["Sennheiser HD 25", "Yamaha HS8"] },
  ],
};

/* ═════════════════════════════ تماس ═════════════════════════════ */

export const contactPage = {
  kicker: "GET IN TOUCH",
  title: "تماس با",
  titleAccent: "ما",
  lead: "برای ثبت‌نام دوره، مشاوره خرید تجهیزات یا رزرو اجرا، مستقیم پیام بدهید یا فرم زیر را پر کنید.",
  channelsTitle: "راه‌های ارتباط مستقیم",
  channels: {
    telegram: { label: "تلگرام", action: "پیام در تلگرام" },
    whatsapp: { label: "واتس‌اپ", action: "پیام در واتس‌اپ" },
    instagram: { label: "اینستاگرام", action: "دنبال کردن در اینستاگرام" },
  },
  responseLabel: "زمان پاسخ‌گویی",
  hoursLabel: "ساعات کاری",
  form: {
    title: "رزرو مشاوره یا ثبت‌نام دوره",
    lead: "اطلاعات را وارد کنید تا برای هماهنگی با شما تماس بگیرم.",
    name: "نام و نام خانوادگی",
    contact: "شماره تماس یا آیدی تلگرام",
    contactHint: "مثلاً 0912… یا ‎@username",
    service: "موضوع",
    format: "نوع کلاس",
    time: "زمان مناسب برای تماس (اختیاری)",
    message: "توضیحات (اختیاری)",
    messageHint: "سطح فعلی، تجهیزاتی که دارید یا هر سؤالی…",
    submit: "ارسال درخواست",
    sending: "در حال ارسال…",
    required: "این فیلد الزامی است",
    successTitle: "درخواست شما ارسال شد",
    successText: "به‌زودی برای هماهنگی با شما تماس می‌گیرم.",
    fallbackTitle: "تقریباً تمام شد!",
    fallbackText: "برای تکمیل ثبت درخواست، پیام آماده زیر را با یک کلیک در تلگرام یا واتس‌اپ ارسال کنید.",
    newRequest: "ارسال درخواست جدید",
    services: [
      { id: "djing-beginner", label: "دوره مبتدی DJing" },
      { id: "djing-pro", label: "دوره حرفه‌ای DJing" },
      { id: "djing-masterclass", label: "Master Class DJ" },
      { id: "ableton", label: "دوره Ableton Live" },
      { id: "gear", label: "مشاوره خرید تجهیزات" },
      { id: "event", label: "رزرو اجرا برای رویداد" },
      { id: "other", label: "سایر موارد" },
    ],
    formats: ["حضوری", "آنلاین", "فرقی نمی‌کند"],
    messageHeader: "درخواست جدید از سایت DJ Soheil",
  },
};

/* ═════════════════════════════ دستیار هوشمند (چت) ═════════════════════════════ */

export type EscalationReason = "hardware" | "registration" | "routing" | "unresolved" | "complex" | "manual";

export const chat: {
  launcher: string;
  title: string;
  modeAi: string;
  modeBuiltin: string;
  greeting: string;
  presetsTitle: string;
  presets: string[];
  placeholder: string;
  send: string;
  close: string;
  typing: string;
  direct: string;
  summaryTitle: string;
  summaryHint: string;
  sendTelegram: string;
  sendWhatsapp: string;
  copy: string;
  copied: string;
  backToChat: string;
  error: string;
  escalation: Record<EscalationReason, string>;
  summary: {
    greeting: string;
    topic: string;
    defaultTopic: string;
    problem: string;
    details: string;
    gear: string;
    tried: string;
    noMessages: string;
  };
} = {
  launcher: "عیب‌یابی رایگان",
  title: "دستیار DJ Soheil",
  modeAi: "پاسخ‌گویی هوشمند (AI)",
  modeBuiltin: "عیب‌یابی تخصصی",
  greeting:
    "سلام! من دستیار DJ Soheil هستم. مشکل نرم‌افزار یا دستگاه دی‌جی‌ات را بگو تا قدم‌به‌قدم حلش کنیم. اگر مشکل سخت‌افزاری یا خاص بود، خلاصه‌اش را مستقیم برای سهیل می‌فرستیم.",
  presetsTitle: "مشکلات رایج:",
  presets: [
    "صدای Rekordbox یا Serato خش‌خش یا قطع و وصل می‌شود",
    "کنترلر دی‌جی توسط لپ‌تاپ شناسایی نمی‌شود",
    "مشکل سینک نبودن و Warp در Ableton Live",
    "مشاوره خرید کنترلر و لپ‌تاپ مناسب بودجه من",
  ],
  placeholder: "مشکلت را بنویس…",
  send: "ارسال",
  close: "بستن چت",
  typing: "در حال بررسی…",
  direct: "ارتباط مستقیم با سهیل",
  summaryTitle: "خلاصه مشکل برای ارسال به سهیل",
  summaryHint: "می‌توانی متن را ویرایش کنی؛ با یک کلیک در تلگرام یا واتس‌اپ آماده ارسال می‌شود و لازم نیست مشکل را دوباره توضیح بدهی.",
  sendTelegram: "ارسال در تلگرام",
  sendWhatsapp: "ارسال در واتس‌اپ",
  copy: "کپی متن",
  copied: "کپی شد ✓",
  backToChat: "ادامه گفتگو",
  error: "ارتباط با سرور برقرار نشد. دوباره تلاش کن یا مستقیم به سهیل پیام بده.",
  escalation: {
    hardware: "این مورد به آسیب یا ایراد فیزیکی دستگاه مربوط است و باید از نزدیک بررسی شود. خلاصه مشکل را برای سهیل بفرست.",
    registration: "برای ثبت‌نام، شهریه و زمان‌بندی کلاس‌ها، مستقیم با سهیل هماهنگ کن. خلاصه درخواستت آماده است:",
    routing: "ستاپ‌های روتینگ خاص معمولاً به بررسی دقیق نیاز دارند. خلاصه را برای سهیل بفرست تا دقیق راهنمایی‌ات کند.",
    unresolved: "خلاصه مشکل و کارهایی که انجام دادی آماده است؛ برای سهیل بفرست تا شخصاً بررسی کند.",
    complex: "این مورد به بررسی دقیق‌تری نیاز دارد. خلاصه مشکل را برای سهیل بفرست.",
    manual: "خلاصه گفتگو آماده است؛ با یک کلیک برای سهیل بفرست.",
  },
  summary: {
    greeting: "سلام سهیل جان، از طریق دستیار سایت پیام می‌دهم.",
    topic: "موضوع",
    defaultTopic: "درخواست راهنمایی",
    problem: "شرح مشکل",
    details: "توضیحات بیشتر",
    gear: "تجهیزات / نرم‌افزار",
    tried: "راهکارهای پیشنهادی دستیار را امتحان کردم ولی مشکل حل نشد.",
    noMessages: "(مشکل یا سؤالم را اینجا بنویسید)",
  },
};

/** پاسخ‌های عمومی موتور داخلی چت */
export const chatReplies = {
  hello:
    "سلام! خوشحالم که اینجایی. مشکلت را با جزئیات بگو — نرم‌افزار (Rekordbox، Serato، Ableton…)، مدل دستگاه و ویندوز یا مک — تا دقیق راهنمایی‌ات کنم.",
  thanks: "خواهش می‌کنم! اگر سؤال دیگری داشتی همین‌جا هستم. موفق باشی پشت دک 🎧",
  unresolved:
    "متأسفم که هنوز حل نشده. احتمالاً مشکل به ستاپ خاص یا سخت‌افزار شما مربوط است و بهتر است سهیل شخصاً بررسی کند.",
  followup:
    "ممنون از توضیحات. اگر مراحل بالا را انجام دادی و مشکل هنوز هست، بهتر است سهیل با همین جزئیات شخصاً بررسی کند؛ خلاصه گفتگو آماده ارسال است.",
  fallback:
    "برای اینکه دقیق راهنمایی کنم، لطفاً بگو:\n1. از چه نرم‌افزاری استفاده می‌کنی؟ (Rekordbox، Serato، Ableton Live…)\n2. مدل کنترلر یا دستگاهت چیست؟\n3. ویندوز یا مک؟\n4. مشکل دقیقاً کی و چطور اتفاق می‌افتد؟\n\nمی‌توانم در این موارد کمک کنم: خش‌خش و قطعی صدا، شناسایی نشدن کنترلر، Warp و سینک در Ableton، نویز و وزوز، نبودن صدا در خروجی یا هدفون، DVS و تایم‌کد، کتابخانه Rekordbox و مشاوره خرید.",
};

/** کلمات کلیدی تشخیص — برای تصمیم ارجاع مستقیم به سهیل */
export const chatSignals = {
  hello: ["سلام", "درود", "hi", "hello", "salam"],
  thanks: ["ممنون", "مرسی", "متشکرم", "سپاس", "thanks", "thank you", "دمت گرم", "حل شد"],
  unresolved: [
    "حل نشد",
    "درست نشد",
    "کار نکرد",
    "فایده نداشت",
    "نتیجه نداد",
    "جواب نداد",
    "هنوز مشکل",
    "هنوز همون",
    "هنوز همان",
    "هنوز هست",
    "باز هم همان",
    "بازم همون",
    "still not",
    "not working",
    "didnt work",
  ],
};

export type KbEntry = {
  id: string;
  /** عنوان کوتاه — در خلاصه ارسالی به سهیل استفاده می‌شود */
  title: string;
  keywords: string[];
  intro: string;
  steps: string[];
  outro?: string;
  /** اگر تعیین شود، با تشخیص این موضوع، گزینه ارتباط مستقیم با سهیل نمایش داده می‌شود */
  escalate?: EscalationReason;
};

/**
 * پایگاه دانش داخلی دستیار — بدون نیاز به API هوش مصنوعی کار می‌کند.
 * وقتی کلید API تنظیم شده باشد، همین متن‌ها به‌عنوان مرجع به مدل داده می‌شوند.
 */
export const chatKb: KbEntry[] = [
  {
    id: "audio-dropouts",
    title: "خش‌خش، کلیک یا قطع‌و‌وصل صدا",
    keywords: [
      "خش",
      "خش خش",
      "خشخش",
      "صدا خش",
      "خش داره",
      "خش میده",
      "قطع و وصل",
      "صدا قطع",
      "قطع شد",
      "قطع میشه",
      "قطع می شود",
      "کلیک",
      "تیک تیک",
      "پت پت",
      "گیر میکنه",
      "لگ میزنه",
      "crackle",
      "crackling",
      "dropout",
      "glitch",
      "buffer",
      "بافر",
      "asio",
      "dpc",
    ],
    intro: "خش‌خش یا قطع‌و‌وصل صدا در Rekordbox و Serato تقریباً همیشه به تنظیمات صدا، درایور یا مدیریت انرژی لپ‌تاپ برمی‌گردد. به ترتیب امتحان کن:",
    steps: [
      "**Buffer Size را بیشتر کن:** در Rekordbox از Preferences > Audio و در Serato از Setup > Audio، مقدار Buffer را روی حدود 5 تا 10 میلی‌ثانیه (256 تا 512 Sample) بگذار.",
      "**درایور درست:** در ویندوز درایور ASIO رسمی دستگاه را از سایت سازنده نصب کن (نه ASIO4ALL). در مک، Core Audio کافی است و اکثر دستگاه‌ها درایور جدا نمی‌خواهند.",
      "**Sample Rate یکسان:** نرم‌افزار و کنترل‌پنل درایور را روی یک Sample Rate (معمولاً 44.1kHz) تنظیم کن.",
      "**مدیریت انرژی:** شارژر را وصل کن؛ در ویندوز Power Plan را روی High / Best Performance بگذار و USB Selective Suspend را غیرفعال کن. در مک Low Power Mode را خاموش کن.",
      "**برنامه‌های پس‌زمینه:** مرورگر، OneDrive / Dropbox و اسکن آنتی‌ویروس را ببند و حین اجرا Wi-Fi و بلوتوث را خاموش کن.",
      "**پورت و کابل:** دستگاه را مستقیم و بدون هاب به لپ‌تاپ وصل کن و کابل اصلی یا یک کابل کوتاه و باکیفیت را امتحان کن.",
      "**تست DPC Latency (ویندوز):** برنامه LatencyMon را اجرا کن تا درایور مزاحم (معمولاً Wi-Fi، کارت گرافیک یا ACPI) مشخص شود.",
    ],
    outro: "اگر بعد از این مراحل مشکل ادامه داشت، مدل لپ‌تاپ، سیستم‌عامل و کنترلرت را بگو.",
  },
  {
    id: "controller-not-detected",
    title: "شناسایی نشدن کنترلر توسط لپ‌تاپ",
    keywords: [
      "شناسایی",
      "نمیشناسه",
      "نمی شناسد",
      "نمی‌شناسه",
      "شناخته نمی",
      "وصل نمیشه",
      "وصل نمی شود",
      "کانکت نمیشه",
      "دیده نمیشه",
      "دیده نمی شود",
      "detect",
      "not recognized",
      "recognize",
      "midi",
      "no controller",
      "دستگاه رو نمیبینه",
    ],
    intro: "وقتی Rekordbox یا Serato کنترلر را نمی‌شناسد، این مراحل را به ترتیب انجام بده:",
    steps: [
      "**کابل:** کابل اصلی دستگاه را استفاده کن؛ بعضی کابل‌های USB فقط شارژ می‌کنند و دیتا منتقل نمی‌کنند. یک پورت دیگر هم امتحان کن و هاب را حذف کن.",
      "**درایور (ویندوز):** درایور مخصوص دستگاه را از سایت رسمی سازنده دانلود و نصب کن و سیستم را ری‌استارت کن.",
      "**Device Manager (ویندوز):** ببین دستگاه زیر Sound, video and game controllers یا USB با علامت زرد دیده می‌شود یا نه. اگر بله، درایور را حذف و دوباره نصب کن.",
      "**مک:** در System Settings > Privacy & Security اجازه درایور یا افزونه سیستمی را بده و در برنامه Audio MIDI Setup بررسی کن دستگاه دیده می‌شود.",
      "**سازگاری نرم‌افزار:** مطمئن شو نسخه نرم‌افزارت از این کنترلر پشتیبانی می‌کند و نرم‌افزار، درایور و Firmware دستگاه به‌روز هستند.",
      "**برنامه‌های دیگر:** هر نرم‌افزار دی‌جی یا DAW دیگری که ممکن است دستگاه را در اختیار گرفته باشد را ببند.",
      "**تغذیه:** اگر دستگاه آداپتور برق جدا دارد، وصلش کن؛ بعضی دستگاه‌ها با برق USB لپ‌تاپ درست کار نمی‌کنند.",
    ],
    outro: "اگر هنوز شناسایی نمی‌شود، مدل دستگاه، نرم‌افزار و سیستم‌عامل را بگو.",
  },
  {
    id: "rekordbox-library",
    title: "کتابخانه Rekordbox، آنالیز و خروجی USB",
    keywords: ["کتابخانه", "library", "آنالیز", "analyze", "analysis", "پلی لیست", "playlist", "فلش", "export", "cdj", "بیت گرید", "beatgrid", "grid", "سینک", "sync", "bpm اشتباه", "bpm غلط", "usb stick"],
    intro: "برای مشکلات کتابخانه، BPM و آماده‌سازی فلش:",
    steps: [
      "**آنالیز کامل:** قبل از اجرا همه آهنگ‌ها را آنالیز کن. اگر BPM دو برابر یا نصف تشخیص داده می‌شود، محدوده BPM را در تنظیمات Analysis اصلاح کن و دوباره آنالیز کن.",
      "**اصلاح Beatgrid:** در حالت ویرایش Grid، اولین ضرب (1.1) را درست کن و گرید را جابه‌جا کن تا روی کیک‌ها بنشیند.",
      "**فرمت فلش:** برای سازگاری با بیشتر پلیرها، فلش را با FAT32 یا exFAT فرمت کن (سازگاری پلیر را چک کن) و از فلش باکیفیت استفاده کن.",
      "**خروجی گرفتن:** پلی‌لیست را از حالت Export به فلش بفرست، نه با کپی دستی فایل‌ها؛ تا Cue Pointها و گریدها منتقل شوند.",
      "**پشتیبان:** از منوی File > Library > Backup Library به‌طور منظم از کتابخانه پشتیبان بگیر.",
      "**فایل‌های گم‌شده:** اگر آهنگ‌ها علامت تعجب دارند، محل فایل‌ها تغییر کرده؛ با Relocate مسیر جدید را معرفی کن.",
    ],
  },
  {
    id: "latency",
    title: "تأخیر (Latency) بین دست و صدا",
    keywords: ["تاخیر", "تأخیر", "دیلی", "delay", "latency", "لیتنسی", "دیر", "با تاخیر", "جاگ دیر"],
    intro: "اگر بین حرکت جاگ‌ویل یا فشردن Cue و شنیدن صدا تأخیر حس می‌کنی:",
    steps: [
      "**Buffer Size را کم کن:** در تنظیمات Audio نرم‌افزار، Buffer را تا جایی پایین بیاور که خش‌خش ایجاد نشود (معمولاً 2 تا 5 میلی‌ثانیه).",
      "**درایور رسمی:** در ویندوز حتماً از درایور ASIO رسمی دستگاه استفاده کن؛ درایورهای عمومی تأخیر زیادی دارند.",
      "**بلوتوث ممنوع:** هدفون یا اسپیکر بلوتوثی برای دی‌جی مناسب نیست؛ همیشه با کابل وصل شو.",
      "**مدیریت انرژی:** شارژر را وصل کن و Power Plan را روی بیشترین کارایی بگذار.",
      "**در Ableton Live:** در Preferences > Audio مقدار Buffer Size را کم کن و Driver Error Compensation را تنظیم کن؛ هنگام ضبط، Monitoring ترک را روی In یا Auto بگذار.",
      "**افکت‌ها و Stems:** اگر پردازنده ضعیف است، استفاده هم‌زمان از چند افکت سنگین یا Stems را کم کن.",
    ],
  },
  {
    id: "ableton-warp-sync",
    title: "Warp و سینک نبودن در Ableton Live",
    keywords: [
      "ableton",
      "آبلتون",
      "ابلتون",
      "warp",
      "وارپ",
      "marker",
      "مارکر",
      "سینک",
      "sync",
      "tempo",
      "تمپو",
      "ریتم بهم",
      "از ریتم",
      "عقب جلو",
      "set 1 1 1",
      "arrangement",
    ],
    intro: "ناهماهنگی تمپو در Ableton Live معمولاً با تنظیم درست Warp حل می‌شود:",
    steps: [
      "**Warp را فعال کن** و Warp Mode مناسب را انتخاب کن: Beats برای درام و قطعات ریتمیک، Complex یا Complex Pro برای آهنگ کامل، Re-Pitch برای حس دی‌جی (تغییر تمپو همراه با Pitch).",
      "**اولین ضرب را درست کن:** روی اولین Downbeat آهنگ کلیک راست کن و Set 1.1.1 Here را بزن.",
      "**تمپوی دو برابر یا نصف:** اگر BPM تشخیص داده‌شده دو برابر یا نصف است، از دکمه‌های ‎:2 یا ‎*2 در Clip View استفاده کن.",
      "**آهنگ‌های با تمپوی ثابت:** روی اولین ضرب کلیک راست کن و Warp From Here (Straight) را بزن تا مارکرهای اضافی حذف شوند.",
      "**آهنگ‌های ضبط زنده:** تمپو متغیر است؛ در ابتدای چند میزان Warp Marker بگذار و هر کدام را روی ضرب درست بکش.",
      "**کنترل دستی:** اگر Auto-Warp مزاحم است، در Preferences > Record, Warp & Launch گزینه Auto-Warp Long Samples را خاموش کن.",
      "**هماهنگی با دستگاه دیگر:** از Ableton Link یا MIDI Clock استفاده کن و در Preferences > Audio مقدار Driver Error Compensation را تنظیم کن.",
    ],
    outro: "اگر مشکل در اجرای زنده یا هماهنگی با دستگاه خاصی است، جزئیات ستاپ را بگو.",
  },
  {
    id: "no-sound-output",
    title: "صدا از اسپیکر یا هدفون پخش نمی‌شود",
    keywords: [
      "صدا نمیاد",
      "صدا نمی آید",
      "صدا نداره",
      "صدا ندارد",
      "بی صدا",
      "صدایی نمیاد",
      "صدا پخش نمی",
      "خروجی",
      "output",
      "master out",
      "cue",
      "هدفون صدا",
      "صدای هدفون",
      "از هدفون",
      "تو هدفون",
      "توی هدفون",
      "در هدفون",
      "از اسپیکر",
      "اسپیکر صدا",
      "no sound",
      "audio output",
    ],
    intro: "اگر نرم‌افزار آهنگ را پخش می‌کند ولی صدایی نمی‌شنوی، مسیر صدا را از نرم‌افزار تا اسپیکر چک کن:",
    steps: [
      "**دستگاه صوتی در نرم‌افزار:** در Rekordbox از Preferences > Audio و در Serato از Setup > Audio بررسی کن کنترلرت به‌عنوان Audio Device انتخاب شده و Master و Headphones روی خروجی‌های درست هستند.",
      "**مسیر روی دستگاه:** Gain / Trim کانال، فیدر کانال، موقعیت کراس‌فیدر و Master Volume را بالا بیاور. اگر کانال سلکتور (USB / PC / Line / Phono) دارد، روی USB یا PC باشد.",
      "**هدفون:** دکمه Cue کانال را روشن کن، Headphone Level را بالا بیاور و پیچ Cue / Master Mix را چک کن.",
      "**اسپیکر:** کابل باید به Master Out وصل باشد (Booth فقط با پیچ Booth کار می‌کند)، اسپیکر روشن و ولومش باز باشد و ورودی درست انتخاب شده باشد.",
      "**ویندوز:** برنامه‌های دیگری که از دستگاه صوتی استفاده می‌کنند را ببند؛ درایور ASIO معمولاً فقط به یک برنامه اجازه دسترسی می‌دهد.",
      "**تست سریع:** با هدفون مستقیم به خروجی هدفون دستگاه وصل شو تا مشخص شود مشکل از دستگاه است یا از اسپیکر و کابل.",
    ],
  },
  {
    id: "ground-loop",
    title: "صدای وزوز، هوم یا نویز (Ground Loop)",
    keywords: ["وزوز", "هوم", "hum", "buzz", "ground", "گراند", "ارت", "سیم زمین", "نویز", "noise", "زززز", "صدای برق", "پارازیت"],
    intro: "وزوز یا هوم یکنواخت معمولاً از Ground Loop (اختلاف ارت بین دستگاه‌ها) است:",
    steps: [
      "**تست شارژر:** شارژر لپ‌تاپ را جدا کن؛ اگر وزوز قطع شد، مشکل Ground Loop از طریق شارژر است.",
      "**یک منبع برق:** همه دستگاه‌ها (لپ‌تاپ، کنترلر، اسپیکر) را به یک چندراهی و یک پریز ارت‌دار وصل کن.",
      "**کابل Balanced:** به‌جای RCA از کابل‌های Balanced (XLR یا TRS) برای اتصال به اسپیکرها استفاده کن.",
      "**ایزولاتور:** از USB Isolator یا Ground Loop Isolator / DI Box با قابلیت Ground Lift بین دستگاه و اسپیکر استفاده کن.",
      "**مسیر کابل‌ها:** کابل‌های صدا را از کابل‌های برق جدا کن و آن‌ها را دور هم نپیچ.",
      "**ترن‌تیبل:** سیم Ground ترن‌تیبل را به ترمینال GND / Phono Earth میکسر ببند.",
      "**Gain Staging:** Master دستگاه را در حد معمول (حدود 0dB) نگه دار و بلندی را از خود اسپیکر تنظیم کن.",
    ],
    outro: "⚠️ هیچ‌وقت پین ارت دوشاخه برق را حذف یا دور نزن؛ این کار خطر برق‌گرفتگی دارد.",
  },
  {
    id: "dvs-timecode",
    title: "مشکل DVS، تایم‌کد یا پرش سوزن",
    keywords: ["dvs", "تایم کد", "تایمکد", "timecode", "control vinyl", "صفحه کنترل", "سوزن", "needle", "پرش سوزن", "سوزن میپره", "skip", "scratch live", "کالیبره", "calibrat"],
    intro: "برای مشکلات DVS (کنترل نرم‌افزار با صفحه تایم‌کد) و پرش سوزن:",
    steps: [
      "**کالیبراسیون:** سوزن را روی صفحه ساکن بگذار و از بخش DVS در تنظیمات نرم‌افزار، Threshold / کالیبراسیون را انجام بده.",
      "**Scope را ببین:** در نمایش سیگنال تایم‌کد باید حلقه‌های تقریباً گرد و منظم ببینی؛ شکل بیضی یا لرزان یعنی مشکل در کابل، سوزن یا سوئیچ Phono / Line.",
      "**سوئیچ Phono / Line:** تنظیم ورودی میکسر یا کارت صدا باید با خروجی ترن‌تیبل هماهنگ باشد.",
      "**سوزن و صفحه:** سوزن را تمیز کن و اگر فرسوده است عوض کن؛ صفحه تایم‌کد ساییده هم باعث خطا می‌شود.",
      "**تنظیم بازو برای اسکرچ:** وزنه را طبق توصیه سازنده سوزن تنظیم کن (اغلب 3 تا 5 گرم برای سوزن‌های اسکرچ) و Anti-skate را روی صفر بگذار.",
      "**Ground:** سیم ارت ترن‌تیبل را به میکسر ببند تا نویز وارد سیگنال تایم‌کد نشود.",
    ],
  },
  {
    id: "buying-advice",
    title: "مشاوره خرید کنترلر و لپ‌تاپ",
    keywords: ["خرید", "بخرم", "بودجه", "پیشنهاد", "قیمت", "مشاوره", "budget", "buy", "recommend", "لپ تاپ مناسب", "کنترلر مناسب", "کنترلر خوب"],
    intro: "برای پیشنهاد دقیق، هدف (تمرین در خانه، مهمانی، کلاب یا اسکرچ) و بودجه‌ات مهم است. خلاصه راهنما:",
    steps: [
      "**مبتدی (حدود ۲۵۰ تا ۴۵۰ دلار):** Pioneer DJ DDJ-FLX4، Numark Mixtrack Pro FX یا Hercules Inpulse 500.",
      "**متوسط (حدود ۵۰۰ تا ۱۲۰۰ دلار):** Pioneer DJ DDJ-GRV6 یا DDJ-FLX6-GT؛ برای اجرا بدون لپ‌تاپ Denon DJ SC Live 4.",
      "**حرفه‌ای و اسکرچ:** Pioneer DJ XDJ-RX3 برای حس کلاب، DDJ-REV7 یا Rane ONE برای Turntablism.",
      "**لپ‌تاپ:** حداقل Core i5 / Ryzen 5 / Apple M1، رم ۸ گیگابایت (۱۶ پیشنهادی)، SSD و دست‌کم ۲ پورت USB.",
      "**هدفون:** Sennheiser HD 25 یا Audio-Technica ATH-M50x؛ هدفون بلوتوثی برای دی‌جی مناسب نیست.",
    ],
    outro: "جزئیات کامل در [راهنمای خرید](/buying-guide) هست. برای مشاوره شخصی بر اساس بودجه دقیقت، دکمه «ارتباط مستقیم با سهیل» را بزن.",
  },
  {
    id: "hardware-damage",
    title: "آسیب فیزیکی یا تعمیر دستگاه",
    keywords: [
      "شکسته",
      "سوخت",
      "سوخته",
      "آب ریخت",
      "اب ریخت",
      "نوشیدنی ریخت",
      "ریخت روش",
      "از دستم افتاد",
      "افتاد زمین",
      "زمین خورد",
      "ضربه خورد",
      "دود کرد",
      "دود میده",
      "دود بلند",
      "بوی سوختگی",
      "جرقه",
      "تعمیر",
      "تعمیرکار",
      "دستگاه خراب",
      "کنترلر خراب",
      "لق شده",
      "روشن نمیشه",
      "روشن نمی شود",
      "فیدر خراب",
      "جاگ خراب",
      "broken",
      "damage",
      "repair",
      "spill",
    ],
    intro: "به نظر می‌رسد دستگاه آسیب فیزیکی دیده است. قبل از هر کاری:",
    steps: [
      "**برق را قطع کن:** دستگاه را از برق و لپ‌تاپ جدا کن و تا بررسی کامل روشنش نکن.",
      "**اگر مایع ریخته:** دستگاه را برعکس نگه دار تا مایع به داخل نفوذ نکند، سطح را با دستمال خشک کن و از سشوار داغ استفاده نکن.",
      "**بدنه را باز نکن:** اگر دستگاه گارانتی دارد، باز کردن بدنه آن را باطل می‌کند.",
      "**مستندسازی:** از آسیب عکس یا ویدیو بگیر و مدل دقیق دستگاه را یادداشت کن.",
    ],
    outro: "عیب‌یابی سخت‌افزار از راه دور ممکن نیست؛ خلاصه مشکل را برای سهیل بفرست تا بهترین راه تعمیر یا جایگزینی را بگوید.",
    escalate: "hardware",
  },
  {
    id: "course-registration",
    title: "ثبت‌نام دوره و کلاس",
    keywords: ["ثبت نام", "ثبتنام", "شهریه", "هزینه دوره", "هزینه کلاس", "کلاس دی جی", "دوره دی جی", "دوره آموزشی", "کلاس آموزشی", "کلاس خصوصی", "دوره ableton", "کلاس ableton", "رزرو", "register", "course", "masterclass", "master class", "مستر کلاس"],
    intro: "دوره‌های فعلی:",
    steps: [
      "**DJing مبتدی و حرفه‌ای:** هر سطح ۱۲ جلسه، حضوری یا آنلاین — [جزئیات دوره DJing](/courses/djing)",
      "**Master Class DJ:** اسکرچ، ست‌سازی و برندینگ؛ حضوری در گروه کوچک",
      "**Ableton Live:** Warping، Mashup و Edit، و پادکست — [جزئیات دوره Ableton](/courses/ableton)",
    ],
    outro: "برای شهریه، زمان‌بندی و ثبت‌نام، مستقیم با سهیل هماهنگ کن.",
    escalate: "registration",
  },
  {
    id: "complex-routing",
    title: "روتینگ صدا، استریم و ستاپ خاص",
    keywords: ["روتینگ", "routing", "استریم", "stream", "obs", "لایو اینستاگرام", "live اینستاگرام", "پخش زنده", "aggregate", "loopback", "دو لپ تاپ", "دو تا لپ تاپ", "b2b", "multi output", "ضبط ست", "record set", "کارت صدا خارجی", "audio interface"],
    intro: "چند نکته کلی برای روتینگ و استریم:",
    steps: [
      "**ضبط ساده ست:** اکثر نرم‌افزارها دکمه Record داخلی دارند (در Rekordbox و Serato)؛ ساده‌ترین و تمیزترین روش ضبط است.",
      "**استریم با OBS:** خروجی Master دستگاه را به یک کارت صدا بده و آن کارت صدا را در OBS به‌عنوان ورودی انتخاب کن.",
      "**مک:** برای ترکیب چند دستگاه صوتی از Aggregate Device در Audio MIDI Setup استفاده کن.",
      "**جلوگیری از اکو:** مانیتورینگ را فقط از یک مسیر انجام بده تا صدا دوبار پخش نشود.",
    ],
    outro: "ستاپ‌های روتینگ خاص به جزئیات دقیق تجهیزات بستگی دارند؛ برای راهنمایی دقیق، خلاصه را برای سهیل بفرست.",
    escalate: "routing",
  },
  {
    id: "beatmatching",
    title: "یادگیری بیت‌مچینگ",
    keywords: ["بیت مچ", "بیتمچ", "beatmatch", "beat match", "با گوش", "بدون سینک", "هماهنگ کردن دو آهنگ", "میکس کردن دو آهنگ"],
    intro: "بیت‌مچینگ با گوش مهم‌ترین مهارت پایه دی‌جی است. روش تمرین:",
    steps: [
      "**BPM نزدیک:** دو آهنگ با BPM نزدیک و ریتم ساده (مثلاً House با کیک چهارضرب) انتخاب کن.",
      "**هم‌زمان کردن ضرب اول:** آهنگ دوم را در هدفون روی ضرب اول Cue کن و دقیقاً روی ضرب اول میزان آهنگ اول رها کن.",
      "**تشخیص جلو یا عقب:** اگر کیک‌ها از هم فاصله می‌گیرند، گوش کن کدام جلوتر است و Tempo آهنگ دوم را کمی کم یا زیاد کن.",
      "**اصلاح لحظه‌ای:** با Jog Wheel (لبه کناری) اختلاف‌های کوچک را اصلاح کن.",
      "**تمرین منظم:** روزی ۱۵ تا ۲۰ دقیقه بدون نگاه کردن به صفحه و بدون Sync تمرین کن.",
    ],
    outro: "در [دوره DJing](/courses/djing) این مهارت قدم‌به‌قدم و با فیدبک تمرین می‌شود.",
  },
];
