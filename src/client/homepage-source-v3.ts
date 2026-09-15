import './homepage-source-v3.css';

const SOURCE = {
  hero: 'https://static.tildacdn.one/tild3938-3763-4364-a165-666362383464/Max_Tour-3.jpg',
  coupon: 'https://static.tildacdn.one/tild3864-3563-4137-b935-353938656338/_.png',
  fastTrack: 'https://static.tildacdn.one/tild3065-3462-4338-a336-613465323463/--.png',
  headerLogo: 'https://static.tildacdn.one/tild3138-3137-4031-a331-373835366439/____1680_x_600_-2.svg',
  footerLogo: 'https://static.tildacdn.one/tild3133-3731-4262-a663-313739663337/6.svg',
  benefits: [
    'https://static.tildacdn.one/tild6562-3037-4334-b838-636637663534/1.svg',
    'https://static.tildacdn.one/tild3464-6134-4064-a531-643135363734/3.svg',
    'https://static.tildacdn.one/tild3133-3731-4262-a663-313739663337/6.svg',
    'https://static.tildacdn.one/tild3163-6664-4337-b936-636566343534/2.svg',
    'https://static.tildacdn.one/tild3333-6265-4532-a233-383639396162/7.svg',
  ],
  popular: [
    'https://static.tildacdn.one/tild3635-3864-4165-b835-373361373637/2.png',
    'https://static.tildacdn.one/tild6232-3065-4232-b230-333061323961/29.png',
    'https://static.tildacdn.one/tild6339-3862-4230-a266-343630333034/26.png',
    'https://static.tildacdn.one/tild6536-6133-4161-a134-376663323632/25.png',
    'https://static.tildacdn.one/tild6165-3065-4236-a435-363434393831/15.png',
    'https://static.tildacdn.one/tild6433-6565-4538-b864-323636623036/10.png',
    'https://static.tildacdn.one/tild3562-3862-4635-a534-386365313533/8.png',
    'https://static.tildacdn.one/tild3863-6334-4930-a436-663064623561/5.png',
  ],
};

const BENEFIT_COPY = [
  'Большой выбор круизов, морских прогулок, катеров и яхт. Подберём идеальный вариант для отдыха, праздника или индивидуального путешествия',
  'Новые автомобили и комфортабельные автобусы. Забираем из вашего отеля и доставляем обратно после экскурсии',
  'Честные и доступные цены без скрытых платежей и доплат во время экскурсии',
  'Небольшие группы позволяют путешествовать комфортно, лучше слышать гида и наслаждаться экскурсией без ощущения массового тура',
  'Любую экскурсию можем провести в индивидуальном формате, полностью адаптировав её под ваши запросы',
];

const SOURCE_MENU_ORDER = [
  'Главная',
  'Экскурсии Нячанга',
  'Премиум экскурсии',
  'Экскурсии Муйне/Фантьета',
  'Экскурсии Ханоя',
  'Экскурсии Дананга',
  'Экскурсии Фукуока',
  'О нас',
  'Блог',
];

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string) {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

function ensureHeaderAndMenu() {
  const headerLogo = document.querySelector<HTMLImageElement>('.site-header .brand img');
  if (headerLogo && !headerLogo.dataset.sourceV3) {
    headerLogo.src = SOURCE.headerLogo;
    headerLogo.dataset.sourceV3 = '1';
  }

  const nav = document.querySelector<HTMLElement>('.side-menu nav');
  if (nav && !nav.dataset.sourceV3) {
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
    links.sort((a, b) => SOURCE_MENU_ORDER.indexOf(a.textContent?.trim() || '') - SOURCE_MENU_ORDER.indexOf(b.textContent?.trim() || ''));
    links.forEach((link) => nav.append(link));
    nav.dataset.sourceV3 = '1';
  }
}

function ensureHero() {
  const hero = document.querySelector<HTMLElement>('main > .hero-slider');
  if (!hero || hero.querySelector('.source-v3-hero')) return;

  const source = element('div', 'source-v3-hero');
  const media = element('div', 'source-v3-hero-media');
  const image = document.createElement('img');
  image.src = SOURCE.hero;
  image.alt = 'MAX TOUR Vietnam';
  media.append(image);

  const originalCta = hero.querySelector<HTMLAnchorElement>('.button-hero');
  const cta = document.createElement('a');
  cta.className = 'source-v3-hero-cta';
  cta.href = originalCta?.getAttribute('href') || '/katalog-nyachang';
  cta.textContent = 'ВЫБРАТЬ ТУР';
  media.append(cta);

  const intro = element('p', 'source-v3-hero-intro');
  intro.innerHTML = 'Более 150 экскурсий по всему Вьетнаму, Fast Track в аэропортах, трансферы, индивидуальные программы и авторские путешествия<br>по Юго-Восточной Азии';

  source.append(media, intro);
  hero.prepend(source);
}

function ensurePopularGallery() {
  const section = document.querySelector<HTMLElement>('.popular-section .container');
  if (!section || section.querySelector('.source-v3-popular')) return;

  const gallery = element('div', 'source-v3-popular');
  const viewport = element('div', 'source-v3-popular-viewport');
  const track = element('div', 'source-v3-popular-track');
  let active = 0;

  SOURCE.popular.forEach((src, index) => {
    const slide = element('div', 'source-v3-popular-slide');
    slide.dataset.index = String(index);
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Популярные экскурсии MAX TOUR';
    slide.append(img);
    track.append(slide);
  });

  const prev = element('button', 'source-v3-gallery-arrow source-v3-gallery-prev');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Предыдущий слайд');
  prev.textContent = '‹';
  const next = element('button', 'source-v3-gallery-arrow source-v3-gallery-next');
  next.type = 'button';
  next.setAttribute('aria-label', 'Следующий слайд');
  next.textContent = '›';
  const dots = element('div', 'source-v3-gallery-dots');

  function render() {
    track.style.transform = `translateX(${-active * 100}%)`;
    dots.querySelectorAll('button').forEach((dot, index) => dot.classList.toggle('active', index === active));
  }

  SOURCE.popular.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Слайд ${index + 1}`);
    dot.addEventListener('click', () => { active = index; render(); });
    dots.append(dot);
  });
  prev.addEventListener('click', () => { active = (active - 1 + SOURCE.popular.length) % SOURCE.popular.length; render(); });
  next.addEventListener('click', () => { active = (active + 1) % SOURCE.popular.length; render(); });

  viewport.append(track, prev, next);
  gallery.append(viewport, dots);
  section.append(gallery);
  render();
}

function ensureCoupon() {
  const content = document.querySelector<HTMLElement>('.coupon-section .coupon-content');
  if (!content || content.querySelector('.source-v3-coupon-image')) return;

  const image = document.createElement('img');
  image.className = 'source-v3-coupon-image';
  image.src = SOURCE.coupon;
  image.alt = 'Купон MAX TOUR';
  content.prepend(image);

  const actions = content.querySelector<HTMLElement>('.coupon-actions');
  if (actions) {
    actions.innerHTML = '';
    const contact = document.createElement('a');
    contact.className = 'button source-v3-manager-button';
    contact.href = 'https://t.me/manager_po_ekskursiyam';
    contact.target = '_blank';
    contact.rel = 'noreferrer';
    contact.textContent = 'СВЯЗАТЬСЯ С МЕНЕДЖЕРОМ';
    actions.append(contact);
  }
}

function ensureCatalogMore() {
  const section = document.querySelector<HTMLElement>('.catalog-preview .container');
  if (!section || section.querySelector('.source-v3-catalog-more')) return;
  const link = document.createElement('a');
  link.className = 'source-v3-catalog-more';
  link.href = '/katalog-nyachang';
  link.textContent = 'ЗАГРУЗИТЬ ЕЩЕ';
  section.append(link);
}

function ensureFastTrack() {
  const image = document.querySelector<HTMLImageElement>('.fast-track-image img');
  if (image && !image.dataset.sourceV3) {
    image.src = SOURCE.fastTrack;
    image.dataset.sourceV3 = '1';
  }
}

function ensureBenefits() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.benefits-grid .benefit-item'));
  if (!items.length) return;
  items.slice(0, 5).forEach((item, index) => {
    if (item.dataset.sourceV3) return;
    const iconHost = item.querySelector<HTMLElement>(':scope > span');
    if (iconHost) {
      iconHost.textContent = '';
      const img = document.createElement('img');
      img.src = SOURCE.benefits[index];
      img.alt = '';
      iconHost.append(img);
    }
    const title = item.querySelector<HTMLElement>('h3');
    if (title) title.hidden = true;
    const copy = item.querySelector<HTMLElement>('p');
    if (copy) copy.textContent = BENEFIT_COPY[index];
    item.dataset.sourceV3 = '1';
  });
}

function ensureFooter() {
  const logo = document.querySelector<HTMLImageElement>('.footer-logo img');
  if (logo && !logo.dataset.sourceV3) {
    logo.src = SOURCE.footerLogo;
    logo.dataset.sourceV3 = '1';
  }
}

function apply() {
  const home = window.location.pathname === '/';
  document.documentElement.classList.toggle('source-home-v3', home);
  ensureHeaderAndMenu();
  ensureFooter();
  if (!home) return;
  ensureHero();
  ensurePopularGallery();
  ensureCoupon();
  ensureCatalogMore();
  ensureFastTrack();
  ensureBenefits();
}

let raf = 0;
const observer = new MutationObserver(() => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(apply);
});
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('popstate', apply);
window.addEventListener('load', apply);
apply();
