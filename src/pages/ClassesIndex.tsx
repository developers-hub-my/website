import { useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import ClassCard from '../components/ClassCard';
import { classes, eventFor } from '../lib/gatherhub';

const ClassesIndex = () => {
  useEffect(() => {
    document.title = 'Classes — Developers Hub';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Classes</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Hands-on training by practitioners, for practitioners.
          </p>
        </div>

        {classes.length === 0 ? (
          <div className="max-w-xl mx-auto text-center bg-white dark:bg-slate-800 rounded-xl shadow-md p-10">
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              New classes are coming soon
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We are preparing our next hands-on training runs. Leave your details and be
              the first to know when registration opens.
            </p>
            <a
              href="/#contact"
              className="inline-block py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Get Notified
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classDefinition) => (
              <ClassCard
                key={classDefinition.slug}
                classDefinition={classDefinition}
                event={eventFor(classDefinition)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ClassesIndex;
