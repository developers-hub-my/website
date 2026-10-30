import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Photo from './Photo';
import { trackCta } from '../../lib/track';
import { primaryButton, secondaryButton } from './styles';
import { WORLD_HREF } from '../../lib/explore';

// The page's only h1. The photo is the LCP element on wide screens, so it is
// eager with fetchpriority=high; on a phone it sits below the text.
const HomeHero = () => (
  <section aria-labelledby="home-title" className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-28 sm:pt-36 pb-16 sm:pb-24">
    {/* Soft brand backdrop, restored from the previous hero: gradient wash, drifting colour blobs, a fine grid and a few orbs.
        Decorative only, behind the content; blobs and orbs stay still for reduced motion. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <div className="absolute top-0 -left-4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-400 dark:bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-normal blur-3xl motion-safe:animate-blob" />
        <div className="absolute top-0 -right-4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-400 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-normal blur-3xl motion-safe:animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400 dark:bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-normal blur-3xl motion-safe:animate-blob animation-delay-4000" />
        <div className="absolute bottom-0 right-20 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-400 dark:bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-normal blur-3xl motion-safe:animate-blob animation-delay-6000" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full motion-safe:animate-float opacity-40 dark:opacity-60" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-500 dark:bg-purple-400 rounded-full motion-safe:animate-float animation-delay-2000 opacity-40 dark:opacity-60" />
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full motion-safe:animate-float animation-delay-4000 opacity-40 dark:opacity-60" />
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1
        id="home-title"
        className="max-w-5xl text-4xl sm:text-6xl xl:text-7xl font-bold tracking-[-0.035em] leading-[1.04] text-slate-900 dark:text-white"
      >
        We build it, run it, and{' '}
        <span className="bg-linear-to-r from-blue-600 via-cyan-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
          teach your team to own it.
        </span>
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
            <a
              href={WORLD_HREF}
              className={secondaryButton}
              onClick={() => trackCta('home_hero', 'Explore DevHub', WORLD_HREF)}
            >
              Explore DevHub
            </a>
          </div>
        </div>

        <figure className="lg:col-span-8">
          <Photo
            name="devhub-booth"
            widths={[640, 960, 1280]}
            width={1280}
            height={960}
            sizes="(min-width: 1280px) 816px, (min-width: 1024px) 66vw, 100vw"
            alt="DevHub engineers talk with visitors at the DevHub booth, under a large Developers Hub banner."
            className="w-full h-auto rounded-xl bg-slate-100 dark:bg-slate-800"
            priority
          />
          <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            The DevHub team meeting students and partners at an industry engagement day.
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
);

export default HomeHero;
