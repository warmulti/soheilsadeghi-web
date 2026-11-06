#!/usr/bin/env bash
# Pull the latest code from GitHub, rebuild and restart. Run as root:  sudo soheil-update
# Database migrations run automatically when the site starts. Data in data/, media/ and files/
# is untouched (ignored by git).
#
# If the install or build fails, the previous build is put back and the running site is left
# alone, so a broken update never takes the site down.
set -euo pipefail
cd /srv/soheil/app
LOG=/srv/soheil/last-build.log

sudo -u soheil /usr/local/bin/soheil-backup
sudo -u soheil git pull --ff-only

sudo -u soheil rm -rf .next.prev
[ -d .next ] && sudo -u soheil cp -a .next .next.prev

echo "Installing and building (2–3 minutes)… full log: $LOG"
# site.env sets NODE_ENV=production; --include=dev keeps the build tools (Tailwind, TypeScript).
if ! sudo -u soheil bash -c 'set -a; . /etc/soheil/site.env; set +a; npm ci --include=dev --no-audit --no-fund && npx next build' >"$LOG" 2>&1; then
  echo "✗ Build failed — the site keeps running the previous version."
  grep -m 6 -E "Error|ERR!" "$LOG" || tail -n 20 "$LOG"
  if [ -d .next.prev ]; then
    sudo -u soheil rm -rf .next
    sudo -u soheil mv .next.prev .next
  fi
  exit 1
fi
sudo -u soheil rm -rf .next.prev

systemctl restart soheil-site
for _ in $(seq 1 40); do
  curl -fsS -o /dev/null -H "Host: soheilsadeghi.com" http://127.0.0.1:3000/ 2>/dev/null && break
  sleep 1
done
if curl -fsS -o /dev/null -H "Host: soheilsadeghi.com" http://127.0.0.1:3000/; then
  echo "✓ site is up — $(sudo -u soheil git log -1 --format='%h %s')"
else
  echo "✗ the site is not answering — see: journalctl -u soheil-site -n 50"
  exit 1
fi
