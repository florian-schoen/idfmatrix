export async function onRequest(context) {
  const { request, env } = context;
  const ADMIN_PASS = env.ADMIN_PASSWORD || '';
  const ADMIN_TOKEN = 'admin_auth=' + btoa(ADMIN_PASS);

  const cookieHeader = request.headers.get('cookie') || '';
  const hasAdminAuth = ADMIN_PASS !== '' && cookieHeader.split(';').some(c => c.trim() === ADMIN_TOKEN);

  if (!hasAdminAuth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (request.method === 'GET') {
    const data = await env.ARTICLES_KV.get('articles');
    return new Response(data || '{}', {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (request.method === 'POST') {
    const body = await request.text();
    try { JSON.parse(body); } catch (_) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await env.ARTICLES_KV.put('articles', body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
