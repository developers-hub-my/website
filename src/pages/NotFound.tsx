import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = 'Page not found — Developers Hub';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-24 pb-20 min-h-screen flex items-center bg-gray-50 dark:bg-slate-900">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-slate-800 mb-6">
          <Compass className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-6xl sm:text-7xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The page you are looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
