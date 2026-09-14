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

const blockedShort = /^(главная|блог|о нас|забронировать|экскурсии|премиум|отзывы|часто задаваемые вопросы|включено|что взять с собой|цена|программа|день \d|telegram|whatsapp|max|instagram|vk)$/i;
const namePattern = /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]{1,24}(?:\s+[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]{1,24}){0,2}\.?$/;
const ratingPattern = /^[★☆⭐✦✭\s]{3,10}$/;

const isName = (line) => line.length <= 45 && namePattern.test(line) && !blockedShort.test(line);
const isText = (line) => line.length >= 45 && line.length <= 1200 && !/^https?:/i.test(line) && !/^отзывы/i.test(line) && !/^часто задаваемые/i.test(line);

function extractReviews(html) {
  const lines = visibleLines(html);
  const markers = lines.map((line, index) => ({ line, index })).filter(({ line }) => /^отзывы\b/i.test(line));
  if (!markers.length) return [];

  // Tilda's current MAX TOUR review block is visually laid out as:
  // [review texts] -> ["Отзывы о ..." heading] -> [names + stars].
  // The text and author columns are separate DOM groups, so proximity pairing fails.
  const marker = markers.at(-1);
  const headingIndex = marker.index;

  const chooserIndex = (() => {
    for (let index = headingIndex - 1; index >= Math.max(0, headingIndex - 80); index -= 1) {
      if (/выберите, где вам удобнее общаться с менеджером/i.test(lines[index])) return index;
    }
    return Math.max(0, headingIndex - 24);
  })();

  const textSection = lines.slice(chooserIndex + 1, headingIndex)
    .filter((line) => !/^(whatsapp|telegram|max)$/i.test(line))
    .filter((line) => !ratingPattern.test(line));

  // Review prose is the last contiguous group of long sentences before the heading.
  const reviewTexts = [];
  for (let index = textSection.length - 1; index >= 0; index -= 1) {
    const line = textSection[index];
    if (isText(line)) {
      reviewTexts.unshift(line);
      if (reviewTexts.length >= 8) break;
      continue;
    }
    if (reviewTexts.length && line.length > 0 && !/^(whatsapp|telegram|max)$/i.test(line)) break;
  }

  // Names appear immediately after the heading, interleaved with star rows.
  const authorSection = lines.slice(headingIndex + 1, headingIndex + 40);
  const names = authorSection
    .filter((line) => !ratingPattern.test(line))
    .filter(isName)
    .slice(0, reviewTexts.length || 8)
    .map((name) => name.replace(/\.$/, ''));

  const count = Math.min(reviewTexts.length, names.length);
  if (count > 0) return Array.from({ length: count }, (_, index) => ({ name: names[index], text: reviewTexts[index] }));

  // Legacy fallback for any page whose Tilda block still uses name/text proximity.
  const tail = lines.slice(headingIndex + 1, headingIndex + 110);
  const end = tail.findIndex((line) => /^(часто задаваемые вопросы|похожие экскурсии|другие экскурсии|контакты|copyright|©)/i.test(line));
  const section = (end >= 0 ? tail.slice(0, end) : tail).filter((line) => !ratingPattern.test(line));
  const reviews = [];
  const usedText = new Set();
  for (let index = 0; index < section.length; index += 1) {
    const line = section[index];
    if (!isName(line)) continue;
    let text = '';
    for (let offset = 1; offset <= 6 && !text; offset += 1) {
      const before = section[index - offset];
      if (before && isText(before) && !usedText.has(before)) text = before;
    }
    for (let offset = 1; offset <= 6 && !text; offset += 1) {
      const after = section[index + offset];
      if (after && isText(after) && !usedText.has(after)) text = after;
    }
    if (!text) continue;
    usedText.add(text);
    reviews.push({ name: line.replace(/\.$/, ''), text });
    if (reviews.length >= 8) break;
  }
  return reviews;
}

const output = {};
for (const [index, tour] of tours.entries()) {
  const html = await fetchPage(tour.sourceUrl);
  output[tour.slug] = html ? extractReviews(html) : [];
  console.log(`[reviews ${index + 1}/${tours.length}] ${tour.slug}: ${output[tour.slug].length}`);
  await sleep(350);
}

const daily = output['dnevnaya-obzornaya-ekskursiya-po-nyachangu'] || [];
if (daily.length < 4) throw new Error(`Review extraction regression: expected >=4 daily Nha Trang reviews, got ${daily.length}`);

const total = Object.values(output).reduce((sum, rows) => sum + rows.length, 0);
if (total < 4) throw new Error(`Review extraction regression: expected reviews across source pages, got ${total}`);

const json = JSON.stringify(output, null, 2);
await writeFile(
  OUTPUT_FILE,
  `// Generated from public MAX TOUR tour pages during production source sync.\nexport type GeneratedReview = { name: string; text: string };\nexport const generatedReviews: Record<string, GeneratedReview[]> = ${json};\n`,
  'utf8',
);
console.log(`Generated ${total} reviews across ${tours.length} tour pages.`);
