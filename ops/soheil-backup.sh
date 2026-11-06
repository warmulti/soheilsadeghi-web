#!/usr/bin/env bash
# Daily backup of the database and uploads → /srv/soheil/backups (kept 14 days).
# Installed as /usr/local/bin/soheil-backup, run by /etc/cron.d/soheil-backup as user "soheil".
set -euo pipefail
umask 077  # backups contain password hashes — owner-only
APP=/srv/soheil/app
DEST=/srv/soheil/backups
STAMP=$(date +%Y%m%d-%H%M)
mkdir -p "$DEST"

# Consistent copy even while the site is running.
sqlite3 "$APP/data/soheil.db" ".backup '$DEST/soheil-$STAMP.db'"
gzip -f "$DEST/soheil-$STAMP.db"

dirs=()
for d in media files; do [ -d "$APP/$d" ] && dirs+=("$d"); done
[ ${#dirs[@]} -gt 0 ] && tar -C "$APP" -czf "$DEST/uploads-$STAMP.tar.gz" "${dirs[@]}"

find "$DEST" -type f -mtime +14 -delete
echo "backup ok: $DEST/soheil-$STAMP.db.gz"
