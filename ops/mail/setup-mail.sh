#!/usr/bin/env bash
# Send-only mail server for soheilsadeghi.com.
#
#   Postfix   accepts mail only from this machine (127.0.0.1) and delivers it straight to the
#             recipient's mail server (Gmail, Yahoo, Outlook…) over IPv4.
#   OpenDKIM  signs every message from @soheilsadeghi.com so receivers can trust it.
#
# Nothing listens on the internet: port 25 stays closed in the firewall, so the server can't be
# used as an open relay. Safe to re-run; the DKIM key is created only once.
#
#   sudo bash /srv/soheil/app/ops/mail/setup-mail.sh
#
# Prints the DNS records to add at the end; afterwards `sudo soheil-mail status` shows them again.
set -euo pipefail

DOMAIN=soheilsadeghi.com
MAILHOST=mail.$DOMAIN
SELECTOR=mail
KEYDIR=/etc/opendkim/keys/$DOMAIN

export DEBIAN_FRONTEND=noninteractive
debconf-set-selections <<EOF
postfix postfix/main_mailer_type select Internet Site
postfix postfix/mailname string $MAILHOST
EOF
apt-get install -y -q postfix opendkim opendkim-tools >/dev/null

echo "$MAILHOST" >/etc/mailname

# --- Postfix -------------------------------------------------------------------------------------
postconf -e \
  "myhostname = $MAILHOST" \
  "mydomain = $DOMAIN" \
  "myorigin = \$myhostname" \
  "mydestination = \$myhostname, localhost.\$mydomain, localhost" \
  "inet_interfaces = loopback-only" \
  "inet_protocols = ipv4" \
  "mynetworks = 127.0.0.0/8" \
  "relayhost =" \
  "smtpd_relay_restrictions = permit_mynetworks, reject" \
  "smtpd_recipient_restrictions = permit_mynetworks, reject" \
  "smtpd_tls_security_level = none" \
  "smtp_tls_security_level = may" \
  "smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt" \
  "smtp_tls_loglevel = 1" \
  "smtpd_banner = \$myhostname ESMTP" \
  "disable_vrfy_command = yes" \
  "message_size_limit = 10485760" \
  "maximal_queue_lifetime = 2d" \
  "bounce_queue_lifetime = 2d" \
  "milter_protocol = 6" \
  "milter_default_action = accept" \
  "smtpd_milters = inet:127.0.0.1:8891" \
  "non_smtpd_milters = inet:127.0.0.1:8891"

# --- OpenDKIM ------------------------------------------------------------------------------------
mkdir -p "$KEYDIR"
if [ ! -f "$KEYDIR/$SELECTOR.private" ]; then
  opendkim-genkey -b 2048 -h sha256 -d "$DOMAIN" -s "$SELECTOR" -D "$KEYDIR"
fi
chown -R opendkim:opendkim /etc/opendkim/keys
chmod 700 "$KEYDIR"
chmod 600 "$KEYDIR/$SELECTOR.private"

cat >/etc/opendkim.conf <<EOF
# Managed by ops/mail/setup-mail.sh
Syslog                  yes
SyslogSuccess           yes
UMask                   007
UserID                  opendkim
PidFile                 /run/opendkim/opendkim.pid
Mode                    s
Canonicalization        relaxed/simple
Domain                  $DOMAIN
Selector                $SELECTOR
KeyFile                 $KEYDIR/$SELECTOR.private
Socket                  inet:8891@127.0.0.1
InternalHosts           127.0.0.1
OversignHeaders         From
SignatureAlgorithm      rsa-sha256
EOF

# Bounces and replies to the no-reply sender have no mailbox to go to: drop them quietly.
printf 'no-reply@%s discard:no-reply address\n' "$DOMAIN" >/etc/postfix/transport
postmap /etc/postfix/transport
postconf -e "transport_maps = hash:/etc/postfix/transport"

systemctl enable -q opendkim postfix
systemctl restart opendkim
systemctl restart postfix
postqueue -f # re-route anything already waiting

# --- Admin command -------------------------------------------------------------------------------
install -m 755 "$(dirname "$(readlink -f "$0")")/soheil-mail.sh" /usr/local/bin/soheil-mail
rm -f /usr/local/bin/soheil-mail-dns

echo
/usr/local/bin/soheil-mail status
