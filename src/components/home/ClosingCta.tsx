import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { SITE } from '../../data/site';
import { trackCta } from '../../lib/track';

const focus =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600 dark:focus-visible:ring-offset-primary-800';

const ClosingCta = () => (
  <section aria-labelledby="closing-title" className="bg-primary-600 dark:bg-primary-800 text-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-end">
      <div className="lg:col-span-8">
        <h2 id="closing-title" className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] leading-tight">
          Tell us what needs building, running or teaching.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-primary-50">
          A system to build, one to take over, or a team to train: start with a short conversation.
        </p>
      </div>
      <div className="lg:col-span-4 flex flex-wrap items-center gap-x-6 gap-y-4 lg:justify-end">
        <Link
          to="/contact/"
          onClick={() => trackCta('home_closing', 'Talk to us', '/contact/')}
          className={`group inline-flex items-center min-h-12 px-6 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 active:translate-y-px motion-safe:transition-colors ${focus}`}
        >
          Talk to us
          <ArrowRight className="ml-2 w-5 h-5 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
        <a
          href={`mailto:${SITE.email}`}
          onClick={() => trackCta('home_closing', 'Email', `mailto:${SITE.email}`)}
          className={`font-semibold underline decoration-white/50 underline-offset-4 hover:decoration-white rounded-sm ${focus}`}
        >
          {SITE.email}
        </a>
      </div>
    </div>
  </section>
);

export default ClosingCta;
