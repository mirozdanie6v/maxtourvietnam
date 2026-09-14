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

    return env.ASSETS.fetch(request);
  },
};
