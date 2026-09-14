import { readFile, readdir, writeFile } from 'node:fs/promises';

const dir = 'public/tour-main';
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");

function promoteBackgrounds(html) {
  return html.replace(/<([a-z0-9:-]+)\b[^>]*\bdata-original=["']([^"']+)["'][^>]*>/gi, (tag, name, raw) => {
    if (name.toLowerCase() === 'img') return tag;
    let source = decode(raw);
    if (source.startsWith('//')) source = `https:${source}`;
    if (!/^https:\/\/(?:static|thb)\.tildacdn\.(?:one|net|com)\//i.test(source)) return tag;

    const css = `background-image:url('${source.replaceAll("'", '%27')}')`;
    if (/\sstyle=["']/i.test(tag)) {
      return tag.replace(/\sstyle=(["'])([\s\S]*?)\1/i, (_match, quote, styles) => {
        const separator = styles.trim() && !styles.trim().endsWith(';') ? ';' : '';
        return ` style=${quote}${styles}${separator}${css};${quote}`;
      });
    }
    return tag.replace(/>$/, ` style="${css};">`);
  });
}

const files = (await readdir(dir)).filter((name) => name.endsWith('.html'));
let promoted = 0;
for (const file of files) {
  const path = `${dir}/${file}`;
  const source = await readFile(path, 'utf8');
  const next = promoteBackgrounds(source);
  promoted += (next.match(/background-image:url\('https:\/\/(?:static|thb)\.tildacdn\./g) || []).length;
  await writeFile(path, next, 'utf8');
}

if (files.length !== 28) throw new Error(`Expected 28 tour main HTML files, got ${files.length}`);
console.log(`Promoted lazy ZeroBlock backgrounds across ${files.length} tour main records (${promoted} background references).`);
