// Shared class strings for the homepage sections: one button shape, one focus
// ring, one container. Square-ish 8px corners, flat fills, no shadows.

export const container = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

export const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950';

export const primaryButton = `group inline-flex items-center justify-center min-h-12 px-6 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 active:translate-y-px dark:bg-primary-300 dark:text-slate-950 dark:hover:bg-primary-200 motion-safe:transition-colors ${focusRing}`;

export const secondaryButton = `inline-flex items-center justify-center min-h-12 px-6 rounded-lg bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 active:translate-y-px dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 motion-safe:transition-colors ${focusRing}`;

export const textLink = `inline-flex items-center gap-1 font-semibold text-primary-600 underline decoration-primary-600/30 underline-offset-4 hover:decoration-primary-600 dark:text-primary-300 dark:decoration-primary-300/40 dark:hover:decoration-primary-300 rounded-sm ${focusRing}`;

export const h2 = 'text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-tight text-slate-900 dark:text-white';
