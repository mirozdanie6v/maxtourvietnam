import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { brand, sidebarLinks, tours } from './data';

const Icon = ({ children }: { children: string }) => <span aria-hidden="true">{children}</span>;

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
        <Link className="brand" to="/" aria-label="MAX TOUR — на главную">
          <img src={brand.logo} alt="MAX TOUR" />
        </Link>
        <div className="header-actions">
          <a href={brand.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
          <a href={brand.telegram} target="_blank" rel="noreferrer" aria-label="Telegram">TG</a>
          <a href={brand.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню">
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`side-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню">×</button>
        <nav>
          {sidebarLinks.map(([label, href]) => (
            <Link key={href} to={href}>{label}</Link>
          ))}
        </nav>
        <div className="side-contacts">
          <a href={`tel:${brand.phone}`}>{brand.phone}</a>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>
      </aside>

      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.58), rgba(0,0,0,.18)), url(${brand.heroImage})` }}>
      <div className="container hero-content">
        <p className="eyebrow">ЭКСКУРСИОННОЕ БЮРО ВО ВЬЕТНАМЕ</p>
        <h1>MAX TOUR</h1>
        <p className="hero-copy">Более 150 экскурсий по всему Вьетнаму, Fast Track в аэропортах, трансферы, индивидуальные программы и авторские путешествия</p>
        <Link className="button button-primary" to="/katalog-nyachang">ВЫБРАТЬ ТУР</Link>
      </div>
    </section>
  );
}

function TourCard({ tour }: { tour: (typeof tours)[number] }) {
  return (
    <article className="tour-card">
      <Link to={`/${tour.slug}`} className="tour-image-wrap">
        <img src={tour.image} alt={tour.title} loading="lazy" />
      </Link>
      <div className="tour-card-body">
        <span className="tour-category">{tour.category}</span>
        <h3><Link to={`/${tour.slug}`}>{tour.title}</Link></h3>
        <Link className="button button-outline" to={`/${tour.slug}`}>ЗАБРОНИРОВАТЬ</Link>
      </div>
    </article>
  );
}

function PopularTours() {
  return (
    <section className="section section-soft">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow red">ПОПУЛЯРНОЕ</p>
          <h2>Самые популярные экскурсии из Нячанга</h2>
        </div>
        <div className="tour-strip">
          {tours.slice(0, 6).map((tour) => <TourCard key={tour.slug} tour={tour} />)}
        </div>
      </div>
    </section>
  );
}

function CatalogPreview() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow red">НЯЧАНГ</p>
            <h2>Каталог экскурсий из Нячанга</h2>
          </div>
          <Link className="text-link" to="/katalog-nyachang">Смотреть весь каталог →</Link>
        </div>
        <div className="tour-grid">
          {tours.slice(0, 8).map((tour) => <TourCard key={tour.slug} tour={tour} />)}
        </div>
      </div>
    </section>
  );
}

function FastTrack() {
  return (
    <section className="fast-track section">
      <div className="container fast-grid">
        <div className="fast-photo" style={{ backgroundImage: `url(${brand.heroImage})` }} />
        <div className="fast-copy">
          <p className="eyebrow red">АЭРОПОРТ</p>
          <h2>Fast Track + индивидуальный трансфер</h2>
          <p>С услугой Fast Track вы быстро пройдёте паспортный контроль, а затем на комфортном автомобиле отправитесь прямо в отель.</p>
          <ul className="check-list">
            <li>Встреча с табличкой у зоны таможенного контроля и проход через паспортный контроль без очереди</li>
            <li>Индивидуальный трансфер до отеля в центре Нячанга</li>
          </ul>
          <a className="button button-primary" href={brand.managerTelegram} target="_blank" rel="noreferrer">ЗАБРОНИРОВАТЬ</a>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    ['01', 'Комфортный транспорт', 'Новые автомобили и комфортабельные автобусы. Забираем из вашего отеля и доставляем обратно после экскурсии'],
    ['02', 'Честные цены', 'Честные и доступные цены без скрытых платежей и доплат во время экскурсии'],
    ['03', 'Небольшие группы', 'Небольшие группы позволяют путешествовать комфортно, лучше слышать гида и наслаждаться экскурсией без ощущения массового тура'],
  ];
  return (
    <section className="section benefits">
      <div className="container">
        <div className="section-heading"><h2>Почему выбирают MAX TOUR</h2></div>
        <div className="benefits-grid">
          {items.map(([number, title, text]) => (
            <article className="benefit-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section className={compact ? 'booking-card' : 'section booking-section'}>
      <div className={compact ? '' : 'container'}>
        <div className="booking-box">
          <div className="booking-intro">
            <p className="eyebrow red">БРОНИРОВАНИЕ</p>
            <h2>{compact ? 'Забронировать экскурсию' : 'Оставьте заявку на экскурсию'}</h2>
            {!compact && <p>Выберите экскурсию и дату — менеджер MAX TOUR свяжется с вами для подтверждения.</p>}
          </div>
          <form onSubmit={submit}>
            <label>Экскурсия
              <select defaultValue="">
                <option value="" disabled>Выберите экскурсию</option>
                {tours.map((tour) => <option key={tour.slug}>{tour.title}</option>)}
              </select>
            </label>
            <label>Желаемая дата<input type="date" required /></label>
            <label>Ваше имя<input type="text" placeholder="Ваше имя" required /></label>
            <label>WhatsApp / Telegram / Телефон<input type="text" placeholder="WhatsApp / Telegram / Телефон" required /></label>
            <div className="people-row">
              <label>Взрослые<input type="number" min="1" defaultValue="1" /></label>
              <label>Дети<input type="number" min="0" defaultValue="0" /></label>
            </div>
            <button className="button button-primary" type="submit">ЗАБРОНИРОВАТЬ</button>
            {sent && <p className="form-note">Форма интерфейса готова. Отправку подключим к Worker/D1 на следующем этапе.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const questions = [
    ['Как забронировать экскурсию?', 'Выберите экскурсию на сайте, заполните форму или напишите менеджеру MAX TOUR в удобном мессенджере.'],
    ['Откуда начинается экскурсия?', 'Для большинства программ туристов забирают из отеля. Точное время и место подтверждает менеджер перед поездкой.'],
    ['Можно ли заказать индивидуальную программу?', 'Да. MAX TOUR организует индивидуальные экскурсии, трансферы и авторские маршруты по Вьетнаму.'],
    ['Как связаться с менеджером?', 'Используйте Telegram, WhatsApp или телефон, указанные на сайте.'],
  ];
  return (
    <section className="section faq-section">
      <div className="container narrow">
        <h2>Часто задаваемые вопросы:</h2>
        <div className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<Icon>＋</Icon></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <PopularTours />
      <section className="coupon-banner">
        <div className="container coupon-inner">
          <div><p className="eyebrow">MAX TOUR</p><h2>Сохраняйте выгодные предложения перед поездкой</h2></div>
          <Link className="button button-light" to="/katalog-nyachang">СМОТРЕТЬ ЭКСКУРСИИ</Link>
        </div>
      </section>
      <CatalogPreview />
      <FastTrack />
      <Benefits />
      <BookingForm />
      <FAQ />
    </>
  );
}

function CatalogPage({ premium = false }: { premium?: boolean }) {
  const filtered = useMemo(() => premium ? tours.filter((tour) => tour.category === 'Премиум') : tours, [premium]);
  return (
    <>
      <section className="page-hero compact-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.62), rgba(0,0,0,.2)), url(${brand.heroImage})` }}>
        <div className="container">
          <p className="eyebrow">MAX TOUR VIETNAM</p>
          <h1>{premium ? 'Премиум экскурсии во Вьетнаме' : 'Экскурсии из Нячанга'}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="tour-grid">
            {filtered.map((tour) => <TourCard key={tour.slug} tour={tour} />)}
          </div>
        </div>
      </section>
      <BookingForm />
    </>
  );
}

function TourPage() {
  const { slug } = useParams();
  const tour = tours.find((item) => item.slug === slug);
  if (!tour) return <NotFoundPage />;

  return (
    <>
      <section className="tour-detail-hero">
        <img src={tour.image} alt={tour.title} />
        <div className="tour-detail-overlay" />
        <div className="container tour-detail-title">
          <p className="eyebrow">{tour.category}</p>
          <h1>{tour.title}</h1>
          <a className="button button-primary" href="#booking">ЗАБРОНИРОВАТЬ</a>
        </div>
      </section>
      <section className="section">
        <div className="container detail-grid">
          <article className="detail-copy">
            <p className="eyebrow red">MAX TOUR</p>
            <h2>{tour.title}</h2>
            <p className="lead">Экскурсии Max Tour во Вьетнаме. Маленькие группы, русские гиды, комфорт и честные цены.</p>
            <div className="info-panels">
              <div><strong>Трансфер</strong><span>Забираем из отеля и возвращаем после экскурсии</span></div>
              <div><strong>Группа</strong><span>Комфортный формат без ощущения массового тура</span></div>
              <div><strong>Поддержка</strong><span>Менеджер на связи в Telegram и WhatsApp</span></div>
            </div>
            <h3>Программа экскурсии</h3>
            <p>Страница перенесена в отдельный React-проект. Детальная программа и тарифы будут храниться в D1 и редактироваться независимо от Tilda.</p>
            <a className="source-link" href={tour.sourceUrl} target="_blank" rel="noreferrer">Исходная страница MAX TOUR ↗</a>
          </article>
          <div id="booking"><BookingForm compact /></div>
        </div>
      </section>
    </>
  );
}

function StaticPage({ title }: { title: string }) {
  return (
    <section className="section top-spaced">
      <div className="container narrow">
        <p className="eyebrow red">MAX TOUR VIETNAM</p>
        <h1>{title}</h1>
        <p className="lead">Раздел подготовлен в новой структуре сайта. Контент переносится из текущей версии MAX TOUR.</p>
        <Link className="button button-primary" to="/katalog-nyachang">КАТАЛОГ ЭКСКУРСИЙ</Link>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return <StaticPage title="Страница не найдена" />;
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand"><img src={brand.logo} alt="MAX TOUR" /><p>Экскурсии и путешествия по Вьетнаму</p></div>
        <div><h4>Контакты</h4><a href={`tel:${brand.phone}`}>{brand.phone}</a><a href={`mailto:${brand.email}`}>{brand.email}</a></div>
        <div><h4>Связаться</h4><a href={brand.telegram} target="_blank" rel="noreferrer">Telegram</a><a href={brand.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><a href={brand.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
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
      </Routes>
    </Layout>
  );
}
