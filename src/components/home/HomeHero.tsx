import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Photo from './Photo';
import { trackCta } from '../../lib/track';
import { primaryButton, secondaryButton } from './styles';

// The page's only h1. The photo is the LCP element on wide screens, so it is
// eager with fetchpriority=high; on a phone it sits below the text.
const HomeHero = () => (
  <section aria-labelledby="home-title" className="bg-white dark:bg-slate-950 pt-28 sm:pt-36 pb-16 sm:pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1
        id="home-title"
        className="max-w-5xl text-4xl sm:text-6xl xl:text-7xl font-bold tracking-[-0.035em] leading-[1.04] text-slate-900 dark:text-white"
      >
        We build it, run it, and teach your team to own it.
      </h1>

      <div className="mt-10 sm:mt-14 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-4">
          <p className="text-lg sm:text-xl leading-relaxed text-slate-800 dark:text-slate-200">
            Developers Hub builds and looks after software for universities, ministries and state agencies across
            Malaysia, from Johor Bahru since 2020.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact/" className={primaryButton} onClick={() => trackCta('home_hero', 'Talk to us', '/contact/')}>
              Talk to us
              <ArrowRight className="ml-2 w-5 h-5 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              to="/explore/"
              className={secondaryButton}
              onClick={() => trackCta('home_hero', 'Explore in 3D', '/explore/')}
            >
              Explore in 3D
            </Link>
          </div>
        </div>

        <figure className="lg:col-span-8">
          <Photo
            name="live-deploy"
            widths={[640, 960, 1600]}
            width={1600}
            height={901}
            sizes="(min-width: 1280px) 816px, (min-width: 1024px) 66vw, 100vw"
            alt="A DevHub engineer runs a live deployment on a large screen while students follow on their laptops."
            className="w-full h-auto rounded-xl bg-slate-100 dark:bg-slate-800"
            priority
          />
          <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            A live deployment, walked through step by step at a DevHub workshop.
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
);

export default HomeHero;
