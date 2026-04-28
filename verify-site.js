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

function assertRegex(source, pattern, label) {
  if (!pattern.test(source)) {
    throw new Error(`Missing ${label}: ${pattern}`);
  }
}

const html = read(htmlPath);
const css = read(cssPath);
const js = read(jsPath);
const pageSource = `${html}\n${css}\n${js}`;

[
  'Noto Serif SC',
  'Cinzel',
  'Inter',
].forEach((needle) => assertIncludes(pageSource, needle, 'required font'));

[
  'star-map-chinese.jpg',
  'guo-back.jpg',
  'jamal-back.jpg',
  'guo-portrait.jpg',
  'jamal-portrait.jpg',
  'shoushi-calendar.jpg',
  'kublai-portrait.jpg',
  'house-of-wisdom.jpg',
  'medicine-split.jpg',
  'star-map-islamic.jpg',
  '1281年，北京。',
  '两个天文学家，同时为同一个皇帝工作。',
  '最终，只有一个人的名字留了下来。',
  '1271年，忽必烈同时召见了他们。',
  '两套宇宙观，在同一个宫廷里相遇。',
  '大元授时历经',
  '郭守敬　撰',
  '知识的生产是共同的。知识的署名权，由权力决定。',
  'الجبر',
  '今天，还有谁的名字正在消失？',
].forEach((needle) => assertIncludes(html, needle, 'required content'));

assertIncludes(html, 'stage-text-lines', 'split Stage C text lines');
[
  '扎马鲁丁带来了七件仪器，带来了更精确的计算方法。',
  '郭守敬学习了，吸收了，',
  '然后超越了。',
].forEach((needle) => assertIncludes(html, needle, 'Stage C text line'));

if (html.includes('<p class="stage-text reveal">扎马鲁丁带来了七件仪器，带来了更精确的计算方法。郭守敬学习了，吸收了，然后超越了。</p>')) {
  throw new Error('Stage C text is still a single oversized paragraph');
}

if (html.includes('这个网页由AI生成。AI的训练数据，80%以上是英文。')) {
  throw new Error('Removed footer text is still present');
}

[
  '简仪',
  '圭表',
  '仰仪',
  '星盘',
  '浑天仪',
  '方位仪',
  '纪限仪',
].forEach((needle) => assertIncludes(html, needle, 'instrument name'));

[
  '苦来亦儿撒麻',
  '苦来亦阿儿子',
  '鲁哈麻亦渺凹只',
].forEach((needle) => {
  if (html.includes(needle)) {
    throw new Error(`Removed instrument name is still present: ${needle}`);
  }
});

assertRegex(html, /class="[^"]*img-placeholder[^"]*"[^>]*data-src="assets\//, 'image placeholders with data-src');
const assetRefs = [...html.matchAll(/data-src="([^"]+)"/g)].map((match) => match[1]);
assetRefs.forEach((assetRef) => {
  const assetPath = path.join(root, assetRef);
  if (!fs.existsSync(assetPath)) {
    throw new Error(`Referenced asset is missing: ${assetRef}`);
  }
});
assertRegex(html, /class="[^"]*scene[^"]*"/, 'scene markup');
assertIncludes(js, 'IntersectionObserver', 'Intersection Observer');
assertIncludes(js, 'prefers-reduced-motion', 'reduced motion detection');
assertIncludes(js, 'typewriter', 'typewriter logic hook');
assertIncludes(css, '@media (prefers-reduced-motion: reduce)', 'reduced motion CSS');
assertIncludes(css, '#080c18', 'background color');
assertIncludes(css, '#c9a84c', 'gold color');
assertIncludes(css, '#e8f4f8', 'blue-white color');
assertIncludes(css, '#c0392b', 'red accent color');
assertIncludes(css, '#f0ead6', 'text color');
assertIncludes(css, 'starRotate', 'star rotation animation');
assertIncludes(css, '120s', 'slow hero background rotation');
assertIncludes(css, 'min-height: 100vh', 'minimum scene height');
assertIncludes(css, 'transition', 'transitions');

console.log('Static scrollytelling checks passed.');
