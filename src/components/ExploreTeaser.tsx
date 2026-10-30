import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

// Homepage entry point to /explore/. A static poster and a link only: the
// WebGL scene and its iframe never load on the homepage.
const ExploreTeaser = () => (
  <section aria-labelledby="explore-teaser" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
      <div className="lg:col-span-2">
        <h2 id="explore-teaser" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Explore Developers Hub in 3D
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          Walk round an interactive model of the company: the hub, the four service districts, our own products and
          the three sectors we work with. Click a district to see what happens there.
        </p>
        <Link
          to="/explore/"
          className="group mt-6 inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
        >
          Open the 3D model
          <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
      <img
        src="/images/explore/explore-poster.webp"
        width={1600}
        height={900}
        loading="lazy"
        alt="Still of the 3D model of Developers Hub: a central tower with four service districts around it."
        className="lg:col-span-3 w-full h-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-md"
      />
    </div>
  </section>
);

export default ExploreTeaser;
