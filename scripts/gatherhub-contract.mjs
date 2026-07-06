// GatherHub public event payload contract — Zod schema.
//
// SINGLE SOURCE OF TRUTH: the GatherHub workspace document
// `documentation/10-devhub-landing-integration.md` (shared contract section).
// If GatherHub changes the contract, change that document first, then this
// schema. `.strict()` is deliberate: a renamed/added field or a new enum value
// must FAIL the build (readable error naming the field), never render
// undefined into the page.
import { z } from 'zod';

export const TicketSchema = z
  .object({
    name: z.string(),
    price: z.number(),
    currency: z.string(),
    available: z.boolean(),
    available_until: z.string().nullable(),
  })
  .strict();

export const EventPayloadSchema = z
  .object({
    uuid: z.string().uuid(),
    status: z.enum(['open', 'sold_out', 'closed', 'ended']),
    starts_at: z.string().nullable(),
    ends_at: z.string().nullable(),
    venue: z.string().nullable(),
    register_url: z.string().url(),
    tickets: z.array(TicketSchema),
    seats: z
      .object({
        cap: z.number().int().nullable(),
        remaining_band: z.enum(['available', 'low', 'last_few', 'none']),
      })
      .strict(),
  })
  .strict();
