import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppV2 from './AppV2';
import { tours } from './data';
import { generatedReviews } from './generatedReviews';
import './styles.css';
import './tour-pages.css';
import './source-parity.css';
import './parity-fixes.css';
import './source-zero-block.css';

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

function HomeDesignParityBridge() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') return;

    let cancelled = false;
    const mounted: HTMLElement[] = [];
    const appendedFaq: HTMLElement[] = [];

    const mount = async () => {
      let popular: HTMLElement | null = null;
      let faq: HTMLElement | null = null;
      for (let attempt = 0; attempt < 40 && !cancelled; attempt += 1) {
        popular = document.querySelector<HTMLElement>('.popular-section');
        faq = document.querySelector<HTMLElement>('.faq-section');
        if (popular?.parentElement && faq?.parentElement) break;
        await new Promise((resolve) => window.setTimeout(resolve, 25));
      }
      if (cancelled || !popular?.parentElement || !faq?.parentElement) return;

      document.getElementById('source-home-brand-band')?.remove();
      document.getElementById('source-home-reviews')?.remove();

      const band = document.createElement('section');
      band.id = 'source-home-brand-band';
      band.className = 'source-home-brand-band';
      band.innerHTML = '<div class="container source-home-brand-band-inner"><h2>MAX TOUR</h2><a class="button button-primary" href="/katalog-nyachang">ВЫБРАТЬ ТУР</a></div>';
      popular.parentElement.insertBefore(band, popular);
      mounted.push(band);

      const faqList = faq.querySelector<HTMLElement>('.faq-list');
      if (faqList && faqList.children.length < 7) {
        const first = document.createElement('details');
        first.className = 'source-home-added-faq';
        first.innerHTML = '<summary>Как записаться на экскурсию?<span>＋</span></summary><p>Выберите экскурсию на сайте и свяжитесь с менеджером удобным способом для подтверждения даты и бронирования.</p>';
        faqList.insertBefore(first, faqList.firstChild);
        appendedFaq.push(first);

        const last = document.createElement('details');
        last.className = 'source-home-added-faq';
        last.innerHTML = '<summary>MAX TOUR — официальная компания?<span>＋</span></summary><p>MAX TOUR работает во Вьетнаме и сопровождает бронирование, оплату и организацию выбранных программ.</p>';
        faqList.append(last);
        appendedFaq.push(last);
      }

      const reviews = generatedReviews['dnevnaya-obzornaya-ekskursiya-po-nyachangu'] || [];
      if (reviews.length) {
        const section = document.createElement('section');
        section.id = 'source-home-reviews';
        section.className = 'section source-home-reviews';
        section.innerHTML = `<div class="container"><h2 class="live-heading">Отзывы наших туристов</h2><div class="source-home-review-grid">${reviews.slice(0, 4).map((review) => `<article><p>${escapeHtml(review.text)}</p><h3>${escapeHtml(review.name)}</h3><strong>★★★★★</strong></article>`).join('')}</div></div>`;
        faq.insertAdjacentElement('afterend', section);
        mounted.push(section);
      }
    };

    void mount();
    return () => {
      cancelled = true;
      mounted.forEach((node) => node.remove());
      appendedFaq.forEach((node) => node.remove());
    };
  }, [location.pathname]);

  return null;
}

function TourMainSourceBridge() {
  const location = useLocation();

  useEffect(() => {
    const slug = location.pathname.split('/').filter(Boolean).at(-1) || '';
    if (!tours.some((tour) => tour.slug === slug)) return;

    let cancelled = false;
    let generated: HTMLElement | null = null;
    const hiddenFallbacks: HTMLElement[] = [];
    const controller = new AbortController();

    const mount = async () => {
      try {
        const response = await fetch(`/tour-main/${encodeURIComponent(slug)}.html`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) return;
        const html = await response.text();
        if (cancelled || !html.includes('t396__artboard')) return;

        let anchor: HTMLElement | null = null;
        for (let attempt = 0; attempt < 40 && !cancelled; attempt += 1) {
          anchor = document.querySelector<HTMLElement>('.source-tour-main');
          if (anchor?.parentElement) break;
          await new Promise((resolve) => window.setTimeout(resolve, 25));
        }
        if (cancelled || !anchor?.parentElement) return;

        generated = document.createElement('section');
        generated.className = 'source-original-main source-generated-main';
        generated.dataset.sourceSlug = slug;
        generated.innerHTML = `<div class="source-zero-block">${html}</div>`;
        anchor.parentElement.insertBefore(generated, anchor);

        document.querySelectorAll<HTMLElement>('.source-tour-main').forEach((node) => {
          node.classList.add('source-main-fallback-hidden');
          hiddenFallbacks.push(node);
        });
      } catch (error) {
        if (!controller.signal.aborted) console.warn('Exact tour source block unavailable; using React fallback.', error);
      }
    };

    void mount();
    return () => {
      cancelled = true;
      controller.abort();
      generated?.remove();
      hiddenFallbacks.forEach((node) => node.classList.remove('source-main-fallback-hidden'));
    };
  }, [location.pathname]);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HomeDesignParityBridge />
      <TourMainSourceBridge />
      <AppV2 />
    </BrowserRouter>
  </React.StrictMode>,
);
