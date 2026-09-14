const urls = [
  'https://maxtourvietnam.com/dnevnaya-obzornaya-ekskursiya-po-nyachangu',
  'https://maxtourvietnam.com/danang-i-hoyan-na-2-dnya-iz-nyachanga',
  'https://maxtourvietnam.com/vinwonders-marriott-nyachang-2-dnya',
  'https://maxtourvietnam.com/zipline-i-verevochnyj-park-v-nyachange',
];

const headers = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36',
  'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
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

function clean(html) {
  return decode(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(div|p|li|h1|h2|h3|h4|h5|h6|span|strong|b)>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' | ');
}

for (const url of urls) {
  const response = await fetch(url, { headers, redirect: 'follow' });
  const html = await response.text();
  console.log(`\n===== ${url} status=${response.status} bytes=${html.length} =====`);
  const starts = [...html.matchAll(/<div\s+id=["']rec(\d+)["'][^>]*class=["'][^"']*\br\s+t-rec\b[^"']*["'][^>]*>/gi)];
  for (let i = 0; i < starts.length; i += 1) {
    const match = starts[i];
    const start = match.index;
    const end = i + 1 < starts.length ? starts[i + 1].index : html.length;
    const opening = match[0];
    const type = opening.match(/data-record-type=["']([^"']+)/i)?.[1] || '?';
    const text = clean(html.slice(start, end));
    if (text.length < 18) continue;
    console.log(`REC ${match[1]} type=${type}: ${text.slice(0, 850)}`);
  }
}
