(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const languageStorageKey = 'preferred-language';

  document.querySelectorAll('.img-placeholder[data-src]').forEach((el) => {
    el.style.setProperty('--image', `url("${el.dataset.src}")`);
  });

  setupLanguageToggle();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');

        if (entry.target.id === 'sky-to-calendar') {
          runLineSequence(entry.target);
        }

        if (entry.target.id === 'political-civilization') {
          runGlowLabels(entry.target);
        }

        if (entry.target.id === 'final-thesis') {
          runTypewriter(entry.target);
        }
      });
    },
    {
      threshold: 0.24,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  document
    .querySelectorAll('.scene, .reveal, .reveal-line, .reveal-side, .scroll-figure')
    .forEach((el) => observer.observe(el));

  setupPanelNavigation();
  setupRevealCards();
  setupParallax();

  function runLineSequence(section) {
    if (section.dataset.played === 'flow') return;
    section.dataset.played = 'flow';

    const nodes = Array.from(section.querySelectorAll('.flow-node'));

    if (reduceMotion) {
      nodes.forEach((node) => node.classList.add('lit', 'line-lit'));
      section.querySelector('.legitimacy-node')?.classList.add('pulse');
      return;
    }

    nodes.forEach((node, index) => {
      window.setTimeout(() => {
        node.classList.add('lit');
        if (index < nodes.length - 1) node.classList.add('line-lit');
        if (node.classList.contains('legitimacy-node')) node.classList.add('pulse');
      }, 260 + index * 360);
    });
  }

  function runGlowLabels(section) {
    if (section.dataset.labelsPlayed === 'true') return;
    section.dataset.labelsPlayed = 'true';

    const labels = Array.from(section.querySelectorAll('.glow-label'));

    if (reduceMotion) {
      labels.forEach((label) => label.classList.add('is-visible'));
      return;
    }

    labels.forEach((label, index) => {
      window.setTimeout(() => label.classList.add('is-visible'), 360 + index * 260);
    });
  }

  async function runTypewriter(section) {
    if (section.dataset.played === 'final') return;
    section.dataset.played = 'final';

    const target = section.querySelector('.typewriter');
    const finalStatement = section.querySelector('.final-statement');
    if (!target) return;

    const lines = (target.dataset.lines || '').split('|').filter(Boolean);
    target.textContent = '';

    if (reduceMotion) {
      lines.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = line;
        target.appendChild(p);
      });
      finalStatement?.classList.add('is-visible');
      return;
    }

    for (const line of lines) {
      const p = document.createElement('p');
      p.className = 'cursor';
      target.appendChild(p);

      for (const char of line) {
        p.textContent += char;
        await wait(38);
      }

      p.classList.remove('cursor');
      await wait(260);
    }

    await wait(760);
    finalStatement?.classList.add('is-visible');
  }

  function setupPanelNavigation() {
    const panels = Array.from(document.querySelectorAll('.scene-panel'));

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
      const cue = panel.querySelector('.next-cue');
      if (!cue) return;

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

  function setupLanguageToggle() {
    const toggle = document.getElementById('language-toggle');
    if (!toggle) return;

    const buttons = Array.from(toggle.querySelectorAll('[data-language-option]'));
    const savedLanguage = window.localStorage.getItem(languageStorageKey);
    const initialLanguage = savedLanguage === 'en' ? 'en' : 'zh';

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        applyLanguage(button.dataset.languageOption || 'zh');
      });
    });

    applyLanguage(initialLanguage);
  }

  function applyLanguage(language) {
    const currentLanguage = language === 'en' ? 'en' : 'zh';
    const suffix = currentLanguage === 'zh' ? 'Zh' : 'En';
    const title = document.getElementById('page-title');

    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    document.body.dataset.language = currentLanguage;
    window.localStorage.setItem(languageStorageKey, currentLanguage);

    if (title) {
      title.textContent = title.dataset[`text${suffix}`] || title.textContent;
      document.title = title.textContent;
    }

    document.querySelectorAll('[data-text-zh][data-text-en]').forEach((element) => {
      const value = element.dataset[`text${suffix}`];
      if (typeof value === 'string') {
        element.textContent = value;
      }
    });

    document.querySelectorAll('[data-html-zh][data-html-en]').forEach((element) => {
      const value = element.dataset[`html${suffix}`];
      if (typeof value === 'string') {
        element.innerHTML = value;
      }
    });

    document.querySelectorAll('[data-aria-zh][data-aria-en]').forEach((element) => {
      const value = element.dataset[`aria${suffix}`];
      if (typeof value === 'string') {
        element.setAttribute('aria-label', value);
      }
    });

    document.querySelectorAll('#language-toggle [data-language-option]').forEach((button) => {
      const isActive = button.dataset.languageOption === currentLanguage;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });

    syncFinalTypewriter(currentLanguage);
  }

  function syncFinalTypewriter(language) {
    const section = document.getElementById('final-thesis');
    const target = section?.querySelector('.typewriter');
    const finalStatement = section?.querySelector('.final-statement');
    if (!section || !target) return;

    target.dataset.lines = language === 'zh' ? target.dataset.linesZh || '' : target.dataset.linesEn || '';
    target.textContent = '';
    finalStatement?.classList.remove('is-visible');
    delete section.dataset.played;

    if (!section.classList.contains('is-visible')) return;
    runTypewriter(section);
  }

  function setupRevealCards() {
    const cards = Array.from(document.querySelectorAll('[data-reveal-card]'));

    cards.forEach((card) => {
      function revealCard() {
        if (card.classList.contains('is-revealed')) return;
        card.classList.add('is-revealed');
        card.setAttribute('aria-expanded', 'true');
        card.querySelector('.card-back')?.setAttribute('aria-hidden', 'true');
        card.querySelector('.card-front')?.setAttribute('aria-hidden', 'false');
      }

      card.addEventListener('click', revealCard);
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        revealCard();
      });
    });
  }

  function setupParallax() {
    if (reduceMotion) return;

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

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
})();
