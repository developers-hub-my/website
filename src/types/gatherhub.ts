// Mirrors the GatherHub public event contract. Source of truth:
// GatherHub workspace `documentation/10-devhub-landing-integration.md`;
// build-time validation lives in scripts/gatherhub-contract.mjs.

export interface GatherHubTicket {
  name: string;
  price: number;
  currency: string;
  available: boolean;
  available_until: string | null;
}

export type GatherHubEventStatus = 'open' | 'sold_out' | 'closed' | 'ended';

export type GatherHubRemainingBand = 'available' | 'low' | 'last_few' | 'none';

export interface GatherHubEvent {
  uuid: string;
  status: GatherHubEventStatus;
  starts_at: string | null;
  ends_at: string | null;
  venue: string | null;
  register_url: string;
  tickets: GatherHubTicket[];
  seats: {
    cap: number | null;
    remaining_band: GatherHubRemainingBand;
  };
}

export interface ClassDefinition {
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  /** Present → run data comes from GatherHub at build time. Absent/null → evergreen mode (waitlist CTA, no pricing). */
  gatherhub_event_uuid?: string | null;
}
