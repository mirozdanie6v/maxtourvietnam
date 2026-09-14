import { readFile, writeFile } from 'node:fs/promises';

const DATA_FILE = 'src/client/data.ts';
const OUTPUT_FILE = 'src/client/generatedGalleries.ts';
const data = await readFile(DATA_FILE, 'utf8');

const tours = [...data.matchAll(/slug:\s*'([^']+)'[\s\S]*?sourceUrl:\s*'([^']+)'/g)].map((match) => ({
  slug: match[1],
  sourceUrl: match[2],
}));

const decodeHtml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&#39;', "'")
  .replaceAll('&quot;', '"');

const isTourImage = (value) => {
  try {
    const url = new URL(value);
    if (!/^static\.tildacdn\.(one|net|com)$/.test(url.hostname)) return false;
    const path = url.pathname.toLowerCase();
    if (path.includes('/img/tildacopy.png') || path.includes('/lib/emoji/') || path.includes('/lib/icons/')) return false;
    return /\.(png|jpe?g|webp)(?:$|\?)/i.test(`${url.pathname}${url.search}`);
  } catch {
    return false;
  }
};

function extractGallery(html) {
  const found = [];
  const seen = new Set();
  const patterns = [
    /\bdata-original=["']([^"']+)["']/gi,
    /\bsrc=["']([^"']+)["']/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      let value = decodeHtml(match[1]);
      if (value.startsWith('//')) value = `https:${value}`;
      if (!isTourImage(value) || seen.has(value)) continue;
      seen.add(value);
      found.push(value);
    }
  }

  return found;
}

const galleries = {};
for (const [index, tour] of tours.entries()) {
  try {
    const response = await fetch(tour.sourceUrl, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 MAX-TOUR-Gallery-Migration/1.0' },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const html = await response.text();
    galleries[tour.slug] = extractGallery(html);
    console.log(`[gallery ${index + 1}/${tours.length}] ${tour.slug}: ${galleries[tour.slug].length} images`);
  } catch (error) {
    console.warn(`[gallery ${index + 1}/${tours.length}] ${tour.slug}: ${error.message}`);
    galleries[tour.slug] = [];
  }
}

const output = `// Generated from the public MAX TOUR excursion pages at build time.\n` +
  `export const generatedGalleries: Record<string, string[]> = ${JSON.stringify(galleries, null, 2)};\n`;
await writeFile(OUTPUT_FILE, output, 'utf8');
console.log(`Generated galleries for ${tours.length} tour pages.`);
