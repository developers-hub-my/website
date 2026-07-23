// Generates public/sitemap.xml from the static training catalogue in
// src/data/trainings.ts. Runs as part of prebuild (alongside
// fetch-gatherhub.mjs), so the sitemap can never drift from the catalogue.
//
// Slugs/stages are regex-extracted rather than importing the TS module —
// trainings.ts pulls in lucide-react, which we don't want to evaluate in a
// bare Node build step. Each catalogue entry opens with `slug:` immediately
// followed by `stage:` on the next line; that pairing skips the identically
// named helper-function parameters further down the file.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://devhub.my';

const source = readFileSync(join(root, 'src/data/trainings.ts'), 'utf8');
const entries = [...source.matchAll(/slug:\s*'([^']+)',\s*\n\s*stage:\s*'([^']+)'/g)].map(
  ([, slug, stage]) => ({ slug, stage }),
);

// Parser-drift guard: the catalogue holds 13 courses. If the regex suddenly
// finds almost none, the file layout changed — fail the build loudly instead
// of shipping a sitemap that silently dropped every training page.
if (entries.length < 10) {
  console.error(
    `generate-sitemap: only ${entries.length} trainings parsed from trainings.ts — ` +
      'catalogue layout changed? Update the regex in scripts/generate-sitemap.mjs.',
  );
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE_URL}/trainings`, changefreq: 'weekly', priority: '0.9' },
  ...entries.map(({ stage, slug }) => ({
    loc: `${SITE_URL}/trainings/${stage}/${slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(root, 'public/sitemap.xml'), xml);
console.log(`generate-sitemap: wrote ${urls.length} URLs to public/sitemap.xml`);
