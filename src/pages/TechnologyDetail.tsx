import { Link, useParams } from 'react-router';
import { ArrowRight, ExternalLink } from 'lucide-react';
import PageShell, { Section } from '../components/PageShell';
import NotFound from './NotFound';
import { useSeo } from '../hooks/useSeo';
import { canonicalUrl, pageTitle, ID } from '../data/site';
import { technologyBySlug } from '../data/technologies';
import { serviceBySlug } from '../data/services';
import { personBySlug } from '../data/people';
import { trainings, trainingPath } from '../data/trainings';
import {
  breadcrumbNode,
  logoNode,
  organizationNode,
  personNode,
  serviceNode,
  technologyNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// A Technology page from the Phase 03 minimum set.
//
// Phase 16 step 05 asks that an industry fact and DevHub's own experience are
// written as two different kinds of claim and never blended. The data model
// keeps them in separate fields — `definition` and `howDevhubUsesIt` — and this
// page renders them under headings that say which is which.

const TechnologyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const technology = slug ? technologyBySlug(slug) : undefined;

  const services = (technology?.services ?? [])
    .map(serviceBySlug)
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const courses = (technology?.trainingSlugs ?? [])
    .map((trainingSlug) => trainings.find((training) => training.slug === trainingSlug))
    .filter((training): training is NonNullable<typeof training> => Boolean(training));
  const experts = (technology?.experts ?? [])
    .map(personBySlug)
    .filter((person): person is NonNullable<typeof person> => Boolean(person));

  const canonical = technology ? canonicalUrl(`/technologies/${technology.slug}`) : '';
  const crumbs = technology
    ? [
        { name: 'Home', path: '/' },
        { name: 'Technologies', path: '/technologies/' },
        { name: technology.name },
      ]
    : [];

  useSeo(
    technology
      ? {
          title: pageTitle(`${technology.name} at DevHub`, 'Developers Hub'),
          description: technology.description,
          path: `/technologies/${technology.slug}`,
          crumbs,
          nodes: [
            organizationNode(),
            logoNode(),
            webSiteNode(),
            webPageNode({
              canonical,
              name: pageTitle(`${technology.name} at DevHub`, 'Developers Hub'),
              description: technology.description,
              mainEntityId: ID.technology(technology.slug),
            }),
            technologyNode(technology),
            // Referenced entities are emitted in full so no @id dangles (R6).
            ...services.map((service) => serviceNode(service, [technology])),
            ...experts.map(personNode),
            breadcrumbNode(canonical, crumbs),
          ],
        }
      : {
          title: 'Technology not found — Developers Hub',
          description: 'That technology page does not exist or may have been moved.',
          path: `/technologies/${slug ?? ''}`,
          noindex: true,
        },
  );

  if (!technology) return <NotFound />;

  return (
    <PageShell crumbs={crumbs} title={technology.name} lede={technology.definition}>
      <Section title={`How DevHub uses ${technology.name}`}>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{technology.howDevhubUsesIt}</p>
        <p className="mt-4">
          <a
            href={technology.officialUrl}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Official {technology.name} documentation
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </p>
      </Section>

      {services.length > 0 && (
        <Section title="Services delivered with it">
          <ul className="grid sm:grid-cols-2 gap-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/services/${service.slug}/`}
                  className="block h-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{service.name}</span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">
                    {service.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {courses.length > 0 && (
        <Section title={`Training we run on ${technology.name}`}>
          <ul className="space-y-3">
            {courses.map((course) => (
              <li key={course.slug}>
                <Link
                  to={trainingPath(course)}
                  className="group flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
                >
                  <ArrowRight
                    className="w-4 h-4 mt-1 text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="font-semibold text-slate-900 dark:text-white block">{course.title}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{course.tagline}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {experts.length > 0 && (
        <Section title="Who at DevHub works with it">
          <ul className="space-y-3">
            {experts.map((person) => {
              const evidence = person.knowsAbout.find(
                (entry) => entry.technologySlug === technology.slug,
              );

              return (
                <li key={person.slug} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Link
                    to={`/authors/${person.slug}/`}
                    className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {person.name}
                  </Link>
                  <span className="text-sm text-slate-500 dark:text-slate-400"> · {person.jobTitle}</span>
                  {evidence && (
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{evidence.evidence}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}
    </PageShell>
  );
};

export default TechnologyDetail;
