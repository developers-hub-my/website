import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ExternalLink, Maximize, Play } from 'lucide-react';
import { useDarkModeContext } from '../context/DarkModeContext';

// The 3D scene is a separate static page (public/explore/world.html, written by
// scripts/sync-3d.mjs). This frame shows its poster in the server HTML and only
// mounts the WebGL iframe after the visitor asks for it, so nothing here touches
// `window` or `document` during render and the page works without JS or WebGL.

export const WORLD_URL = '/explore/world.html';

type Look = 'night' | 'studio';
type Stage = { state: 'poster' } | { state: 'live'; src: string; key: number };

const lookFor = (isDark: boolean): Look => (isDark ? 'night' : 'studio');
const worldSrc = (look: Look, hash: string) => `${WORLD_URL}?embed=1&look=${look}${hash}`;

// Same server/client split as the navbar's full screen toggle: the server
// snapshot says "unsupported", so the button only appears after hydration and
// never on browsers without the Fullscreen API (iPhone Safari).
const subscribe = (onChange: () => void) => {
  document.addEventListener('fullscreenchange', onChange);
  return () => document.removeEventListener('fullscreenchange', onChange);
};
const getSupported = () => document.fullscreenEnabled;
const onServer = () => false;

const control =
  'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-600 hover:text-blue-700 dark:hover:border-blue-400 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-900';

const ExploreStage = () => {
  const { isDark } = useDarkModeContext();
  const [stage, setStage] = useState<Stage>({ state: 'poster' });
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const focusOnLoad = useRef(false);
  const fullscreen = useSyncExternalStore(subscribe, getSupported, onServer);

  const launch = (hash: string, focus: boolean) => {
    focusOnLoad.current = focus;
    setStage((prev) => ({ state: 'live', src: worldSrc(lookFor(isDark), hash), key: prev.state === 'live' ? prev.key + 1 : 0 }));
  };

  // Deep links. /explore/#g8deck opens the scene on G8Deck at load, and a
  // "View in 3D" anchor on the page changes the hash, which reloads the frame
  // on that spot (the scene reads its hash once, at load).
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.length < 2) return;
      launch(window.location.hash, true);
      wrapRef.current?.scrollIntoView({ block: 'start' });
    };
    window.addEventListener('hashchange', onHash);
    // The hash cannot be read during render without a hydration mismatch, so a
    // deep link is picked up once here, after the server poster has hydrated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.location.hash.length > 1) launch(window.location.hash, false);
    return () => window.removeEventListener('hashchange', onHash);
    // Mount only; `launch` reads the theme at the moment it runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow the site's theme without reloading the scene. The scene only accepts
  // this message from its own origin.
  const postLook = () =>
    frameRef.current?.contentWindow?.postMessage({ type: 'dh3d:look', look: lookFor(isDark) }, window.location.origin);
  useEffect(postLook, [isDark]);

  const onLoad = () => {
    postLook(); // covers a theme toggle made while the scene was still loading
    if (focusOnLoad.current) frameRef.current?.focus();
  };

  return (
    <div
      ref={wrapRef}
      className="relative left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-7xl scroll-mt-24"
    >
      <div className="relative h-[min(80vh,760px)] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900">
        {stage.state === 'live' ? (
          <iframe
            key={stage.key}
            ref={frameRef}
            src={stage.src}
            title="Developers Hub in 3D: interactive model"
            allow="fullscreen"
            loading="lazy"
            onLoad={onLoad}
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <>
            <img
              src="/images/explore/explore-poster.webp"
              width={1600}
              height={900}
              alt="Still of the 3D model: the Developers Hub tower at the centre, four service districts around it, on a floating landscape ringed by the three sectors it serves."
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30">
              <button
                type="button"
                onClick={() => launch('', true)}
                className="inline-flex items-center gap-3 px-7 py-4 text-lg font-semibold rounded-xl bg-white text-slate-900 shadow-lg hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                <Play className="w-5 h-5" aria-hidden="true" />
                Launch 3D
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {stage.state === 'live' && fullscreen && (
          <button type="button" onClick={() => frameRef.current?.requestFullscreen().catch(() => undefined)} className={control}>
            <Maximize className="w-4 h-4" aria-hidden="true" />
            Full screen
          </button>
        )}
        <a href={WORLD_URL} target="_blank" rel="noopener" className={control}>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          Open in new tab
        </a>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Drag to orbit, scroll to zoom. Keys: 1–4 for the districts, T for the tour, N for day or night.
        </p>
      </div>
    </div>
  );
};

export default ExploreStage;
