// Google Analytics 4 (gtag.js), enabled only when VITE_GA_MEASUREMENT_ID is
// set at build time. The measurement ID is a public identifier (not a secret)
// so the standard VITE_ prefix is fine. When unset — e.g. local dev — every
// call here is a no-op and no GA script is ever loaded.
//
// gtag's automatic page_view is disabled: this is an SPA, so AnalyticsTracker
// (in App.tsx) reports every route change instead, including the landing view.

export const GA_MEASUREMENT_ID: string | undefined =
  import.meta.env.VITE_GA_MEASUREMENT_ID || undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let loaded = false;

export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID || loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  // gtag.js requires the arguments object (not a spread array) on dataLayer.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackPageView(path: string): void {
  if (!GA_MEASUREMENT_ID || !loaded) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
