#!/usr/bin/env bash
# soheil-mail — the site's email in one command (installed to /usr/local/bin/soheil-mail).
#
#   sudo soheil-mail status          DNS records the mail server needs, and whether the site sends email
#   sudo soheil-mail test ADDRESS    sends a test email and shows the receiving server's answer
#   sudo soheil-mail on | off        site email on/off (sign-up confirmation, password reset, notifications)
#   sudo soheil-mail log             the latest deliveries
set -euo pipefail

DOMAIN=soheilsadeghi.com
ENV=/etc/soheil/site.env
MAILLOG=/var/log/mail.log

ip4() { ip -4 route get 1.1.1.1 | awk '{for (i = 1; i <= NF; i++) if ($i == "src") print $(i + 1)}'; }
live() { if dig +short @1.1.1.1 "$2" "$1" | tr -d '"' | grep -q -- "$3"; then echo "   ✔ live"; else echo "   ✘ not found yet"; fi; }

status() {
  local ip dkim ptr
  ip=$(ip4)
  dkim=$(sed -e 's/^[^(]*(//' -e 's/).*$//' "/etc/opendkim/keys/$DOMAIN/mail.txt" | tr -d '\n\t" ')
  echo "DNS records — Cloudflare → DNS → Records → Add record (Proxy status: DNS only):"
  echo
  echo "1) Type A    Name: mail             Content: $ip";                         live "mail.$DOMAIN" A "$ip"
  echo "2) Type TXT  Name: @                Content: v=spf1 ip4:$ip ~all";         live "$DOMAIN" TXT "v=spf1"
  echo "3) Type TXT  Name: mail._domainkey  Content: $dkim";                       live "mail._domainkey.$DOMAIN" TXT "v=DKIM1"
  echo "4) Type TXT  Name: _dmarc           Content: v=DMARC1; p=quarantine; adkim=r; aspf=r"; live "_dmarc.$DOMAIN" TXT "v=DMARC1"
  echo
  ptr=$(dig +short @1.1.1.1 -x "$ip")
  echo "5) Reverse DNS (PTR), set by the hosting provider: $ip → mail.$DOMAIN"
  if [ "$ptr" = "mail.$DOMAIN." ]; then echo "   ✔ live"; else echo "   ✘ currently: ${ptr:-none}"; fi
  echo
  echo "Mail server: postfix $(systemctl is-active postfix), opendkim $(systemctl is-active opendkim)"
  if grep -q '^SMTP_HOST=' "$ENV"; then echo "Site email:  ON"; else echo "Site email:  OFF — turn on with: sudo soheil-mail on"; fi
}

set_key() {
  if grep -qE "^#? ?$1=" "$ENV"; then sed -i -E "s|^#? ?$1=.*|$1=$2|" "$ENV"; else echo "$1=$2" >>"$ENV"; fi
}

turn_on() {
  set_key SMTP_HOST 127.0.0.1
  set_key SMTP_PORT 25
  set_key SMTP_FROM "no-reply@$DOMAIN"
  systemctl restart soheil-site
  echo "Site email is ON: sign-up confirmation, password reset and notifications are sent."
  echo "Notifications go to NOTIFY_EMAIL (or ADMIN_EMAIL) in $ENV."
}

turn_off() {
  sed -i -E 's/^SMTP_HOST=/# SMTP_HOST=/' "$ENV"
  systemctl restart soheil-site
  echo "Site email is OFF: new accounts no longer need email confirmation; password reset by email is unavailable."
}

send_test() {
  local to=$1 start line=""
  start=$(($(wc -l <"$MAILLOG") + 1))
  printf 'From: DJ Soheil <no-reply@%s>\nTo: %s\nSubject: Test email — %s\nMIME-Version: 1.0\nContent-Type: text/plain; charset=utf-8\nContent-Transfer-Encoding: 8bit\n\nThis is a test email from the %s mail server.\nاین یک ایمیل آزمایشی از سرور ایمیل سایت است.\n' \
    "$DOMAIN" "$to" "$DOMAIN" "$DOMAIN" | /usr/sbin/sendmail -f "no-reply@$DOMAIN" "$to"
  echo "Sent to $to — waiting for the receiving server's answer…"
  for _ in $(seq 1 40); do
    line=$(tail -n +"$start" "$MAILLOG" | grep -F "to=<$to>" | grep "status=" | tail -1 || true)
    [ -n "$line" ] && break
    sleep 1
  done
  if [ -z "$line" ]; then echo "No answer yet. Check later with: sudo soheil-mail log"; return; fi
  echo "$line" | sed -E 's/.*status=/status=/'
  case "$line" in
    *status=sent*) echo "✔ Delivered. If it isn't in the inbox, check the spam folder." ;;
    *) echo "✘ Not delivered — the reason is above. Check the DNS records with: sudo soheil-mail status" ;;
  esac
}

case "${1:-status}" in
  status) status ;;
  on) turn_on ;;
  off) turn_off ;;
  test) [ -n "${2:-}" ] || { echo "usage: soheil-mail test you@example.com"; exit 1; }; send_test "$2" ;;
  log) grep -E "status=" "$MAILLOG" | tail -n 15 ;;
  *) sed -n '3,8p' "$0" | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
