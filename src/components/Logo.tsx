import { Link } from 'react-router';

// The logo links home and nothing else.
//
// Two things changed here for the prerender step. The image source was built
// from `window.location.origin`, which throws during server rendering and
// produced an absolute URL for no benefit — a root-relative path resolves
// identically in every environment. And the anchor pointed at `#home`, which
// only meant anything on the homepage itself; from /services/laravel/ it was a
// link to nowhere. It is now a real link to `/`, which also gives every page an
// inbound link to the homepage for the Phase 08 crawl.
const Logo = () => (
  <Link to="/" className="flex items-center space-x-2">
    <img src="/logo.png" alt="Developers Hub Logo" className="h-8 sm:h-9 w-auto" />
    <div className="flex items-baseline">
      <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Developers</span>
      <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
        Hub
      </span>
    </div>
  </Link>
);

export default Logo;
