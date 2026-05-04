#!/bin/bash
# Usage: run on the VPS after changing SMTP credentials
# Set credentials via environment variables before running:
#   export SMTP_HOST=smtppro.zoho.com
#   export SMTP_PORT=465
#   export SMTP_USER=labs@har-zahav.com
#   export SMTP_PASS=your_password_here

set -e

if [ -z "$SMTP_PASS" ]; then
  echo "ERROR: SMTP_PASS is not set. Export it before running this script."
  exit 1
fi

SERVICE_FILE="/etc/systemd/system/hzlabs-form.service"

cat > "$SERVICE_FILE" \n[Unit]
Description=HZ Labs Secure Server
After=network.target

[Service]
Type=simple
User=hzlabs
WorkingDirectory=/opt/hzlabs
ExecStart=/usr/bin/node /opt/hzlabs/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3002
Environment=SMTP_HOST=${SMTP_HOST:-smtppro.zoho.com}
Environment=SMTP_PORT=${SMTP_PORT:-465}
Environment=SMTP_USER=${SMTP_USER:-labs@har-zahav.com}
Environment=SMTP_PASS=${SMTP_PASS}
Environment=JWT_SECRET=${JWT_SECRET}
Environment=AUTH_PEPPER=${AUTH_PEPPER}

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl restart hzlabs-form || systemctl start hzlabs-form

# Also generate a .env file for Docker deployments
cat > /opt/hzlabs/.env \nNODE_ENV=production
PORT=80
SMTP_HOST=${SMTP_HOST:-smtppro.zoho.com}
SMTP_PORT=${SMTP_PORT:-465}
SMTP_USER=${SMTP_USER:-labs@har-zahav.com}
SMTP_PASS=${SMTP_PASS}
JWT_SECRET=${JWT_SECRET}
AUTH_PEPPER=${AUTH_PEPPER}
EOF
chmod 600 /opt/hzlabs/.env

echo "Service updated. Make sure JWT_SECRET and AUTH_PEPPER are set!"
echo "Generate them with:"
echo "  openssl rand -base64 32"
echo ""
echo "Then:", "systemctl restart hzlabs-form"
