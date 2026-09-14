(() => {
  let manifestPromise;
  let scheduled = false;

  const loadManifest = () => {
    manifestPromise ||= fetch('/tour-galleries.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : {})
      .catch(() => ({}));
    return manifestPromise;
  };

  const slugFromPath = () => window.location.pathname.split('/').filter(Boolean).at(-1) || '';

  async function renderGallery() {
    scheduled = false;
    const host = document.querySelector('.source-tour-main .source-tour-narrow');
    if (!host) return;

    const slug = slugFromPath();
    const current = host.querySelector('.source-generated-gallery');
    if (current?.dataset.slug === slug) return;
    current?.remove();

    const manifest = await loadManifest();
    const images = manifest[slug] || [];
    if (!images.length) return;

    const section = document.createElement('section');
    section.className = 'source-generated-gallery';
    section.dataset.slug = slug;
    section.setAttribute('aria-label', 'Фотографии экскурсии');

    const main = document.createElement('div');
    main.className = 'source-gallery-main';
    const mainImage = document.createElement('img');
    mainImage.src = images[0];
    mainImage.alt = '';
    main.append(mainImage);

    const thumbs = document.createElement('div');
    thumbs.className = 'source-gallery-thumbs';
    images.forEach((src, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `source-gallery-thumb${index === 0 ? ' active' : ''}`;
      button.setAttribute('aria-label', `Фото ${index + 1}`);
      const image = document.createElement('img');
      image.src = src;
      image.alt = '';
      image.loading = index > 3 ? 'lazy' : 'eager';
      button.append(image);
      button.addEventListener('click', () => {
        mainImage.src = src;
        thumbs.querySelectorAll('.source-gallery-thumb').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
      });
      thumbs.append(button);
    });

    section.append(main, thumbs);
    const anchor = host.querySelector('.source-tour-meta-head');
    host.insertBefore(section, anchor || host.firstChild);
  }

  function scheduleRender() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(renderGallery, 40);
  }

  new MutationObserver(scheduleRender).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', scheduleRender);
  window.addEventListener('DOMContentLoaded', scheduleRender);
  scheduleRender();
})();
