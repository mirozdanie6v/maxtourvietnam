export type Tour = {
  slug: string;
  title: string;
  image: string;
  category: 'Нячанг' | 'Премиум' | 'Другие города';
  sourceUrl: string;
};

export const brand = {
  logo: 'https://static.tildacdn.one/tild3138-3137-4031-a331-373835366439/____1680_x_600_-2.svg',
  heroImage: 'https://static.tildacdn.one/tild3063-6230-4266-b063-313839663461/____1680_x_600_-4.jpg',
  phone: '+84384850407',
  email: 'maxtournhatrang@gmail.com',
  instagram: 'https://www.instagram.com/maxtourvietnam/',
  telegram: 'https://t.me/maxtournhatrang',
  managerTelegram: 'https://t.me/manager_po_ekskursiyam',
  whatsapp: 'https://wa.me/84384850407',
};

export const tours: Tour[] = [
  {
    slug: 'vechernyaya-obzornaya-ekskursiya-po-nyachangu',
    title: 'Вечерняя обзорная экскурсия по Нячангу',
    image: 'https://static.tildacdn.one/tild3561-3935-4830-b462-323432643731/nha-trang-city-tour-.png',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/vechernyaya-obzornaya-ekskursiya-po-nyachangu',
  },
  {
    slug: 'ekskursiya-v-fuyen-iz-nyachanga',
    title: 'Экскурсия в провинцию Фуйен',
    image: 'https://static.tildacdn.one/tild3931-3439-4539-b865-623431343161/Phu-yen_3.png',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-fuyen-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-dalat-na-2-dnya-iz-nyachanga',
    title: 'Экскурсия в Далат на 2 дня из Нячанга',
    image: 'https://static.tildacdn.net/tild3231-6337-4638-a134-303463303839/IMG_20251030_130346_.jpg',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-dalat-na-2-dnya-iz-nyachanga',
  },
  {
    slug: 'vip-ekskursiya-v-dalat-iz-nyachanga',
    title: 'Экскурсия в Далат «ВИП» из Нячанга',
    image: 'https://static.tildacdn.one/tild3036-6635-4135-b631-636538376635/10.jpg',
    category: 'Премиум',
    sourceUrl: 'https://maxtourvietnam.com/vip-ekskursiya-v-dalat-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-dalat-iz-nyachanga-premium',
    title: 'Экскурсия в Далат из Нячанга Премиум',
    image: 'https://static.tildacdn.one/tild3334-3434-4230-a637-383934633961/11.jpg',
    category: 'Премиум',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-dalat-iz-nyachanga-premium',
  },
  {
    slug: 'dnevnaya-obzornaya-ekskursiya-po-nyachangu',
    title: 'Дневная обзорная экскурсия по Нячангу',
    image: 'https://static.tildacdn.one/tild6638-6230-4633-b838-366163306231/nha-trang-city-tour-.png',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/dnevnaya-obzornaya-ekskursiya-po-nyachangu',
  },
  {
    slug: 'ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga',
    title: 'Экскурсия в Далат со стеклянным мостом из Нячанга',
    image: 'https://static.tildacdn.one/tild3539-6164-4030-b562-613039326233/13.jpg',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-baho-zoklet-iz-nyachanga',
    title: 'Экскурсия на водопад Бахо и пляж Зоклет',
    image: 'https://static.tildacdn.one/tild3732-3461-4265-a662-383135643934/12.jpg',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-baho-zoklet-iz-nyachanga',
  },
  {
    slug: 'ostrov-hon-tam-nyachang',
    title: 'Остров Хон Там',
    image: 'https://static.tildacdn.one/tild3861-6231-4462-a235-663762633665/ostrov-hon-tam-2.png',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/ostrov-hon-tam-nyachang',
  },
  {
    slug: 'ostrov-orhidey-i-obezian-nyachang',
    title: 'Остров Орхидей и остров Обезьян',
    image: 'https://static.tildacdn.one/tild3434-6534-4637-a137-383063623031/ostrov-orhidey-i-obe.png',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/ostrov-orhidey-i-obezian-nyachang',
  },
  {
    slug: 'dayving-i-snorkling-v-nyachange',
    title: 'Дайвинг и снорклинг в Нячанге',
    image: 'https://static.tildacdn.one/tild6239-6432-4331-a533-633333326634/extrim-1.png',
    category: 'Нячанг',
    sourceUrl: 'https://maxtourvietnam.com/dayving-i-snorkling-v-nyachange',
  },
  {
    slug: 'ekskursiya-v-danang-iz-nyachanga',
    title: 'Экскурсия в Дананг из Нячанга',
    image: 'https://static.tildacdn.one/tild6630-3532-4338-b331-386631393866/danang-13.png',
    category: 'Другие города',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-danang-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-saygon-iz-nyachanga',
    title: 'Экскурсия в Сайгон из Нячанга',
    image: 'https://static.tildacdn.one/tild6135-6531-4963-a264-613866353466/saigon-tour-10.png',
    category: 'Другие города',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-saygon-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-fanrang-iz-nyachanga',
    title: 'Экскурсия в Фанранг из Нячанга',
    image: 'https://static.tildacdn.one/tild6138-6264-4135-b235-313662326165/_-3.jpg',
    category: 'Другие города',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-fanrang-iz-nyachanga',
  },
];

export const sidebarLinks = [
  ['Главная', '/'],
  ['Экскурсии Дананга', '/tours/danang'],
  ['Блог', '/blog'],
  ['О нас', '/about'],
  ['Экскурсии Фукуока', '/tours/phu-quoc'],
  ['Экскурсии Муйне/Фантьета', '/tours/mui-ne'],
  ['Экскурсии Ханоя', '/tours/hanoi'],
  ['Премиум экскурсии', '/premium-ekskursii-vetnam'],
  ['Экскурсии Нячанга', '/katalog-nyachang'],
] as const;
