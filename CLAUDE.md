# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HZ Labs company website — static HTML pages, no build system. Open files directly in a browser to preview.

## Structure

- `landing_page.html` — main marketing site (Hebrew RTL, single-page with anchored sections)
- `customers.html` — customer portal with client-side login and dashboard
- `hz_labs_logo_futuristic.svg` — standalone logo asset

## Architecture Notes

**All CSS and JavaScript are embedded inline** within each HTML file — there are no separate `.css` or `.js` files.

**Theme system**: CSS custom properties defined on `:root`, overridden by `[data-theme="dark"]`. Theme is persisted to `localStorage` under key `hzlabs-theme`. Default is `dark`.

**Layout**: Hebrew RTL (`lang="he" dir="rtl"`). Primary font is Heebo (Hebrew), with Space Grotesk for English/branding elements — both loaded from Google Fonts.

**Customer portal auth** (`customers.html`): Authentication is entirely client-side. Customer records (name, password, URLs) are stored as a plain JavaScript object in the `<script>` block. Session state is kept in `sessionStorage` under key `hzlabs-customer`. To add a customer, add an entry to the `customers` object in that script block.

## Design Tokens

Accent color palette (cyan/teal family):
- Light mode primary: `#0e7490`
- Dark mode primary: `#22d3ee`
- Gradient: `135deg, #22d3ee → #06b6d4 → #0891b2`

Contact email: `contact@hzlabs.io`

## Deployment

**Live URL**: https://harzahav.online  
**VPS IP**: `76.13.130.45` — SSH as `root`  
**Deploy path**: `/opt/hzlabs/` on the VPS

### Docker

The site runs as a Docker container (`hzlabs-web`) serving static files via nginx on internal port 8085.

```bash
# Rebuild and redeploy (run on VPS or via sshpass)
cd /opt/hzlabs
docker build -t hzlabs-web .
docker rm -f hzlabs-web
docker run -d --name hzlabs-web --restart unless-stopped -p 127.0.0.1:8085:80 hzlabs-web
```

To deploy local changes to VPS:
```bash
sshpass -p '<password>' scp -o PubkeyAuthentication=no -o StrictHostKeyChecking=no \
  landing_page.html customers.html hz_labs_logo_futuristic.svg logo-L.avif tahatzomot.avif \
  root@76.13.130.45:/opt/hzlabs/
# Then SSH in and rebuild (see above)
```

### nginx (host)

Config file: `/etc/nginx/sites-enabled/harzahav`  
Proxies `harzahav.online` → `127.0.0.1:8085`  
After editing: `pkill -HUP nginx`

### SSL

Certificate: `/etc/letsencrypt/live/harzahav.online/` (Let's Encrypt, auto-renews)  
Covers: `harzahav.online` and `www.harzahav.online`

### Customer site files

`Educare.html` and `tahatzomot.html` are served from the same container, copied from the `design-proposals` container on the VPS. Available at:
- https://harzahav.online/Educare.html
- https://harzahav.online/tahatzomot.html
