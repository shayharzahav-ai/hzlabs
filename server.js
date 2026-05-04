const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_PEPPER = process.env.AUTH_PEPPER;
const SMTP_HOST = process.env.SMTP_HOST || 'smtppro.zoho.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || 'labs@har-zahav.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const ORIGIN = 'https://harzahav.online';

// ── Startup checks ─────────────────────────────────────────────────
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET must be set and at least 32 chars');
  process.exit(1);
}
if (!AUTH_PEPPER || AUTH_PEPPER.length < 32) {
  console.error('FATAL: AUTH_PEPPER must be set and at least 32 chars');
  process.exit(1);
}

// ── Customer credentials (PBKDF2-HMAC-SHA256, 100k iterations) ─────
const CUSTOMERS = {
  educare: {
    hash: '4JEoApL8pJ7mZfA/OAjz0Z6nLROdUlxhdNlx7CosUI0=',
    name: 'המרכז לחינוך קשוב ואכפתי',
    siteUrl: 'https://harzahav.online/Educare.html',
    proposalUrl: 'educare-proposal-short.pdf',
    appendixUrl: 'educare-proposal-full.pdf',
    logoUrl: 'logo-L.avif',
  },
  taatzumot: {
    hash: 'z5+zylaTlciiy91S8jgTr+uqXoF4V3BA0BfqvxUjW68=',
    name: 'תעצומות',
    siteUrl: 'https://harzahav.online/tahatzomot.html',
    proposalUrl: 'taatzumot-proposal-short.pdf',
    appendixUrl: 'taatzumot-proposal-full.pdf',
    logoUrl: 'tahatzomot.avif',
  },
  shutafimlamasa: {
    hash: 'aUz7E7liE/arfnFNp8hrD8GI+4DR7jIdRlyP2qQ6rbA=',
    name: 'שותפים למסע',
    siteUrl: 'https://shutafimlamasa.online',
    siteUrl2: 'https://shutafimlamasa.cloud',
    proposalUrl: '#',
    appendixUrl: '#',
  },
  hokhmat: {
    hash: 'fBj6/0Uu6lj8N7QYohNP7+0J9GP3mLh+I8ubJ/W/QvY=',
    name: 'חוכמת ההזדקנות',
    siteUrl: '#',
    proposalUrl: 'hokhmat-hazdaknut-proposal.pdf',
    appendixUrl: 'hokhmat-hazdaknut-proposal-full.pdf',
  },
};

// ── Static file cache ──────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

// ── Rate limiter (simple in-memory per IP) ─────────────────────────
const RATE_LIMITS = {};
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX_CONTACT = 5;  // max /api/contact per hour per IP
const RATE_MAX_AUTH = 20;    // max /api/auth per hour per IP
function checkRateLimit(ip, key, max, clear) {
  const now = Date.now();
  const bucket = RATE_LIMITS[ip + ':' + key] || { count: 0, reset: now + RATE_WINDOW_MS };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + RATE_WINDOW_MS;
  }
  bucket.count++;
  RATE_LIMITS[ip + ':' + key] = bucket;
  if (bucket.count > max) return false;
  return true;
}
setInterval(() => {
  const now = Date.now();
  for (const k in RATE_LIMITS) {
    if (RATE_LIMITS[k].reset < now - RATE_WINDOW_MS) delete RATE_LIMITS[k];
  }
}, 5 * 60 * 1000);

// ── Security headers ───────────────────────────────────────────────
function setSecurityHeaders(res) {
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https://harzahav.online https://*.googleusercontent.com; " +
    "connect-src 'self' https://harzahav.online; " +
    "frame-src https://shutafimlamasa.online https://shutafimlamasa.cloud https://harzahav.online; " +
    "object-src 'none'; base-uri 'self'; form-action 'self';"
  );
}

// ── CORS ───────────────────────────────────────────────────────────
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin === ORIGIN || origin === 'https://www.harzahav.online') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
}

// ── JWT helpers ────────────────────────────────────────────────────
function signJWT(payload, expiresInSeconds = 3600) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  }));
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest('base64url');
  return header + '.' + body + '.' + sig;
}
function verifyJWT(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}
function base64url(str) {
  return Buffer.from(str).toString('base64url');
}

// ── Password verification ──────────────────────────────────────────
function verifyPassword(key, password) {
  const expected = CUSTOMERS[key]?.hash;
  if (!expected) return false;
  const salt = Buffer.from(key);
  const pepper = Buffer.from(AUTH_PEPPER);
  const dk = crypto.pbkdf2Sync(password, Buffer.concat([salt, pepper]), 100000, 32, 'sha256');
  return crypto.timingSafeEqual(Buffer.from(expected, 'base64'), dk);
}

// ── Email validation ───────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function normalizeReplyTo(email) {
  return email.replace(/[\r\n\0]/g, '');
}

// ── Escape HTML ────────────────────────────────────────────────────
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Send email via raw SMTP ────────────────────────────────────────
async function sendEmail({ name, email, replyTo, subject, textBody, htmlBody }) {
  return new Promise((resolve, reject) => {
    const client = require('net').connect({ host: SMTP_HOST, port: SMTP_PORT });
    let step = 0;
    const base64 = (s) => Buffer.from(s).toString('base64');
    const send = (cmd) => client.write(cmd + '\r\n');

    client.on('connect', () => {
      if (SMTP_PORT === 465) {
        const tls = require('tls');
        const secureClient = tls.connect({ socket: client, servername: SMTP_HOST, rejectUnauthorized: true });
        handleSmtp(secureClient);
      } else {
        handleSmtp(client);
      }
    });

    function handleSmtp(sock) {
      sock.setEncoding('utf8');
      const sendLine = (line) => sock.write(line + '\r\n');
      const flushData = () => {
        const mimeBoundary = '----HZLabsForm' + Date.now();
        const data = [
          'MIME-Version: 1.0',
          `From: "HZ Labs Contact Form" <${SMTP_USER}>`,
          `To: ${SMTP_USER}`,
          `Reply-To: ${normalizeReplyTo(replyTo)}`,
          `Subject: =?UTF-8?B?${base64(subject)}?=?`,
          `Content-Type: multipart/alternative; boundary="${mimeBoundary}"`,
          '',
          `--${mimeBoundary}`,
          'Content-Type: text/plain; charset=utf-8',
          'Content-Transfer-Encoding: base64',
          '',
          base64(textBody),
          '',
          `--${mimeBoundary}`,
          'Content-Type: text/html; charset=utf-8',
          'Content-Transfer-Encoding: base64',
          '',
          base64(htmlBody),
          '',
          `--${mimeBoundary}--`,
          '.',
        ].join('\r\n');
        sendLine(data);
      };

      sock.on('data', (chunk) => {
        const code = chunk.trim().split(' ')[0];
        if (['220', '250', '334', '235', '354'].includes(code)) {
          step++;
          if (step === 1) sendLine(`EHLO hzlabs`);
          else if (step === 2) sendLine('STARTTLS');
          else if (step === 3) {
            const tls = require('tls');
            const s = tls.connect({ socket: sock, servername: SMTP_HOST, rejectUnauthorized: true });
            handleSmtp(s); // re-negotiate over TLS
          }
          else if (step === 4) sendLine(`AUTH LOGIN`);
          else if (step === 5) sendLine(base64(SMTP_USER));
          else if (step === 6) sendLine(base64(SMTP_PASS));
          else if (step === 7) sendLine(`MAIL FROM:<${SMTP_USER}>`);
          else if (step === 8) sendLine(`RCPT TO:<${SMTP_USER}>`);
          else if (step === 9) sendLine('DATA');
          else if (step === 10) { flushData(); }
          else if (step === 11) { sendLine('QUIT'); sock.end(); resolve(true); }
        } else if (code.startsWith('5') || code.startsWith('4')) {
          sock.end();
          reject(new Error(`SMTP error: ${chunk.trim()}`));
        }
      });

      sock.on('error', reject);
      sock.on('close', () => { if (step < 11) reject(new Error('SMTP closed prematurely')); });
    }
  });
}

// ── Response helpers ───────────────────────────────────────────────
function json(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}
function text(res, status, msg) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(msg);
}

// ── Request body parser ────────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) reject(new Error('Payload too large')); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// ── Main server ────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
  setSecurityHeaders(res);
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // Health check
  if (pathname === '/api/health') {
    return json(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
  }

  // Auth: login
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    if (!checkRateLimit(ip, 'auth', RATE_MAX_AUTH)) {
      return json(res, 429, { error: 'Too many attempts. Try again later.' });
    }
    try {
      const body = await readBody(req);
      const { customer, password } = JSON.parse(body || '{}');
      if (!customer || !password || !CUSTOMERS[customer]) {
        return json(res, 401, { error: 'Invalid credentials' });
      }
      if (!verifyPassword(customer, password)) {
        return json(res, 401, { error: 'Invalid credentials' });
      }
      const token = signJWT({ customer });
      return json(res, 200, {
        token,
        customer: {
          key: customer,
          name: CUSTOMERS[customer].name,
          siteUrl: CUSTOMERS[customer].siteUrl,
          siteUrl2: CUSTOMERS[customer].siteUrl2 || null,
          proposalUrl: CUSTOMERS[customer].proposalUrl,
          appendixUrl: CUSTOMERS[customer].appendixUrl,
          logoUrl: CUSTOMERS[customer].logoUrl || null,
        }
      });
    } catch (e) {
      return json(res, 400, { error: 'Invalid request' });
    }
  }

  // Auth: verify token
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    const payload = verifyJWT(token);
    if (!payload || !payload.customer || !CUSTOMERS[payload.customer]) {
      return json(res, 401, { error: 'Unauthorized' });
    }
    const c = CUSTOMERS[payload.customer];
    return json(res, 200, {
      customer: {
        key: payload.customer,
        name: c.name,
        siteUrl: c.siteUrl,
        siteUrl2: c.siteUrl2 || null,
        proposalUrl: c.proposalUrl,
        appendixUrl: c.appendixUrl,
        logoUrl: c.logoUrl || null,
      }
    });
  }

  // Contact form
  if (pathname === '/api/contact' && req.method === 'POST') {
    if (!checkRateLimit(ip, 'contact', RATE_MAX_CONTACT)) {
      return json(res, 429, { error: 'Rate limit exceeded. Please try again later.' });
    }
    try {
      const body = await readBody(req);
      const { name, organization, email, budget, message } = JSON.parse(body || '{}');

      if (!name || !email || !message) {
        return json(res, 400, { error: 'Name, email, and message are required' });
      }
      if (!isValidEmail(email)) {
        return json(res, 400, { error: 'Invalid email address' });
      }
      if (message.length > 10000) {
        return json(res, 400, { error: 'Message too long' });
      }

      const subject = `פנייה חדשה מהאתר — ${name}${organization ? ` (${organization})` : ''}`;
      const textBody = `שם: ${name}\nארגון: ${organization || '—'}\nאימייל: ${email}\nתקציב: ${budget || '—'}\n\nתיאור הפרויקט:\n${message}`;
      const htmlBody = `<div dir="rtl" style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #D49A3E;">פנייה חדשה מהאתר</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">שם:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">ארגון:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(organization || '—')}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">אימייל:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(email)}</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">תקציב:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(budget || '—')}</td></tr>
  </table>
  <h3 style="margin-top: 24px;">תיאור הפרויקט:</h3>
  <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 4px;">${escapeHtml(message)}</p>
</div>`;

      await sendEmail({
        name, email,
        replyTo: normalizeReplyTo(email),
        subject,
        textBody,
        htmlBody,
      });

      return json(res, 200, { success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Email error:', error.message);
      return json(res, 500, { error: 'Failed to send email' });
    }
  }

  // Static files
  if (req.method !== 'GET') {
    return text(res, 405, 'Method Not Allowed');
  }
  let filePath = pathname === '/' ? '/landing_page.html' : pathname;
  filePath = path.join('/usr/share/nginx/html', path.normalize(filePath));
  if (!filePath.startsWith('/usr/share/nginx/html')) {
    return text(res, 403, 'Forbidden');
  }
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return text(res, 404, 'Not Found');
      return text(res, 500, 'Internal Server Error');
    }
    const mime = MIME[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': mime };
    if (ext === '.html') {
      headers['Cache-Control'] = 'no-cache, must-revalidate';
    } else if (['.avif', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico'].includes(ext)) {
      headers['Cache-Control'] = 'public, immutable';
      headers['Expires'] = new Date(Date.now() + 30 * 24 * 3600 * 1000).toUTCString();
    } else if (ext === '.pdf') {
      headers['Cache-Control'] = 'public';
      headers['Expires'] = new Date(Date.now() + 7 * 24 * 3600 * 1000).toUTCString();
    }
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`HZ Labs secure server running on port ${PORT}`);
});
