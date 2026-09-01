import { useEffect } from 'react';
import { SITE, canonicalUrl } from '../data/site';
import { buildGraph, type Crumb, type Graph, type SchemaNode } from '../lib/schema';

// Per-page head management, in two modes.
//
// During prerender (`import.meta.env.SSR`) the values are recorded into a
// module-scoped slot that scripts/prerender.mjs reads after renderToString, so
// the title, canonical and JSON-LD are written into the HTML file itself. That
// is what satisfies requirement R9: a crawler with JavaScript disabled sees
// the full head without executing anything.
//
// In the browser the same values are applied by an effect, so client-side
// navigation keeps the head in step after hydration.
//
// index.html carries no per-page tags any more — every title, description,
// canonical, OG tag and JSON-LD block on the site originates here.

export interface SeoOptions {
  /** Full document title. Under 60 characters, entity name first. */
  title: string;
  description: string;
  /** Site-relative path; the canonical URL is derived from it (trailing slash, no query). */
  path: string;
  /** og:image — site-relative or absolute; defaults to the site og-image. */
  image?: string;
  /** Keep crawlers off soft-404s and not-found states. */
  noindex?: boolean;
  /**
   * Schema nodes for this page, beyond the foundation set. The hook adds
   * Organization, Logo, WebSite, WebPage and BreadcrumbList, then assembles
   * everything into exactly one @graph (R1).
   */
  nodes?: (SchemaNode | undefined | false)[];
  /** Breadcrumb trail, the same array the page renders visibly (R8). */
  crumbs?: Crumb[];
}

export interface HeadData {
  title: string;
  description: string;
  canonical: string;
  image: string;
  noindex: boolean;
  graph: Graph | null;
}

// SSR collector. renderToString is synchronous and renders one route at a
// time, so a module-scoped slot is safe and needs no context plumbing.
let collected: HeadData | null = null;

export const takeCollectedHead = (): HeadData | null => {
  const head = collected;
  collected = null;
  return head;
};

const absoluteUrl = (url: string): string => (url.startsWith('http') ? url : `${SITE.url.replace(/\/$/, '')}${url}`);

// `crumbs` is not read here: the page passes the same array to breadcrumbNode()
// when building its nodes, which is what makes R8 hold by construction.
function buildHead({ title, description, path, image, noindex, nodes }: SeoOptions): HeadData {
  const canonical = canonicalUrl(path);

  return {
    title,
    description,
    canonical,
    image: absoluteUrl(image ?? '/og-image.png'),
    noindex: noindex ?? false,
    // A noindex page still renders, but contributes nothing to the entity
    // graph — emitting schema for a page we are asking Google to ignore only
    // creates nodes with no page behind them.
    graph: noindex ? null : buildGraph(nodes ?? []),
  };
}

export function useSeo(options: SeoOptions): void {
  if (import.meta.env.SSR) {
    // Writing to a module variable during render is a side effect, and the rule
    // flagging it is right in general. It is safe on this one path and there is
    // no alternative that keeps the head next to the page that owns it:
    // renderToString is synchronous, runs a route exactly once, and never
    // concurrently — and takeCollectedHead() empties the slot immediately after,
    // so a route that forgets to call useSeo fails the prerender rather than
    // inheriting the previous page's title. This branch is compiled out of the
    // browser bundle entirely.
    // eslint-disable-next-line react-hooks/globals
    collected = buildHead(options);
  }

  // Serialised so callers can pass inline arrays and objects without
  // retriggering the effect on every render.
  const key = JSON.stringify([
    options.title,
    options.description,
    options.path,
    options.image,
    options.noindex,
    options.crumbs,
  ]);

  useEffect(() => {
    const head = buildHead(options);

    document.title = head.title;
    setMeta('name', 'description', head.description);
    setMeta('name', 'robots', head.noindex ? 'noindex, nofollow' : 'index, follow');

    setLink('canonical', head.canonical);

    setMeta('property', 'og:url', head.canonical);
    setMeta('property', 'og:title', head.title);
    setMeta('property', 'og:description', head.description);
    setMeta('property', 'og:image', head.image);
    setMeta('name', 'twitter:title', head.title);
    setMeta('name', 'twitter:description', head.description);
    setMeta('name', 'twitter:image', head.image);

    // Replace, never append: exactly one JSON-LD block may exist at a time (R1).
    document.head.querySelectorAll('script[data-seo="graph"]').forEach((node) => node.remove());

    if (head.graph) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seo = 'graph';
      script.textContent = JSON.stringify(head.graph);
      document.head.appendChild(script);
    }

    return () => {
      document.head.querySelectorAll('script[data-seo="graph"]').forEach((node) => node.remove());
      // Never let a noindex leak onto the next route.
      setMeta('name', 'robots', 'index, follow');
    };
    // `options` is intentionally excluded — `key` covers the values that
    // matter, and the node array is rebuilt from the same data on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}
