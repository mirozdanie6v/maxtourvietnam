import { sourceMeta } from './sourceMeta';

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

const json = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

async function withSourceMeta(request: Request, response: Response): Promise<Response> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const url = new URL(request.url);
  const meta = sourceMeta(url.pathname);
  if (!meta) return response;

  const canonical = `https://maxtourvietnam.viiversion.com${url.pathname}`;
  let html = await response.text();
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(
    '</head>',
    `<meta name="description" content="${escapeHtml(meta.description)}" />\n<link rel="canonical" href="${escapeHtml(canonical)}" />\n<meta property="og:title" content="${escapeHtml(meta.title)}" />\n<meta property="og:description" content="${escapeHtml(meta.description)}" />\n<meta property="og:url" content="${escapeHtml(canonical)}" />\n</head>`,
  );

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('content-type', 'text/html; charset=utf-8');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ ok: true, project: 'maxtourvietnam', timestamp: new Date().toISOString() });
    }

    if (url.pathname === '/api/tours' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT slug, title, subtitle, location, duration, price_from, currency, cover_image, published
         FROM tours
         WHERE published = 1
         ORDER BY sort_order ASC, id ASC`,
      ).all();
      return json({ tours: results });
    }

    if (url.pathname.startsWith('/api/tours/') && request.method === 'GET') {
      const slug = decodeURIComponent(url.pathname.slice('/api/tours/'.length));
      const tour = await env.DB.prepare(
        `SELECT slug, title, subtitle, location, duration, price_from, currency, cover_image,
                description, program, included, not_included, published
         FROM tours
         WHERE slug = ? AND published = 1`,
      )
        .bind(slug)
        .first();

      return tour ? json({ tour }) : json({ error: 'Tour not found' }, { status: 404 });
    }

    const response = await env.ASSETS.fetch(request);
    return withSourceMeta(request, response);
  },
};
