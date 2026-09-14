import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { extname } from 'node:path';

const SOURCE_ORIGIN = 'https://maxtourvietnam.com';
const TARGET_ORIGIN = process.env.TARGET_ORIGIN || 'https://maxtourvietnam.viiversion.com';
const OUT_DIR = process.env.SNAPSHOT_DIR || '.snapshot';

const slugs = [
  'dnevnaya-obzornaya-ekskursiya-po-nyachangu',
  'vechernyaya-obzornaya-ekskursiya-po-nyachangu',
  'danang-i-hoyan-na-2-dnya-iz-nyachanga',
  'ekskursiya-v-saygon-na-2-dnya-iz-nyachanga',
  'ekskursiya-v-danang-iz-nyachanga',
  'ekskursiya-v-saygon-iz-nyachanga',
  'ekskursiya-v-fanrang-iz-nyachanga',
  'ekskursiya-v-fuyen-iz-nyachanga',
  'ekskursiya-v-dalat-na-2-dnya-iz-nyachanga',
  'ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga',
  'vip-ekskursiya-v-dalat-iz-nyachanga',
  'ekskursiya-v-dalat-iz-nyachanga-premium',
  'ostrov-doidep-nyachang',
  'vinwonders-marriott-nyachang-2-dnya',
  'ostrov-hon-tam-nyachang',
  'rybalka-na-ozere-nyachang',
  'ostrov-orhidey-i-obezian-nyachang',
  'morskaya-rybalka-nyachang',
  'kruiz-marmoris-nyachang',
  'kruiz-emperor-nyachang',
  'kruiz-na-katamarane-nyachang',
  'zipline-i-verevochnyj-park-v-nyachange',
  'kvadrocikly-v-nyachange',
  'dayving-i-snorkling-v-nyachange',
  'ekskursiya-v-daklak-iz-nyachanga',
  'termalnye-istochniki-yang-bay-iz-nyachanga',
  'dzip-tur-v-nyachange',
  'ekskursiya-baho-zoklet-iz-nyachanga',
];

const allowedAssetHosts = new Set([
  'static.tildacdn.com', 'static.tildacdn.net', 'static.tildacdn.one',
  'thb.tildacdn.com', 'thb.tildacdn.net', 'thb.tildacdn.one',
  'fonts.googleapis.com', 'fonts.gstatic.com',
]);

const assetMap = new Map();
const queue = [];

function sha(input) { return createHash('sha256').update(input).digest('hex').slice(0, 24); }
function safeExt(url, contentType = '') {
  const pathname = new URL(url).pathname;
  const ext = extname(pathname).toLowerCase();
  if (ext && ext.length <= 8) return ext;
  if (contentType.includes('text/css')) return '.css';
  if (contentType.includes('javascript')) return '.js';
  if (contentType.includes('svg')) return '.svg';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('jpeg')) return '.jpg';
  if (contentType.includes('woff2')) return '.woff2';
  return '.bin';
}
function localAssetPath(url, contentType = '') {
  return `snapshot-assets/${sha(url)}${safeExt(url, contentType)}`;
}
function isAssetUrl(value) {
  try {
    const u = new URL(value, SOURCE_ORIGIN);
    return allowedAssetHosts.has(u.hostname);
  } catch { return false; }
}
function normalizeUrl(value, base = SOURCE_ORIGIN) {
  try { return new URL(value, base).href; } catch { return null; }
}
function enqueueAsset(url) {
  const normalized = normalizeUrl(url);
  if (!normalized || !isAssetUrl(normalized)) return normalized;
  if (!assetMap.has(normalized)) {
    assetMap.set(normalized, null);
    queue.push(normalized);
  }
  return normalized;
}
function rewriteSourceLinks(text) {
  return text
    .replaceAll('https://www.maxtourvietnam.com', TARGET_ORIGIN)
    .replaceAll('http://www.maxtourvietnam.com', TARGET_ORIGIN)
    .replaceAll('https://maxtourvietnam.com', TARGET_ORIGIN)
    .replaceAll('http://maxtourvietnam.com', TARGET_ORIGIN);
}
function discover(text, baseUrl) {
  const found = new Set();
  const patterns = [
    /(?:src|href|poster|data-original|data-lazy-rule)=["']([^"']+)["']/gi,
    /url\((?:["']?)([^)"']+)(?:["']?)\)/gi,
    /https?:\/\/[^\s"'<>\\)]+/gi,
  ];
  for (const re of patterns) {
    for (const match of text.matchAll(re)) {
      const value = match[1] || match[0];
      const normalized = normalizeUrl(value, baseUrl);
      if (normalized && isAssetUrl(normalized)) found.add(normalized);
    }
  }
  return [...found];
}
function rewriteAssets(text, baseUrl = SOURCE_ORIGIN) {
  let out = text;
  for (const original of discover(text, baseUrl)) enqueueAsset(original);
  for (const [original, local] of assetMap) {
    if (!local) continue;
    out = out.split(original).join(`${TARGET_ORIGIN}/${local}`);
    const protocolRelative = original.replace(/^https?:/, '');
    out = out.split(protocolRelative).join(`${TARGET_ORIGIN}/${local}`);
  }
  return rewriteSourceLinks(out);
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 MAX-TOUR-Snapshot/1.0' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return { text: await res.text(), type: res.headers.get('content-type') || 'text/html; charset=utf-8' };
}

async function mirrorAssets() {
  let cursor = 0;
  while (cursor < queue.length) {
    const original = queue[cursor++];
    if (assetMap.get(original)) continue;
    const res = await fetch(original, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 MAX-TOUR-Snapshot/1.0' } });
    if (!res.ok) { console.warn('asset failed', res.status, original); continue; }
    const type = res.headers.get('content-type') || 'application/octet-stream';
    const local = localAssetPath(original, type);
    assetMap.set(original, local);
    let body = Buffer.from(await res.arrayBuffer());
    if (type.includes('text/css') || type.includes('javascript') || type.includes('svg') || type.includes('text/')) {
      let text = body.toString('utf8');
      for (const nested of discover(text, original)) enqueueAsset(nested);
      body = Buffer.from(text, 'utf8');
    }
    await mkdir(`${OUT_DIR}/snapshot-assets`, { recursive: true });
    await writeFile(`${OUT_DIR}/${local}`, body);
    await writeFile(`${OUT_DIR}/${local}.meta.json`, JSON.stringify({ contentType: type, source: original }));
  }

  // second pass rewrites dependencies after every asset received a local path
  for (const [original, local] of assetMap) {
    if (!local) continue;
    const meta = JSON.parse(await readFile(`${OUT_DIR}/${local}.meta.json`, 'utf8'));
    if (!/(text\/css|javascript|svg|text\/)/.test(meta.contentType)) continue;
    const path = `${OUT_DIR}/${local}`;
    let text = await readFile(path, 'utf8');
    text = rewriteAssets(text, original);
    await writeFile(path, text);
  }
}

function cleanHtml(html) {
  return html
    .replace(/<script[^>]+src=["'][^"']*(?:tilda-stat|stat\.tildacdn|mc\.yandex|googletagmanager|google-analytics)[^"']*["'][^>]*><\/script>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?(?:ym\(|gtag\(|dataLayer|tilda-stat)[\s\S]*?<\/script>/gi, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, `<link rel="canonical" href="${TARGET_ORIGIN}/">`);
}

async function main() {
  await mkdir(`${OUT_DIR}/pages`, { recursive: true });
  const pages = [];
  for (const slug of slugs) {
    const source = `${SOURCE_ORIGIN}/${slug}`;
    console.log('page', slug);
    const { text } = await fetchText(source);
    const html = cleanHtml(text);
    for (const asset of discover(html, source)) enqueueAsset(asset);
    pages.push({ slug, source, html });
  }

  await mirrorAssets();

  for (const page of pages) {
    let html = rewriteAssets(page.html, page.source);
    html = html.replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${TARGET_ORIGIN}/${page.slug}">`);
    html = html.replace(/<head>/i, `<head><meta name="snapshot-source" content="local-r2"><base href="${TARGET_ORIGIN}/">`);
    await writeFile(`${OUT_DIR}/pages/${page.slug}.html`, html);
  }

  await writeFile(`${OUT_DIR}/manifest.json`, JSON.stringify({ generatedAt: new Date().toISOString(), target: TARGET_ORIGIN, slugs, assets: Object.fromEntries(assetMap) }, null, 2));
  console.log(`snapshot complete: ${pages.length} pages, ${[...assetMap.values()].filter(Boolean).length} assets`);
}

await main();
