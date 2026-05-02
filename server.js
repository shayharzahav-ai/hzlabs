const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the same directory as nginx
app.use(express.static('/usr/share/nginx/html'));

// SMTP transporter using your hosting provider's mail server
// For most shared hosting (cPanel/Plesk), use these settings:
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.har-zahav.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'labs@har-zahav.com',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, organization, email, budget, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const mailOptions = {
      from: `"HZ Labs Contact Form" <labs@har-zahav.com>`,
      to: 'labs@har-zahav.com',
      replyTo: email,
      subject: `פנייה חדשה מהאתר — ${name}${organization ? ` (${organization})` : ''}`,
      text: `
שם: ${name}
ארגון: ${organization || '—'}
אימייל: ${email}
תקציב: ${budget || '—'}

תיאור הפרויקט:
${message}
      `,
      html: `
<div dir="rtl" style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #D49A3E;">פנייה חדשה מהאתר</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">שם:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">ארגון:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(organization || '—')}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">אימייל:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(email)}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">תקציב:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(budget || '—')}</td></tr>
  </table>
  <h3 style="margin-top: 24px;">תיאור הפרויקט:</h3>
  <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 4px;">${escapeHtml(message)}</p>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Contact form server running on port ${PORT}`);
});
