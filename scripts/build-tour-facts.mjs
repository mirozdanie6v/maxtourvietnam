import { readFile, writeFile } from 'node:fs/promises';

const DATA_FILE = 'src/client/data.ts';
const DETAILS_FILE = 'src/client/tourDetails.ts';

let dataSource = await readFile(DATA_FILE, 'utf8');
let detailsSource = await readFile(DETAILS_FILE, 'utf8');

const existing = new Set([...detailsSource.matchAll(/^\s*'([^']+)':\s*\{/gm)].map((match) => match[1]));
const tours = [...dataSource.matchAll(/\{\s*slug:\s*'([^']+)'([\s\S]*?)sourceUrl:\s*'([^']+)'[\s\S]*?\}/g)].map((match) => {
  const body = match[2];
  return {
    slug: match[1],
    sourceUrl: match[3],
    adultPrice: Number(body.match(/adultPrice:\s*(\d+)/)?.[1] || 0),
    childPrice: body.match(/childPrice:\s*(\d+)/)?.[1] ? Number(body.match(/childPrice:\s*(\d+)/)[1]) : undefined,
  };
});

const decode = (input) => input
  .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
  .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)))
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');

const stripTags = (input) => decode(input.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const norm = (input) => input.toLowerCase().replace(/[«»"'():–—-]/g, ' ').replace(/\s+/g, ' ').trim();

function visibleLines(html) {
  let text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(div|p|li|h1|h2|h3|h4|h5|h6|section|article|strong|b)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  text = decode(text);
  return text.split(/\n+/).map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

function strongTexts(html) {
  const items = [];
  const seen = new Set();
  for (const match of html.matchAll(/<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi)) {
    const text = stripTags(match[1]);
    const key = norm(text);
    if (!text || seen.has(key)) continue;
    seen.add(key);
    items.push(text);
  }
  return items;
}

const isSchedule = (line) => /сбор участников|возвращение (?:в|из|в нячанг)|возвращение в отель/i.test(line);
const isPriceLine = (line) => /\$|бесплат|по запросу|рассчитывается/i.test(line);
const sectionIndex = (lines, pattern, from = 0) => lines.findIndex((line, index) => index >= from && pattern.test(line));

function collectSection(lines, startPattern, endPatterns) {
  const start = sectionIndex(lines, startPattern);
  if (start < 0) return [];
  let end = lines.length;
  for (const pattern of endPatterns) {
    const found = sectionIndex(lines, pattern, start + 1);
    if (found >= 0) end = Math.min(end, found);
  }
  return lines.slice(start + 1, end).filter((line) => line.length < 180 && !/^забронировать/i.test(line));
}

function parseFacts(html, fallback) {
  const lines = visibleLines(html);
  const strong = strongTexts(html);
  const scheduleEntries = lines.filter(isSchedule).filter((line, index, all) => all.indexOf(line) === index).slice(0, 6);
  const firstSchedule = lines.findIndex(isSchedule);
  const priceAreaEnd = firstSchedule >= 0 ? firstSchedule : Math.min(lines.length, 120);
  const priceArea = lines.slice(0, priceAreaEnd);

  const groupMarker = priceArea.findIndex((line) => /цена групповой экскурсии/i.test(line));
  const privateMarker = priceArea.findIndex((line) => /цена индивидуальной экскурсии|стоимость индивидуальной экскурсии/i.test(line));

  let groupPrices = [];
  if (groupMarker >= 0) {
    const end = privateMarker > groupMarker ? privateMarker : priceArea.length;
    groupPrices = priceArea.slice(groupMarker + 1, end).filter((line) => isPriceLine(line) || /цена групповой экскурсии/i.test(line)).slice(0, 12);
  }
  if (!groupPrices.length && fallback.adultPrice) {
    groupPrices = [`Взрослые — ${fallback.adultPrice}$`, ...(fallback.childPrice !== undefined ? [`Дети — ${fallback.childPrice}$`] : [])];
  }

  let privatePrices = [];
  if (privateMarker >= 0) {
    privatePrices = priceArea.slice(privateMarker + 1).filter(isPriceLine).slice(0, 12);
    if (!privatePrices.length && /по запросу|рассчитывается/i.test(priceArea[privateMarker])) privatePrices = [priceArea[privateMarker]];
  }

  const lastScheduleIndex = scheduleEntries.length
    ? Math.max(...scheduleEntries.map((entry) => lines.indexOf(entry)))
    : priceAreaEnd;
  const programEndCandidates = [
    /в стоимость включено/i,
    /^включено:?$/i,
    /что входит/i,
    /что взять/i,
    /^забронировать тур/i,
    /часто задаваемые вопросы/i,
  ].map((pattern) => sectionIndex(lines, pattern, lastScheduleIndex + 1)).filter((index) => index >= 0);
  const programEnd = programEndCandidates.length ? Math.min(...programEndCandidates) : Math.min(lines.length, lastScheduleIndex + 80);
  const programLines = lines.slice(lastScheduleIndex + 1, programEnd);

  const excludedStrong = /цена|сбор участников|возвращение|забронировать|локации|день \d|программа|включено|что взять|важно|взросл|дети|бесплат|\$/i;
  const locationNames = strong.filter((item) => {
    if (excludedStrong.test(item) || item.length > 110 || item.length < 2) return false;
    const key = norm(item);
    return programLines.some((line) => norm(line) === key || norm(line).startsWith(`${key} `));
  }).slice(0, 18);

  const locations = locationNames.map((name, index) => {
    const start = programLines.findIndex((line) => norm(line) === norm(name) || norm(line).startsWith(`${norm(name)} `));
    const nextName = locationNames[index + 1];
    const next = nextName ? programLines.findIndex((line, lineIndex) => lineIndex > start && (norm(line) === norm(nextName) || norm(line).startsWith(`${norm(nextName)} `))) : -1;
    const end = next > start ? next : Math.min(programLines.length, start + 4);
    const description = start >= 0
      ? programLines.slice(start + 1, end).filter((line) => !excludedStrong.test(line) && line.length < 240).slice(0, 2).join(' ')
      : '';
    return description ? { name, description } : { name };
  });

  const included = collectSection(lines, /в стоимость включено|^включено:?$/i, [/что взять/i, /^забронировать/i, /часто задаваемые/i])
    .filter((line) => line.length < 160).slice(0, 12);
  const bring = collectSection(lines, /что взять/i, [/^забронировать/i, /часто задаваемые/i, /отзывы/i])
    .filter((line) => line.length < 160).slice(0, 12);

  let notice;
  const important = lines.findIndex((line) => /^важно!?/i.test(line));
  if (important >= 0) notice = lines.slice(important, important + 4).join(' ').slice(0, 500);

  return { schedule: scheduleEntries, locations, groupPrices, privatePrices, included, bring, notice };
}

const generated = {};
for (const [index, tour] of tours.entries()) {
  if (existing.has(tour.slug)) continue;
  const response = await fetch(tour.sourceUrl, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0 MAX-TOUR-Content-Migration/1.0' },
  });
  if (!response.ok) throw new Error(`Failed ${response.status} ${tour.sourceUrl}`);
  generated[tour.slug] = parseFacts(await response.text(), tour);
  console.log(`[facts ${index + 1}/${tours.length}] ${tour.slug}: ${generated[tour.slug].locations.length} locations`);
}

const entries = Object.entries(generated).map(([slug, detail]) => {
  const compact = Object.fromEntries(Object.entries(detail).filter(([, value]) => Array.isArray(value) ? value.length : Boolean(value)));
  return `  ${JSON.stringify(slug)}: ${JSON.stringify(compact, null, 2).replace(/^/gm, '  ')},`;
}).join('\n');

if (entries) {
  const closing = detailsSource.lastIndexOf('\n};');
  if (closing < 0) throw new Error('Could not locate tourDetails object closing token.');
  detailsSource = `${detailsSource.slice(0, closing)}\n${entries}${detailsSource.slice(closing)}`;
  await writeFile(DETAILS_FILE, detailsSource, 'utf8');
}

for (const [slug, detail] of Object.entries(generated)) {
  const adult = detail.groupPrices.find((line) => /взросл/i.test(line))?.match(/(\d+(?:[.,]\d+)?)\s*\$/)?.[1];
  const child = detail.groupPrices.find((line) => /дети/i.test(line) && !/бесплат/i.test(line))?.match(/(\d+(?:[.,]\d+)?)\s*\$/)?.[1];
  if (!adult && !child) continue;
  const objectPattern = new RegExp(`(slug:\\s*'${slug.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}'[\\s\\S]*?)(sourceUrl:)`);
  const match = dataSource.match(objectPattern);
  if (!match) continue;
  let body = match[1];
  if (adult) body = body.replace(/adultPrice:\s*\d+(?:\.\d+)?/, `adultPrice: ${adult.replace(',', '.')}`);
  if (child && /childPrice:\s*\d/.test(body)) body = body.replace(/childPrice:\s*\d+(?:\.\d+)?/, `childPrice: ${child.replace(',', '.')}`);
  dataSource = dataSource.replace(match[1], body);
}
await writeFile(DATA_FILE, dataSource, 'utf8');

console.log(`Generated structured facts for ${Object.keys(generated).length} previously incomplete tours.`);
