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
      threshold: 0.28,
      rootMargin: '0px 0px -4% 0px',
    }
  );

  document
    .querySelectorAll('.scene, .scroll-stage, .reveal')
    .forEach((el) => observer.observe(el));

  setupPanelNavigation();

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

    window.setTimeout(() => scene.classList.add('show-ghost'), 1800);
    window.setTimeout(() => scene.classList.add('strike'), 2500);
    window.setTimeout(() => scene.classList.add('vanish'), 3400);
    window.setTimeout(() => scene.classList.add('lines'), 4000);
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
        await wait(45);
      }

      p.classList.remove('cursor');
      await wait(240);
    }

    await wait(1200);
    scene.classList.add('question-visible');
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function setupPanelNavigation() {
    const panels = Array.from(
      document.querySelectorAll(
        '.scene-hero, .scroll-stage, .erasure-scene, .why-scene, .card-scene, .ending-scene'
      )
    );

    function goToPanel(index) {
      const panel = panels[index];
      if (!panel) return;
      panel.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }

    function currentPanelIndex() {
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      panels.forEach((panel, index) => {
        const distance = Math.abs(panel.getBoundingClientRect().top);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      return nearestIndex;
    }

    panels.forEach((panel, index) => {
      if (index === panels.length - 1) return;

      let cue = Array.from(panel.children).find((child) => child.classList?.contains('next-cue'));
      if (!cue) {
        cue = document.createElement('button');
        cue.className = 'next-cue';
        cue.type = 'button';
        cue.setAttribute('aria-label', '下一页');
        panel.appendChild(cue);
      }

      cue.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        goToPanel(index + 1);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        goToPanel(currentPanelIndex() + 1);
      }

      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        goToPanel(currentPanelIndex() - 1);
      }
    });
  }
})();
