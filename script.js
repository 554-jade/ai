(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.img-placeholder[data-src]').forEach((el) => {
    el.style.setProperty('--image', `url("${el.dataset.src}")`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');

        if (entry.target.classList.contains('erasure-scene')) {
          runErasure(entry.target);
        }

        if (entry.target.classList.contains('ending-scene')) {
          runTypewriter(entry.target);
        }
      });
    },
    {
      threshold: 0.42,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  document
    .querySelectorAll('.scene, .scroll-stage, .reveal')
    .forEach((el) => observer.observe(el));

  let ticking = false;
  function updateParallax() {
    ticking = false;
    const viewport = window.innerHeight || 1;
    document.querySelectorAll('.scene').forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const centerOffset = rect.top + rect.height / 2 - viewport / 2;
      scene.style.setProperty('--parallax', String(centerOffset));
    });
  }

  if (!reduceMotion) {
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      },
      { passive: true }
    );
    updateParallax();
  }

  function runErasure(scene) {
    if (scene.dataset.played === 'true') return;
    scene.dataset.played = 'true';

    if (reduceMotion) {
      scene.classList.add('show-ghost', 'strike', 'vanish', 'lines');
      return;
    }

    window.setTimeout(() => scene.classList.add('show-ghost'), 3000);
    window.setTimeout(() => scene.classList.add('strike'), 4000);
    window.setTimeout(() => scene.classList.add('vanish'), 5400);
    window.setTimeout(() => scene.classList.add('lines'), 6200);
  }

  async function runTypewriter(scene) {
    if (scene.dataset.played === 'true') return;
    scene.dataset.played = 'true';

    const target = scene.querySelector('.typewriter');
    if (!target) return;

    const lines = (target.dataset.lines || '').split('|').filter(Boolean);
    target.textContent = '';

    if (reduceMotion) {
      lines.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = line;
        target.appendChild(p);
      });
      scene.classList.add('question-visible');
      return;
    }

    for (const line of lines) {
      const p = document.createElement('p');
      p.className = 'cursor';
      target.appendChild(p);

      for (const char of line) {
        p.textContent += char;
        await wait(78);
      }

      p.classList.remove('cursor');
      await wait(420);
    }

    await wait(2000);
    scene.classList.add('question-visible');
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
})();
