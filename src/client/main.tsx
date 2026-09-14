import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppV2 from './AppV2';
import { tours } from './data';
import './styles.css';
import './tour-pages.css';
import './source-parity.css';
import './parity-fixes.css';

function TourMainSourceBridge() {
  const location = useLocation();

  useEffect(() => {
    const slug = location.pathname.split('/').filter(Boolean).at(-1) || '';
    if (!tours.some((tour) => tour.slug === slug)) return;

    let cancelled = false;
    let generated: HTMLElement | null = null;
    let fallback: HTMLElement | null = null;
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

        for (let attempt = 0; attempt < 40 && !cancelled; attempt += 1) {
          fallback = document.querySelector<HTMLElement>('.source-tour-main');
          if (fallback) break;
          await new Promise((resolve) => window.setTimeout(resolve, 25));
        }
        if (cancelled || !fallback?.parentElement) return;

        generated = document.createElement('section');
        generated.className = 'source-original-main source-generated-main';
        generated.dataset.sourceSlug = slug;
        generated.innerHTML = `<div class="source-zero-block">${html}</div>`;
        fallback.parentElement.insertBefore(generated, fallback);
        fallback.classList.add('source-main-fallback-hidden');
      } catch (error) {
        if (!controller.signal.aborted) console.warn('Exact tour source block unavailable; using React fallback.', error);
      }
    };

    void mount();
    return () => {
      cancelled = true;
      controller.abort();
      generated?.remove();
      fallback?.classList.remove('source-main-fallback-hidden');
    };
  }, [location.pathname]);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TourMainSourceBridge />
      <AppV2 />
    </BrowserRouter>
  </React.StrictMode>,
);
