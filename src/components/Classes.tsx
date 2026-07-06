import ClassCard from './ClassCard';
import classesData from '../data/classes.json';
import gatherhubData from '../data/gatherhub.generated.json';
import { ClassDefinition, GatherHubEvent } from '../types/gatherhub';

// Class run data (pricing, seats, registration state) is baked at build time
// by scripts/fetch-gatherhub.mjs — no runtime fetch. Freshness comes from the
// nightly rebuild workflow + GatherHub webhooks hitting the Netlify build hook.

const classes = classesData as ClassDefinition[];
const events = gatherhubData as Record<string, GatherHubEvent>;

const Classes = () => {
  if (classes.length === 0) {
    return null;
  }

  return (
    <section id="classes" className="py-20 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Classes</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Hands-on training by practitioners, for practitioners.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classDefinition) => (
            <ClassCard
              key={classDefinition.slug}
              classDefinition={classDefinition}
              event={
                classDefinition.gatherhub_event_uuid
                  ? events[classDefinition.gatherhub_event_uuid]
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;
