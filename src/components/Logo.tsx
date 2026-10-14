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
// The official lockup from the brand master (DH FINAL LOGO.ai, artboards 2 and
// 3), cropped to SVG in public/brand/. The colour lockup is for light grounds;
// on dark grounds the brand board pairs the mono mark with a white wordmark,
// so dark mode swaps to that file rather than recolouring anything here.
// Both <img>s are in the server-rendered DOM; the hidden one is display:none,
// which also keeps it out of the accessibility tree.
const Logo = () => (
  <Link to="/" className="flex items-center" aria-label="Developers Hub — home">
    <img
      src="/brand/devhub-lockup.svg"
      alt="Developers Hub"
      width={863}
      height={321}
      className="h-11 sm:h-14 w-auto dark:hidden"
    />
    <img
      src="/brand/devhub-lockup-mono.svg"
      alt="Developers Hub"
      width={804}
      height={299}
      className="hidden dark:block h-11 sm:h-14 w-auto"
    />
  </Link>
);

export default Logo;
