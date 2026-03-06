export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  const PASS       = env.SITE_PASSWORD  || '';
  const ADMIN_PASS = env.ADMIN_PASSWORD || '';
  const SITE_TOKEN  = 'auth='       + btoa(PASS);
  const ADMIN_TOKEN = 'admin_auth=' + btoa(ADMIN_PASS);

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const hasSiteAuth  = PASS       !== '' && cookies.some(c => c === SITE_TOKEN);
  const hasAdminAuth = ADMIN_PASS !== '' && cookies.some(c => c === ADMIN_TOKEN);

  // ── POST /login (site) ──────────────────────────────────────────────────
  if (request.method === 'POST' && url.pathname === '/login') {
    let body = ''; try { body = await request.text(); } catch (_) {}
    const entered = new URLSearchParams(body).get('password') || '';
    if (PASS !== '' && entered === PASS) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/IDfMatrix-Produktkonfigurator.html',
          'Set-Cookie': SITE_TOKEN + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400',
        },
      });
    }
    return Response.redirect(new URL('/login.html?error=1', request.url));
  }

  // ── POST /admin-login ───────────────────────────────────────────────────
  if (request.method === 'POST' && url.pathname === '/admin-login') {
    let body = ''; try { body = await request.text(); } catch (_) {}
    const entered = new URLSearchParams(body).get('password') || '';
    if (ADMIN_PASS !== '' && entered === ADMIN_PASS) {
      const headers = new Headers({ Location: '/admin.html' });
      // Admin gets both cookies so they can also view the main site
      headers.append('Set-Cookie', ADMIN_TOKEN + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400');
      headers.append('Set-Cookie', SITE_TOKEN  + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400');
      return new Response(null, { status: 302, headers });
    }
    return Response.redirect(new URL('/admin-login.html?error=1', request.url));
  }

  // ── POST /admin-logout ──────────────────────────────────────────────────
  if (url.pathname === '/admin-logout') {
    const headers = new Headers({ Location: '/admin-login.html' });
    headers.append('Set-Cookie', 'admin_auth=; Path=/; HttpOnly; Max-Age=0');
    return new Response(null, { status: 302, headers });
  }

  // ── Always allow login pages ────────────────────────────────────────────
  if (['/login.html', '/login', '/admin-login.html', '/admin-login'].includes(url.pathname)) {
    return next();
  }

  // ── Admin pages & API: require admin auth ───────────────────────────────
  if (url.pathname === '/admin.html' || url.pathname === '/admin' || url.pathname.startsWith('/api/')) {
    // Allow GET /api/articles for site-authenticated users (read-only)
    const isSiteReadArticles = url.pathname === '/api/articles' && request.method === 'GET' && hasSiteAuth;
    if (!hasAdminAuth && !isSiteReadArticles) {
      if (url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return Response.redirect(new URL('/admin-login.html', request.url));
    }
    return next();
  }

  // ── Main site: require site OR admin auth ───────────────────────────────
  if (!hasSiteAuth && !hasAdminAuth) {
    return Response.redirect(new URL('/login.html', request.url));
  }

  // ── Inject article overrides into main HTML ─────────────────────────────
  const isMainHtml = url.pathname === '/IDfMatrix-Produktkonfigurator.html' || url.pathname === '/';
  if (isMainHtml && env.ARTICLES_KV) {
    const overrides = await env.ARTICLES_KV.get('articles');
    if (overrides && overrides !== '{}') {
      const response = await next();
      const text = await response.text();
      const script = `<script>window.ARTICLE_OVERRIDES=${overrides};<\/script>`;
      const modified = text.replace('</head>', script + '\n</head>');
      const newHeaders = new Headers(response.headers);
      newHeaders.delete('content-encoding'); // ensure no gzip mismatch
      newHeaders.set('content-type', 'text/html; charset=utf-8');
      return new Response(modified, { status: response.status, headers: newHeaders });
    }
  }

  return next();
}
