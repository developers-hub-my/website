import classesData from '../data/classes.json';
import gatherhubData from '../data/gatherhub.generated.json';
import { ClassDefinition, GatherHubEvent, GatherHubTicket } from '../types/gatherhub';

// Class run data is baked at build time by scripts/fetch-gatherhub.mjs — no
// runtime fetch. Availability flags are rendered verbatim, never re-computed.

export const classes = classesData as ClassDefinition[];

// "Get Notified" target: the GatherHub public subscribe page for the DevHub
// organization (double opt-in newsletter). Falls back to the contact section
// until the env var is set in Netlify.
export const SUBSCRIBE_URL: string =
  import.meta.env.VITE_GATHERHUB_SUBSCRIBE_URL || '/#contact';

export const SUBSCRIBE_IS_EXTERNAL = SUBSCRIBE_URL.startsWith('http');

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
