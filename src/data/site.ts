// The single source of company identity for the whole site.
//
// Phase 07 of the Entity SOP requires that one change here updates every
// surface at once — JSON-LD, footer and contact page — so nothing may restate
// these values inline. If you find an address or an email typed into a
// component, that is the bug.
//
// Rule 05 (no empty properties) is enforced by omission, not by empty strings:
// a field DevHub does not have yet is absent from this file, and the graph
// builder drops absent values before output. `telephone`, `priceRange` and
// `sameAs` are deliberately missing — there is no published phone number, the
// price range was a guess, and no external profile has been verified as owned
// (Phase 07 gate). Add them here once they are real, never as placeholders.

export const SITE_URL = 'https://devhub.my';

export const SITE = {
  legalName: 'Developers Hub Sdn Bhd',
  name: 'Developers Hub',
  alternateName: 'DevHub',
  url: `${SITE_URL}/`,
  email: 'hello@devhub.my',
  foundingDate: '2020',
  /** Phase 03 language decision: English primary, Malay only where real Malay content exists. */
  inLanguage: 'en-MY',
  description:
    'Developers Hub Sdn Bhd is a technology company in Johor Bahru, Malaysia. ' +
    'DevHub provides software development, IT consultation, technology education ' +
    'and business solutions.',
  logo: {
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  address: {
    streetAddress: '37A, Jalan Harmonium 23/13, Taman Desa Tebrau',
    addressLocality: 'Johor Bahru',
    addressRegion: 'Johor',
    postalCode: '81100',
    addressCountry: 'MY',
  },
  geo: {
    latitude: 1.5545,
    longitude: 103.79608,
  },
  openingHours: {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  areaServed: 'Malaysia',
  availableLanguage: ['English', 'Malay'],
} as const;

// Canonical ID registry — Phase 04/05 R2.
//
// Every @id in the system comes from here. No other module may build one by
// string concatenation: an @id that drifts is a new entity as far as a search
// engine is concerned, and every signal accumulated against the old one is
// lost. A slug is part of an @id, so renaming a slug after launch is a Phase 14
// migration, not an edit.
export const ID = {
  organization: `${SITE_URL}/#organization`,
  localBusiness: `${SITE_URL}/#localbusiness`,
  logo: `${SITE_URL}/#logo`,
  website: `${SITE_URL}/#website`,
  /** The homepage keeps the bare `/#webpage` form the registry spells out. */
  webPage: (canonical: string) => `${canonical}#webpage`,
  breadcrumb: (canonical: string) => `${canonical}#breadcrumb`,
  service: (slug: string) => `${SITE_URL}/#service-${slug}`,
  technology: (slug: string) => `${SITE_URL}/technologies/${slug}/#technology`,
  person: (slug: string) => `${SITE_URL}/authors/${slug}/#person`,
  article: (canonical: string) => `${canonical}#article`,
  course: (canonical: string) => `${canonical}#course`,
} as const;

/**
 * Absolute, canonical URL for a site path.
 *
 * Enforces the Phase 03 URL contract in one place: https, bare host, and a
 * trailing slash on everything except the homepage. Any query string is
 * dropped — rule C5 says a tracking parameter never becomes part of a
 * canonical URL.
 */
export function canonicalUrl(path: string): string {
  const [pathname] = path.split(/[?#]/);
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  return trimmed ? `${SITE_URL}/${trimmed}/` : `${SITE_URL}/`;
}

/**
 * Builds a document title that stays inside the 60-character budget the Site
 * Audit flagged, with the entity name leading.
 *
 * The brand suffix is dropped rather than the entity name when the two do not
 * both fit: a truncated course or article name is worse in a result listing
 * than a missing " | DevHub". A name that exceeds the budget on its own is left
 * alone and reported by the title check in scripts/check-seo.mjs — that is a
 * content decision, not something to silently cut mid-word.
 */
export function pageTitle(name: string, suffix = 'DevHub'): string {
  const withSuffix = `${name} | ${suffix}`;
  return withSuffix.length <= 60 ? withSuffix : name;
}
