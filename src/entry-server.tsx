import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { takeCollectedHead, type HeadData } from './hooks/useSeo';
import { danglingReferences } from './lib/schema';
import { SERVICES } from './data/services';
import { TECHNOLOGIES } from './data/technologies';
import { PEOPLE } from './data/people';
import { trainings, trainingPath } from './data/trainings';
import { posts, blogPath } from './data/blog';

// Server entry for the prerender step.
//
// This module never ships to the browser. scripts/prerender.mjs imports the
// SSR bundle built from it, asks for every route in ROUTES, and writes the
// result to a real HTML file — which is what puts JSON-LD and internal links
// in the server response (R9).

export interface RenderResult {
  html: string;
  head: HeadData | null;
  /** R6 violations found in this page's graph, if any. */
  dangling: string[];
}

export function render(url: string): RenderResult {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  const head = takeCollectedHead();

  return {
    html,
    head,
    dangling: head?.graph ? danglingReferences(head.graph) : [],
  };
}

/**
 * Every URL the site publishes, derived from the same data that drives the
 * pages themselves.
 *
 * The sitemap is generated from this list too, so a page cannot exist without
 * appearing in the sitemap or vice versa — the Phase 12 inclusion rule holds by
 * construction rather than by anyone remembering to update a second list.
 */
export function routes(): string[] {
  return [
    '/',
    '/about/',
    '/contact/',
    '/services/',
    ...SERVICES.map((service) => `/services/${service.slug}/`),
    '/technologies/',
    ...TECHNOLOGIES.map((technology) => `/technologies/${technology.slug}/`),
    '/authors/',
    ...PEOPLE.map((person) => `/authors/${person.slug}/`),
    '/trainings/',
    ...trainings.map(trainingPath),
    '/blog/',
    ...posts.map(blogPath),
  ];
}

/**
 * Entity catalogues, re-exported so build scripts can read them from the SSR
 * bundle instead of parsing TypeScript source. One list of services and
 * technologies feeds the pages, the sitemap and llms.txt alike.
 */
export const catalogue = {
  services: SERVICES.map((service) => ({
    slug: service.slug,
    name: service.name,
    description: service.description,
  })),
  technologies: TECHNOLOGIES.map((technology) => ({
    slug: technology.slug,
    name: technology.name,
    description: technology.description,
  })),
};

/**
 * When each route's content last changed — the Phase 12 `lastmod` rule.
 *
 * This is the content-change date held in the entity data, never the build
 * time and never the file mtime. A typo fix that does not touch these values
 * must leave lastmod alone, or the freshness signal means nothing.
 */
export function lastModified(): Record<string, string> {
  const map: Record<string, string> = {};

  SERVICES.forEach((service) => {
    map[`/services/${service.slug}/`] = service.contentUpdated;
  });
  TECHNOLOGIES.forEach((technology) => {
    map[`/technologies/${technology.slug}/`] = technology.contentUpdated;
  });
  PEOPLE.forEach((person) => {
    map[`/authors/${person.slug}/`] = person.contentUpdated;
  });
  posts.forEach((post) => {
    map[blogPath(post)] = post.updated ?? post.date;
  });

  // Hubs move when the newest thing they list moves.
  // ISO dates sort lexicographically, so the last one is the most recent.
  const newest = (dates: string[]) => dates.slice().sort()[dates.length - 1];
  map['/services/'] = newest(SERVICES.map((s) => s.contentUpdated)) ?? '';
  map['/technologies/'] = newest(TECHNOLOGIES.map((t) => t.contentUpdated)) ?? '';
  map['/authors/'] = newest(PEOPLE.map((p) => p.contentUpdated)) ?? '';
  map['/blog/'] = newest(posts.map((p) => p.updated ?? p.date)) ?? '';

  return map;
}
