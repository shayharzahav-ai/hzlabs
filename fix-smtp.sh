#!/bin/bash
sed -i 's|Environment=SMTP_HOST=.*|Environment=SMTP_HOST=smtppro.zoho.com|' /etc/systemd/system/hzlabs-form.service
sed -i 's|Environment=SMTP_PORT=.*|Environment=SMTP_PORT=465|' /etc/systemd/system/hzlabs-form.service
sed -i '/Environment=SMTP_PASS=/d' /etc/systemd/system/hzlabs-form.service
sed -i '/Environment=SMTP_USER/a Environment=SMTP_PASS=Dandan44!' /etc/systemd/system/hzlabs-form.service
systemctl daemon-reload
systemctl restart hzlabs-form
