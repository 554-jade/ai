const fs = require('fs');
const path = require('path');

const root = __dirname;
const htmlPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');
const jsPath = path.join(root, 'script.js');

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${path.basename(filePath)} is missing`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) {
    throw new Error(`Unexpected ${label}: ${needle}`);
  }
}

function assertRegex(source, pattern, label) {
  if (!pattern.test(source)) {
    throw new Error(`Missing ${label}: ${pattern}`);
  }
}

const html = read(htmlPath);
const css = read(cssPath);
const js = read(jsPath);
const pageSource = `${html}\n${css}\n${js}`;

['Noto Serif SC', 'Cinzel', 'Inter'].forEach((needle) =>
  assertIncludes(pageSource, needle, 'required font')
);

[
  'id="hero-opening"',
  'id="two-astronomies"',
  'id="sky-to-calendar"',
  'id="visibility-memory"',
  'id="political-civilization"',
  'id="contemporary-mirror"',
  'id="celestial-textures"',
  'id="final-thesis"',
].forEach((needle) => assertIncludes(html, needle, 'required section id'));

[
  'href="#two-astronomies"',
  'href="#sky-to-calendar"',
  'href="#visibility-memory"',
  'href="#political-civilization"',
  'href="#contemporary-mirror"',
  'href="#celestial-textures"',
  'href="#final-thesis"',
].forEach((needle) => assertIncludes(html, needle, 'section navigation flow'));

[
  '01_hero_same_sky.png',
  '02_two_astronomies_one_city.png',
  '03_sky_to_calendar_flow.png',
  '04_visibility_and_memory_scroll.png',
  '05_calendar_political_civilization.png',
  '06_contemporary_mirror_astronomy.png',
  '07_chinese_celestial_texture.png',
  '08_islamic_celestial_texture.png',
  'reference_keep/ref_guo_shoujing_portrait.jpg',
  'reference_keep/ref_jamal_al_din_portrait.jpg',
  'reference_keep/ref_hero_backview_chinese.jpg',
  'reference_keep/ref_jamal_backview_city.jpg',
  'reference_keep/ref_chinese_star_map.jpg',
  'reference_keep/ref_islamic_star_map.jpg',
  'kublai-portrait.jpg',
].forEach((needle) => assertIncludes(html, needle, 'astronomy asset'));

[
  'Astronomy & Political Civilization',
  'Beijing, 1281.',
  'Two cosmologies',
  'From Sky to Calendar',
  'Celestial signs',
  'Observation',
  'Calculation',
  'Calendar',
  'Agriculture / Ritual / Administration',
  'Imperial legitimacy',
  'The Shoushi Calendar.',
  'Calendar as a core technology of political civilization',
  'Who holds the authority',
  'Control of astronomical data',
  'The same sky,',
  'different credits.',
  'Sky -> Calendar -> Order -> Imperial Legitimacy -> Contemporary Scientific Authority',
].forEach((needle) => assertIncludes(html, needle, 'English astronomy narrative'));

[
  'Guo Shoujing',
  'Jamal al-Din',
  'Shoushi Calendar',
  'Islamic astronomy',
  'Calendrical reform in North China',
  'Observation instruments and the state calendar',
  'Scientific authority',
  'Kublai Khan',
].forEach((needle) => assertIncludes(html, needle, 'paired astronomer content'));

[
  'data-reveal-card="guo"',
  'data-reveal-card="jamal"',
  'card-back',
  'card-front',
  'Click to reveal the figure',
  'backview-copy',
  'backview-image',
].forEach((needle) => assertIncludes(html, needle, 'interactive card reveal structure'));

[
  'class="img-placeholder section-bg sky-flow-backdrop"',
  'class="img-placeholder section-bg texture-backdrop"',
  'class="img-placeholder section-bg final-backdrop"',
].forEach((needle) => assertIncludes(html, needle, 'background image layer'));

[
  'Algebra',
  'Algorithm',
  'الجبر',
  'medicine-split',
  'house-of-wisdom',
  'patent',
].forEach((needle) => assertNotIncludes(html, needle, 'off-topic content'));

assertNotIncludes(html, 'lang="zh-CN"', 'Chinese page language tag');
assertNotIncludes(html, '下一页', 'Chinese navigation label');
assertNotIncludes(html, '点击后再看人物', 'Chinese reveal prompt');
assertNotIncludes(html, '郭守敬', 'Chinese personal name');
assertNotIncludes(html, '扎马鲁丁', 'Chinese personal name');
assertNotIncludes(html, '忽必烈', 'Chinese personal name');
assertRegex(html, /^[\s\S]*$/u, 'valid UTF-8 content');

if (/[\u3400-\u9fff]/u.test(html)) {
  throw new Error('Chinese characters remain in index.html');
}

assertRegex(html, /class="[^"]*flow-node[^"]*"[^>]*data-tone="science"/, 'science flow nodes');
assertRegex(html, /class="[^"]*flow-node[^"]*"[^>]*data-tone="calendar"/, 'calendar flow node');
assertRegex(html, /class="[^"]*flow-node[^"]*"[^>]*data-tone="power"/, 'power flow nodes');

assertIncludes(js, 'IntersectionObserver', 'Intersection Observer');
assertIncludes(js, 'setupPanelNavigation', 'click-to-next panel navigation');
assertIncludes(js, 'setupRevealCards', 'card reveal interactions');
assertIncludes(js, 'is-revealed', 'card revealed class handling');
assertIncludes(js, 'runLineSequence', 'flow line sequence');
assertIncludes(js, 'runTypewriter', 'final thesis reveal');
assertIncludes(js, 'prefers-reduced-motion', 'reduced motion detection');

assertIncludes(css, '#05070B', 'deep black background');
assertIncludes(css, '#0A1320', 'night blue background');
assertIncludes(css, '#D7A64A', 'gold palette');
assertIncludes(css, '#8FB6D9', 'blue palette');
assertIncludes(css, '#E7E2D8', 'body text palette');
assertIncludes(css, 'heroZoom', 'hero slow zoom animation');
assertIncludes(css, 'twinkle', 'star twinkle animation');
assertIncludes(css, '.astronomy-card.is-revealed .card-front', 'revealed card front state');
assertIncludes(css, '.astronomy-card:not(.is-revealed) .card-back', 'hidden front default state');
assertIncludes(css, '.political-copy', 'political copy styling');
assertIncludes(css, 'justify-self: start', 'left anchored panel placement');
assertIncludes(css, '.sky-flow-backdrop', 'sky flow backdrop styling');
assertIncludes(css, '.texture-backdrop', 'celestial backdrop styling');
assertIncludes(css, '.final-backdrop', 'final backdrop styling');
assertIncludes(css, '@media (prefers-reduced-motion: reduce)', 'reduced motion CSS');

const assetRefs = [...html.matchAll(/(?:data-src|src)="([^"]*\.(?:png|jpg|jpeg|webp))"/g)].map(
  (match) => match[1]
);

assetRefs.forEach((assetRef) => {
  if (/^https?:\/\//.test(assetRef)) return;
  const normalizedRef = assetRef.replace(/^\//, '');
  const assetPath = path.join(root, normalizedRef);
  if (!fs.existsSync(assetPath)) {
    throw new Error(`Referenced asset is missing: ${assetRef}`);
  }
});

console.log('English astronomy site checks passed.');
