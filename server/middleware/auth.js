const crypto = require('crypto');

const SITE_PASSWORD  = process.env.SITE_PASSWORD  || 'changeme';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminchangeme';

// In-memory Sessions – werden bei Server-Neustart gelöscht
const siteSessions  = new Set();
const adminSessions = new Set();

function setCookie(res, name, token) {
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000, // 8 Stunden
  });
}

// Kurzzeitiges nicht-httpOnly Cookie das dem Client signalisiert: frischer Login
function setSessInitCookie(res) {
  res.cookie('sess_init', '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 1000, // 30 Sekunden reichen für den Redirect
  });
}

function requireSiteAuth(req, res, next) {
  const token = req.cookies && req.cookies.site_auth;
  if (token && siteSessions.has(token)) return next();
  res.redirect('/login.html');
}

function requireAdminAuth(req, res, next) {
  const token = req.cookies && req.cookies.admin_auth;
  if (token && adminSessions.has(token)) return next();
  res.redirect('/admin-login.html');
}

function handleSiteLogin(req, res) {
  const { password } = req.body;
  if (password === SITE_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    siteSessions.add(token);
    setCookie(res, 'site_auth', token);
    setSessInitCookie(res);
    res.redirect('/');
  } else {
    res.redirect('/login.html?error=1');
  }
}

function handleAdminLogin(req, res) {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const adminToken = crypto.randomBytes(32).toString('hex');
    const siteToken  = crypto.randomBytes(32).toString('hex');
    adminSessions.add(adminToken);
    siteSessions.add(siteToken);
    setCookie(res, 'admin_auth', adminToken);
    setCookie(res, 'site_auth',  siteToken);
    res.redirect('/admin.html');
  } else {
    res.redirect('/admin-login.html?error=1');
  }
}

module.exports = { requireSiteAuth, requireAdminAuth, handleSiteLogin, handleAdminLogin };
