// g8crm Lead Intake API client — the "Get Notified" modal POSTs directly to
// CRM › Intake Channels (API type) so the visitor never leaves the site.
// No auth: the unguessable token in the path IS the credential, and the full
// URL is public by design (baked into the bundle like any web form action).
// A 202 means the lead is queued server-side and will not be dropped; repeat
// submissions dedupe/merge by email in the CRM, so re-submitting is safe.

// Exposed without the VITE_ prefix via envPrefix in vite.config.ts (owner
// wants this key VITE_-free). Unset → the Get Notified button/modal are not
// rendered at all.
export const CRM_INTAKE_URL: string | undefined =
  import.meta.env.CRM_INTAKE_CHANNEL_API || undefined;

export interface LeadSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer_url?: string;
  landing_url?: string;
}

export type LeadResult =
  | { status: 'queued' }
  | { status: 'invalid'; errors: Record<string, string[]> }
  | { status: 'error'; message: string };

// Attribution context sent with every lead: the page the visitor is on, how
// they arrived, and any utm_* params carried on the current URL.
export function leadContext(): Partial<LeadSubmission> {
  const params = new URLSearchParams(window.location.search);
  const utm = (key: string) => params.get(key) || undefined;
  return {
    landing_url: window.location.href,
    referrer_url: document.referrer || undefined,
    utm_source: utm('utm_source'),
    utm_medium: utm('utm_medium'),
    utm_campaign: utm('utm_campaign'),
    utm_term: utm('utm_term'),
    utm_content: utm('utm_content'),
  };
}

export async function submitLead(payload: LeadSubmission): Promise<LeadResult> {
  if (!CRM_INTAKE_URL) {
    return { status: 'error', message: 'Subscriptions are not available right now.' };
  }

  let res: Response;
  try {
    res = await fetch(CRM_INTAKE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Version': 'v1',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      status: 'error',
      message: 'Could not reach the server. Please check your connection and try again.',
    };
  }

  if (res.status === 202) return { status: 'queued' };

  if (res.status === 422) {
    try {
      const body = (await res.json()) as { errors?: Record<string, string[]> };
      return { status: 'invalid', errors: body.errors ?? {} };
    } catch {
      return { status: 'invalid', errors: {} };
    }
  }

  if (res.status === 429) {
    return { status: 'error', message: 'Too many attempts — please try again in a minute.' };
  }

  return { status: 'error', message: 'Something went wrong on our side. Please try again later.' };
}
