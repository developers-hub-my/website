import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import PageShell, { Section } from '../components/PageShell';
import { useSeo } from '../hooks/useSeo';
import { SITE, canonicalUrl, ID } from '../data/site';
import { SERVICES } from '../data/services';
import { PEOPLE } from '../data/people';
import { technologiesForService } from '../data/technologies';
import {
  breadcrumbNode,
  logoNode,
  organizationNode,
  personNode,
  serviceNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// The About page — Organization and Person entities, per the Phase 04 page
// implementation matrix.
//
// Company facts come from src/data/site.ts rather than being written into the
// copy, so the Phase 07 requirement holds: change the address or founding year
// in one place and this page, the contact page, the footer and the JSON-LD all
// move together.

const AboutPage = () => {
  const canonical = canonicalUrl('/about');
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About' }];

  useSeo({
    title: 'About Developers Hub Sdn Bhd',
    description:
      'Developers Hub Sdn Bhd is a technology company founded in 2020 in Johor Bahru, Malaysia, working in software development, IT consultation, technology education and business solutions.',
    path: '/about',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      webPageNode({
        canonical,
        type: 'AboutPage',
        name: 'About Developers Hub Sdn Bhd',
        description: SITE.description,
        mainEntityId: ID.organization,
      }),
      ...SERVICES.map((service) => serviceNode(service, technologiesForService(service.slug))),
      ...PEOPLE.map(personNode),
      breadcrumbNode(canonical, crumbs),
    ],
  });

  return (
    <PageShell
      crumbs={crumbs}
      title="About Developers Hub"
      lede={`${SITE.legalName}, operating as ${SITE.alternateName}, is a technology company based in ${SITE.address.addressLocality}, ${SITE.address.addressRegion}. It was founded in ${SITE.foundingDate} and works with businesses across Malaysia.`}
    >
      <Section title="What the company does">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          DevHub works in four areas: building custom software, advising on technical decisions, training
          development teams, and automating the manual steps in how a business already runs. The same
          engineers do the client work and teach the courses, which is deliberate — the training material
          comes out of problems the team has had to solve for real.
        </p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-3">
          {SERVICES.map((service) => (
            <li key={service.slug}>
              <Link
                to={`/services/${service.slug}/`}
                className="group flex items-center justify-between gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
              >
                <span className="font-medium text-slate-900 dark:text-white">{service.name}</span>
                <ArrowRight
                  className="w-4 h-4 text-blue-600 shrink-0 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Capability">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          The engineering practice is built on Laravel and PHP, and the training catalogue runs from Linux,
          Git and containers through to system architecture. DevHub also teaches AI-augmented development,
          which is currently the fastest-moving part of the catalogue. What the company can defend with real
          projects and published work is listed on the{' '}
          <Link to="/technologies/" className="text-blue-600 dark:text-blue-400 hover:underline">
            technologies page
          </Link>
          .
        </p>
      </Section>

      <Section title="The team">
        <ul className="space-y-3">
          {PEOPLE.map((person) => (
            <li key={person.slug} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <Link
                to={`/authors/${person.slug}/`}
                className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {person.name}
              </Link>
              <span className="text-sm text-slate-500 dark:text-slate-400"> · {person.jobTitle}</span>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{person.bio}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Company details">
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Registered name</dt>
            <dd className="font-medium text-slate-900 dark:text-white">{SITE.legalName}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Founded</dt>
            <dd className="font-medium text-slate-900 dark:text-white">{SITE.foundingDate}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Based in</dt>
            <dd className="font-medium text-slate-900 dark:text-white">
              {SITE.address.addressLocality}, {SITE.address.addressRegion}, Malaysia
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Email</dt>
            <dd className="font-medium">
              <a href={`mailto:${SITE.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {SITE.email}
              </a>
            </dd>
          </div>
        </dl>
      </Section>
    </PageShell>
  );
};

export default AboutPage;
