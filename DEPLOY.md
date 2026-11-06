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

## تنظیمات اختیاری (`/etc/soheil/site.env`)

بعد از هر تغییر: `sudo systemctl restart soheil-site`. فهرست کامل و توضیح هر متغیر در [`.env.example`](.env.example) است.

- **ایمیل بازیابی رمز:** `SMTP_HOST`، `SMTP_PORT`، `SMTP_USER`، `SMTP_PASS`، `SMTP_FROM` (مثلاً ایمیل Gmail با App Password یا هر سرویس SMTP).
- **چت هوشمند:** `ANTHROPIC_API_KEY` یا `GEMINI_API_KEY`.
- ⚠️ **تلگرام:** API تلگرام از این سرور مسدود است، پس اطلاع‌رسانی ربات تلگرام برای فرم تماس کار نمی‌کند. درخواست‌ها همیشه در پنل (بخش «درخواست‌ها») ذخیره می‌شوند.

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
sudo -u soheil bash -c 'cd /srv/soheil/app && set -a && . /etc/soheil/site.env && set +a && npm ci && npx next build'
cp ops/soheil-site.service /etc/systemd/system/ && systemctl enable --now soheil-site
cp ops/nginx/soheilsadeghi.com.conf /etc/nginx/sites-available/ && cp ops/nginx/soheil-*.conf /etc/nginx/snippets/
certbot certonly --nginx -d soheilsadeghi.com -d www.soheilsadeghi.com --deploy-hook "systemctl reload nginx"
ln -s /etc/nginx/sites-available/soheilsadeghi.com /etc/nginx/sites-enabled/ && systemctl reload nginx
install -m 755 ops/soheil-backup.sh /usr/local/bin/soheil-backup && install -m 755 ops/soheil-update.sh /usr/local/bin/soheil-update
cp ops/cron.soheil-backup /etc/cron.d/soheil-backup
ufw allow OpenSSH && ufw allow "Nginx Full" && ufw enable
```

برای انتقال داده‌ها از سرور قبلی، پوشه‌های `data/`، `media/` و `files/` را کپی کنید.
