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
  '01_hero_same_sky.png',
  '02_two_astronomies_one_city.png',
  '03_sky_to_calendar_flow.png',
  '04_visibility_and_memory_scroll.png',
  '05_calendar_political_civilization.png',
  '06_contemporary_mirror_astronomy.png',
  '07_chinese_celestial_texture.png',
  '08_islamic_celestial_texture.png',
].forEach((needle) => assertIncludes(html, needle, 'astronomy asset'));

[
  'id="language-toggle"',
  'data-language-option="zh"',
  'data-language-option="en"',
  'data-text-zh=',
  'data-text-en=',
  'data-html-zh=',
  'data-html-en=',
  'data-aria-zh=',
  'data-aria-en=',
  'data-lines-zh=',
  'data-lines-en=',
].forEach((needle) => assertIncludes(html, needle, 'bilingual UI scaffold'));

[
  '1281年，北京。',
  '天文学不只是关于天空。',
  '两套宇宙观',
  '从天空到历法',
  '农业 / 祭祀 / 行政',
  '帝国合法性',
  '今天，',
  '谁拥有天空的解释权？',
  '同一片天空，',
  '不同的署名。',
  'Astronomy & Political Civilization',
  'Beijing, 1281.',
  'From Sky to Calendar',
  'Agriculture',
  'Imperial Legitimacy',
  'The same sky,',
  'different credits.',
].forEach((needle) => assertIncludes(html, needle, 'bilingual narrative copy'));

[
  'setupLanguageToggle',
  'applyLanguage',
  'localStorage',
  'preferred-language',
  'data-language',
].forEach((needle) => assertIncludes(js, needle, 'language toggle behavior'));

[
  '.language-toggle',
  '.lang-tab',
  '.lang-tab.is-active',
  '.flow-node--dense',
  'text-wrap: balance',
  'overflow-wrap: anywhere',
].forEach((needle) => assertIncludes(css, needle, 'layout resilience styling'));

assertNotIncludes(html, 'Click to reveal the figure</small>\n            </div>\n          </div>\n          <div class="card-stage card-front"', 'English-only card without bilingual attributes');

console.log('Bilingual astronomy site checks passed.');
