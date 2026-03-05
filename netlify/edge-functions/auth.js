export default async (request, context) => {
  const url = new URL(request.url);
  const PASS = Deno.env.get("SITE_PASSWORD") || "";
  const TOKEN = "auth=" + btoa(PASS);

  // Handle POST /login – validate password and set cookie
  if (request.method === "POST" && url.pathname === "/login") {
    let formData = "";
    try { formData = await request.text(); } catch (_) {}
    const params = new URLSearchParams(formData);
    const entered = params.get("password") || "";

    if (PASS !== "" && entered === PASS) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": TOKEN + "; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400",
        },
      });
    }
    return Response.redirect(new URL("/login.html?error=1", request.url));
  }

  // Login page is always accessible
  if (url.pathname === "/login.html") return context.next();

  // Check auth cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const authed = cookieHeader.split(";").some((c) => c.trim() === TOKEN);

  if (authed) return context.next();

  return Response.redirect(new URL("/login.html", request.url));
};
