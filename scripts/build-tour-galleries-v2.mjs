import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const data = await readFile('src/client/data.ts', 'utf8');
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

const decodeHtml = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");

async function fetchPage(sourceUrl) {
  const variants = [sourceUrl, sourceUrl.replace('https://maxtourvietnam.com/', 'https://www.maxtourvietnam.com/')];
  for (const url of variants) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(url, { redirect: 'follow', headers: browserHeaders });
        if (response.ok) return await response.text();
        console.warn(`[gallery page] ${response.status} ${url}`);
      } catch (error) {
        console.warn(`[gallery page] ${error.message} ${url}`);
      }
      await sleep(700 * (attempt + 1));
    }
  }
  return null;
}

function extractImages(html) {
  const urls = [];
  const seen = new Set();
  for (const match of html.matchAll(/\bdata-original=["']([^"']+)["']/gi)) {
    let value = decodeHtml(match[1]);
    if (value.startsWith('//')) value = `https:${value}`;
    try {
      const url = new URL(value);
      if (!/^static\.tildacdn\.(one|net|com)$/.test(url.hostname)) continue;
      const pathname = url.pathname.toLowerCase();
      if (!/\.(png|jpe?g|webp)$/.test(pathname)) continue;
      if (pathname.includes('/img/tildacopy.png') || pathname.includes('/lib/') || seen.has(value)) continue;
      seen.add(value);
      urls.push(value);
    } catch {
      // Ignore malformed image attributes.
    }
  }
  return urls;
}

function extension(url) {
  const ext = extname(new URL(url).pathname).toLowerCase();
  return ext === '.jpeg' ? '.jpg' : ext || '.jpg';
}

async function downloadImage(source, target) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(source, { redirect: 'follow', headers: browserHeaders });
      if (response.ok) {
        await writeFile(target, Buffer.from(await response.arrayBuffer()));
        return true;
      }
    } catch {
      // Retry below.
    }
    await sleep(250 * (attempt + 1));
  }
  return false;
}

const galleries = {};
for (const [tourIndex, tour] of tours.entries()) {
  const html = await fetchPage(tour.sourceUrl);
  if (!html) {
    galleries[tour.slug] = [];
    console.warn(`[gallery ${tourIndex + 1}/${tours.length}] ${tour.slug}: source unavailable`);
    await sleep(450);
    continue;
  }

  const images = extractImages(html);
  const localImages = [];
  const dir = `public/tour-galleries/${tour.slug}`;
  await mkdir(dir, { recursive: true });

  for (const [imageIndex, source] of images.entries()) {
    const filename = `${String(imageIndex + 1).padStart(2, '0')}${extension(source)}`;
    const ok = await downloadImage(source, `${dir}/${filename}`);
    if (ok) localImages.push(`/tour-galleries/${tour.slug}/${filename}`);
    else console.warn(`[gallery image] skipped ${source}`);
  }

  galleries[tour.slug] = localImages;
  console.log(`[gallery ${tourIndex + 1}/${tours.length}] ${tour.slug}: ${localImages.length} local images`);
  await sleep(450);
}

const json = JSON.stringify(galleries, null, 2);
await writeFile('public/tour-galleries.json', `${json}\n`, 'utf8');
await writeFile(
  'src/client/generatedGalleries.ts',
  `// Generated from public MAX TOUR pages during build. All URLs below are local deployment assets.\nexport const generatedGalleries: Record<string, string[]> = ${json};\n`,
  'utf8',
);
console.log(`Built local galleries for ${tours.length} tours.`);
