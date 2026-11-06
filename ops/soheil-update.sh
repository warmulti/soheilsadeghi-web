#!/usr/bin/env bash
# Pull the latest code from GitHub, rebuild and restart. Run as root:  sudo soheil-update
# Database migrations run automatically when the site starts. Data in data/, media/ and files/
# is untouched (ignored by git).
set -euo pipefail
cd /srv/soheil/app
sudo -u soheil /usr/local/bin/soheil-backup
sudo -u soheil git pull --ff-only
sudo -u soheil bash -c 'set -a; . /etc/soheil/site.env; set +a; npm ci --no-audit --no-fund && npx next build'
systemctl restart soheil-site
sleep 5
curl -fsS -o /dev/null -H "Host: soheilsadeghi.com" http://127.0.0.1:3000/ && echo "✓ site is up — $(sudo -u soheil git log -1 --format='%h %s')"
