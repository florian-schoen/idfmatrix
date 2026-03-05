export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const PASS = env.SITE_PASSWORD || '';
  const TOKEN = 'auth=' + btoa(PASS);

  // Allow login page
  if (url.pathname === '/login.html') return next();

  // Handle POST /login
  if (request.method === 'POST' && url.pathname === '/login') {
    let body = '';
    try { body = await request.text(); } catch (_) {}
    const params = new URLSearchParams(body);
    const entered = params.get('password') || '';

    if (PASS !== '' && entered === PASS) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/IDfMatrix-Produktkonfigurator.html',
          'Set-Cookie': TOKEN + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400',
        },
      });
    }
    return Response.redirect(new URL('/login.html?error=1', request.url));
  }

  // Check auth cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const authed = cookieHeader.split(';').some((c) => c.trim() === TOKEN);

  if (authed) return next();

  return Response.redirect(new URL('/login.html', request.url));
}
