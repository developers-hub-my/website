import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Photo from './Photo';
import { trackCta } from '../../lib/track';
import { container, primaryButton, secondaryButton } from './styles';
import { WORLD_HREF } from '../../lib/explore';

// The page's only h1. The photo is the LCP element on wide screens, so it is
// eager with fetchpriority=high; on a phone it sits below the text.
const HomeHero = () => (
  <section aria-labelledby="home-title" className="pt-28 sm:pt-32 pb-16 sm:pb-20">
    <div className={`${container} grid lg:grid-cols-12 gap-10 lg:gap-12 items-center`}>
      <div className="lg:col-span-5">
        <h1
          id="home-title"
          className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-balance text-slate-900 dark:text-white"
        >
          We build it, run it, and{' '}
          <span className="text-primary-600 dark:text-primary-300">teach your team to own it.</span>
        </h1>
        <p className="mt-6 sm:mt-8 max-w-xl text-lg sm:text-xl leading-relaxed text-slate-800 dark:text-slate-200">
          Developers Hub builds and looks after software for universities, ministries and state agencies across
          Malaysia, from Johor Bahru since 2020.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/contact/" className={primaryButton} onClick={() => trackCta('home_hero', 'Talk to us', '/contact/')}>
            Talk to us
            <ArrowRight className="ml-2 w-5 h-5 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <a
            href={WORLD_HREF}
            className={secondaryButton}
            onClick={() => trackCta('home_hero', 'Explore DevHub', WORLD_HREF)}
          >
            Explore DevHub
          </a>
        </div>
      </div>

      <figure className="lg:col-span-7">
        <Photo
          name="devhub-booth"
          widths={[640, 960, 1280]}
          width={1280}
          height={960}
          sizes="(min-width: 1280px) 690px, (min-width: 1024px) 56vw, 100vw"
          alt="DevHub engineers talk with visitors at the DevHub booth, under a large Developers Hub banner."
          className="w-full h-auto rounded-xl bg-slate-100 dark:bg-slate-800"
          priority
        />
        <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          The DevHub team meeting students and partners at an industry engagement day.
        </figcaption>
      </figure>
    </div>
  </section>
);

export default HomeHero;
