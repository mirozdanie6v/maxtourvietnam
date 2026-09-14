import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { brand, heroSlides, sidebarLinks, tours } from './data';
import { tourDetails } from './tourDetails';

type SocialKind = 'whatsapp' | 'telegram' | 'instagram' | 'max' | 'vk';

function SocialIcon({ kind }: { kind: SocialKind }) {
  if (kind === 'telegram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.7 3.5 18.5 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.1 12.8 1.3 11.3c-1-.3-1-1 .2-1.5L20.3 2.6c.9-.3 1.7.2 1.4.9Z" /></svg>;
  }
  if (kind === 'whatsapp') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a9.8 9.8 0 0 0-8.4 14.9L2 22l5.3-1.5A10 10 0 1 0 12 2Zm0 17.8c-1.6 0-3.1-.5-4.4-1.3l-.3-.2-3.1.9.9-3-.2-.3A7.8 7.8 0 1 1 12 19.8Zm4.3-5.8c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.5-.7-2.5-1.3-3.5-3-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4H8c-.2 0-.5.1-.7.4-.2.2-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.7.9 3.7.8 1.1-.2 1.4-1 1.6-1.9.2-.9.2-1.6.1-1.7-.2-.1-.3-.2-.5-.3Z" /></svg>;
  }
  if (kind === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.2 2A3 3 0 0 0 4 7v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.3 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>;
  }
  if (kind === 'max') return <span className="max-mark">MAX</span>;
  return <span className="vk-mark">VK</span>;
}

function SocialLink({ kind, href, label, compact = false }: { kind: SocialKind; href: string; label: string; compact?: boolean }) {
  return <a className={`social-link social-${kind}${compact ? ' social-compact' : ''}`} href={href} target="_blank" rel="noreferrer" aria-label={label}><SocialIcon kind={kind} /></a>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="MAX TOUR — на главную"><img src={brand.logo} alt="MAX TOUR" /></Link>
        <div className="header-actions">
          <SocialLink kind="whatsapp" href={brand.whatsapp} label="WhatsApp" compact />
          <SocialLink kind="telegram" href={brand.telegram} label="Telegram" compact />
          <SocialLink kind="instagram" href={brand.instagram} label="Instagram" compact />
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню"><span /><span /><span /></button>
        </div>
      </header>

      <button className={`menu-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} aria-label="Закрыть меню" />
      <aside className={`side-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню">×</button>
        <img className="menu-logo" src={brand.logo} alt="MAX TOUR" />
        <nav>{sidebarLinks.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</nav>
        <div className="side-socials">
          <SocialLink kind="whatsapp" href={brand.whatsapp} label="WhatsApp" />
          <SocialLink kind="telegram" href={brand.telegram} label="Telegram" />
          <SocialLink kind="instagram" href={brand.instagram} label="Instagram" />
        </div>
        <div className="side-contacts"><a href={`tel:${brand.phone}`}>{brand.phone}</a><a href={`mailto:${brand.email}`}>{brand.email}</a></div>
      </aside>

      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Hero() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero-slider">
      {heroSlides.map((image, index) => <div key={image} className={`hero-slide ${index === slide ? 'active' : ''}`} style={{ backgroundImage: `url(${image})` }} />)}
      <div className="hero-shade" />
      <div className="hero-copy-wrap">
        <div className="hero-title-lockup"><strong>MAX TOUR</strong><span>Экскурсионное бюро</span></div>
        <p>Более 150 экскурсий по всему Вьетнаму, Fast Track в аэропортах, трансферы, индивидуальные программы и авторские путешествия</p>
        <Link className="button button-hero" to="/katalog-nyachang">ВЫБРАТЬ ТУР</Link>
      </div>
      <div className="hero-dots" aria-label="Слайды">
        {heroSlides.map((_, index) => <button key={index} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} aria-label={`Слайд ${index + 1}`} />)}
      </div>
    </section>
  );
}

function BrandShowcase() {
  return (
    <section className="brand-showcase section-tight">
      <img src={brand.brandImage} alt="MAX TOUR" />
      <div className="brand-showcase-socials">
        <SocialLink kind="whatsapp" href={brand.whatsapp} label="WhatsApp" />
        <SocialLink kind="telegram" href={brand.telegram} label="Telegram" />
        <SocialLink kind="instagram" href={brand.instagram} label="Instagram" />
      </div>
    </section>
  );
}

function TourCard({ tour }: { tour: (typeof tours)[number] }) {
  return (
    <article className="tour-card">
      <Link to={`/${tour.slug}`} className="tour-image-wrap">
        <img src={tour.image} alt={tour.title} loading="lazy" />
        {tour.badge && <span className={`tour-badge badge-${tour.badge.replace(' ', '-')}`}>{tour.badge}</span>}
      </Link>
      <div className="tour-card-body">
        <h3><Link to={`/${tour.slug}`}>{tour.title}</Link></h3>
        <div className="tour-prices">
          <span>Взрослые - <strong>{tour.adultPrice}$</strong></span>
          {tour.childPrice !== undefined && <span>Дети - <strong>{tour.childPrice}$</strong></span>}
        </div>
        <Link className="button button-primary tour-book" to={`/${tour.slug}`}>ЗАБРОНИРОВАТЬ</Link>
      </div>
    </article>
  );
}

function PopularTours() {
  const popular = tours.filter((tour) => tour.popular).slice(0, 6);
  return (
    <section className="section popular-section">
      <div className="container">
        <h2 className="live-heading">Самые популярные экскурсии из Нячанга</h2>
        <div className="tour-strip">{popular.map((tour) => <TourCard key={tour.slug} tour={tour} />)}</div>
      </div>
    </section>
  );
}

function CouponPromo() {
  return (
    <section className="coupon-section">
      <div className="container coupon-content">
        <p>Просто отправьте скриншот купона менеджеру <strong>MAX TOUR</strong> и получите скидку на экскурсию, а также бесплатный гайд по популярным городам Вьетнама</p>
        <div className="coupon-actions">
          <a className="messenger-button whatsapp-button" href={brand.whatsapp} target="_blank" rel="noreferrer"><SocialIcon kind="whatsapp" />Отправить в WhatsApp</a>
          <a className="messenger-button telegram-button" href={brand.managerTelegram} target="_blank" rel="noreferrer"><SocialIcon kind="telegram" />Отправить Telegram</a>
        </div>
      </div>
    </section>
  );
}

function CatalogPreview() {
  return (
    <section className="section catalog-preview">
      <div className="container">
        <div className="catalog-heading-row"><h2 className="live-heading">Каталог экскурсий из Нячанга</h2><Link to="/katalog-nyachang">Весь каталог</Link></div>
        <div className="tour-strip catalog-strip">{tours.slice(0, 10).map((tour) => <TourCard key={tour.slug} tour={tour} />)}</div>
      </div>
    </section>
  );
}

function FastTrack() {
  const airportImage = 'https://static.tildacdn.one/tild3063-6230-4266-b063-313839663461/____1680_x_600_-4.jpg';
  return (
    <section className="section fast-track-section">
      <div className="container fast-track-grid">
        <div className="fast-track-copy">
          <p className="fast-kicker">Аэропорт</p>
          <h2>Fast Track</h2>
          <p className="fast-lead">С услугой Fast Track вы быстро пройдёте паспортный контроль, а затем на комфортном автомобиле отправитесь прямо в отель.</p>
          <div className="fast-features">
            <div><span className="feature-icon">▣</span><strong>Встреча с табличкой</strong><p>Встречаем у зоны таможенного контроля.</p></div>
            <div><span className="feature-icon">↯</span><strong>Без очереди</strong><p>Быстрое прохождение паспортного контроля.</p></div>
            <div><span className="feature-icon">⌂</span><strong>Трансфер в отель</strong><p>Индивидуальный трансфер до отеля в центре Нячанга.</p></div>
          </div>
          <a className="button button-primary" href={brand.managerTelegram} target="_blank" rel="noreferrer">ЗАБРОНИРОВАТЬ</a>
        </div>
        <div className="fast-track-image"><img src={airportImage} alt="Fast Track в аэропорту" /></div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    ['⌁', 'Разнообразие круизов', 'Морские прогулки, яхты, катамараны и индивидуальные программы.'],
    ['▰', 'Новые автомобили', 'Новые автомобили и комфортабельные автобусы. Забираем из вашего отеля и доставляем обратно после экскурсии.'],
    ['◇', 'Честные цены', 'Честные и доступные цены без скрытых платежей и доплат во время экскурсии.'],
    ['◉', 'Мини-группы', 'Небольшие группы позволяют путешествовать комфортно, лучше слышать гида и наслаждаться экскурсией.'],
    ['✦', 'Индивидуальные форматы', 'Собираем частные программы и маршруты под вашу компанию.'],
  ];
  return (
    <section className="section benefits-section">
      <div className="container">
        <h2 className="live-heading">Наши преимущества:</h2>
        <div className="benefits-grid">
          {items.map(([icon, title, text]) => <article className="benefit-item" key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>
  );
}

function BookingForm({ compact = false, tourTitle }: { compact?: boolean; tourTitle?: string }) {
  const [travelers, setTravelers] = useState(1);
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };

  return (
    <section className={compact ? 'booking-card' : 'section booking-section'}>
      <div className={compact ? '' : 'container'}>
        <div className="booking-box">
          <h2>Забронировать тур</h2>
          {tourTitle && <p className="booking-tour-name">{tourTitle}</p>}
          <form onSubmit={submit}>
            <label><span>Желаемая дата *</span><div className="input-with-icon"><input type="date" required /><b>▣</b></div></label>
            <label><span>Ваше имя *</span><div className="input-with-icon"><input type="text" placeholder="Ваше имя" required /><b>◉</b></div></label>
            <label><span>Название вашего отеля *</span><input type="text" placeholder="Например: Nha Trang Sunrise" required /></label>
            <label><span>Количество путешественников</span><div className="traveler-stepper"><button type="button" onClick={() => setTravelers((value) => Math.max(1, value - 1))}>−</button><output>{travelers}</output><button type="button" onClick={() => setTravelers((value) => value + 1)}>+</button></div></label>
            <button className="button button-primary form-submit" type="submit">Забронировать тур</button>
            {sent && <p className="form-success">Заявка подготовлена. Выберите мессенджер ниже, чтобы связаться с менеджером.</p>}
          </form>
          <div className="booking-messengers">
            <a className="messenger-button whatsapp-button" href={brand.whatsapp} target="_blank" rel="noreferrer"><SocialIcon kind="whatsapp" />Отправить в WhatsApp</a>
            <a className="messenger-button telegram-button" href={brand.managerTelegram} target="_blank" rel="noreferrer"><SocialIcon kind="telegram" />Отправить Telegram</a>
            <a className="messenger-button max-button" href={brand.maxMessenger} target="_blank" rel="noreferrer"><SocialIcon kind="max" />Отправить в MAX</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const questions = [
    ['Как записаться на экскурсию?', 'Оставьте заявку на сайте или напишите менеджеру MAX TOUR в WhatsApp, Telegram или MAX. Менеджер подтвердит дату, программу и детали поездки.'],
    ['Нужна ли предоплата?', 'Условия оплаты зависят от выбранной экскурсии. Менеджер сообщит размер предоплаты и доступные способы оплаты при подтверждении брони.'],
    ['Какие правила отмены и переноса?', 'Условия отмены и переноса зависят от программы и даты. Сообщите менеджеру об изменениях как можно раньше — мы предложим доступный вариант.'],
    ['Какие способы оплаты доступны?', 'Доступные способы оплаты менеджер подтверждает при бронировании. Оплатить можно удобным согласованным способом.'],
    ['А что будет, если группа не наберется?', 'Менеджер заранее свяжется с вами и предложит перенос даты, другую программу или подходящий формат поездки.'],
    ['Возможны ли дополнительные расходы?', 'Все обязательные расходы по программе проговариваются заранее. Дополнительные личные расходы остаются на усмотрение туриста.'],
    ['MAX TOUR - официальная компания?', 'MAX TOUR работает во Вьетнаме как экскурсионное бюро и организует групповые и индивидуальные программы для туристов.'],
  ];
  return <section className="section faq-section"><div className="container faq-container"><h2 className="live-heading">Часто задаваемые вопросы:</h2><div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span>＋</span></summary><p>{answer}</p></details>)}</div></div></section>;
}

function HomePage() {
  return <><Hero /><BrandShowcase /><PopularTours /><CouponPromo /><CatalogPreview /><FastTrack /><Benefits /><BookingForm /><FAQ /></>;
}

function CatalogPage({ premium = false }: { premium?: boolean }) {
  const all = useMemo(() => premium ? tours.filter((tour) => tour.category === 'Премиум') : tours, [premium]);
  const [visible, setVisible] = useState(12);
  useEffect(() => setVisible(12), [premium]);
  return (
    <>
      <section className="catalog-page-head"><div className="container"><h1>{premium ? 'Премиум экскурсии во Вьетнаме' : 'Каталог экскурсий из Нячанга'}</h1></div></section>
      <section className="section catalog-page"><div className="container"><div className="tour-grid">{all.slice(0, visible).map((tour) => <TourCard key={tour.slug} tour={tour} />)}</div>{visible < all.length && <button className="load-more" onClick={() => setVisible((value) => value + 8)}>ЗАГРУЗИТЬ ЕЩЕ</button>}</div></section>
      <BookingForm />
    </>
  );
}

function PricePanel({ title, lines }: { title: string; lines: string[] }) {
  if (!lines.length) return null;
  return <div className="source-price-panel"><h3>{title}</h3>{lines.map((line) => <p key={line}>{line}</p>)}</div>;
}

function TourPage() {
  const { slug } = useParams();
  const tour = tours.find((item) => item.slug === slug);
  if (!tour) return <NotFoundPage />;
  const detail = tourDetails[tour.slug];
  const groupPrices = detail?.groupPrices ?? [
    `Взрослые — ${tour.adultPrice}$`,
    ...(tour.childPrice !== undefined ? [`Дети — ${tour.childPrice}$`] : []),
  ];
  const locations = detail?.locations ?? [];
  const schedule = detail?.schedule ?? [];
  const included = detail?.included ?? [];
  const bring = detail?.bring ?? [];

  return (
    <>
      <section className="source-tour-top">
        <div className="container source-tour-topbar"><a className="button button-primary" href="#booking">ЗАБРОНИРОВАТЬ</a></div>
        <div className="source-tour-cover"><img src={tour.image} alt={tour.title} /></div>
      </section>

      <section className="source-tour-main section">
        <div className="container source-tour-narrow">
          <h1>{tour.title}</h1>
          {tour.badge && <span className={`tour-badge source-detail-badge badge-${tour.badge.replace(' ', '-')}`}>{tour.badge}</span>}

          <div className="source-tour-meta-head">
            <h2>Локации которые вы посетите:</h2>
            <div className="source-price-grid">
              <PricePanel title="Цена групповой экскурсии:" lines={groupPrices} />
              <PricePanel title="Цена индивидуальной экскурсии:" lines={detail?.privatePrices ?? []} />
            </div>
          </div>

          {schedule.length > 0 && <div className="source-schedule">{schedule.map((item) => <div key={item}><span>●</span><strong>{item}</strong></div>)}</div>}
          {detail?.notice && <div className="source-notice">{detail.notice}</div>}

          {locations.length > 0 ? (
            <div className="source-location-list">
              {locations.map((location, index) => (
                <article className="source-location" key={`${location.name}-${index}`}>
                  <div className="source-location-number">{String(index + 1).padStart(2, '0')}</div>
                  <div><h3>{location.name}</h3>{location.description && <p>{location.description}</p>}</div>
                </article>
              ))}
            </div>
          ) : (
            <div className="source-pending-copy"><p>Для этой экскурсии программа переносится постранично из действующей версии MAX TOUR. Универсальный текст здесь больше не используется.</p></div>
          )}

          {(included.length > 0 || bring.length > 0) && <section className="source-features-section">
            <h2>Особенности тура:</h2>
            <div className="source-two-columns">
              {included.length > 0 && <div><h3>Включено:</h3><ul>{included.map((item) => <li key={item}>{item}</li>)}</ul></div>}
              {bring.length > 0 && <div><h3>Что взять с собой:</h3><ul>{bring.map((item) => <li key={item}>{item}</li>)}</ul></div>}
            </div>
          </section>}
        </div>
      </section>

      <div id="booking"><BookingForm tourTitle={tour.title} /></div>
      <FAQ />
      {detail?.reviewTitle && <section className="section source-reviews"><div className="container source-tour-narrow"><h2>{detail.reviewTitle}</h2><div className="source-review-grid">{['★★★★★', '★★★★★', '★★★★★', '★★★★★'].map((stars, index) => <article key={index}><div className="source-review-avatar">{index + 1}</div><strong>{stars}</strong></article>)}</div></div></section>}
    </>
  );
}

function StaticPage({ title }: { title: string }) {
  return <section className="section static-page"><div className="container"><h1>{title}</h1><p>Раздел MAX TOUR. Основные экскурсии доступны в актуальном каталоге.</p><Link className="button button-primary" to="/katalog-nyachang">КАТАЛОГ ЭКСКУРСИЙ</Link></div></section>;
}

function NotFoundPage() { return <StaticPage title="Страница не найдена" />; }

function Footer() {
  return (
    <footer className="footer"><div className="container footer-main"><div className="footer-copy">Copyright © 2026 MaxTour</div><div className="footer-socials"><SocialLink kind="whatsapp" href={brand.whatsapp} label="WhatsApp" /><SocialLink kind="instagram" href={brand.instagram} label="Instagram" /><SocialLink kind="telegram" href={brand.telegram} label="Telegram" /><span className="footer-vk"><SocialIcon kind="vk" /></span></div><div className="footer-contacts"><a href={`mailto:${brand.email}`}>{brand.email}</a><a href={`tel:${brand.phone}`}>{brand.phone}</a></div></div></footer>
  );
}

export default function App() {
  return (
    <Layout><Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/katalog-nyachang" element={<CatalogPage />} />
      <Route path="/premium-ekskursii-vetnam" element={<CatalogPage premium />} />
      <Route path="/about" element={<StaticPage title="О нас" />} />
      <Route path="/blog" element={<StaticPage title="Блог" />} />
      <Route path="/tours/danang" element={<StaticPage title="Экскурсии Дананга" />} />
      <Route path="/tours/phu-quoc" element={<StaticPage title="Экскурсии Фукуока" />} />
      <Route path="/tours/mui-ne" element={<StaticPage title="Экскурсии Муйне / Фантьета" />} />
      <Route path="/tours/hanoi" element={<StaticPage title="Экскурсии Ханоя" />} />
      <Route path="/:slug" element={<TourPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes></Layout>
  );
}
