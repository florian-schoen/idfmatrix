const SITE_PASSWORD  = process.env.SITE_PASSWORD  || 'changeme';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminchangeme';

// Auth-Cookie setzen (30 Tage)
function setCookie(res, name, value) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
}

// Middleware: Konfigurator-Zugang
function requireSiteAuth(req, res, next) {
  if (req.cookies && req.cookies.site_auth === SITE_PASSWORD) return next();
  res.redirect('/login.html');
}

// Middleware: Admin-Zugang
function requireAdminAuth(req, res, next) {
  if (req.cookies && req.cookies.admin_auth === ADMIN_PASSWORD) return next();
  res.redirect('/admin-login.html');
}

// POST /login – Site-Passwort (Form-Submit)
function handleSiteLogin(req, res) {
  const { password } = req.body;
  if (password === SITE_PASSWORD) {
    setCookie(res, 'site_auth', SITE_PASSWORD);
    res.redirect('/');
  } else {
    res.redirect('/login.html?error=1');
  }
}

// POST /admin-login – Admin-Passwort (Form-Submit)
function handleAdminLogin(req, res) {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    setCookie(res, 'admin_auth', ADMIN_PASSWORD);
    res.redirect('/admin.html');
  } else {
    res.redirect('/admin-login.html?error=1');
  }
}

module.exports = { requireSiteAuth, requireAdminAuth, handleSiteLogin, handleAdminLogin };
