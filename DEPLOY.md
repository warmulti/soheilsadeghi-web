# سرور سایت — soheilsadeghi.com

سایت روی یک سرور **Ubuntu 24.04** (IP: `46.245.89.47`) اجرا می‌شود. این فایل توضیح می‌دهد چه چیزی کجاست و کارهای روزمره را چطور انجام دهید.
(راهنمای جایگزین برای هاست اشتراکی: [DEPLOY-CPANEL.md](DEPLOY-CPANEL.md))

## ساختار سرور

| بخش | جزئیات |
| --- | --- |
| برنامه | `/srv/soheil/app` — کپی همین مخزن GitHub، اجرا با کاربر سیستمی `soheil` |
| داده‌ها | `/srv/soheil/app/data` (پایگاه داده)، `media/` (تصاویر)، `files/` (فایل‌های دانلودی) |
| تنظیمات و رمزها | `/etc/soheil/site.env` (فقط root و کاربر soheil می‌خوانند) |
| سرویس | `soheil-site` (systemd) — Node.js 22، فقط روی `127.0.0.1:3000` |
| وب‌سرور | Nginx → HTTPS با گواهی Let's Encrypt (تمدید خودکار)؛ `www` و `http` به `https://soheilsadeghi.com` ریدایرکت می‌شوند |
| فایروال | UFW: فقط SSH، HTTP و HTTPS باز است. fail2ban جلوی حمله به SSH را می‌گیرد |
| ایمیل | Postfix + OpenDKIM، فقط برای ارسال و فقط از داخل خود سرور (`127.0.0.1`). جزئیات: بخش «ایمیل سایت» |
| پشتیبان | هر روز ساعت ۳:۳۰ UTC (۷ صبح تهران) در `/srv/soheil/backups` (۱۴ روز نگه داشته می‌شود) |

نسخه کامل همه فایل‌های تنظیمات سرور در پوشه [`ops/`](ops) همین مخزن است.

## به‌روزرسانی سایت بعد از تغییر کد

1. تغییرات را روی GitHub (شاخه `main`) push کنید.
2. با SSH وارد سرور شوید و اجرا کنید:

```bash
sudo soheil-update
```

این دستور به ترتیب: پشتیبان می‌گیرد ← کد را از GitHub می‌گیرد ← نصب و بیلد می‌کند ← سرویس را ری‌استارت می‌کند. حدود ۲–۳ دقیقه طول می‌کشد. تغییرات پایگاه داده (migration) خودکار اعمال می‌شود و محتوای پنل دست نمی‌خورد.

> ویرایش متن‌ها، دانلودها، هنرجوها و… نیازی به این کار ندارد؛ همه از پنل `/admin` انجام می‌شود و فوراً روی سایت است.

## دستورات کاربردی (روی سرور)

| کار | دستور |
| --- | --- |
| وضعیت سایت | `systemctl status soheil-site` |
| دیدن لاگ‌ها | `journalctl -u soheil-site -n 100 -f` |
| ری‌استارت | `sudo systemctl restart soheil-site` |
| پشتیبان فوری | `sudo -u soheil soheil-backup` |
| لیست پشتیبان‌ها | `ls -lh /srv/soheil/backups` |
| ویرایش تنظیمات (ایمیل، کلید AI…) | `sudo nano /etc/soheil/site.env` و بعد ری‌استارت |
| وضعیت گواهی SSL | `sudo certbot certificates` |
| وضعیت ایمیل و رکوردهای DNS | `sudo soheil-mail status` |
| ایمیل آزمایشی | `sudo soheil-mail test you@gmail.com` |
| روشن / خاموش کردن ایمیل سایت | `sudo soheil-mail on` / `sudo soheil-mail off` |
| آخرین ایمیل‌های ارسال‌شده | `sudo soheil-mail log` |

## تنظیمات اختیاری (`/etc/soheil/site.env`)

بعد از هر تغییر: `sudo systemctl restart soheil-site`. فهرست کامل و توضیح هر متغیر در [`.env.example`](.env.example) است.

- **ایمیل:** با `sudo soheil-mail on` تنظیم می‌شود (بخش بعد). مقصد اعلان‌ها: `NOTIFY_EMAIL` (پیش‌فرض: `ADMIN_EMAIL`).
- **چت هوشمند:** `ANTHROPIC_API_KEY` یا `GEMINI_API_KEY`.
- **پیامک (sms.ir):** برای اطلاع‌رسانی پیامکی ثبت‌نام هنرجو و درخواست تماس به موبایل سهیل. در پنل sms.ir کلید و شماره خط بگیرید و این سه مقدار را پر کنید: `SMSIR_API_KEY`، `SMSIR_LINE_NUMBER`، `SMS_NOTIFY_MOBILE` (موبایل گیرنده، مثل `09xxxxxxxxx`). خالی باشند، پیامک غیرفعال است.
- ⚠️ **تلگرام:** API تلگرام از این سرور مسدود است، پس اطلاع‌رسانی ربات تلگرام برای فرم تماس کار نمی‌کند. درخواست‌ها همیشه در پنل (بخش «درخواست‌ها») ذخیره می‌شوند؛ ایمیل و پیامک جایگزین آن هستند.

## پشتیبان دستی از پنل

در داشبورد پنل مدیریت (فقط برای مدیر کل) دو دکمه هست:

- **دانلود بکاپ کامل (zip):** پایگاه داده + تصاویر (`media`) + فایل‌های دانلودی (`files`).
- **دانلود بکاپ دیتابیس (zip):** فقط پایگاه داده.

نسخه پایگاه داده با روش `VACUUM INTO` گرفته می‌شود، پس حتی وقتی سایت در حال کار است هم سالم و یکپارچه است. این‌ها علاوه بر پشتیبان خودکار شبانه (`soheil-backup`) هستند. بکاپ شامل داده‌های حساس (از جمله هش رمز کاربران) است؛ جای امن نگه‌اش دارید.

## ایمیل سایت

سرور ایمیل خود سایت این ایمیل‌ها را می‌فرستد:

- لینک تأیید ایمیل بعد از ثبت‌نام هنرجو
- بازیابی رمز عبور
- خبر ثبت‌نام هنرجوی جدید و درخواست‌های فرم تماس، به ایمیل سهیل

همه ایمیل‌ها از آدرس `no-reply@soheilsadeghi.com` و به زبان بازدیدکننده ارسال می‌شوند.

**راه‌اندازی (یک بار):**

1. `sudo soheil-mail status` را اجرا کنید. چهار رکورد DNS را عیناً در Cloudflare اضافه کنید: **DNS → Records → Add record**، با Proxy status روی **DNS only**.
2. از پشتیبانی هاست (Asiatech) بخواهید **Reverse DNS (PTR)** آی‌پی `46.245.89.47` را روی `mail.soheilsadeghi.com` بگذارند.
3. چند دقیقه بعد دوباره `sudo soheil-mail status` را اجرا کنید تا همه موارد ✔ شوند. بعد بزنید `sudo soheil-mail test آدرس-جیمیل-خودتان`. باید `status=sent` ببینید.
4. `sudo soheil-mail on` را اجرا کنید. از این به بعد هنرجوی جدید باید ایمیلش را تأیید کند تا بتواند وارد شود.

**نکته‌ها:**

- **حساب‌های ساخته‌شده در پنل:** هنرجویی که مدیر در پنل می‌سازد نیازی به تأیید ندارد. مدیر می‌تواند هر حساب را دستی هم تأییدشده کند (تیک «تأیید شده» در صفحه کاربر).
- **وقتی ایمیل خاموش است** (`soheil-mail off`): ثبت‌نام بدون تأیید انجام می‌شود، ولی بازیابی رمز با ایمیل کار نمی‌کند.
- **اگر هنرجو ایمیل را نگرفت:** با ورود به حساب، لینک تأیید دوباره ارسال می‌شود (حداکثر هر ۱۰ دقیقه یک بار). پوشه اسپم را هم ببیند.
- **امنیت:** پورت ۲۵ در فایروال بسته است. سرور ایمیل فقط از داخل خود سرور ایمیل قبول می‌کند و راهی برای سوءاستفاده از بیرون ندارد.

## بازگردانی پشتیبان

```bash
sudo systemctl stop soheil-site
cd /srv/soheil/app
sudo -u soheil cp data/soheil.db data/soheil.db.before-restore
gunzip -c /srv/soheil/backups/soheil-YYYYMMDD-HHMM.db.gz | sudo -u soheil tee data/soheil.db >/dev/null
sudo -u soheil tar -xzf /srv/soheil/backups/uploads-YYYYMMDD-HHMM.tar.gz -C /srv/soheil/app
sudo systemctl start soheil-site
```

> پشتیبان‌ها روی همان سرور هستند؛ هر چند وقت یک بار پوشه `/srv/soheil/backups` را روی سیستم خودتان هم دانلود کنید (مثلاً با WinSCP).

## نصب از صفر روی یک سرور جدید (خلاصه)

```bash
apt-get install -y nodejs nginx certbot python3-certbot-nginx sqlite3 fail2ban   # Node 22 از deb.nodesource.com
useradd --system --create-home --home-dir /srv/soheil --shell /usr/sbin/nologin soheil
sudo -u soheil git clone https://github.com/warmulti/soheilsadeghi-web.git /srv/soheil/app
# /etc/soheil/site.env را از روی .env.example بسازید (SERVER_URL، PAYLOAD_SECRET، ADMIN_EMAIL، ADMIN_PASSWORD…)
sudo -u soheil bash -c 'cd /srv/soheil/app && set -a && . /etc/soheil/site.env && set +a && npm ci --include=dev && npx next build'
cp ops/soheil-site.service /etc/systemd/system/ && systemctl enable --now soheil-site
cp ops/nginx/soheilsadeghi.com.conf /etc/nginx/sites-available/ && cp ops/nginx/soheil-*.conf /etc/nginx/snippets/
certbot certonly --nginx -d soheilsadeghi.com -d www.soheilsadeghi.com --deploy-hook "systemctl reload nginx"
ln -s /etc/nginx/sites-available/soheilsadeghi.com /etc/nginx/sites-enabled/ && systemctl reload nginx
install -m 755 ops/soheil-backup.sh /usr/local/bin/soheil-backup && install -m 755 ops/soheil-update.sh /usr/local/bin/soheil-update
cp ops/cron.soheil-backup /etc/cron.d/soheil-backup
bash ops/mail/setup-mail.sh   # سرور ایمیل؛ رکوردهای DNS را چاپ می‌کند → بعد: soheil-mail on
ufw allow OpenSSH && ufw allow "Nginx Full" && ufw enable
```

برای انتقال داده‌ها از سرور قبلی، پوشه‌های `data/`، `media/` و `files/` را کپی کنید.
