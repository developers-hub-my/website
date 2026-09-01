// Turns the client bundle into a set of real HTML documents — one per route.
//
// This is the step that makes the rest of the Entity SOP verifiable. Before
// it existed, every URL on devhub.my returned the same index.html and a crawler
// with JavaScript disabled saw one page repeated nineteen times: hence
// requirement R9, the soft-404s, and nineteen sitemap URLs all canonicalising
// to the homepage.
//
// Runs after both Vite builds:
//   1. vite build              → dist/index.html + client assets
//   2. vite build --ssr        → dist-ssr/entry-server.js
//   3. node scripts/prerender  → dist/<route>/index.html for every route
//
// The template is dist/index.html, so the hashed asset tags Vite injected are
// inherited by every page for free.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const { render, routes } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);

const template = readFileSync(join(dist, 'index.html'), 'utf8');

if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  console.error('prerender: index.html is missing <!--app-head--> or <!--app-html-->.');
  process.exit(1);
}

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeText = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * JSON-LD sits inside a <script> element, so the one sequence that must never
 * appear raw is `</script`. Escaping the forward slash keeps the JSON valid
 * while making the closing tag unrecognisable to the HTML parser.
 */
const escapeJsonLd = (graph) => JSON.stringify(graph).replace(/<\/(script)/gi, '<\\/$1');

function headTags(head) {
  const tags = [
    `<title>${escapeText(head.title)}</title>`,
    `<meta name="description" content="${escapeAttr(head.description)}" />`,
    `<meta name="robots" content="${head.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${escapeAttr(head.canonical)}" />`,
    `<meta property="og:url" content="${escapeAttr(head.canonical)}" />`,
    `<meta property="og:title" content="${escapeAttr(head.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(head.description)}" />`,
    `<meta property="og:image" content="${escapeAttr(head.image)}" />`,
    `<meta name="twitter:url" content="${escapeAttr(head.canonical)}" />`,
    `<meta name="twitter:title" content="${escapeAttr(head.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(head.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(head.image)}" />`,
  ];

  // Exactly one block, exactly one @graph (R1). A noindex page emits none.
  if (head.graph) {
    tags.push(`<script type="application/ld+json">${escapeJsonLd(head.graph)}</script>`);
  }

  return tags.join('\n    ');
}

const list = routes();
const failures = [];
let written = 0;

for (const route of list) {
  const { html, head, dangling } = render(route);

  if (!head) {
    failures.push(`${route}: rendered without calling useSeo — the page has no title or canonical.`);
    continue;
  }

  // R6: a reference to a node that is not in the graph leaves the graph
  // incomplete in a way no validator reports. Fail the build instead.
  if (dangling.length > 0) {
    failures.push(`${route}: dangling @id reference(s): ${dangling.join(', ')}`);
    continue;
  }

  // R2/R3: a staging or preview host must never emit a production @id, and a
  // canonical must never point somewhere the page is not.
  const expected = `https://devhub.my${route === '/' ? '/' : route}`;
  if (head.canonical !== expected) {
    failures.push(`${route}: canonical is ${head.canonical}, expected ${expected}`);
    continue;
  }

  const page = template
    .replace('<!--app-head-->', headTags(head))
    .replace('<!--app-html-->', html);

  // "/" writes dist/index.html; "/about/" writes dist/about/index.html, which
  // Netlify serves at /about/ with the trailing slash the URL contract requires.
  const outDir = route === '/' ? dist : join(dist, route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), page);
  written += 1;
}

// The 404 document. Netlify serves dist/404.html with a genuine 404 status for
// any path that does not resolve to a file, which is what replaces the old
// `/* /index.html 200` fallback — that rule is why /about/, /llms.txt and
// /tidak-wujud/ all answered 200 with the homepage.
const notFound = render('/__not_found__');
if (notFound.head) {
  writeFileSync(
    join(dist, '404.html'),
    template
      .replace('<!--app-head-->', headTags(notFound.head))
      .replace('<!--app-html-->', notFound.html),
  );
  written += 1;
}

if (failures.length > 0) {
  console.error(`prerender: ${failures.length} route(s) failed\n  ${failures.join('\n  ')}`);
  process.exit(1);
}

console.log(`prerender: wrote ${written} HTML documents (${list.length} routes + 404)`);
