import { Link } from 'react-router';
import { GraduationCap, Hammer, LifeBuoy, Server, type LucideIcon } from 'lucide-react';
import { WAYS } from '../../data/offer';
import { container, h2, textLink } from './styles';

const ICONS: Record<string, LucideIcon> = {
  '#platforms': Server,
  '#build': Hammer,
  '#run': LifeBuoy,
  '#people': GraduationCap,
};

// The four ways of working. Platforms has no service page of its own; it
// points at the product list further down this page.
const WaysOfWorking = () => (
  <section aria-labelledby="what-we-do" className="bg-slate-50 dark:bg-slate-900 py-20 sm:py-28">
    <div className={`${container} grid lg:grid-cols-12 gap-12`}>
      <div className="lg:col-span-4">
        <h2 id="what-we-do" className={h2}>
          What we do
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-800 dark:text-slate-200">
          One team from the first design to long after go-live, so nothing is lost between the people who build a
          system and the people who run it.
        </p>
        <Link to="/services/" className={`mt-6 ${textLink}`}>
          All services
        </Link>
      </div>

      <ul className="lg:col-span-8 grid sm:grid-cols-2 gap-x-12 gap-y-12">
        {WAYS.map((way) => {
          const Icon = ICONS[way.hash];
          return (
            <li key={way.hash}>
              <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                <Icon className="w-6 h-6 shrink-0 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                {way.name}
              </h3>
              <p className="mt-3 font-semibold text-slate-900 dark:text-white">{way.line}</p>
              <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">{way.body}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {way.related ? (
                  way.related.map((link) => (
                    <Link key={link.to} to={link.to} className={textLink}>
                      {link.label}
                    </Link>
                  ))
                ) : (
                  <a href="#products" className={textLink}>
                    See our products
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default WaysOfWorking;
