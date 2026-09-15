import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppV2 from './AppV2';
import { brand, tours } from './data';
import './styles.css';
import './tour-pages.css';
import './source-parity.css';
import './parity-fixes.css';
import './source-zero-block.css';
import './design-parity-v2.css';
import './mobile-header-source.css';
import './homepage-source-contact.css';

function HeaderSocialParityBridge() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | null = null;
    let attempts = 0;

    const apply = () => {
      const actions = document.querySelector<HTMLElement>('.site-header .header-actions');
      if (!actions) return false;

      const whatsapp = actions.querySelector<HTMLAnchorElement>('.social-whatsapp');
      const telegram = actions.querySelector<HTMLAnchorElement>('.social-telegram');
      const instagram = actions.querySelector<HTMLAnchorElement>('.social-instagram');
      const menu = actions.querySelector<HTMLElement>('.menu-button');
      let max = actions.querySelector<HTMLAnchorElement>('.social-max');

      if (!max && instagram) {
        instagram.classList.remove('social-instagram');
        instagram.classList.add('social-max');
        instagram.href = brand.maxMessenger;
        instagram.setAttribute('aria-label', 'MAX');
        instagram.innerHTML = '<span class="max-mark">MAX</span>';
        max = instagram;
      }

      if (!max || !telegram || !whatsapp) return false;

      const desired = [max, telegram, whatsapp, menu].filter(Boolean) as HTMLElement[];
      desired.forEach((node, index) => {
        if (actions.children[index] !== node) actions.insertBefore(node, actions.children[index] || null);
      });
      return true;
    };

    const timer = window.setInterval(() => {
      attempts += 1;
      if (cancelled) return;
      if (apply() || attempts >= 80) {
        window.clearInterval(timer);
        const actions = document.querySelector<HTMLElement>('.site-header .header-actions');
        if (actions) {
          observer = new MutationObserver(() => {
            if (!cancelled) apply();
          });
          observer.observe(actions, { childList: true, subtree: true });
        }
      }
    }, 25);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      observer?.disconnect();
    };
  }, [location.pathname]);

  return null;
}

function HomeDesignParityBridge() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') return;

    let cancelled = false;
    const mounted: HTMLElement[] = [];
    const appendedFaq: HTMLElement[] = [];

    const mount = async () => {
      let faq: HTMLElement | null = null;
      for (let attempt = 0; attempt < 40 && !cancelled; attempt += 1) {
        faq = document.querySelector<HTMLElement>('.faq-section');
        if (faq?.parentElement) break;
        await new Promise((resolve) => window.setTimeout(resolve, 25));
      }
      if (cancelled || !faq?.parentElement) return;

      document.getElementById('source-home-brand-band')?.remove();
      document.getElementById('source-home-reviews')?.remove();
      document.getElementById('source-home-manager-contact')?.remove();

      const faqList = faq.querySelector<HTMLElement>('.faq-list');
      if (faqList && faqList.children.length < 7) {
        const first = document.createElement('details');
        first.className = 'source-home-added-faq';
        first.innerHTML = '<summary>Как записаться на экскурсию?<span>＋</span></summary><p>Оставьте заявку на сайте или свяжитесь с нами через удобный мессенджер. Мы быстро ответим, поможем выбрать экскурсию, подберём удобную дату и подтвердим бронирование.</p>';
        faqList.insertBefore(first, faqList.firstChild);
        appendedFaq.push(first);

        const last = document.createElement('details');
        last.className = 'source-home-added-faq';
        last.innerHTML = '<summary>MAX TOUR - официальная компания?<span>＋</span></summary><p>Да, MAX TOUR работает официально и имеет все необходимые разрешения для организации экскурсий. Мы проводим туры по проверенным маршрутам, соблюдаем стандарты безопасности и обеспечиваем страхование для каждого участника.</p>';
        faqList.append(last);
        appendedFaq.push(last);
      }

      const contact = document.createElement('section');
      contact.id = 'source-home-manager-contact';
      contact.className = 'source-home-manager-contact';
      contact.innerHTML = `<div class="container"><div class="source-home-manager-contact-inner"><h2>Выберите, где вам удобнее общаться с менеджером</h2><div class="source-home-manager-contact-actions"><a class="messenger-button whatsapp-button" href="${brand.whatsapp}" target="_blank" rel="noreferrer"><span aria-hidden="true">◉</span>WhatsApp</a><a class="messenger-button telegram-button" href="${brand.managerTelegram}" target="_blank" rel="noreferrer"><span aria-hidden="true">➤</span>Telegram</a><a class="messenger-button max-button" href="${brand.maxMessenger}" target="_blank" rel="noreferrer"><span class="max-mark" aria-hidden="true">MAX</span>MAX</a></div></div></div>`;
      faq.insertAdjacentElement('afterend', contact);
      mounted.push(contact);
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
      <HeaderSocialParityBridge />
      <HomeDesignParityBridge />
      <TourMainSourceBridge />
      <AppV2 />
    </BrowserRouter>
  </React.StrictMode>,
);
