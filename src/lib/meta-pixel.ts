// Meta (Facebook) Pixel, mirroring lib/analytics.ts: enabled only when
// VITE_META_PIXEL_ID is set at build time (it is, on Netlify). The pixel ID is a
// public identifier, not a secret, so the standard VITE_ prefix is fine. When
// unset — e.g. local dev — every call here is a no-op and no Meta script is ever
// loaded.
//
// The snippet's own `fbq('track', 'PageView')` is NOT fired at init: this is an
// SPA, so AnalyticsTracker (in App.tsx) reports every route change instead,
// including the landing view. Firing both would double-count the first view.

export const META_PIXEL_ID: string | undefined =
  import.meta.env.VITE_META_PIXEL_ID || undefined;

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let loaded = false;

export function initMetaPixel(): void {
  if (!META_PIXEL_ID || loaded) return;
  loaded = true;

  // The official fbq bootstrap: queue calls until fbevents.js swaps in its own
  // callMethod implementation.
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  } as Fbq;

  window.fbq = fbq;
  window._fbq = window._fbq || fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  fbq('init', META_PIXEL_ID);
}

export function trackMetaPageView(): void {
  if (!META_PIXEL_ID || !loaded || !window.fbq) return;
  window.fbq('track', 'PageView');
}
