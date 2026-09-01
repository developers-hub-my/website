// Generates dist/llms.txt — the Phase 16 artifact.
//
// The file did not exist before this script. `curl https://devhub.my/llms.txt`
// returned 200 with the homepage HTML, because the SPA fallback answered every
// unmatched path — and that HTML is what the Site Audit read as "Llms.txt has
// formatting issues".
//
// It is generated rather than hand-written for one reason: the SOP requires it
// to be reconciled with the sitemap on every release, and a file a human
// maintains separately will drift the first time a page is renamed. Here it is
// derived from the same route list, and a URL that is not in the sitemap cannot
// appear in it.
//
// Format rules, from the SOP's own list of what breaks parsers:
//   - exactly one H1
//   - an optional blockquote summary
//   - H2 sections containing ONLY `- [Title](url): description` items
//   - no HTML, no tables, no nested lists, no emoji

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE_URL = 'https://devhub.my';

const { routes, catalogue } = await import(
  pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href
);

const published = new Set(routes());

/** Only lists a URL the site actually published — keeps llms.txt and the sitemap in step. */
function link(path, title, description) {
  if (!published.has(path)) {
    console.error(`generate-llms: ${path} is not a published route; refusing to list it.`);
    process.exit(1);
  }
  return `- [${title}](${SITE_URL}${path}): ${description}`;
}

const lines = [
  '# Developers Hub Sdn Bhd',
  '',
  '> Developers Hub Sdn Bhd, operating as DevHub, is a technology company in',
  '> Johor Bahru, Malaysia. DevHub provides software development, IT consultation,',
  '> technology education and business solutions, and publishes technical knowledge',
  '> about Laravel, PHP and AI-augmented development.',
  '',
  '## Services',
  '',
  ...catalogue.services.map((service) =>
    link(`/services/${service.slug}/`, service.name, service.description),
  ),
  '',
  '## Technologies',
  '',
  ...catalogue.technologies.map((technology) =>
    link(`/technologies/${technology.slug}/`, technology.name, technology.description),
  ),
  '',
  '## Knowledge',
  '',
  link('/trainings/', 'Trainings', 'Thirteen developer courses across four stages, from Foundation to Architect.'),
  link('/resources/', 'Resources', 'Articles and field notes on software engineering, developer training and technology practice.'),
  link('/authors/', 'Authors', "The people who write DevHub's technical content, and the evidence behind their expertise."),
  '',
  '## Company',
  '',
  link('/about/', 'About', 'Company background, capabilities and team.'),
  link('/contact/', 'Contact', 'Business address, email and opening hours.'),
  '',
];

writeFileSync(join(dist, 'llms.txt'), lines.join('\n'));
console.log(`generate-llms: wrote dist/llms.txt`);
