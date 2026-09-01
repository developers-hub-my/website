import { useEffect, type ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import type { Crumb } from '../lib/schema';

// Common frame for the entity pages added for Phase 03's minimum page set.
//
// Enforces two things every one of them needs and none of them should restate:
// the visible breadcrumb trail (R8's other half) and exactly one h1 naming the
// page's main entity — the Site Audit's "missing h1" finding was a symptom of
// there being no shared place to put it.

interface PageShellProps {
  crumbs: Crumb[];
  /** The h1. Names the entity this page is about, not a marketing phrase. */
  title: string;
  /**
   * Phase 16 definition block: one or two sentences that stand alone, on the
   * first screen, stating what the entity is before any promotional framing.
   */
  lede: string;
  children: ReactNode;
}

const PageShell = ({ crumbs, title, lede, children }: PageShellProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-24 pb-20 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          <div className="mt-4 w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{lede}</p>
        </header>

        {children}
      </div>
    </main>
  );
};

export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mt-12">
    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-4">{title}</h2>
    {children}
  </section>
);

export default PageShell;
