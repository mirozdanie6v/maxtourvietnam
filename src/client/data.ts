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

const managerText = encodeURIComponent('Добрый день. Меня интересует экскурсия...');
const whatsappText = encodeURIComponent('Добрый день! Меня интересует экскурсия');

export const brand = {
  logo: 'https://static.tildacdn.one/tild3138-3137-4031-a331-373835366439/____1680_x_600_-2.svg',
  brandImage: 'https://static.tildacdn.one/tild3037-3338-4836-a362-336236666631/Max_Tour-4.jpg',
  heroImage: 'https://static.tildacdn.one/tild3037-3338-4836-a362-336236666631/Max_Tour-4.jpg',
  phone: '+84384850407',
  email: 'maxtournhatrang@gmail.com',
  instagram: 'https://www.instagram.com/maxtourvietnam/',
  telegram: `https://t.me/manager_po_ekskursiyam?text=${managerText}`,
  telegramChannel: 'https://t.me/maxtournhatrang',
  managerTelegram: `https://t.me/manager_po_ekskursiyam?text=${managerText}`,
  whatsapp: `https://wa.me/84384850407?text=${whatsappText}`,
  maxMessenger: 'https://max.ru/u/f9LHodD0cOJQGE6a59IAQqjiCYN9YO-yF_cBvgPtZLPAksl7TPfP-HZ5dpM?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn56uHoupPGmSeywR4SMQvetY0rwX9rcG6D2JG2sQX_yBISRQQOqVDwVM0kEg_aem_NZs3VVg3ZPzvxSMEhrB30Q',
};

export const heroSlides = [
  'https://static.tildacdn.one/tild3063-6230-4266-b063-313839663461/____1680_x_600_-4.jpg',
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
    slug: 'danang-i-hoyan-na-2-dnya-iz-nyachanga', title: 'Экскурсия в Дананг и Хойан на 2 дня из Нячанга',
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
    slug: 'ekskursiya-v-fuyen-iz-nyachanga', title: 'Экскурсия в Фуйен из Нячанга',
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
    image: 'https://static.tildacdn.one/tild6364-3464-4566-a261-623638643137/2.png', category: 'Нячанг', adultPrice: 60, childPrice: 42, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-dalat-so-steklyannym-mostom-iz-nyachanga',
  },
  {
    slug: 'vip-ekskursiya-v-dalat-iz-nyachanga', title: 'Экскурсия в Далат "ВИП" из Нячанга',
    image: 'https://static.tildacdn.one/tild3536-6562-4632-b564-393961346366/4.png', category: 'Премиум', adultPrice: 45, childPrice: 32, badge: 'новинка', popular: true,
    sourceUrl: 'https://maxtourvietnam.com/vip-ekskursiya-v-dalat-iz-nyachanga',
  },
  {
    slug: 'ekskursiya-v-dalat-iz-nyachanga-premium', title: 'Экскурсия в Далат из Нячанга Премиум',
    image: 'https://static.tildacdn.one/tild6232-3736-4363-b364-323135306337/1.png', category: 'Премиум', adultPrice: 52, childPrice: 38, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-dalat-iz-nyachanga-premium',
  },
  {
    slug: 'ostrov-doidep-nyachang', title: 'Экскурсия на Остров Дойдеп (Doidep) в Нячанге',
    image: 'https://static.tildacdn.one/tild6537-3962-4134-b630-326630613066/ostrov-doidep-2.png', category: 'Нячанг', adultPrice: 75, childPrice: 55, badge: 'эксклюзив',
    sourceUrl: 'https://maxtourvietnam.com/ostrov-doidep-nyachang',
  },
  {
    slug: 'vinwonders-marriott-nyachang-2-dnya', title: 'Экскурсия на Винперл и отель Marriott, Нячанг, тур на 2 дня',
    image: 'https://static.tildacdn.net/tild3539-6138-4139-b861-313231316566/vinwonders-marriott-.png', category: 'Премиум', adultPrice: 220, badge: 'супер',
    sourceUrl: 'https://maxtourvietnam.com/vinwonders-marriott-nyachang-2-dnya',
  },
  {
    slug: 'ostrov-hon-tam-nyachang', title: 'Экскурсия на Остров Хон Там в Нячанге',
    image: 'https://static.tildacdn.one/tild3861-6231-4462-a235-663762633665/ostrov-hon-tam-2.png', category: 'Нячанг', adultPrice: 45, childPrice: 35, badge: 'хит лета',
    sourceUrl: 'https://maxtourvietnam.com/ostrov-hon-tam-nyachang',
  },
  {
    slug: 'rybalka-na-ozere-nyachang', title: 'Рыбалка на озере в Нячанге',
    image: 'https://static.tildacdn.one/tild6366-6637-4561-b031-313530623763/rybalka-na-ozere-2.png', category: 'Нячанг', adultPrice: 60, childPrice: 40,
    sourceUrl: 'https://maxtourvietnam.com/rybalka-na-ozere-nyachang',
  },
  {
    slug: 'ostrov-orhidey-i-ostrov-obezyan-nyachang', title: 'Остров Орхидей и Остров Обезьян в Нячанге',
    image: 'https://static.tildacdn.one/tild6339-3862-4230-a266-343630333034/26.png', category: 'Нячанг', adultPrice: 45, childPrice: 30,
    sourceUrl: 'https://maxtourvietnam.com/ostrov-orhidey-i-ostrov-obezyan-nyachang',
  },
  {
    slug: 'morskaya-rybalka-nyachang', title: 'Морская рыбалка в Нячанге',
    image: 'https://static.tildacdn.one/tild6536-6133-4161-a134-376663323632/25.png', category: 'Нячанг', adultPrice: 75, childPrice: 50,
    sourceUrl: 'https://maxtourvietnam.com/morskaya-rybalka-nyachang',
  },
  {
    slug: 'kruiz-marmoris-nyachang', title: 'Круиз Marmoris в Нячанге',
    image: 'https://static.tildacdn.one/tild6130-3632-4234-a138-333130303761/marmoris-2.png', category: 'Премиум', adultPrice: 180, badge: 'супер',
    sourceUrl: 'https://maxtourvietnam.com/kruiz-marmoris-nyachang',
  },
  {
    slug: 'kruiz-imperator-nyachang', title: 'Круиз Император в Нячанге',
    image: 'https://static.tildacdn.one/tild3635-3864-4165-b835-373361373637/2.png', category: 'Премиум', adultPrice: 95, badge: 'супер',
    sourceUrl: 'https://maxtourvietnam.com/kruiz-imperator-nyachang',
  },
  {
    slug: 'kruiz-na-katamarane-nyachang', title: 'Круиз на катамаране в Нячанге',
    image: 'https://static.tildacdn.one/tild6232-3065-4232-b230-333061323961/29.png', category: 'Премиум', adultPrice: 120, badge: 'супер',
    sourceUrl: 'https://maxtourvietnam.com/kruiz-na-katamarane-nyachang',
  },
  {
    slug: 'zipline-nyachang', title: 'Зиплайн в Нячанге',
    image: 'https://static.tildacdn.one/tild6165-3065-4236-a435-363434393831/15.png', category: 'Нячанг', adultPrice: 42, badge: 'новинка',
    sourceUrl: 'https://maxtourvietnam.com/zipline-nyachang',
  },
  {
    slug: 'kvadrocikly-nyachang', title: 'Квадроциклы в Нячанге',
    image: 'https://static.tildacdn.one/tild6433-6565-4538-b864-323636623036/10.png', category: 'Нячанг', adultPrice: 60, badge: 'новинка',
    sourceUrl: 'https://maxtourvietnam.com/kvadrocikly-nyachang',
  },
  {
    slug: 'dayving-i-snorkling-nyachang', title: 'Дайвинг и снорклинг в Нячанге',
    image: 'https://static.tildacdn.one/tild3562-3862-4635-a534-386365313533/8.png', category: 'Нячанг', adultPrice: 65,
    sourceUrl: 'https://maxtourvietnam.com/dayving-i-snorkling-nyachang',
  },
  {
    slug: 'ekskursiya-v-daklak-iz-nyachanga', title: 'Экскурсия в Даклак из Нячанга',
    image: 'https://static.tildacdn.one/tild3334-3032-4939-a133-623138373765/daklak-2.png', category: 'Другие города', adultPrice: 1000,
    sourceUrl: 'https://maxtourvietnam.com/ekskursiya-v-daklak-iz-nyachanga',
  },
  {
    slug: 'yang-bay-waterfall-nyachang', title: 'Экскурсия на водопад Янг Бэй из Нячанга',
    image: 'https://static.tildacdn.one/tild6430-3734-4664-b664-643532636331/yang-bay-2.png', category: 'Нячанг', adultPrice: 45, childPrice: 35,
    sourceUrl: 'https://maxtourvietnam.com/yang-bay-waterfall-nyachang',
  },
  {
    slug: 'jeep-tour-nyachang', title: 'Джип тур в Нячанге',
    image: 'https://static.tildacdn.one/tild3638-3733-4238-b234-666461333134/jeep-tour-2.png', category: 'Нячанг', adultPrice: 150,
    sourceUrl: 'https://maxtourvietnam.com/jeep-tour-nyachang',
  },
  {
    slug: 'baho-waterfall-zoklet-beach-nyachang', title: 'Экскурсия на водопад Бахо и пляж Зоклет из Нячанга',
    image: 'https://static.tildacdn.one/tild6536-6133-4161-a134-376663323632/25.png', category: 'Нячанг', adultPrice: 50, childPrice: 35,
    sourceUrl: 'https://maxtourvietnam.com/baho-waterfall-zoklet-beach-nyachang',
  },
];

export const sidebarLinks: Array<[string, string]> = [
  ['Главная', '/'],
  ['Экскурсии Дананга', '/page-not-found'],
  ['Блог', '/page-not-found'],
  ['О нас', '/page-not-found'],
  ['Экскурсии Фукуока', '/page-not-found'],
  ['Экскурсии Муйне/Фантьета', '/page-not-found'],
  ['Экскурсии Ханоя', '/page-not-found'],
  ['Премиум экскурсии', '/premium-ekskursii-vetnam'],
  ['Экскурсии Нячанга', '/katalog-nyachang'],
];
