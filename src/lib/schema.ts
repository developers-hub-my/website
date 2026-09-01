// Builds the single JSON-LD `@graph` every page emits.
//
// This module is the only place in the codebase that produces schema. The nine
// Phase 05 requirements map onto it as follows:
//
//   R1  one @graph per page          buildGraph() is called once, by useSeo
//   R2  @id matches the registry     every id comes from data/site.ts ID
//   R3  @id is deterministic         pure functions of the canonical URL — no
//                                    randomness, no timestamps, no env leakage
//   R4  reference, never rebuild     ref() emits {"@id": …} for anything the
//                                    graph already defines in full
//   R5  no empty properties          prune() strips them before output
//   R6  no dangling references       danglingReferences() fails the build
//   R7  generated from data          every input comes from src/data/*
//   R8  breadcrumb matches visible   one crumb list feeds both the schema and
//                                    the <nav>, so they cannot drift
//   R9  present in the server response — the prerender step, see scripts/prerender.mjs

import { ID, SITE, SITE_URL, canonicalUrl } from '../data/site';
import { SERVICES, type Service } from '../data/services';
import { TECHNOLOGIES, technologiesForService, type Technology } from '../data/technologies';
import { PEOPLE, type Person } from '../data/people';

/** A reference to a node defined elsewhere in the same graph (R4). */
export const ref = (id: string) => ({ '@id': id });

// Values that carry no information but look like they do. Rule 05 treats these
// as worse than an absent property: an empty string is a claim that the value
// is empty, whereas omission says nothing at all.
const PLACEHOLDERS = new Set(['n/a', 'na', 'tbd', 'tba', 'none', 'null', 'undefined', '-', '?']);

/**
 * Recursively drops keys whose value carries nothing: null, undefined, empty
 * string, empty array, empty object, or a placeholder token.
 *
 * Runs over the finished graph rather than at each call site, so a property
 * added later cannot bypass it.
 */
export function prune<T>(value: T): T {
  if (Array.isArray(value)) {
    const items = value.map(prune).filter((item) => !isEmpty(item));
    return items as unknown as T;
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, prune(item)] as const)
      .filter(([, item]) => !isEmpty(item));
    return Object.fromEntries(entries) as T;
  }

  return value;
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' || PLACEHOLDERS.has(trimmed.toLowerCase());
  }
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
}

export interface Crumb {
  name: string;
  /** Site-relative path. The last crumb is the current page and needs no link. */
  path?: string;
}

export interface SchemaNode {
  '@type': string | string[];
  '@id'?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Foundation nodes — P0. Present on every page.
// ---------------------------------------------------------------------------

/**
 * The one Organization node. Emitted in full exactly once per graph; every
 * other mention is a ref() to this @id.
 *
 * `telephone`, `priceRange` and `sameAs` are absent rather than empty — see
 * the note in data/site.ts. prune() would drop them anyway; not writing them
 * keeps the intent visible.
 */
export function organizationNode(): SchemaNode {
  return {
    '@type': 'Organization',
    '@id': ID.organization,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: SITE.alternateName,
    url: SITE.url,
    logo: ref(ID.logo),
    image: ref(ID.logo),
    description: SITE.description,
    foundingDate: SITE.foundingDate,
    address: {
      '@type': 'PostalAddress',
      ...SITE.address,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE.email,
        availableLanguage: [...SITE.availableLanguage],
      },
    ],
    areaServed: { '@type': 'Country', name: SITE.areaServed },
  };
}

export function logoNode(): SchemaNode {
  return {
    '@type': 'ImageObject',
    '@id': ID.logo,
    url: SITE.logo.url,
    width: SITE.logo.width,
    height: SITE.logo.height,
    caption: SITE.legalName,
  };
}

export function webSiteNode(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: SITE.url,
    name: SITE.name,
    publisher: ref(ID.organization),
    inLanguage: SITE.inLanguage,
  };
  // No SearchAction: Phase 04 classifies it as conditional — only when a site
  // search genuinely works. There is none, so claiming one would be a false
  // capability signal.
}

/** LocalBusiness — homepage and contact page only, per the page matrix. */
export function localBusinessNode(): SchemaNode {
  return {
    '@type': 'LocalBusiness',
    '@id': ID.localBusiness,
    name: SITE.name,
    url: SITE.url,
    image: ref(ID.logo),
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      ...SITE.address,
    },
    parentOrganization: ref(ID.organization),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...SITE.openingHours.dayOfWeek],
        opens: SITE.openingHours.opens,
        closes: SITE.openingHours.closes,
      },
    ],
  };
}

export function webPageNode(options: {
  canonical: string;
  name: string;
  description: string;
  /** AboutPage, ContactPage, ProfilePage, CollectionPage — plain WebPage otherwise. */
  type?: string;
  /** The entity this page is primarily about — Phase 10's one-primary-entity rule. */
  mainEntityId?: string;
  hasBreadcrumb?: boolean;
}): SchemaNode {
  const { canonical, name, description, type = 'WebPage', mainEntityId, hasBreadcrumb = true } = options;

  return {
    '@type': type,
    '@id': ID.webPage(canonical),
    url: canonical,
    name,
    description,
    isPartOf: ref(ID.website),
    about: mainEntityId ? ref(mainEntityId) : undefined,
    mainEntity: mainEntityId ? ref(mainEntityId) : undefined,
    publisher: ref(ID.organization),
    inLanguage: SITE.inLanguage,
    breadcrumb: hasBreadcrumb ? ref(ID.breadcrumb(canonical)) : undefined,
  };
}

/**
 * BreadcrumbList built from the same crumb array the page renders visibly.
 * R8 holds by construction rather than by discipline.
 */
export function breadcrumbNode(canonical: string, crumbs: Crumb[]): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(canonical),
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.path ? canonicalUrl(crumb.path) : canonical,
    })),
  };
}

// ---------------------------------------------------------------------------
// Entity nodes — P0/P1.
// ---------------------------------------------------------------------------

export function serviceNode(service: Service, technologies: Technology[]): SchemaNode {
  return {
    '@type': 'Service',
    '@id': ID.service(service.slug),
    name: service.name,
    description: service.description,
    url: canonicalUrl(`/services/${service.slug}`),
    provider: ref(ID.organization),
    areaServed: { '@type': 'Country', name: SITE.areaServed },
    // Only technologies actually used to deliver it — the same list the page
    // links to visibly.
    isRelatedTo: technologies.map((technology) => ref(ID.technology(technology.slug))),
  };
}

export function technologyNode(technology: Technology): SchemaNode {
  return {
    '@type': technology.schemaType,
    '@id': ID.technology(technology.slug),
    name: technology.name,
    description: technology.definition,
    url: canonicalUrl(`/technologies/${technology.slug}`),
    sameAs: technology.officialUrl,
  };
}

export function personNode(person: Person): SchemaNode {
  return {
    '@type': 'Person',
    '@id': ID.person(person.slug),
    name: person.name,
    url: canonicalUrl(`/authors/${person.slug}`),
    jobTitle: person.jobTitle,
    description: person.bio,
    worksFor: ref(ID.organization),
    knowsAbout: person.knowsAbout.map((entry) => ref(ID.technology(entry.technologySlug))),
    // sameAs omitted until Phase 07 verifies profile ownership.
  };
}

export function articleNode(options: {
  canonical: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorId: string;
  /** TechArticle for tutorials, Article otherwise. */
  type?: 'Article' | 'TechArticle';
  /** Technology @ids this article is genuinely about — not ten topics (Phase 10). */
  aboutIds?: string[];
  image?: string;
}): SchemaNode {
  const {
    canonical,
    headline,
    description,
    datePublished,
    dateModified,
    authorId,
    type = 'Article',
    aboutIds = [],
    image,
  } = options;

  return {
    '@type': type,
    '@id': ID.article(canonical),
    headline,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: ref(authorId),
    publisher: ref(ID.organization),
    mainEntityOfPage: ref(ID.webPage(canonical)),
    about: aboutIds.map(ref),
    image: image ? absolute(image) : undefined,
    inLanguage: SITE.inLanguage,
  };
}

export function courseNode(options: {
  canonical: string;
  name: string;
  description: string;
}): SchemaNode {
  return {
    '@type': 'Course',
    '@id': ID.course(options.canonical),
    name: options.name,
    description: options.description,
    url: options.canonical,
    provider: ref(ID.organization),
  };
}

/**
 * FAQPage from question/answer pairs.
 *
 * Phase 15 step 06: only for questions people actually ask, and the same pairs
 * must be visible on the page. Callers pass the array they render.
 */
export function faqPageNode(canonical: string, faqs: { question: string; answer: string }[]): SchemaNode {
  return {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

const absolute = (url: string): string => (url.startsWith('http') ? url : `${SITE_URL}${url}`);

// ---------------------------------------------------------------------------
// Assembly and integrity
// ---------------------------------------------------------------------------

export interface Graph {
  '@context': 'https://schema.org';
  '@graph': SchemaNode[];
}

/**
 * Rebuilds any entity node from its @id alone.
 *
 * This is what lets the graph close itself. A Service node references the
 * technologies it is delivered with, and a Person node references what they
 * know about — so a page listing four services pulls in three technologies it
 * never asked for. Making every page remember that transitive set is how R6
 * violations get shipped; deriving it from the registry instead means a
 * reference cannot dangle no matter which page emits it.
 *
 * Returns undefined for an id outside the registry, which then surfaces as a
 * genuine R6 failure rather than being silently invented.
 */
function nodeForId(id: string): SchemaNode | undefined {
  if (id === ID.organization) return organizationNode();
  if (id === ID.logo) return logoNode();
  if (id === ID.website) return webSiteNode();
  if (id === ID.localBusiness) return localBusinessNode();

  const technology = TECHNOLOGIES.find((entry) => ID.technology(entry.slug) === id);
  if (technology) return technologyNode(technology);

  const service = SERVICES.find((entry) => ID.service(entry.slug) === id);
  if (service) return serviceNode(service, technologiesForService(service.slug));

  const person = PEOPLE.find((entry) => ID.person(entry.slug) === id);
  if (person) return personNode(person);

  return undefined;
}

/**
 * Assembles one graph from the nodes a page declares.
 *
 * Nodes sharing an @id are collapsed to the first occurrence, so a page that
 * lists a Technology twice still emits one node (R4). Any entity referenced but
 * not declared is pulled in from the registry until the graph is closed, then
 * the whole thing is pruned.
 */
export function buildGraph(nodes: (SchemaNode | undefined | false)[]): Graph {
  const seen = new Set<string>();
  const unique: SchemaNode[] = [];

  const add = (node: SchemaNode): void => {
    const id = node['@id'];
    if (typeof id === 'string') {
      if (seen.has(id)) return;
      seen.add(id);
    }
    unique.push(node);
  };

  for (const node of nodes) {
    if (node) add(node);
  }

  // Resolving a node can introduce references of its own, so this repeats
  // until nothing new appears. The bound is a guard against a registry entry
  // that somehow references itself in a cycle we did not anticipate.
  for (let pass = 0; pass < 10; pass += 1) {
    const missing = danglingReferences({ '@context': 'https://schema.org', '@graph': unique });
    if (missing.length === 0) break;

    const resolved = missing.map(nodeForId).filter((node): node is SchemaNode => Boolean(node));
    if (resolved.length === 0) break;

    resolved.forEach(add);
  }

  return prune({ '@context': 'https://schema.org', '@graph': unique } as Graph);
}

/**
 * R6: every {"@id": …} reference must resolve to a node defined in the same
 * graph. A dangling reference leaves the graph incomplete in a way validators
 * do not flag, so this is checked here and asserted by the prerender step.
 *
 * Returns the unresolved ids; empty means the graph is closed.
 */
export function danglingReferences(graph: Graph): string[] {
  const defined = new Set(
    graph['@graph'].map((node) => node['@id']).filter((id): id is string => typeof id === 'string'),
  );
  const referenced = new Set<string>();

  const walk = (value: unknown, isRoot = false): void => {
    if (Array.isArray(value)) {
      value.forEach((item) => walk(item));
      return;
    }
    if (value === null || typeof value !== 'object') return;

    const entries = Object.entries(value as Record<string, unknown>);
    const keys = entries.map(([key]) => key);

    // A bare {"@id": …} is a reference; a node that also carries @type is a
    // definition, and its own @id is not a reference to anything.
    if (!isRoot && keys.length === 1 && keys[0] === '@id') {
      referenced.add((value as { '@id': string })['@id']);
      return;
    }

    entries.forEach(([key, item]) => {
      if (key === '@id') return;
      walk(item);
    });
  };

  graph['@graph'].forEach((node) => walk(node, true));

  return [...referenced].filter((id) => !defined.has(id));
}
