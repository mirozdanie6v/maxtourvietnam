const url = 'https://maxtourvietnam.com/dnevnaya-obzornaya-ekskursiya-po-nyachangu';
const response = await fetch(url, {
  redirect: 'follow',
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
  },
});
const html = await response.text();
console.log(`status=${response.status} length=${html.length}`);
for (const needle of ['Отзывы', 'Михаил', 'rec2343430183', '2343430183', '1779697604747']) {
  console.log(`${needle}: ${html.includes(needle)}`);
}

const decode = (input) => input
  .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
  .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)))
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');

function visibleLines(source) {
  let text = source
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

const lines = visibleLines(html);
console.log(`visible-lines=${lines.length}`);
const reviewIndexes = lines.map((line, index) => ({ line, index })).filter(({ line }) => /отзывы/i.test(line));
console.log(`review-markers=${JSON.stringify(reviewIndexes.slice(-5))}`);
for (const marker of reviewIndexes.slice(-2)) {
  console.log(`VISIBLE AROUND REVIEW index=${marker.index}:`);
  for (const [offset, line] of lines.slice(Math.max(0, marker.index - 20), marker.index + 24).entries()) {
    console.log(`${Math.max(0, marker.index - 20) + offset}: ${line}`);
  }
}
