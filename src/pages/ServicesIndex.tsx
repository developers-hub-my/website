import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import PageShell from '../components/PageShell';
import { useSeo } from '../hooks/useSeo';
import { canonicalUrl } from '../data/site';
import { SERVICES } from '../data/services';
import { technologiesForService } from '../data/technologies';
import {
  breadcrumbNode,
  logoNode,
  organizationNode,
  serviceNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// The services hub. Every Service entity is emitted here in full, which is
// what lets the homepage and the individual pages reference them by @id
// without rebuilding the objects (R4).

const ServicesIndex = () => {
  const canonical = canonicalUrl('/services');
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Services' }];

  useSeo({
    title: 'Services | DevHub Malaysia',
    description:
      'Software development, IT consultation, technology education and business solutions for Malaysian businesses, delivered from Johor Bahru.',
    path: '/services/',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      webPageNode({
        canonical,
        type: 'CollectionPage',
        name: 'Services | DevHub Malaysia',
        description:
          'The four services Developers Hub Sdn Bhd offers: software development, IT consultation, technology education and business solutions.',
      }),
      ...SERVICES.map((service) => serviceNode(service, technologiesForService(service.slug))),
      breadcrumbNode(canonical, crumbs),
    ],
  });

  return (
    <PageShell
      crumbs={crumbs}
      title="Services"
      lede="Developers Hub Sdn Bhd offers four services: software development, IT consultation, technology education and business solutions. Each is delivered by the same team, from Johor Bahru, for clients across Malaysia."
    >
      <ul className="grid sm:grid-cols-2 gap-4">
        {SERVICES.map((service) => (
          <li key={service.slug}>
            <Link
              to={`/services/${service.slug}/`}
              className="group flex h-full flex-col p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{service.name}</h2>
              <p className="mt-2 flex-grow text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Read more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
};

export default ServicesIndex;
