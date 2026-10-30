// How DevHub works with clients, and its own products (g8suite).
//
// One list, read by the homepage and by /explore/. The copy mirrors the 3D
// scene (DISTRICTS and PRODUCTS in the business workspace's
// _brand/3d/developers-hub-3d.html, synced by scripts/sync-3d.mjs) and the
// company profile. Change the scene and this file together; never add a
// product or a claim here that the scene and the product's own status docs do
// not make.

export interface Way {
  hash: string;
  name: string;
  line: string;
  body: string;
  /** Existing pages that describe this work. Null when there is none yet. */
  related: readonly { to: string; label: string }[] | null;
}

export const WAYS: readonly Way[] = [
  {
    hash: '#platforms',
    name: 'Platforms',
    line: 'Software you own, on servers you own.',
    body: "DevHub's own products, installed inside the client's network or hosted for them.",
    related: null,
  },
  {
    hash: '#build',
    name: 'Build',
    line: 'Built around your process, not ours.',
    body: 'Solution architecture, system development and migration, by the engineers who will support the system afterwards.',
    related: [
      { to: '/services/software-development/', label: 'Software Development' },
      { to: '/services/it-consultation/', label: 'IT Consultation' },
    ],
  },
  {
    hash: '#run',
    name: 'Run & support',
    line: 'Supported for the long term.',
    body: 'Fixes, upgrades and SLA-based support after go-live, with a direct line to the builders.',
    related: [{ to: '/services/software-development/', label: 'Software Development' }],
  },
  {
    hash: '#people',
    name: 'People',
    line: 'Your team learns to run what we build.',
    body: 'Training, bootcamps, coaching and mentoring, so the system stays the client’s long after the project ends.',
    related: [
      { to: '/services/technology-education/', label: 'Technology Education' },
      { to: '/trainings/', label: 'Trainings' },
    ],
  },
];

export interface Product {
  hash: string;
  /** Lower-case key; also the file name of the mark in /images/home/marks/. */
  key: string;
  name: string;
  line: string;
  live: boolean;
  /** Where it runs, for live products. */
  delivery?: 'On your servers' | 'Hosted';
  /** Public site. Absent when the product has none yet. */
  url?: string;
}

export const PRODUCTS: readonly Product[] = [
  {
    hash: '#g8stack',
    key: 'g8stack',
    name: 'G8Stack',
    line: 'API management on the Kong gateway.',
    live: true,
    delivery: 'On your servers',
    url: 'https://g8stack.com/',
  },
  {
    hash: '#g8deck',
    key: 'g8deck',
    name: 'G8Deck',
    line: 'Deploy apps on infrastructure you own.',
    live: true,
    delivery: 'On your servers',
    url: 'https://g8deck.app/',
  },
  {
    hash: '#gatherhub',
    key: 'gatherhub',
    name: 'GatherHub',
    line: 'Events, from registration to certificate.',
    live: true,
    delivery: 'Hosted',
    url: 'https://gatherhub.app/',
  },
  {
    hash: '#warung',
    key: 'warung',
    name: 'Warung',
    line: 'A point of sale on the phone the shop already owns.',
    live: true,
    delivery: 'Hosted',
    url: 'https://warung.my/',
  },
  {
    hash: '#bliptrace',
    key: 'bliptrace',
    name: 'Bliptrace',
    line: 'Error tracking for every app.',
    live: false,
    url: 'https://bliptrace.com/',
  },
  {
    hash: '#devhub-academy',
    key: 'devhub-academy',
    name: 'DevHub Academy',
    line: 'Short video series that end in a verifiable credential.',
    live: false,
  },
];

/** Outbound product link with the homepage referral tags. */
export function productHref(url: string, campaign = 'homepage'): string {
  const target = new URL(url);
  target.searchParams.set('utm_source', 'devhub.my');
  target.searchParams.set('utm_medium', 'referral');
  target.searchParams.set('utm_campaign', campaign);
  return target.toString();
}
