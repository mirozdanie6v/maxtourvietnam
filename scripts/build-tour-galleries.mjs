import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const data = await readFile('src/client/data.ts', 'utf8');
const tours = [...data.matchAll(/slug:\s*'([^']+)'[\s\S]*?sourceUrl:\s*'([^']+)'/g)].map((match) => ({
  slug: match[1],
  sourceUrl: match[2],
}));

const decodeHtml = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");

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
      if (pathname.includes('/img/tildacopy.png') || seen.has(value)) continue;
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

const galleries = {};

for (const [tourIndex, tour] of tours.entries()) {
  const page = await fetch(tour.sourceUrl, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0 MAX-TOUR-Gallery-Migration/1.0' },
  });
  if (!page.ok) throw new Error(`Failed ${page.status} ${tour.sourceUrl}`);

  const images = extractImages(await page.text());
  const localImages = [];
  const dir = `public/tour-galleries/${tour.slug}`;
  await mkdir(dir, { recursive: true });

  for (const [imageIndex, source] of images.entries()) {
    const response = await fetch(source, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 MAX-TOUR-Gallery-Migration/1.0' },
    });
    if (!response.ok) throw new Error(`Failed ${response.status} ${source}`);
    const filename = `${String(imageIndex + 1).padStart(2, '0')}${extension(source)}`;
    await writeFile(`${dir}/${filename}`, Buffer.from(await response.arrayBuffer()));
    localImages.push(`/tour-galleries/${tour.slug}/${filename}`);
  }

  galleries[tour.slug] = localImages;
  console.log(`[gallery ${tourIndex + 1}/${tours.length}] ${tour.slug}: ${localImages.length} local images`);
}

const json = JSON.stringify(galleries, null, 2);
await writeFile('public/tour-galleries.json', `${json}\n`, 'utf8');
await writeFile(
  'src/client/generatedGalleries.ts',
  `// Generated from public MAX TOUR pages during build. All URLs below are local deployment assets.\nexport const generatedGalleries: Record<string, string[]> = ${json};\n`,
  'utf8',
);

console.log(`Built local galleries for ${tours.length} tours.`);
