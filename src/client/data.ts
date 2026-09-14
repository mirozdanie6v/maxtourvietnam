export type TourCategory = 'Нячанг' | 'Премиум' | 'Другие города';
export type TourBadge = 'новинка' | 'хит лета' | 'эксклюзив' | 'супер';

export type Tour = {
  slug: string;
  title: string;
  image: string;
  category: TourCategory;
  sourceUrl: string;
  adultPrice: number;
  childPrice?: number;
  badge?: TourBadge;
  popular?: boolean;
};

export const brand = {
  logo: 'https://static.tildacdn.one/tild3138-3137-4031-a331-373835366439/____1680_x_600_-2.svg',
  brandImage: 'https://static.tildacdn.one/tild3938-3763-4364-a165-666362383464/Max_Tour-3.jpg',
  heroImage: 'https://static.tildacdn.one/tild3037-3338-4836-a362-336236666631/Max_Tour-4.jpg',
  phone: '+84384850407',
  email: 'maxtournhatrang@gmail.com',
  instagram: 'https://www.instagram.com/maxtourvietnam/',
  telegram: 'https://t.me/maxtournhatrang',
  managerTelegram: 'https://t.me/manager_po_ekskursiyam',
  whatsapp: 'https://wa.me/84384850407',
  maxMessenger: 'https://max.ru/u/f9LHodD0cOJQGE6a59IAQqjiCYN9YO-yF_cBvgPtZLPAksl7TPfP-HZ5dpM',
};

export const heroSlides = [
  'https://static.tildacdn.one/tild3037-3338-4836-a362-336236666631/Max_Tour-4.jpg',
  'https://static.tildacdn.one/tild6364-3464-4566-a261-623638643137/2.png',
  'https://static.tildacdn.one/tild6362-3037-4265-b638-323665613039/29.png',
  'https://static.tildacdn.one/tild6164-3530-4135-a237-303861393436/26.png',
  'https://static.tildacdn.one/tild6531-3964-4237-b662-376264393936/_.jpg',
  'https://static.tildacdn.one/tild3333-6437-4133-b165-333831306339/11.png',
  'https://static.tildacdn.one/tild6265-3761-4865-a137-303939326638/10.png',
  'https://static.tildacdn.one/tild6561-6665-4830-a231-633537383732/12.png',
  'https://static.tildacdn.one/tild3862-3535-4034-b833-313639636565/13.png',
  'https://static.tildacdn.one/tild3063-6230-4266-b063-313839663461/____1680_x_600_-4.jpg',
];

export const tours: Tour[] = [
  {
    slug: 'dnevnaya-obzornaya-ekskursiya-po-nyachangu', title: 'Дневная обзорная экскурсия по Нячангу',
    image: 'https://static.tildacdn.one/tild6561-6665-4830-a231-633537383732/12.png', category: 'Нячанг', adultPrice: 35, childPrice: 25, badge: 'хит лета', popular: true,
    sourceUrl: 'https://maxtourvietnam.com/dnevnaya-obzornaya-ekskursiya-po-nyachangu',
  },
  {
    slug: 'vechernyaya-obzornaya-ekskursiya-po-nyachangu', title: 'Вечерняя обзорная экскурсия по Нячангу',
    image: 'https://static.tildacdn.one/tild3862-3535-4034-b833-313639636565/13.png', category: 'Нячанг', adultPrice: 48, childPrice: 35, badge: 'новинка', popular: true,
    sourceUrl: 'https://maxtourvietnam.com/vechernyaya-obzornaya-ekskursiya-po-nyachangu',
  },
  {
    slug: 'danang-i-hoyan-na-2-dnya-iz-nyachanga', title: 'Дананг и Хоян на 2 дня из Нячанга',
    image: 'https://static.tildacdn.one/tild3333-6437-4133-b165-333831306339/11.png', category: 'Другие города', adultPrice: 215, childPrice: 165, badge: 'хит лета', popular: true,
    sourceUrl: 'https://maxtourvietnam.com/danang-i-hoyan-na-2-dnya-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-saygon-na-2-dnya-iz-nyachanga', title: 'Экскурсия в Сайгон на 2 дня из Нячанга',
    image: 'https://static.tildacdn.one/tild3031-6166-4533-b034-666432363439/9.png', category: 'Другие города', adultPrice: 200, childPrice: 150, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-saygon-na-2-dnya-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-danang-iz-nyachanga', title: 'Экскурсия в Дананг из Нячанга',
    image: 'https://static.tildacdn.one/tild6265-3761-4865-a137-303939326638/10.png', category: 'Другие города', adultPrice: 150, childPrice: 113, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-danang-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-saygon-iz-nyachanga', title: 'Экскурсия в Сайгон из Нячанга',
    image: 'https://static.tildacdn.one/tild3230-3063-4535-b031-313737346666/8.png', category: 'Другие города', adultPrice: 150, childPrice: 110, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-saygon-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-fanrang-iz-nyachanga', title: 'Экскурсия в Фанранг из Нячанга',
    image: 'https://static.tildacdn.one/tild3033-6335-4666-b731-363239636533/5.png', category: 'Другие города', adultPrice: 45, childPrice: 31, badge: 'новинка',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-fanrang-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-fuyen-iz-nyachanga', title: 'Экскурсия в Фуен из Нячанга',
    image: 'https://static.tildacdn.one/tild3465-3666-4537-b237-363730356339/6.png', category: 'Нячанг', adultPrice: 40, childPrice: 30, badge: 'новинка', popular: true,
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-fuyen-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-dalat-na-2-dnya-iz-nyachanga', title: 'Экскурсия в Далат на 2 дня из Нячанга',
    image: 'https://static.tildacdn.one/tild6665-6438-4166-a435-663338323262/3.png', category: 'Нячанг', adultPrice: 110, childPrice: 79, badge: 'хит лета', popular: true,
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-dalat-na-2-dnya-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga', title: 'Экскурсия в Далат со стеклянным мостом из Нячанга',
    image: 'https://static.tildacdn.one/tild6364-3464-4566-a261-623638643137/2.png', category: 'Нячанг', adultPrice: 60, childPrice: 45, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga',
  },
  {
    slug: 'vip-ekskursiya-v-dalat-iz-nyachanga', title: 'VIP экскурсия в Далат из Нячанга',
    image: 'https://static.tildacdn.one/tild3536-6562-4632-b564-393961346366/4.png', category: 'Премиум', adultPrice: 45, childPrice: 35, badge: 'новинка', popular: true,
    sourceUrl: 'https://maxtourvietnam.com/vip-ekskursiya-v-dalat-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-dalat-iz-nyachanga-premium', title: 'Экскурсия в Далат из Нячанга Premium',
    image: 'https://static.tildacdn.one/tild6232-3736-4363-b364-323135306337/1.png', category: 'Премиум', adultPrice: 52, childPrice: 43, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-dalat-iz-nyachanga-premium',
  },
  {
    slug: 'ostrov-doidep-nyachang', title: 'Остров Дойдеп Нячанг',
    image: 'https://static.tildacdn.one/tild6537-3962-4134-b630-326630613066/ostrov-doidep-2.png', category: 'Нячанг', adultPrice: 75, childPrice: 55, badge: 'эксклюзив',
    sourceUrl: 'https://maxtourvietnam.com/ostrov-doidep-nyachang',
  },
  {
    slug: 'vinwonders-marriott-nyachang-2-dnya', title: 'VinWonders + Marriott Нячанг, 2 дня',
    image: 'https://static.tildacdn.net/tild3539-6138-4139-b861-313231316566/vinwonders-marriott-.png', category: 'Премиум', adultPrice: 220, badge: 'супер',
    sourceUrl: 'https://maxtourvietnam.com/vinwonders-marriott-nyachang-2-dnya',
  },
  {
    slug: 'ostrov-hon-tam-nyachang', title: 'Остров Хон Там Нячанг',
    image: 'https://static.tildacdn.one/tild3861-6231-4462-a235-663762633665/ostrov-hon-tam-2.png', category: 'Нячанг', adultPrice: 45, childPrice: 35, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ostrov-hon-tam-nyachang',
  },
  {
    slug: 'rybalka-na-ozere-nyachang', title: 'Рыбалка на озере Нячанг',
    image: 'https://static.tildacdn.one/tild6666-6332-4139-a238-313334393035/rybalka-na-ozere-nya.png', category: 'Нячанг', adultPrice: 35, childPrice: 25, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/rybalka-na-ozere-nyachang',
  },
  {
    slug: 'ostrov-orhidey-i-obezian-nyachang', title: 'Остров орхидей и обезьян Нячанг',
    image: 'https://static.tildacdn.one/tild3434-6534-4637-a137-383063623031/ostrov-orhidey-i-obe.png', category: 'Нячанг', adultPrice: 36, childPrice: 28, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ostrov-orhidey-i-obezian-nyachang',
  },
  {
    slug: 'morskaya-rybalka-nyachang', title: 'Морская рыбалка Нячанг',
    image: 'https://static.tildacdn.one/tild6566-6533-4266-a531-333961333866/morskaya-rybalka-.png', category: 'Премиум', adultPrice: 300, badge: 'эксклюзив',
    sourceUrl: 'https://maxtourvietnam.com/morskaya-rybalka-nyachang',
  },
  {
    slug: 'kruiz-marmoris-nyachang', title: 'Круиз Marmoris Нячанг',
    image: 'https://static.tildacdn.one/tild3633-3061-4139-b231-643531363761/14D42C84-0A6F-461C-9.jpg', category: 'Премиум', adultPrice: 98, childPrice: 79, badge: 'новинка',
    sourceUrl: 'https://maxtourvietnam.com/kruiz-marmoris-nyachang',
  },
  {
    slug: 'kruiz-emperor-nyachang', title: 'Круиз Emperor Нячанг',
    image: 'https://static.tildacdn.one/tild6362-3431-4932-b761-626631336564/kruiz-emperor-6.png', category: 'Премиум', adultPrice: 90, childPrice: 67, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/kruiz-emperor-nyachang',
  },
  {
    slug: 'kruiz-na-katamarane-nyachang', title: 'Круиз на катамаране Нячанг',
    image: 'https://static.tildacdn.one/tild3635-3132-4639-b934-376331643765/0BAD15B0-60EF-4433-9.jpg', category: 'Премиум', adultPrice: 75, childPrice: 55, badge: 'эксклюзив',
    sourceUrl: 'https://maxtourvietnam.com/kruiz-na-katamarane-nyachang',
  },
  {
    slug: 'zipline-i-verevochnyj-park-v-nyachange', title: 'Зиплайн и верёвочный парк в Нячанге',
    image: 'https://static.tildacdn.net/tild3938-3237-4737-b234-343333626633/extrim-22.png', category: 'Нячанг', adultPrice: 58, childPrice: 40, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/zipline-i-verevochnyj-park-v-nyachange',
  },
  {
    slug: 'kvadrocikly-v-nyachange', title: 'Квадроциклы в Нячанге',
    image: 'https://static.tildacdn.net/tild3363-3932-4763-a337-333230623937/extrim-21.png', category: 'Нячанг', adultPrice: 64, childPrice: 45, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/kvadrocikly-v-nyachange',
  },
  {
    slug: 'dayving-i-snorkling-v-nyachange', title: 'Дайвинг и снорклинг в Нячанге',
    image: 'https://static.tildacdn.one/tild6239-6432-4331-a533-633333326634/extrim-1.png', category: 'Нячанг', adultPrice: 90, childPrice: 45, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/dayving-i-snorkling-v-nyachange',
  },
  {
    slug: 'ekskursiya-v-daklak-iz-nyachanga', title: 'Экскурсия в Даклак из Нячанга',
    image: 'https://static.tildacdn.one/tild6234-3865-4263-a230-343463326331/7.png', category: 'Другие города', adultPrice: 1000, badge: 'эксклюзив',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-daklak-iz-nyachanga',
  },
  {
    slug: 'termalnye-istochniki-yang-bay-iz-nyachanga', title: 'Термальные источники Янг Бэй из Нячанга',
    image: 'https://static.tildacdn.one/tild3162-3537-4034-b165-373239396436/30.png', category: 'Нячанг', adultPrice: 34, childPrice: 24, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/termalnye-istochniki-yang-bay-iz-nyachanga',
  },
  {
    slug: 'dzip-tur-v-nyachange', title: 'Джип-тур в Нячанге',
    image: 'https://static.tildacdn.one/tild6635-3366-4362-b039-613562343330/17.png', category: 'Нячанг', adultPrice: 90, childPrice: 65, badge: 'новинка',
    sourceUrl: 'https://maxtourvietnam.com/dzip-tur-v-nyachange',
  },
  {
    slug: 'ekskursiya-baho-zoklet-iz-nyachanga', title: 'Экскурсия Бахо — Зоклет из Нячанга',
    image: 'https://static.tildacdn.one/tild6362-3037-4265-b638-323665613039/29.png', category: 'Нячанг', adultPrice: 36, childPrice: 26, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-baho-zoklet-iz-nyachanga',
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
