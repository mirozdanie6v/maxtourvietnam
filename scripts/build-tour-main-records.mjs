import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const DATA_FILE = 'src/client/data.ts';
const OUT_DIR = 'public/tour-main';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const data = await readFile(DATA_FILE, 'utf8');
const tours = [...data.matchAll(/slug:\s*'([^']+)'[\s\S]*?sourceUrl:\s*'([^']+)'/g)].map((match) => ({
  slug: match[1],
  sourceUrl: match[2],
}));

const browserHeaders = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
  'cache-control': 'no-cache',
};

const decode = (input) => input
  .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
  .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)))
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');

function visibleText(html) {
  return decode(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchPage(sourceUrl) {
  const variants = [sourceUrl, sourceUrl.replace('https://maxtourvietnam.com/', 'https://www.maxtourvietnam.com/')];
  let lastError = 'unknown';
  for (const url of variants) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(url, { redirect: 'follow', headers: browserHeaders });
        if (response.ok) return await response.text();
        lastError = `HTTP ${response.status} ${url}`;
      } catch (error) {
        lastError = `${error?.message || error} ${url}`;
      }
      await sleep(700 * (attempt + 1));
    }
  }
  throw new Error(`Unable to fetch source page: ${lastError}`);
}

function splitRecords(html) {
  const starts = [...html.matchAll(/<div\s+id=["']rec(\d+)["'][^>]*class=["'][^"']*\br\s+t-rec\b[^"']*["'][^>]*>/gi)];
  return starts.map((match, index) => {
    const start = match.index ?? 0;
    const end = index + 1 < starts.length ? (starts[index + 1].index ?? html.length) : html.length;
    const opening = match[0];
    const type = opening.match(/data-record-type=["']([^"']+)/i)?.[1] || '';
    const raw = html.slice(start, end);
    return { id: match[1], type, raw, text: visibleText(raw) };
  });
}

function recordScore(record) {
  if (record.type !== '396') return -1000;
  const text = record.text.toLowerCase();
  let score = 0;
  const positives = [
    ['локации которые вы посетите', 30],
    ['цена групповой экскурсии', 24],
    ['цена индивидуальной экскурсии', 20],
    ['сбор участников из отелей', 22],
    ['возвращение в', 12],
    ['описание программы', 20],
    ['особенности тура', 12],
    ['что взять с собой', 10],
    ['день 1', 8],
    ['комбо 1', 8],
  ];
  for (const [needle, weight] of positives) if (text.includes(needle)) score += weight;

  const negatives = [
    ['отправить в whatsapp', 120],
    ['часто задаваемые вопросы', 120],
    ['выберите, где вам удобнее общаться с менеджером', 120],
    ['отзывы о', 120],
    ['copyright ©', 120],
    ['экскурсии дананга блог о нас', 80],
  ];
  for (const [needle, weight] of negatives) if (text.includes(needle)) score -= weight;
  return score;
}

function normalizeTildaUrls(html) {
  return html
    .replace(/(["'(=:])\/\/(static|thb)\.tildacdn\.(one|net|com)\//gi, '$1https://$2.tildacdn.$3/')
    .replace(/https:\/\/www\.maxtourvietnam\.com\//g, '/')
    .replace(/https:\/\/maxtourvietnam\.com\//g, '/');
}

function promoteLazyImages(html) {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const original = tag.match(/\bdata-original=["']([^"']+)["']/i)?.[1];
    if (!original) return tag;
    const source = original.startsWith('//') ? `https:${original}` : decode(original);
    let next = tag.replace(/\ssrc=["'][^"']*["']/i, '');
    next = next.replace(/<img\b/i, `<img src="${source.replaceAll('"', '&quot;')}"`);
    return next;
  });
}

function sanitizeRecord(raw) {
  let html = raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/href=["']javascript:[^"']*["']/gi, 'href="#"')
    .replace(/href=["']#popup:booking[^"']*["']/gi, 'href="#booking"');
  html = normalizeTildaUrls(html);
  html = promoteLazyImages(html);
  return html.trim();
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const manifest = {};
for (const [index, tour] of tours.entries()) {
  const html = await fetchPage(tour.sourceUrl);
  const candidates = splitRecords(html)
    .map((record) => ({ ...record, score: recordScore(record) }))
    .sort((a, b) => b.score - a.score);
  const main = candidates[0];
  if (!main || main.score < 12) {
    throw new Error(`No reliable main tour record for ${tour.slug}; best=${main?.id || 'none'} score=${main?.score ?? 'none'}`);
  }

  const sanitized = sanitizeRecord(main.raw);
  if (sanitized.length < 1000) throw new Error(`Main record too small for ${tour.slug}: ${sanitized.length}`);
  await writeFile(`${OUT_DIR}/${tour.slug}.html`, `${sanitized}\n`, 'utf8');
  manifest[tour.slug] = { recordId: main.id, score: main.score, bytes: sanitized.length };
  console.log(`[main ${index + 1}/${tours.length}] ${tour.slug}: rec${main.id} score=${main.score} bytes=${sanitized.length}`);
  await sleep(350);
}

if (Object.keys(manifest).length !== tours.length || tours.length !== 28) {
  throw new Error(`Main record regression: expected 28 pages, got ${Object.keys(manifest).length}/${tours.length}`);
}

const checks = [
  ['dnevnaya-obzornaya-ekskursiya-po-nyachangu', 'Пагода Лонг Шон'],
  ['danang-i-hoyan-na-2-dnya-iz-nyachanga', 'Ba Na Hills'],
  ['vinwonders-marriott-nyachang-2-dnya', 'вилла 3 спальни'],
  ['zipline-i-verevochnyj-park-v-nyachange', 'Zip Line трасса'],
];
for (const [slug, marker] of checks) {
  const page = await readFile(`${OUT_DIR}/${slug}.html`, 'utf8');
  if (!page.includes(marker)) throw new Error(`Main record regression: ${slug} missing marker ${marker}`);
}

await writeFile(`${OUT_DIR}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Built exact local main records for ${tours.length} tour pages.`);
