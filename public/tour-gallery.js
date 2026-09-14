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

  function makeTopGallery(images, slug) {
    const section = document.createElement('div');
    section.className = 'source-cover-gallery';
    section.dataset.slug = slug;

    const heroImages = images.slice(0, Math.min(7, images.length));
    const main = document.createElement('div');
    main.className = 'source-cover-gallery-main';
    const mainImage = document.createElement('img');
    mainImage.src = heroImages[0];
    mainImage.alt = '';
    main.append(mainImage);

    if (heroImages.length > 1) {
      const thumbs = document.createElement('div');
      thumbs.className = 'source-cover-gallery-dots';
      heroImages.forEach((src, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = index === 0 ? 'active' : '';
        button.setAttribute('aria-label', `Фото ${index + 1}`);
        button.addEventListener('click', () => {
          mainImage.src = src;
          thumbs.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
          button.classList.add('active');
        });
        thumbs.append(button);
      });
      section.append(main, thumbs);
    } else {
      section.append(main);
    }
    return section;
  }

  function makeProgramImage(src, slug) {
    const figure = document.createElement('figure');
    figure.className = 'source-program-image';
    figure.dataset.slug = slug;
    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    image.loading = 'lazy';
    figure.append(image);
    return figure;
  }

  async function renderGallery() {
    scheduled = false;
    const slug = slugFromPath();
    const cover = document.querySelector('.source-tour-cover');
    const host = document.querySelector('.source-tour-main .source-tour-narrow');
    if (!cover || !host) return;

    const manifest = await loadManifest();
    const images = manifest[slug] || [];
    if (!images.length) return;

    const currentCover = cover.querySelector('.source-cover-gallery');
    if (currentCover?.dataset.slug !== slug) {
      cover.innerHTML = '';
      cover.append(makeTopGallery(images, slug));
    }

    host.querySelectorAll('.source-generated-gallery').forEach((node) => node.remove());
    const oldProgramImage = host.querySelector('.source-program-image');
    if (oldProgramImage?.dataset.slug !== slug) oldProgramImage?.remove();

    // Source pages place a standalone visual between timing/prices and the
    // ordered program. The first seven source images belong to the top gallery.
    if (images[7] && !host.querySelector('.source-program-image')) {
      const figure = makeProgramImage(images[7], slug);
      const locations = host.querySelector('.source-location-list');
      if (locations) host.insertBefore(figure, locations);
      else {
        const features = host.querySelector('.source-features-section');
        host.insertBefore(figure, features || null);
      }
    }
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
