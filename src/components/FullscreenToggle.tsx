import { useSyncExternalStore } from 'react';
import { Maximize, Minimize } from 'lucide-react';

// Presenting the site in a meeting: one click in, Esc or a second click out.
// The server snapshot reports "unsupported", so the prerendered HTML never
// touches `document` and the button only appears after hydration — and never
// on browsers without the Fullscreen API (iPhone Safari).
const subscribe = (onChange: () => void) => {
  document.addEventListener('fullscreenchange', onChange);
  return () => document.removeEventListener('fullscreenchange', onChange);
};
const getSupported = () => document.fullscreenEnabled;
const getIsFull = () => Boolean(document.fullscreenElement);
const onServer = () => false;

const FullscreenToggle = () => {
  const supported = useSyncExternalStore(subscribe, getSupported, onServer);
  const isFull = useSyncExternalStore(subscribe, getIsFull, onServer);

  if (!supported) return null;

  const toggle = () =>
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();

  return (
    <button
      onClick={toggle}
      type="button"
      className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
      aria-label={isFull ? 'Exit full screen' : 'Enter full screen'}
      aria-pressed={isFull}
    >
      {isFull ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
    </button>
  );
};

export default FullscreenToggle;
