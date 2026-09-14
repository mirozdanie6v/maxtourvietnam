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
const probes = ['rec2343430183', 'Отзывы', 'Михаил'];
for (const probe of probes) {
  const i = html.indexOf(probe);
  if (i >= 0) console.log(`AROUND ${probe}: ${html.slice(Math.max(0, i - 400), i + 1200).replace(/\s+/g, ' ')}`);
}
const escapedReview = html.match(/\\u041e\\u0442\\u0437\\u044b\\u0432[^"']*/i);
console.log(`escaped-review-match=${Boolean(escapedReview)}`);
if (escapedReview) console.log(escapedReview[0].slice(0, 500));
