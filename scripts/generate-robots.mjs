// Writes dist/robots.txt for the deploy context being built.
//
// A deploy preview is a byte-identical copy of the site on another hostname,
// and the prerendered HTML hardcodes production canonicals — so an indexable
// preview hands Google canonical tags pointing at devhub.my from a host that is
// not devhub.my. Phase 13 requires staging to be both uncrawlable and
// unindexable.
//
// Netlify already sets `X-Robots-Tag: noindex` on preview deploys, which covers
// the indexing half. This covers the crawling half.
//
// Why this runs at build time rather than as a Netlify rule: header and
// redirect rules written inside a `[context.*]` block in netlify.toml are
// parsed and then silently ignored — those blocks take build settings and
// environment variables only. Doing it here means the served file is decided by
// code that can be read, tested and asserted on, instead of by a rule that
// looks right and does nothing.
//
// CONTEXT is set by Netlify to `production`, `deploy-preview` or
// `branch-deploy`. Anything unrecognised — a local build, some other CI — is
// treated as NOT production, because the failure that matters is a staging copy
// getting indexed, not a local build having a strict robots file.

import { copyFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const context = process.env.CONTEXT ?? 'local';
const isProduction = context === 'production';

if (isProduction) {
  // public/robots.txt is already copied into dist by Vite; this makes the
  // production path explicit rather than implicit, so the two branches read
  // the same way.
  copyFileSync(join(root, 'public/robots.txt'), join(root, 'dist/robots.txt'));
} else {
  writeFileSync(
    join(root, 'dist/robots.txt'),
    `# Deploy context: ${context}. NOT production.
#
# This is a copy of devhub.my on a different hostname. Crawled, it becomes a
# duplicate of every page on the real site, and its pages carry canonical tags
# pointing at devhub.my — so it must not be crawled at all.
#
# The production robots.txt is public/robots.txt in the repo.

User-agent: *
Disallow: /
`,
  );
}

console.log(`generate-robots: wrote dist/robots.txt for context "${context}"`);
