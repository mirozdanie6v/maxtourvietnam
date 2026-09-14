import { readFile, writeFile } from 'node:fs/promises';

const DATA_FILE = 'src/client/data.ts';
const OUTPUT_FILE = 'src/client/generatedReviews.ts';
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

function visibleLines(html) {
  let text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(div|p|li|h1|h2|h3|h4|h5|h6|section|article|strong|b|span)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  text = decode(text);
  return text.split(/\n+/).map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

async function fetchPage(sourceUrl) {
  const variants = [sourceUrl, sourceUrl.replace('https://maxtourvietnam.com/', 'https://www.maxtourvietnam.com/')];
  for (const url of variants) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(url, { redirect: 'follow', headers: browserHeaders });
        if (response.ok) return await response.text();
        console.warn(`[reviews page] ${response.status} ${url}`);
      } catch (error) {
        console.warn(`[reviews page] ${error.message} ${url}`);
      }
      await sleep(650 * (attempt + 1));
    }
  }
  return null;
}

const ratingPattern = /^[★☆⭐✦✭\s]{3,12}$/u;
const isReviewText = (line) => line.length >= 45 && line.length <= 1400 && !/^https?:/i.test(line);

function extractReviews(html) {
  const lines = visibleLines(html);
  const headingIndex = lines.findLastIndex((line) => /^отзывы(?:\s|$)/iu.test(line));
  if (headingIndex < 0) return [];

  let chooserIndex = -1;
  for (let index = headingIndex - 1; index >= Math.max(0, headingIndex - 100); index -= 1) {
    if (/выберите, где вам удобнее общаться с менеджером/i.test(lines[index])) {
      chooserIndex = index;
      break;
    }
  }

  const proseStart = chooserIndex >= 0 ? chooserIndex + 1 : Math.max(0, headingIndex - 20);
  const textsBeforeHeading = lines.slice(proseStart, headingIndex)
    .filter((line) => !/^(whatsapp|telegram|max)$/i.test(line))
    .filter(isReviewText);

  const authors = [];
  for (let index = headingIndex + 1; index < Math.min(lines.length - 1, headingIndex + 40); index += 1) {
    const line = lines[index];
    const next = lines[index + 1];
    if (/^(copyright|©|made on|tilda)/i.test(line)) break;
    if (!ratingPattern.test(next || '')) continue;
    if (!line || line.length > 60 || /[@$]/.test(line) || /^\+?\d/.test(line)) continue;
    authors.push(line.replace(/\.$/, ''));
    index += 1;
    if (authors.length >= 8) break;
  }

  const count = Math.min(authors.length, textsBeforeHeading.length, 8);
  if (!count) return [];
  const texts = textsBeforeHeading.slice(-count);
  return authors.slice(0, count).map((name, index) => ({ name, text: texts[index] }));
}

const output = {};
for (const [index, tour] of tours.entries()) {
  const html = await fetchPage(tour.sourceUrl);
  output[tour.slug] = html ? extractReviews(html) : [];
  console.log(`[reviews ${index + 1}/${tours.length}] ${tour.slug}: ${output[tour.slug].length}`);
  await sleep(350);
}

const daily = output['dnevnaya-obzornaya-ekskursiya-po-nyachangu'] || [];
if (daily.length !== 4) throw new Error(`Review extraction regression: expected 4 daily Nha Trang reviews, got ${daily.length}`);
if (daily.map((item) => item.name).join('|') !== 'Михаил|Ева|Артём|София') {
  throw new Error(`Review extraction regression: daily reviewer order mismatch: ${daily.map((item) => item.name).join('|')}`);
}

const total = Object.values(output).reduce((sum, rows) => sum + rows.length, 0);
if (total < 4) throw new Error(`Review extraction regression: expected reviews across source pages, got ${total}`);

const json = JSON.stringify(output, null, 2);
await writeFile(
  OUTPUT_FILE,
  `// Generated from public MAX TOUR tour pages during production source sync.\nexport type GeneratedReview = { name: string; text: string };\nexport const generatedReviews: Record<string, GeneratedReview[]> = ${json};\n`,
  'utf8',
);
console.log(`Generated ${total} reviews across ${tours.length} tour pages.`);
