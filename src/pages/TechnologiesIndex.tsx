import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import PageShell from '../components/PageShell';
import { useSeo } from '../hooks/useSeo';
import { canonicalUrl } from '../data/site';
import { TECHNOLOGIES } from '../data/technologies';
import {
  breadcrumbNode,
  logoNode,
  organizationNode,
  technologyNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// The technologies hub.
//
// Three entries, not the ten the homepage used to advertise. Phase 01 is
// explicit that a technology without a project, service, training or article
// behind it inflates the graph without making it defensible — see the note at
// the top of src/data/technologies.ts.

const TechnologiesIndex = () => {
  const canonical = canonicalUrl('/technologies');
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Technologies' }];

  useSeo({
    title: 'Technologies | DevHub',
    description:
      'The technologies DevHub builds with and teaches — Laravel, PHP and Claude Code — each with the courses and client work behind it.',
    path: '/technologies/',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      webPageNode({
        canonical,
        type: 'CollectionPage',
        name: 'Technologies | DevHub',
        description: 'Technologies Developers Hub builds with and teaches, with the evidence behind each.',
      }),
      ...TECHNOLOGIES.map(technologyNode),
      breadcrumbNode(canonical, crumbs),
    ],
  });

  return (
    <PageShell
      crumbs={crumbs}
      title="Technologies"
      lede="These are the technologies DevHub builds with in client work and teaches in its courses. The list is short on purpose: a technology appears here only when there is a project, a course or published work behind it."
    >
      <ul className="space-y-4">
        {TECHNOLOGIES.map((technology) => (
          <li key={technology.slug}>
            <Link
              to={`/technologies/${technology.slug}/`}
              className="group block p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{technology.name}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {technology.definition}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                How DevHub uses {technology.name}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
};

export default TechnologiesIndex;
