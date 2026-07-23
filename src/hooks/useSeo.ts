import { useEffect } from 'react';

// Per-route SEO head management. index.html ships the home-page defaults as
// static tags; this hook swaps title/description/canonical/OG/Twitter per
// route and injects route-scoped JSON-LD blocks (removed on unmount, so the
// static Organization/LocalBusiness schemas in index.html are untouched).
// Google renders JS for SPAs, so client-side tag swaps are indexed.

export const SITE_URL = 'https://devhub.my';

const DEFAULT_ROBOTS = 'index, follow';

export interface SeoOptions {
  /** Full document title, e.g. 'Trainings | Developers Hub' */
  title: string;
  description: string;
  /** Canonical path for this page, e.g. '/trainings' */
  path: string;
  /** og:image — site-relative or absolute; defaults to the site og-image */
  image?: string;
  /** Keep crawlers off soft-404s and not-found states */
  noindex?: boolean;
  /** JSON-LD blocks for this page only — injected on mount, removed on unmount */
  jsonLd?: object[];
}

export const absoluteUrl = (url: string): string =>
  url.startsWith('http') ? url : `${SITE_URL}${url}`;

function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function useSeo({ title, description, path, image, noindex, jsonLd }: SeoOptions): void {
  // Serialize so callers can pass inline arrays without retriggering the effect.
  const jsonLdJson = JSON.stringify(jsonLd ?? []);

  useEffect(() => {
    const url = absoluteUrl(path);
    const ogImage = absoluteUrl(image ?? '/og-image.png');

    document.title = title;
    setMeta('name', 'title', title);
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : DEFAULT_ROBOTS);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:url', url);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    const scripts = (JSON.parse(jsonLdJson) as object[]).map((block) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'route');
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((script) => script.remove());
      // Never let a noindex leak onto the next route.
      setMeta('name', 'robots', DEFAULT_ROBOTS);
    };
  }, [title, description, path, image, noindex, jsonLdJson]);
}
