export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const target = url.pathname.replace(/^\/api\/radio\//, '');

  if (!target) {
    return new Response('Missing path', { status: 400 });
  }

  try {
    const upstream = await fetch(`https://s1-fmt2.liveatc.net/${target}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.liveatc.net/',
      },
      redirect: 'follow',
    });

    if (!upstream.ok) {
      return new Response(null, { status: upstream.status });
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return new Response('Upstream fetch failed', { status: 502 });
  }
}
