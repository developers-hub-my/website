import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import ClassCard from './ClassCard';
import { classes, eventFor } from '../lib/gatherhub';

// Home-page section: a taste of the classes catalogue. The full list lives at
// /classes; each card links to its /classes/:slug detail page where the
// register CTA redirects to GatherHub.

const FEATURED_COUNT = 3;

const Classes = () => {
  const featured = classes.slice(0, FEATURED_COUNT);

  return (
    <section id="classes" className="py-20 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Classes</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Hands-on training by practitioners, for practitioners.
          </p>
        </div>

        {featured.length === 0 ? (
          <div className="max-w-xl mx-auto text-center bg-white dark:bg-slate-800 rounded-xl shadow-md p-10">
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              New classes are coming soon
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We are preparing our next hands-on training runs. Leave your details and be
              the first to know when registration opens.
            </p>
            <a
              href="#contact"
              className="inline-block py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Get Notified
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((classDefinition) => (
                <ClassCard
                  key={classDefinition.slug}
                  classDefinition={classDefinition}
                  event={eventFor(classDefinition)}
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/classes"
                className="inline-flex items-center py-2 px-6 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              >
                View All Classes <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Classes;
