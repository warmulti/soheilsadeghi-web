#!/usr/bin/env bash
# soheil-webmail — manage mailboxes for the webmail (installed to /usr/local/bin/soheil-webmail).
#
#   sudo soheil-webmail add <name> [password]   create a mailbox (name or name@soheilsadeghi.com)
#   sudo soheil-webmail passwd <name> [password] change its password
#   sudo soheil-webmail del <name>               remove the mailbox (its stored mail is kept on disk)
#   sudo soheil-webmail list                     list mailboxes
#   sudo soheil-webmail status                   services + the DNS record the webmail needs
set -euo pipefail

DOMAIN=soheilsadeghi.com
USERS=/etc/dovecot/users
VMAILBOX=/etc/postfix/vmailbox
VMAIL=/var/mail/vhosts

addr() { case "$1" in *@*) echo "$1";; *) echo "$1@$DOMAIN";; esac; }
local_part() { echo "${1%@*}"; }

# openssl|tr|cut avoids the classic `… | head -c` SIGPIPE that aborts under `set -o pipefail`.
gen_pw() { openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | cut -c1-14; }

set_password() {
  local email=$1 pass=$2 hash
  hash=$(doveadm pw -s BLF-CRYPT -p "$pass")
  # replace existing line or append
  if grep -q "^$email:" "$USERS" 2>/dev/null; then
    sed -i "s|^$email:.*|$email:$hash|" "$USERS"
  else
    echo "$email:$hash" >>"$USERS"
  fi
  chown root:dovecot "$USERS"; chmod 640 "$USERS"
}

cmd_add() {
  local email user pass
  email=$(addr "$1"); user=$(local_part "$email")
  [ -n "${user:-}" ] || { echo "usage: soheil-webmail add <name> [password]"; exit 1; }
  if grep -q "^$email:" "$USERS" 2>/dev/null; then echo "Mailbox $email already exists. Use 'passwd' to change it."; exit 1; fi
  pass=${2:-$(gen_pw)}
  set_password "$email" "$pass"
  grep -q "^$email" "$VMAILBOX" 2>/dev/null || echo "$email	$DOMAIN/$user/" >>"$VMAILBOX"
  postmap "$VMAILBOX"
  install -d -o vmail -g vmail -m 700 "$VMAIL/$DOMAIN/$user"/{cur,new,tmp}
  echo "✔ Mailbox created:  $email"
  if [ -z "${2:-}" ]; then echo "  Password: $pass"; echo "  (save it now — it isn't stored anywhere in readable form)"; fi
  echo "  Webmail: https://mail.$DOMAIN"
}

cmd_passwd() {
  local email; email=$(addr "$1")
  grep -q "^$email:" "$USERS" 2>/dev/null || { echo "No such mailbox: $email"; exit 1; }
  local pass=${2:-$(gen_pw)}
  set_password "$email" "$pass"
  echo "✔ Password changed for $email"
  [ -z "${2:-}" ] && echo "  New password: $pass"
}

cmd_del() {
  local email user; email=$(addr "$1"); user=$(local_part "$email")
  sed -i "\|^$email:|d" "$USERS"
  sed -i "\|^$email[[:space:]]|d" "$VMAILBOX"
  postmap "$VMAILBOX"
  echo "✔ Mailbox $email removed. Its stored mail is still on disk at $VMAIL/$DOMAIN/$user (delete it manually if you want)."
}

cmd_list() {
  if [ -s "$VMAILBOX" ]; then echo "Mailboxes:"; awk '{print "  " $1}' "$VMAILBOX"; else echo "No mailboxes yet. Create one: sudo soheil-webmail add info"; fi
}

cmd_status() {
  echo "Services:  dovecot $(systemctl is-active dovecot)   postfix $(systemctl is-active postfix)   nginx $(systemctl is-active nginx)"
  echo
  echo "DNS — add in Cloudflare → DNS → Records (Proxy status: DNS only):"
  echo "   Type MX   Name @   Mail server mail.$DOMAIN   Priority 10"
  if dig +short @1.1.1.1 MX "$DOMAIN" | grep -q "mail.$DOMAIN"; then echo "   ✔ MX live"; else echo "   ✘ MX not found yet (mail can't be received until it is)"; fi
  echo
  cmd_list
}

case "${1:-status}" in
  add)    shift; cmd_add "$@";;
  passwd) shift; cmd_passwd "$@";;
  del)    shift; cmd_del "$@";;
  list)   cmd_list;;
  status) cmd_status;;
  *) sed -n '3,9p' "$0" | sed 's/^# \{0,1\}//'; exit 1;;
esac
