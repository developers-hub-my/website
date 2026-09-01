// Generates dist/sitemap.xml from the same route list the prerender step used.
//
// Phase 12's inclusion rule is a single rule with no exceptions: published AND
// indexable AND has a canonical URL AND returns 200 AND is self-canonical. That
// holds here by construction — the list comes from entry-server.js routes(), so
// a URL is in the sitemap if and only if a document was written for it. There
// is no hand-maintained list to drift, and no way to add a URL to the sitemap
// without the page existing.
//
// Two things the SOP asks us to stop doing, both of which this file used to do:
//
//   changefreq / priority   Removed. "Hierarchy sebenar datang dari internal
//                           link, navigation dan kualiti content, bukan nombor
//                           dalam XML." Google ignores them; keeping them only
//                           invites someone to read meaning into them later.
//
//   lastmod = today         Removed. The old version stamped the build date on
//                           every non-blog URL, so lastmod moved on every
//                           deploy whether or not a word had changed. The gate
//                           is literally "edit a typo, lastmod must not move".
//                           Dates now come from the contentUpdated field on
//                           each entity.

import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE_URL = 'https://devhub.my';

const { routes, lastModified } = await import(
  pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href
);

const list = routes();
const dates = lastModified();

// S1 (every URL returns 200) is guaranteed only if a document was actually
// written for it. Checking the files exist is the cheap half of that check;
// the HTTP half runs against production in the acceptance tests.
const missing = list.filter(
  (route) => !existsSync(join(dist, route === '/' ? 'index.html' : join(route, 'index.html'))),
);

if (missing.length > 0) {
  console.error(
    `generate-sitemap: ${missing.length} route(s) have no prerendered document:\n  ${missing.join('\n  ')}`,
  );
  process.exit(1);
}

// S5: no URL may appear twice, across the whole sitemap.
const duplicates = list.filter((route, index) => list.indexOf(route) !== index);
if (duplicates.length > 0) {
  console.error(`generate-sitemap: duplicate URLs: ${[...new Set(duplicates)].join(', ')}`);
  process.exit(1);
}

const entries = list
  .map((route) => {
    const loc = `${SITE_URL}${route}`;
    const lastmod = dates[route];

    return lastmod
      ? `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
      : `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  })
  .join('\n');

writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
);

// S4: every URL must be https, on the bare host, with a trailing slash.
const malformed = list.filter((route) => !route.startsWith('/') || !route.endsWith('/'));
if (malformed.length > 0) {
  console.error(`generate-sitemap: malformed route(s): ${malformed.join(', ')}`);
  process.exit(1);
}

// The robots.txt/sitemap cross-check lives in scripts/check-seo.mjs, not here.
// It was in both, and the copy here was not context-aware: it failed every
// preview build, where robots.txt correctly disallows everything, and it failed
// before check-seo could run and say anything more useful.

console.log(`generate-sitemap: wrote ${list.length} URLs to dist/sitemap.xml`);
