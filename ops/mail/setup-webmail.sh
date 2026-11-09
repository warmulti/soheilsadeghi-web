#!/usr/bin/env bash
# Full webmail for soheilsadeghi.com — turns the send-only server into a receive + webmail server.
#
#   Postfix    now also RECEIVES mail for @soheilsadeghi.com and hands it to Dovecot (LMTP).
#              It is NOT an open relay: only this machine (127.0.0.1) and SASL-authenticated
#              submission clients may send onward; outside senders may only deliver to our domain.
#   Dovecot    stores mail in Maildirs and serves IMAP (webmail + phone apps).
#   Roundcube  the browser webmail at https://mail.soheilsadeghi.com.
#
# Mailboxes are managed with `soheil-webmail` (installed by this script). Safe to re-run.
#
#   sudo bash /srv/soheil/app/ops/mail/setup-webmail.sh
#
# Afterwards add ONE DNS record (printed at the end): MX  @  ->  mail.soheilsadeghi.com
set -euo pipefail

DOMAIN=soheilsadeghi.com
MAILHOST=mail.$DOMAIN
VMAIL=/var/mail/vhosts
CERT=/etc/letsencrypt/live/$MAILHOST
export DEBIAN_FRONTEND=noninteractive

echo "==> Installing packages (Dovecot, PHP, nginx already present)…"
apt-get update -qq
apt-get install -y -q dovecot-core dovecot-imapd dovecot-lmtpd \
  php-fpm php-mbstring php-xml php-intl php-gd php-zip php-curl php-sqlite3 php-bz2 \
  nginx certbot python3-certbot-nginx sqlite3 >/dev/null

# ── vmail user + storage ─────────────────────────────────────────────────────────────────────
getent group vmail >/dev/null || groupadd -g 5000 vmail
getent passwd vmail >/dev/null || useradd -g vmail -u 5000 vmail -d $VMAIL -m -s /usr/sbin/nologin
mkdir -p $VMAIL/$DOMAIN
chown -R vmail:vmail $VMAIL
chmod -R 770 $VMAIL
touch /etc/dovecot/users
chown root:dovecot /etc/dovecot/users
chmod 640 /etc/dovecot/users

# ── TLS certificate for mail.soheilsadeghi.com (needs the `mail` A record live) ───────────────
# A temporary HTTP vhost so certbot can validate, before the real webmail vhost is written.
cat >/etc/nginx/sites-available/$MAILHOST <<EOF
server {
  listen 80;
  listen [::]:80;
  server_name $MAILHOST;
  root /var/www/html;
  location /.well-known/acme-challenge/ { allow all; }
}
EOF
ln -sf /etc/nginx/sites-available/$MAILHOST /etc/nginx/sites-enabled/$MAILHOST
nginx -t && systemctl reload nginx
if [ ! -d "$CERT" ]; then
  certbot certonly --nginx -d $MAILHOST --non-interactive --agree-tos -m "admin@$DOMAIN" --deploy-hook "systemctl reload nginx postfix dovecot" || \
    echo "!! certbot failed — mail will run without TLS until the cert is issued (check the mail A record)."
fi
HAVE_CERT=no
[ -f "$CERT/fullchain.pem" ] && HAVE_CERT=yes

# ── Dovecot ──────────────────────────────────────────────────────────────────────────────────
# Use only the passwd-file (virtual users); never system/PAM accounts over IMAP.
sed -i 's|^!include auth-system.conf.ext|#!include auth-system.conf.ext|' /etc/dovecot/conf.d/10-auth.conf || true

cat >/etc/dovecot/local.conf <<EOF
# Managed by ops/mail/setup-webmail.sh
protocols = imap lmtp
mail_location = maildir:$VMAIL/%d/%n
mail_privileged_group = vmail
first_valid_uid = 5000
first_valid_gid = 5000
namespace inbox {
  inbox = yes
  mailbox Sent {
    special_use = \Sent
    auto = subscribe
  }
  mailbox Drafts {
    special_use = \Drafts
    auto = subscribe
  }
  mailbox Junk {
    special_use = \Junk
    auto = subscribe
  }
  mailbox Trash {
    special_use = \Trash
    auto = subscribe
  }
}
disable_plaintext_auth = yes
auth_mechanisms = plain login
!include_try /etc/dovecot/local-ssl.conf
passdb {
  driver = passwd-file
  args = scheme=BLF-CRYPT username_format=%u /etc/dovecot/users
}
userdb {
  driver = static
  args = uid=vmail gid=vmail home=$VMAIL/%d/%n
}
service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
  unix_listener auth-userdb {
    mode = 0600
    user = vmail
  }
}
service imap-login {
  inet_listener imap {
    port = 143
  }
  inet_listener imaps {
    port = 993
    ssl = yes
  }
}
EOF

if [ "$HAVE_CERT" = yes ]; then
  cat >/etc/dovecot/local-ssl.conf <<EOF
ssl = required
ssl_cert = <$CERT/fullchain.pem
ssl_key = <$CERT/privkey.pem
ssl_min_protocol = TLSv1.2
EOF
else
  echo "ssl = no" >/etc/dovecot/local-ssl.conf
fi
systemctl enable -q dovecot
systemctl restart dovecot

# ── Postfix: receive for the domain, deliver to Dovecot, keep send-only safety ────────────────
touch /etc/postfix/vmailbox
postmap /etc/postfix/vmailbox
postconf -e \
  "inet_interfaces = all" \
  "virtual_mailbox_domains = $DOMAIN" \
  "virtual_transport = lmtp:unix:private/dovecot-lmtp" \
  "virtual_mailbox_maps = hash:/etc/postfix/vmailbox" \
  "local_recipient_maps = \$virtual_mailbox_maps" \
  "smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination" \
  "smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination" \
  "smtpd_sasl_type = dovecot" \
  "smtpd_sasl_path = private/auth" \
  "smtpd_sasl_auth_enable = no" \
  "mailbox_size_limit = 0" \
  "virtual_mailbox_limit = 0"

if [ "$HAVE_CERT" = yes ]; then
  postconf -e \
    "smtpd_tls_cert_file = $CERT/fullchain.pem" \
    "smtpd_tls_key_file = $CERT/privkey.pem" \
    "smtpd_tls_security_level = may" \
    "smtp_tls_security_level = may"
fi

# Submission (587): authenticated sending for phone/desktop mail apps, over TLS only.
if ! grep -qE '^submission[[:space:]]+inet' /etc/postfix/master.cf; then
  cat >>/etc/postfix/master.cf <<EOF

submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_sasl_type=dovecot
  -o smtpd_sasl_path=private/auth
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
EOF
fi
systemctl restart postfix

# ── Firewall: open SMTP (25), submission (587), IMAPS (993) ────────────────────────────────────
ufw allow 25/tcp >/dev/null 2>&1 || true
ufw allow 587/tcp >/dev/null 2>&1 || true
ufw allow 993/tcp >/dev/null 2>&1 || true

# ── Roundcube (browser webmail) ───────────────────────────────────────────────────────────────
RC_DIR=/var/www/roundcube
if [ ! -f "$RC_DIR/index.php" ]; then
  echo "==> Downloading Roundcube…"
  url=$(curl -fsSL https://api.github.com/repos/roundcube/roundcubemail/releases/latest | grep -oE 'https://[^"]*-complete\.tar\.gz' | head -1)
  [ -n "$url" ] || { echo "Could not find the Roundcube download URL."; exit 1; }
  tmp=$(mktemp -d)
  curl -fsSL "$url" -o "$tmp/rc.tar.gz"
  mkdir -p "$RC_DIR"
  tar -xzf "$tmp/rc.tar.gz" -C "$tmp"
  cp -a "$tmp"/roundcubemail-*/. "$RC_DIR"/
  rm -rf "$tmp"
fi
mkdir -p /var/lib/roundcube "$RC_DIR/temp" "$RC_DIR/logs"
[ -f /var/lib/roundcube/roundcube.db ] || sqlite3 /var/lib/roundcube/roundcube.db < "$RC_DIR/SQL/sqlite.initial.sql"
chown -R www-data:www-data /var/lib/roundcube "$RC_DIR/temp" "$RC_DIR/logs"

if [ ! -f "$RC_DIR/config/config.inc.php" ]; then
  deskey=$(openssl rand -base64 24)
  cat >"$RC_DIR/config/config.inc.php" <<EOF
<?php
\$config = [];
\$config['db_dsnw'] = 'sqlite:////var/lib/roundcube/roundcube.db?mode=0640';
\$config['imap_host'] = 'ssl://$MAILHOST:993';
\$config['smtp_host'] = 'tls://$MAILHOST:587';
\$config['smtp_user'] = '%u';
\$config['smtp_pass'] = '%p';
\$config['support_url'] = '';
\$config['product_name'] = 'DJ Soheil Webmail';
\$config['des_key'] = '$deskey';
\$config['plugins'] = ['archive', 'zipdownload'];
\$config['skin'] = 'elastic';
\$config['enable_installer'] = false;
\$config['mail_domain'] = '$DOMAIN';
\$config['smtp_conn_options'] = ['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]];
\$config['imap_conn_options'] = ['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]];
EOF
  chown www-data:www-data "$RC_DIR/config/config.inc.php"
  chmod 640 "$RC_DIR/config/config.inc.php"
fi

# nginx vhost for the webmail (HTTPS when the cert exists)
PHPSOCK=$(ls /run/php/php*-fpm.sock 2>/dev/null | head -1)
if [ "$HAVE_CERT" = yes ]; then
  cat >/etc/nginx/sites-available/$MAILHOST <<EOF
server {
  listen 80; listen [::]:80; server_name $MAILHOST;
  location /.well-known/acme-challenge/ { root /var/www/html; allow all; }
  location / { return 301 https://\$host\$request_uri; }
}
server {
  listen 443 ssl http2; listen [::]:443 ssl http2;
  server_name $MAILHOST;
  ssl_certificate $CERT/fullchain.pem;
  ssl_certificate_key $CERT/privkey.pem;
  root $RC_DIR/public_html;
  index index.php;
  client_max_body_size 50m;
  add_header X-Frame-Options SAMEORIGIN;
  add_header X-Content-Type-Options nosniff;
  add_header Referrer-Policy strict-origin-when-cross-origin;
  location ~ ^/(config|temp|logs|SQL|bin|vendor|composer\.|CHANGELOG|INSTALL|LICENSE|README|UPGRADING)/? { deny all; }
  location ~ ^/(\.|installer) { deny all; }
  location / { try_files \$uri \$uri/ /index.php?\$query_string; }
  location ~ \.php(/|\$) {
    fastcgi_split_path_info ^(.+?\.php)(/.*)\$;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    fastcgi_param PATH_INFO \$fastcgi_path_info;
    fastcgi_pass unix:$PHPSOCK;
  }
}
EOF
  nginx -t && systemctl reload nginx
fi

# ── fail2ban: protect the newly-exposed IMAP/SMTP auth from brute force ────────────────────────
if [ -d /etc/fail2ban ]; then
  cat >/etc/fail2ban/jail.d/soheil-mail.local <<'EOF'
[dovecot]
enabled = true
maxretry = 5
bantime = 1h
[postfix-sasl]
enabled = true
maxretry = 5
bantime = 1h
EOF
  systemctl restart fail2ban 2>/dev/null || true
fi

# ── soheil-webmail management command ─────────────────────────────────────────────────────────
install -m 755 "$(dirname "$(readlink -f "$0")")/soheil-webmail.sh" /usr/local/bin/soheil-webmail

echo
echo "==> Webmail stack installed."
echo "   Dovecot: $(systemctl is-active dovecot)  Postfix: $(systemctl is-active postfix)  nginx: $(systemctl is-active nginx)  TLS: $HAVE_CERT"
echo
echo "NEXT:"
echo "  1) Cloudflare → DNS → add:  Type MX   Name @   Mail server mail.$DOMAIN   Priority 10   (DNS only)"
echo "  2) Create a mailbox:        sudo soheil-webmail add info"
echo "  3) Open the webmail:        https://$MAILHOST   (log in as info@$DOMAIN)"
