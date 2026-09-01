// Acceptance tests T1–T8 from Phase 06, run against the built output.
//
// The SOP's reasoning for automating these is blunt: "Kalau ia hanya
// dijalankan manual, ia akan berhenti dijalankan dalam masa dua bulan." They
// run on every build, and the build fails when one fails.
//
// These check what we control — the documents we generate. The HTTP half
// (redirect chains, real 404 status, one-hop www) can only be checked against a
// deployed origin, and lives in scripts/check-live.mjs.
//
// To confirm the gate actually bites, break something on purpose: change an
// @id, drop a breadcrumb, put "" in a service description. The build must fail.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { glob } from 'node:fs/promises';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE_URL = 'https://devhub.my';

const { render, routes } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);

const failures = [];
const fail = (test, page, message) => failures.push(`${test}  ${page}  ${message}`);

const jsonLdBlocks = (html) => [
  ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
].map((match) => match[1]);

const pageFor = (route) => (route === '/' ? 'index.html' : join(route.slice(1), 'index.html'));

// Markup escapes what JSON does not: a course called "Docker & Container
// Fundamentals" is `&amp;` in the breadcrumb nav and `&` in the graph. Decoding
// before comparing keeps T6 checking the names rather than the encoding.
const decodeEntities = (text) =>
  text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&');

// ---------------------------------------------------------------------------

for (const route of routes()) {
  const file = join(dist, pageFor(route));
  const page = route;

  if (!existsSync(file)) {
    fail('T1', page, 'no prerendered document');
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const blocks = jsonLdBlocks(html);

  // T1 — exactly one JSON-LD block, containing one @graph.
  if (blocks.length !== 1) {
    fail('T1', page, `${blocks.length} JSON-LD blocks, expected 1`);
    continue;
  }

  let graph;
  try {
    graph = JSON.parse(blocks[0]);
  } catch (error) {
    fail('T1', page, `JSON-LD does not parse: ${error.message}`);
    continue;
  }

  if (!Array.isArray(graph['@graph'])) {
    fail('T1', page, 'block has no @graph array');
    continue;
  }

  const nodes = graph['@graph'];
  const byType = (type) => nodes.filter((node) => node['@type'] === type);

  // T2 — exactly one Organization, with the registry @id.
  const orgs = byType('Organization');
  if (orgs.length !== 1) {
    fail('T2', page, `${orgs.length} Organization nodes, expected 1`);
  } else if (orgs[0]['@id'] !== `${SITE_URL}/#organization`) {
    fail('T2', page, `Organization @id is ${orgs[0]['@id']}`);
  }

  // T3 — every @id must match the canonical registry patterns (R2), and no
  // id may leak a non-production host (R3).
  for (const node of nodes) {
    const id = node['@id'];
    if (typeof id !== 'string') continue;
    if (!id.startsWith(`${SITE_URL}/`)) {
      fail('T3', page, `@id outside the canonical host: ${id}`);
    }
    if (/#[0-9a-f]{6,}$/i.test(id)) {
      fail('T3', page, `@id looks non-deterministic: ${id}`);
    }
  }

  // T4 — no empty, null or placeholder values anywhere in the output.
  const raw = blocks[0];
  const emptyHit = raw.match(/"[^"]+"\s*:\s*(""|null|\[\]|\{\}|"(?:N\/A|TBD|TBA|none)")/i);
  if (emptyHit) {
    fail('T4', page, `empty or placeholder value: ${emptyHit[0]}`);
  }

  // T5 — WebPage.url, the canonical tag and the requested URL all agree.
  const expected = `${SITE_URL}${route}`;
  const canonicalTag = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const webPage = nodes.find((node) => String(node['@type']).endsWith('Page'));

  if (canonicalTag !== expected) {
    fail('T5', page, `canonical tag is ${canonicalTag}, expected ${expected}`);
  }
  if (webPage && webPage.url !== expected) {
    fail('T5', page, `WebPage.url is ${webPage.url}, expected ${expected}`);
  }
  const ogUrl = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1];
  if (ogUrl !== expected) {
    fail('T5', page, `og:url is ${ogUrl}, expected ${expected}`);
  }

  // T6 — BreadcrumbList names match the visible trail, in order.
  const crumbList = byType('BreadcrumbList')[0];
  const nav = html.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0];

  if (crumbList && nav) {
    const visible = [...nav.matchAll(/<(?:a|span)[^>]*>([^<]+)<\/(?:a|span)>/g)]
      .map((match) => decodeEntities(match[1]).trim())
      .filter(Boolean);
    const schema = crumbList.itemListElement.map((item) => item.name);

    if (visible.join(' > ') !== schema.join(' > ')) {
      fail('T6', page, `breadcrumbs differ — visible [${visible}] vs schema [${schema}]`);
    }
  } else if (crumbList && !nav && route !== '/') {
    fail('T6', page, 'graph has a BreadcrumbList but the page renders no breadcrumb nav');
  }

  // T7 — a value that is absent from the data must be absent from the output,
  // not present as an empty string. Verified structurally: the identity module
  // publishes no telephone, so no node may carry one.
  if (raw.includes('"telephone"')) {
    fail('T7', page, 'telephone is emitted although no phone number is configured');
  }

  // T8 — the crawler-visible half. Content and internal links must be in the
  // document itself, not injected after load.
  // Page links only. Anything whose last segment has a file extension is an
  // asset reference (images, the feed, the manifest), not a destination a
  // crawler walks — and assets have no trailing slash by definition.
  const internalLinks = [...html.matchAll(/href="(\/[^"#][^"]*)"/g)]
    .map((match) => match[1])
    .filter((href) => !/\.[a-z0-9]+$/i.test(href.split('?')[0]));

  if (internalLinks.length < 3) {
    fail('T8', page, `only ${internalLinks.length} internal links in the server response`);
  }

  // C4 — an internal link must point at the canonical URL, not at one that
  // will be redirected to it. A link to /services/x costs a 301 on every click
  // and every crawl of the page, which the Phase 08 gate reads as a chain.
  for (const href of new Set(internalLinks)) {
    if (!href.endsWith('/')) {
      fail('C4', page, `internal link without a trailing slash: ${href}`);
    }
  }
  if (!html.includes('<h1')) {
    fail('T8', page, 'no h1 in the server response');
  }

  // Title budget — the Site Audit's "long title element" finding.
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
  if (title.length > 60) {
    fail('title', page, `title is ${title.length} characters: ${title}`);
  }
  if (!title.trim()) {
    fail('title', page, 'empty title');
  }

  // Exactly one h1 per page.
  const h1s = (html.match(/<h1[ >]/g) ?? []).length;
  if (h1s !== 1) {
    fail('h1', page, `${h1s} h1 elements, expected 1`);
  }
}

// --- T3, the other half: determinism ---------------------------------------
//
// Rendering the same route twice must produce byte-identical JSON-LD. A random
// suffix, a timestamp or a Set iteration order that varies would show up here.
for (const route of routes().slice(0, 5)) {
  const first = JSON.stringify(render(route).head?.graph);
  const second = JSON.stringify(render(route).head?.graph);
  if (first !== second) {
    fail('T3', route, 'JSON-LD differs between two renders of the same route');
  }
}

// --- Site-wide artifacts ----------------------------------------------------

// robots.txt differs by deploy context, so the assertion has to as well:
// production must invite the crawl and point at the sitemap, everything else
// must refuse it outright. Checking only the production shape would fail every
// preview build; checking neither would let a staging deploy ship crawlable.
const context = process.env.CONTEXT ?? 'local';
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');

if (context === 'production') {
  if (!/^Sitemap:\s*https:\/\/devhub\.my\/sitemap\.xml$/m.test(robots)) {
    fail('robots', '/robots.txt', 'does not reference the sitemap');
  }
  if (/^Crawl-delay:/m.test(robots)) {
    fail('robots', '/robots.txt', 'still sets Crawl-delay');
  }
  if (/^Disallow:\s*\/$/m.test(robots)) {
    fail('robots', '/robots.txt', 'production is serving the staging robots.txt — the whole site is disallowed');
  }
} else if (!/^Disallow:\s*\/$/m.test(robots)) {
  fail('robots', '/robots.txt', `context "${context}" is not production but robots.txt does not disallow everything`);
}

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
if (/<changefreq>|<priority>/.test(sitemap)) {
  fail('S', '/sitemap.xml', 'contains changefreq or priority, which Phase 12 removes');
}

const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const published = new Set(routes().map((route) => `${SITE_URL}${route}`));

// S5 — no duplicates.
const seen = new Set();
for (const url of sitemapUrls) {
  if (seen.has(url)) fail('S5', url, 'appears twice in the sitemap');
  seen.add(url);
}

// S1/S6 — every sitemap URL is a page we actually built, and vice versa.
for (const url of sitemapUrls) {
  if (!published.has(url)) fail('S1', url, 'is in the sitemap but was not built');
}
for (const url of published) {
  if (!sitemapUrls.includes(url)) fail('S6', url, 'was built but is missing from the sitemap');
}

// S4 — https, bare host, trailing slash.
for (const url of sitemapUrls) {
  if (!url.startsWith('https://devhub.my/')) fail('S4', url, 'wrong scheme or host');
  if (!url.endsWith('/')) fail('S4', url, 'missing trailing slash');
}

// llms.txt — every URL in it must be a published route (Phase 16 gate).
const llms = readFileSync(join(dist, 'llms.txt'), 'utf8');
const llmsUrls = [...llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);
for (const url of llmsUrls) {
  if (!published.has(url)) fail('llms', url, 'is listed in llms.txt but is not a published route');
}
if ((llms.match(/^# /gm) ?? []).length !== 1) {
  fail('llms', '/llms.txt', 'must have exactly one H1');
}

// The 404 document has to exist, and must be noindex.
if (!existsSync(join(dist, '404.html'))) {
  fail('404', '/404.html', 'missing — unmatched paths would fall back to the SPA');
} else {
  const notFound = readFileSync(join(dist, '404.html'), 'utf8');
  if (!/content="noindex/.test(notFound)) {
    fail('404', '/404.html', 'is not noindex');
  }
}

// Nothing outside dist/ should still be serving a stale hand-written schema.
for await (const file of glob('**/*.html', { cwd: dist })) {
  if (file.startsWith('admin/')) continue;
  const html = readFileSync(join(dist, file), 'utf8');
  if (jsonLdBlocks(html).length > 1) {
    fail('T1', `/${relative('.', file)}`, 'more than one JSON-LD block');
  }
}

// ---------------------------------------------------------------------------

if (failures.length > 0) {
  console.error(`check-seo: ${failures.length} failure(s)\n  ${failures.join('\n  ')}`);
  process.exit(1);
}

console.log(`check-seo: T1–T8 and S1–S6 pass across ${routes().length} pages`);
