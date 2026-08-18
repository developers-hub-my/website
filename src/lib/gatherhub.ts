import classesData from '../data/classes.json';
import gatherhubData from '../data/gatherhub.generated.json';
import { ClassDefinition, GatherHubEvent, GatherHubTicket } from '../types/gatherhub';

// Class run data is baked at build time by scripts/fetch-gatherhub.mjs — no
// runtime fetch. Availability flags are rendered verbatim, never re-computed.

export const classes = classesData as ClassDefinition[];

// DevHub's public GatherHub organization page — the "see available sessions"
// CTA on training landing pages. Same style as VITE_COMPANY_PROFILE_URL: a
// public URL (not a secret), standard VITE_ prefix, baked at build time.
// (Distinct from the un-prefixed GATHERHUB_* secrets, which stay
// prebuild-only.)
export const GATHERHUB_ORG_URL: string | undefined =
  import.meta.env.VITE_GATHERHUB_ORG_URL || undefined;

// The GatherHub sessions CTA is on hold (same pattern as SHOW_HRD_CORP in
// src/data/trainings.ts): flip to true to bring "See Available Sessions"
// back on training landing pages. While off, "Get Notified" (g8crm intake
// modal, src/lib/crm.ts) is the only CTA.
export const SHOW_GATHERHUB_SESSIONS = false;

const events = gatherhubData as Record<string, GatherHubEvent>;

export function classBySlug(slug: string): ClassDefinition | undefined {
  return classes.find((cls) => cls.slug === slug);
}

export function eventFor(cls: ClassDefinition): GatherHubEvent | undefined {
  return cls.gatherhub_event_uuid ? events[cls.gatherhub_event_uuid] : undefined;
}

export function availableTickets(event: GatherHubEvent | undefined): GatherHubTicket[] {
  return (event?.tickets ?? [])
    .filter((ticket) => ticket.available)
    .sort((a, b) => a.price - b.price);
}

export function formatPrice(ticket: GatherHubTicket): string {
  const prefix = ticket.currency === 'MYR' ? 'RM' : ticket.currency;
  return `${prefix} ${ticket.price.toLocaleString('en-MY')}`;
}

export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Bands render copy only — never seat numbers (contract rule).
export const BAND_COPY: Record<string, string | null> = {
  available: null,
  low: 'Seats are running low',
  last_few: 'Last few seats',
  none: null,
};
