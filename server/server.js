require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express    = require('express');
const cookieParser = require('cookie-parser');
const path       = require('path');
const fs         = require('fs');

const { requireSiteAuth, requireAdminAuth, handleSiteLogin, handleAdminLogin } = require('./middleware/auth');
const articlesRouter = require('./routes/articles');
const emailRouter    = require('./routes/email');

const app  = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, '..');

// Sicherstellen dass data/ Verzeichnis existiert
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

app.use(cookieParser());
app.use(express.json());

// ---------- Auth-Endpunkte (kein Auth nötig) ----------
app.use(express.urlencoded({ extended: false }));
app.post('/login',       handleSiteLogin);
app.post('/admin-login', handleAdminLogin);

// ---------- Öffentliche Seiten (Login-Seiten, Bilder, CSS, JS) ----------
app.use('/css',    express.static(path.join(PUBLIC, 'css')));
app.use('/js',     express.static(path.join(PUBLIC, 'js')));
app.use('/images', express.static(path.join(PUBLIC, 'images')));
app.get('/login.html',       (req, res) => res.sendFile(path.join(PUBLIC, 'login.html')));
app.get('/admin-login.html', (req, res) => res.sendFile(path.join(PUBLIC, 'admin-login.html')));

// ---------- API ----------
app.use('/api/articles', (req, res, next) => {
  if (req.method === 'GET')  return requireSiteAuth(req, res, next);
  if (req.method === 'POST') return requireAdminAuth(req, res, next);
  next();
}, articlesRouter);
app.use('/api/send-email', requireSiteAuth, emailRouter);

// ---------- Admin-Bereich ----------
app.get('/admin',      requireAdminAuth, (req, res) => res.sendFile(path.join(PUBLIC, 'admin.html')));
app.get('/admin.html', requireAdminAuth, (req, res) => res.sendFile(path.join(PUBLIC, 'admin.html')));

// ---------- Konfigurator (Site-Auth) ----------
app.get('/', requireSiteAuth, (req, res) => res.sendFile(path.join(PUBLIC, 'index.html')));
app.get('/index.html', requireSiteAuth, (req, res) => res.sendFile(path.join(PUBLIC, 'index.html')));

app.listen(PORT, () => {
  console.log(`IDfMatrix Server läuft auf Port ${PORT}`);
});
