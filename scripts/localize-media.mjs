import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { extname } from 'node:path';

const files = [
  'src/client/data.ts',
  'src/client/tourDetails.ts',
  'src/client/styles.css',
  'src/client/tour-pages.css',
];
const outDir = 'public/mirror-media';
const urlPattern = /https:\/\/(?:static|thb)\.tildacdn\.(?:one|net|com)\/[^'"\s)]+/g;

const hash = (url) => createHash('sha1').update(url).digest('hex').slice(0, 18);
const extensionFor = (url, type = '') => {
  let ext = extname(new URL(url).pathname).toLowerCase();
  if (ext && ext.length <= 8) return ext;
  if (type.includes('svg')) return '.svg';
  if (type.includes('png')) return '.png';
  if (type.includes('webp')) return '.webp';
  if (type.includes('gif')) return '.gif';
  return '.jpg';
};

await mkdir(outDir, { recursive: true });
const sources = new Map();
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const url of text.match(urlPattern) || []) sources.set(url, null);
}

let index = 0;
for (const url of sources.keys()) {
  index += 1;
  const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 MAX-TOUR-Media-Migration/1.0' } });
  if (!response.ok) throw new Error(`Failed ${response.status} ${url}`);
  const type = response.headers.get('content-type') || '';
  const name = `${hash(url)}${extensionFor(url, type)}`;
  await writeFile(`${outDir}/${name}`, Buffer.from(await response.arrayBuffer()));
  sources.set(url, `/mirror-media/${name}`);
  console.log(`[media ${index}/${sources.size}] ${name}`);
}

for (const file of files) {
  let text = await readFile(file, 'utf8');
  for (const [source, local] of sources) text = text.split(source).join(local);
  await writeFile(file, text, 'utf8');
}
console.log(`Localized ${sources.size} Tilda media assets into the deployment bundle.`);
