// Copies the 3D campus scene into the site and makes it self-hosted.
//
//   npm run sync:3d [-- /path/to/developers-hub-3d.html]
//
// The scene's source of truth lives OUTSIDE this repo, in the business
// workspace (_brand/3d/developers-hub-3d.html). It is never edited here: re-run
// this script whenever it changes, then commit what it writes under
// public/explore/ and public/images/explore/.
//
// What hosting needs, and nothing else:
//   - three is served from public/explore/vendor/three/ (the exact-pinned npm
//     package), with only the addon files the scene imports, plus whatever
//     those files import relatively — crawled, not listed by hand;
//   - Xbot.glb and the typeface JSON are served from public/explore/assets/;
//   - world.html is noindex with a canonical pointing at /explore/, and carries
//     no JSON-LD (check-seo fails any dist HTML with more than one block).
// The script fails if any CDN URL survives the rewrite.

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2] ?? join(homedir(), 'Desktop/business/_brand/3d/developers-hub-3d.html');
const poster = join(dirname(source), 'explore-poster.webp');

const THREE_VERSION = '0.160.0';
const threePkg = join(root, 'node_modules/three');
const outDir = join(root, 'public/explore');
const vendorDir = join(outDir, 'vendor/three');
const assetDir = join(outDir, 'assets');
const WEB_VENDOR = '/explore/vendor/three';
const WEB_ASSETS = '/explore/assets';

// Remote assets the scene loads at runtime. A file the npm package already
// ships is copied from it; anything else is downloaded once and kept.
const ASSETS = [
  {
    url: `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/examples/fonts/helvetiker_bold.typeface.json`,
    file: 'helvetiker_bold.typeface.json',
    local: join(threePkg, 'examples/fonts/helvetiker_bold.typeface.json'),
  },
  {
    url: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/Xbot.glb',
    file: 'Xbot.glb',
  },
];

const fail = (message) => {
  console.error(`sync-3d: ${message}`);
  process.exit(1);
};

if (!existsSync(source)) fail(`scene not found at ${source}`);
const installed = JSON.parse(readFileSync(join(threePkg, 'package.json'), 'utf8')).version;
if (installed !== THREE_VERSION) fail(`node_modules/three is ${installed}, the scene needs ${THREE_VERSION} — run npm ci`);

let html = readFileSync(source, 'utf8');

// --- three: the importmap and the files it has to resolve -------------------

const mapMatch = html.match(/<script type="importmap">([\s\S]*?)<\/script>/);
if (!mapMatch) fail('no importmap in the scene');
const importmap = JSON.parse(mapMatch[1]);
if (!importmap.imports?.three || !importmap.imports['three/addons/']) {
  fail('importmap must define "three" and "three/addons/" — update this script if the scene changed shape');
}

/**
 * Every module specifier in a source file, from top-level statements only:
 * `import … from '…'`, `export … from '…'` and side-effect `import '…'`.
 * Anchored to the start of a line so log strings and JSDoc examples that
 * merely contain the word "from" are not mistaken for imports.
 */
const specifiers = (code) =>
  [...code.matchAll(/^\s*(?:import|export)\b(?:[^;'"]*?\bfrom)?\s*['"]([^'"]+)['"]/gm)].map((m) => m[1]);

const moduleScript = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
const addonEntries = specifiers(moduleScript)
  .filter((s) => s.startsWith('three/addons/'))
  .map((s) => s.slice('three/addons/'.length));
const unknown = specifiers(moduleScript).filter((s) => s !== 'three' && !s.startsWith('three/addons/'));
if (unknown.length) fail(`scene imports modules this script does not host: ${unknown.join(', ')}`);

// Crawl relative imports from each addon, paths relative to examples/jsm.
const jsm = join(threePkg, 'examples/jsm');
const addons = new Set();
const queue = [...addonEntries];
while (queue.length) {
  const file = queue.pop();
  if (addons.has(file)) continue;
  const abs = join(jsm, file);
  if (!existsSync(abs)) fail(`addon ${file} is not in three@${THREE_VERSION}`);
  addons.add(file);
  for (const spec of specifiers(readFileSync(abs, 'utf8'))) {
    if (spec === 'three') continue;
    if (!spec.startsWith('.')) fail(`${file} imports ${spec}, which the importmap cannot resolve`);
    const next = posix.normalize(posix.join(posix.dirname(file), spec));
    if (next.startsWith('..')) fail(`${file} imports ${spec}, outside examples/jsm`);
    queue.push(next);
  }
}

// Rebuild vendor/ from scratch so a dropped addon does not linger.
rmSync(join(outDir, 'vendor'), { recursive: true, force: true });
mkdirSync(join(vendorDir, 'build'), { recursive: true });
copyFileSync(join(threePkg, 'build/three.module.js'), join(vendorDir, 'build/three.module.js'));
copyFileSync(join(threePkg, 'LICENSE'), join(vendorDir, 'LICENSE'));
for (const file of addons) {
  const to = join(vendorDir, 'examples/jsm', file);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(join(jsm, file), to);
}

const localMap = {
  imports: {
    three: `${WEB_VENDOR}/build/three.module.js`,
    'three/addons/': `${WEB_VENDOR}/examples/jsm/`,
  },
};
html = html.replace(mapMatch[0], `<script type="importmap">\n${JSON.stringify(localMap)}\n</script>`);

// --- runtime assets ---------------------------------------------------------

mkdirSync(assetDir, { recursive: true });
for (const asset of ASSETS) {
  if (!html.includes(asset.url)) fail(`scene no longer loads ${asset.url} — update ASSETS`);
  const to = join(assetDir, asset.file);
  if (asset.local) {
    copyFileSync(asset.local, to);
  } else if (!existsSync(to)) {
    const res = await fetch(asset.url);
    if (!res.ok) fail(`download ${asset.url} failed: HTTP ${res.status}`);
    writeFileSync(to, Buffer.from(await res.arrayBuffer()));
    console.log(`sync-3d: downloaded ${asset.file}`);
  }
  html = html.replaceAll(asset.url, `${WEB_ASSETS}/${asset.file}`);
}

// --- head: keep the bare scene out of the index -----------------------------

if (/application\/ld\+json/.test(html)) fail('scene carries JSON-LD; it must not (check-seo T1)');
if (/<meta name="robots"|<link rel="canonical"/.test(html)) fail('scene already sets robots/canonical — reconcile by hand');
html = html.replace(
  /<meta charset="utf-8">/i,
  (m) => `${m}\n<meta name="robots" content="noindex">\n<link rel="canonical" href="https://devhub.my/explore/">`,
);
if (!html.includes('<link rel="canonical" href="https://devhub.my/explore/">')) fail('could not inject the head tags');

// Self-check: nothing may still come from a CDN.
const remote = html.match(/https:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com|esm\.sh)[^\s'"]*/g);
if (remote) fail(`remote URLs survived the rewrite: ${remote.join(', ')}`);

writeFileSync(join(outDir, 'world.html'), html);

// --- poster -----------------------------------------------------------------

if (!existsSync(poster)) fail(`poster not found at ${poster}`);
mkdirSync(join(root, 'public/images/explore'), { recursive: true });
copyFileSync(poster, join(root, 'public/images/explore/explore-poster.webp'));

console.log(
  `sync-3d: wrote ${relative(root, join(outDir, 'world.html'))} with three ${THREE_VERSION} and ${addons.size} addon file(s)`,
);
