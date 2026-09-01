import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import PageShell from '../components/PageShell';
import { useSeo } from '../hooks/useSeo';
import { canonicalUrl } from '../data/site';
import { PEOPLE } from '../data/people';
import {
  breadcrumbNode,
  logoNode,
  organizationNode,
  personNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// The authors hub, referenced from llms.txt.
//
// Only people who have agreed to appear are listed — Phase 11 rule 06. An
// empty or half-filled profile is not published; the SOP's indexation matrix
// says a profile without content does not get indexed.

const AuthorsIndex = () => {
  const canonical = canonicalUrl('/authors');
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Authors' }];

  useSeo({
    title: 'Authors | DevHub Malaysia',
    description: "The people who write Developers Hub's technical content, and the expertise behind it.",
    path: '/authors/',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      webPageNode({
        canonical,
        type: 'CollectionPage',
        name: 'Authors | DevHub Malaysia',
        description: "The people who write Developers Hub's technical content.",
      }),
      ...PEOPLE.map(personNode),
      breadcrumbNode(canonical, crumbs),
    ],
  });

  return (
    <PageShell
      crumbs={crumbs}
      title="Authors"
      lede="Everything published on this site carries the name of the person who wrote it. These are those people, with the work that backs up what each of them claims to know."
    >
      <ul className="space-y-4">
        {PEOPLE.map((person) => (
          <li key={person.slug}>
            <Link
              to={`/authors/${person.slug}/`}
              className="group block p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{person.name}</h2>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{person.jobTitle}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{person.bio}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Read profile
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
};

export default AuthorsIndex;
