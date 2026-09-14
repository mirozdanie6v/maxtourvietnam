import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { extname, join } from 'node:path';

const roots = ['index.html', 'src/client', 'seed', 'public/tour-main'];
const allowedExtensions = new Set(['.html', '.ts', '.tsx', '.css', '.sql']);
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

async function collectFiles(path) {
  const info = await stat(path);
  if (info.isFile()) return allowedExtensions.has(extname(path).toLowerCase()) ? [path] : [];
  const entries = await readdir(path);
  const nested = await Promise.all(entries.map((entry) => collectFiles(join(path, entry))));
  return nested.flat();
}

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': 'Mozilla/5.0 MAX-TOUR-Media-Migration/1.0' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw new Error(`Failed to download ${url}: ${lastError?.message || lastError}`);
}

await mkdir(outDir, { recursive: true });
const files = (await Promise.all(roots.map((root) => collectFiles(root)))).flat();
const sources = new Map();

for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const url of text.match(urlPattern) || []) sources.set(url, null);
}

let index = 0;
for (const url of sources.keys()) {
  index += 1;
  const response = await fetchWithRetry(url);
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

const remaining = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  if (text.match(urlPattern)) remaining.push(file);
}
if (remaining.length) throw new Error(`Unlocalized Tilda media remains in: ${remaining.join(', ')}`);

console.log(`Localized ${sources.size} Tilda media assets across ${files.length} storefront source files.`);
