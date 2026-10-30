import { trackEvent } from './analytics';
import { trackMetaCustom } from './meta-pixel';

/**
 * A click on a call to action, reported to GA4 as `cta_click` and to Meta as
 * `CtaClick`. `location` is the page section, `label` what the control says,
 * `url` where it goes — the same three fields in both vendors so the reports
 * line up. Both calls are no-ops when their env var is unset.
 */
export function trackCta(location: string, label: string, url: string): void {
  const params = { cta_location: location, cta_label: label, link_url: url };
  trackEvent('cta_click', params);
  trackMetaCustom('CtaClick', params);
}
