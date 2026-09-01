import { Link, useParams } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';
import PageShell, { Section } from '../components/PageShell';
import NotFound from './NotFound';
import { useSeo } from '../hooks/useSeo';
import { canonicalUrl, pageTitle, ID } from '../data/site';
import { serviceBySlug } from '../data/services';
import { technologiesForService } from '../data/technologies';
import {
  breadcrumbNode,
  faqPageNode,
  logoNode,
  organizationNode,
  serviceNode,
  technologyNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// One of the four Service pages in the Phase 03 minimum page set.
//
// The technology list is read from the service's own data, and the same list
// produces both the visible "Technologies we use" links and the `isRelatedTo`
// references in the graph. Phase 08 calls a mismatch between those two layers a
// defect, so there is deliberately no way to render one without the other.

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? serviceBySlug(slug) : undefined;
  const technologies = service ? technologiesForService(service.slug) : [];

  const canonical = service ? canonicalUrl(`/services/${service.slug}`) : '';
  const crumbs = service
    ? [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }, { name: service.name }]
    : [];

  useSeo(
    service
      ? {
          title: pageTitle(`${service.name} in Malaysia`),
          description: service.description,
          path: `/services/${service.slug}`,
          crumbs,
          nodes: [
            organizationNode(),
            logoNode(),
            webSiteNode(),
            webPageNode({
              canonical,
              name: pageTitle(`${service.name} in Malaysia`),
              description: service.description,
              mainEntityId: ID.service(service.slug),
            }),
            serviceNode(service, technologies),
            ...technologies.map(technologyNode),
            breadcrumbNode(canonical, crumbs),
            faqPageNode(canonical, service.faqs),
          ],
        }
      : {
          title: 'Service not found — Developers Hub',
          description: 'That service does not exist or may have been moved.',
          path: `/services/${slug ?? ''}`,
          noindex: true,
        },
  );

  if (!service) return <NotFound />;

  return (
    <PageShell crumbs={crumbs} title={service.name} lede={service.definition}>
      <Section title="Who this is for">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{service.audience}</p>
      </Section>

      <Section title="Problems this solves">
        <ul className="space-y-3">
          {service.problems.map((problem) => (
            <li key={problem} className="flex gap-3 text-slate-600 dark:text-slate-300">
              <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{problem}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="How the work runs">
        <ol className="space-y-6">
          {service.process.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {technologies.length > 0 && (
        <Section title="Technologies we use for this">
          <ul className="flex flex-wrap gap-3">
            {technologies.map((technology) => (
              <li key={technology.slug}>
                <Link
                  to={`/technologies/${technology.slug}/`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {technology.name}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Common questions">
        <dl className="space-y-6">
          {service.faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-slate-900 dark:text-white">{faq.question}</dt>
              <dd className="mt-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <div className="mt-12 rounded-2xl bg-slate-900 dark:bg-slate-800 p-6 sm:p-8 text-white">
        <h2 className="text-xl font-semibold">Talk to us about {service.name.toLowerCase()}</h2>
        <p className="mt-2 text-slate-300">
          Tell us what you are trying to build or fix, and we will tell you whether we are the right people for it.
        </p>
        <Link
          to="/contact/"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors"
        >
          Contact DevHub
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </PageShell>
  );
};

export default ServiceDetail;
