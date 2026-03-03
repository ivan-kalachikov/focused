export default async function handler(req, res) {
  const { path } = req.query;
  const target = Array.isArray(path) ? path.join('/') : path;
  const url = `https://s1-fmt2.liveatc.net/${target}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Referer: 'https://www.liveatc.net/',
      },
      redirect: 'follow',
    });

    if (!upstream.ok) {
      res.status(upstream.status).end();
      return;
    }

    const contentType = upstream.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    res.status(502).json({ error: 'Upstream fetch failed' });
  }
}
