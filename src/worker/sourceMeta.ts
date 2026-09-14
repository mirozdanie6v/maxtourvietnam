export type PageMeta = { title: string; description: string };

const defaultDescription = 'Экскурсии Max Tour во Вьетнаме. Маленькие группы, русские гиды, комфорт и честные цены.';

const tourTitles: Record<string, string> = {
  '/dnevnaya-obzornaya-ekskursiya-po-nyachangu': 'Дневная обзорная экскурсия по Нячангу',
  '/vechernyaya-obzornaya-ekskursiya-po-nyachangu': 'Вечерняя обзорная экскурсия по Нячангу',
  '/danang-i-hoyan-na-2-dnya-iz-nyachanga': 'Экскурсия в Дананг и Хойан на 2 дня из Нячанга',
  '/ekskursiya-v-saygon-na-2-dnya-iz-nyachanga': 'Экскурсия в Сайгон на 2 дня из Нячанга',
  '/ekskursiya-v-danang-iz-nyachanga': 'Экскурсия в Дананг из Нячанга',
  '/ekskursiya-v-saygon-iz-nyachanga': 'Экскурсия в Сайгон из Нячанга',
  '/ekskursiya-v-fanrang-iz-nyachanga': 'Экскурсия в Фанранг из Нячанга',
  '/ekskursiya-v-fuyen-iz-nyachanga': 'Экскурсия в Фуйен из Нячанга',
  '/ekskursiya-v-dalat-na-2-dnya-iz-nyachanga': 'Экскурсия в Далат на 2 дня из Нячанга',
  '/ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga': 'Экскурсия в Далат со стеклянным мостом из Нячанга',
  '/vip-ekskursiya-v-dalat-iz-nyachanga': 'Экскурсия в Далат "ВИП" из Нячанга',
  '/ekskursiya-v-dalat-iz-nyachanga-premium': 'Экскурсия в Далат из Нячанга Премиум',
  '/ostrov-doidep-nyachang': 'Экскурсия на Остров Дойдеп (Doidep) в Нячанге',
  '/vinwonders-marriott-nyachang-2-dnya': 'Экскурсия на Винперл и отель Marriott, Нячанг, тур на 2 дня',
  '/ostrov-hon-tam-nyachang': 'Экскурсия на Остров Хон Там в Нячанге',
  '/rybalka-na-ozere-nyachang': 'Рыбалка на озере в Нячанге',
  '/ostrov-orhidey-i-obezian-nyachang': 'Экскурсия на Остров Орхидей и Остров Обезьян',
  '/morskaya-rybalka-nyachang': 'Морская рыбалка в Нячанге на приватном катере',
  '/kruiz-marmoris-nyachang': 'Круиз Marmoris в Нячанге',
  '/kruiz-emperor-nyachang': 'Круиз Emperor в Нячанге',
  '/kruiz-na-katamarane-nyachang': 'Круиз на катамаране в Нячанге',
  '/zipline-i-verevochnyj-park-v-nyachange': 'Экскурсия Зиплайн и веревочный парк в Нячанге',
  '/kvadrocikly-v-nyachange': 'Квадроциклы в Нячанге',
  '/dayving-i-snorkling-v-nyachange': 'Дайвинг и Снорклинг в Нячанге',
  '/ekskursiya-v-daklak-iz-nyachanga': 'Экскурсия в Даклак из Нячанга',
  '/termalnye-istochniki-yang-bay-iz-nyachanga': 'Экскурсия в Термальные источники Янг Бэй',
  '/dzip-tur-v-nyachange': 'Джип-тур в Нячанге',
  '/ekskursiya-baho-zoklet-iz-nyachanga': 'Экскурсия на водопад Бахо и пляж Зоклет из Нячанга',
};

const descriptions: Record<string, string> = {
  '/vinwonders-marriott-nyachang-2-dnya': 'VinWonders Нячанг + Marriott на острове Хон Тре - тур 2 дня. Маленькие группы, русские гиды, комфорт и честные цены.',
  '/termalnye-istochniki-yang-bay-iz-nyachanga': 'Экскурсия в Янг Бэй из Нячанга - цены, программа экскурсии. Маленькие группы, русские гиды, комфорт и честные цены.',
  '/ekskursiya-baho-zoklet-iz-nyachanga': 'Водопад Бахо и пляж Зоклет - цены, программа экскурсии. Маленькие группы, русские гиды, комфорт и честные цены.',
};

export function sourceMeta(pathname: string): PageMeta | null {
  if (pathname === '/') return { title: 'Max Tour - Экскурсионное бюро во Вьетнаме', description: 'Экскурсии в Нячанге' };
  if (pathname === '/katalog-nyachang') return { title: 'Экскурсии из Нячанга — MAX TOUR', description: 'Каталог экскурсий из Нячанга MAX TOUR.' };
  if (pathname === '/premium-ekskursii-vetnam') return { title: 'Премиум экскурсии во Вьетнаме — MAX TOUR', description: 'Премиум экскурсии MAX TOUR во Вьетнаме.' };
  const title = tourTitles[pathname];
  return title ? { title, description: descriptions[pathname] || defaultDescription } : null;
}
