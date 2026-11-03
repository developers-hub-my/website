// Soft brand backdrop for the whole homepage: gradient wash, drifting colour
// blobs, a fine grid and a few orbs. Fixed to the viewport so it runs
// continuously behind every section; the homepage wrapper clips it
// (clip-path clips fixed children, overflow does not) so it never shows
// behind the footer. Decorative only; blobs and orbs stay still for reduced motion.
const Backdrop = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
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
);

export default Backdrop;
