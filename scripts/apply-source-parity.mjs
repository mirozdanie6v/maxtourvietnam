import { readFile, writeFile } from 'node:fs/promises';

const detailsPath = 'src/client/tourDetails.ts';
const dataPath = 'src/client/data.ts';
const seedPath = 'seed/tours.sql';

// Keep verified source-only corrections deterministic. This runs after the one-time
// source fact extraction and before typecheck/Vite, so legacy hand-written data
// cannot override confirmed values.
let details = await readFile(detailsPath, 'utf8');
const vipBlock = `  'vip-ekskursiya-v-dalat-iz-nyachanga': {
    schedule: ['5:00–5:30 — сбор участников из отелей', 'Около 20:00 — возвращение в Нячанг'],
    locations: [
      { name: 'Кофейные плантации', description: 'Знакомство с культурой вьетнамского кофе и дегустация.' },
      { name: 'Деревня хоббитов', description: 'Тематическая фотолокация в Далате.' },
      { name: 'Горный перевал', description: 'Панорамная дорога через горы и джунгли.' },
      { name: 'Глиняная деревня', description: 'Арт-парк и известные фотолокации.' },
      { name: 'Crazy House', description: 'Один из самых необычных архитектурных объектов Далата.' },
      { name: 'Пагода Линь Фуок', description: 'Буддийский храм с мозаичным декором.' },
      { name: 'Большой Золотой Будда', description: 'Одна из знаковых буддийских локаций программы.' },
      { name: 'Дегустация', description: 'Знакомство с местными продуктами Далата.' },
      { name: 'Обед в ресторане', description: 'Обед по программе.' },
      { name: 'Водопад Датанла', description: 'Горный водопад; дополнительные активности оплачиваются отдельно.' },
      { name: 'Кофейная ферма и зоопарк', description: 'Ферма с животными и дополнительными активностями.' },
    ],
    groupPrices: ['Взрослые — 45$', 'Дети ростом до 120 см — 32$', 'Дети до 2 лет — бесплатно'],
    privatePrices: ['1–2 человека — 350$', '3 человека — 400$', '4 человека — 450$', '5 человек — 480$', '6 человек — 510$'],
    notice: 'Для бронирования любой экскурсии в Далат необходимо предоставить ФИО и дату рождения всех участников. Эти данные требуются для оформления путевого листа туристической полицией.',
    included: ['Обед по программе', 'Входные билеты по программе', 'Русскоязычное сопровождение', 'Трансфер по программе', 'Вода для участников'],
    bring: ['Удобная одежда и обувь', 'Защита от солнца', 'Кофта', 'Дождевик', 'Деньги в донгах на личные расходы'],
    reviewTitle: 'Отзывы о «Далат ВИП»',
  },`;

const vipPattern = /  'vip-ekskursiya-v-dalat-iz-nyachanga': \{[\s\S]*?\n  \},\n  'rybalka-na-ozere-nyachang': \{/;
if (!vipPattern.test(details)) throw new Error('VIP Dalat legacy block was not found');
details = details.replace(vipPattern, `${vipBlock}\n  'rybalka-na-ozere-nyachang': {`);
await writeFile(detailsPath, details, 'utf8');

// Synchronize D1 display titles with the verified React catalog titles.
const data = await readFile(dataPath, 'utf8');
const titleMap = new Map();
for (const match of data.matchAll(/slug:\s*'([^']+)'\s*,\s*title:\s*'([^']+)'/g)) {
  titleMap.set(match[1], match[2]);
}

const verifiedChildPrices = new Map([
  ['ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga', 42],
  ['vip-ekskursiya-v-dalat-iz-nyachanga', 32],
  ['ekskursiya-v-dalat-iz-nyachanga-premium', 38],
]);

let seed = await readFile(seedPath, 'utf8');
const lines = seed.split('\n').map((line) => {
  const slugMatch = line.match(/^\('([^']+)',/);
  if (!slugMatch) return line;
  const slug = slugMatch[1];
  const title = titleMap.get(slug);
  if (title) {
    const safeTitle = title.replaceAll("'", "''");
    line = line.replace(new RegExp(`^(\\('${slug.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}',)'[^']*'`), `$1'${safeTitle}'`);
  }
  const child = verifiedChildPrices.get(slug);
  if (child !== undefined) {
    if (slug === 'ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga') line = line.replace(',60,45,', `,60,${child},`);
    if (slug === 'vip-ekskursiya-v-dalat-iz-nyachanga') line = line.replace(',45,35,', `,45,${child},`);
    if (slug === 'ekskursiya-v-dalat-iz-nyachanga-premium') line = line.replace(',52,43,', `,52,${child},`);
  }
  return line;
});
seed = lines.join('\n');
await writeFile(seedPath, seed, 'utf8');

console.log(`Applied source parity overrides and synchronized ${titleMap.size} D1 titles.`);
