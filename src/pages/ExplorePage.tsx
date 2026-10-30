import { Link } from 'react-router';
import PageShell, { Section } from '../components/PageShell';
import ExploreStage from '../components/ExploreStage';
import { useSeo } from '../hooks/useSeo';
import { canonicalUrl, ID, pageTitle } from '../data/site';
import { SERVICES } from '../data/services';
import { breadcrumbNode, logoNode, organizationNode, webPageNode, webSiteNode } from '../lib/schema';

// /explore/ — the 3D model of the company, with a plain-text account of
// everything it shows so the page stands on its own without WebGL.
//
// The copy below mirrors the scene itself (DISTRICTS, PRODUCTS and SECTORS in
// the business workspace's _brand/3d/developers-hub-3d.html, synced by
// scripts/sync-3d.mjs). Change the scene and this list together; never add a
// product or a claim here that the scene does not make.

const DISTRICTS = [
  {
    hash: '#platforms',
    name: 'Platforms',
    line: 'Software you own, on servers you own.',
    body: "DevHub's own products, installed inside the client's network or hosted for them.",
    related: null,
  },
  {
    hash: '#build',
    name: 'Build',
    line: 'Built around your process, not ours.',
    body: 'Solution architecture, system development and migration, by the engineers who will support the system afterwards.',
    related: [
      { to: '/services/software-development/', label: 'Software Development' },
      { to: '/services/it-consultation/', label: 'IT Consultation' },
    ],
  },
  {
    hash: '#run',
    name: 'Run & support',
    line: 'Supported for the long term.',
    body: 'Fixes, upgrades and SLA-based support after go-live, with a direct line to the builders.',
    related: [{ to: '/services/software-development/', label: 'Software Development' }],
  },
  {
    hash: '#people',
    name: 'People',
    line: 'Your team learns to run what we build.',
    body: 'Training, bootcamps, coaching and mentoring, so the system stays the client’s long after the project ends.',
    related: [
      { to: '/services/technology-education/', label: 'Technology Education' },
      { to: '/trainings/', label: 'Trainings' },
    ],
  },
] as const;

const PRODUCTS = [
  { hash: '#g8stack', name: 'G8Stack', line: 'API management on the Kong gateway.', live: true },
  { hash: '#g8deck', name: 'G8Deck', line: 'Deploy apps on infrastructure you own.', live: true },
  { hash: '#gatherhub', name: 'GatherHub', line: 'Events, from registration to certificate.', live: true },
  { hash: '#warung', name: 'Warung', line: 'A point of sale on the phone the shop already owns.', live: true },
  { hash: '#bliptrace', name: 'Bliptrace', line: 'Error tracking for every app.', live: false },
  { hash: '#devhub-academy', name: 'DevHub Academy', line: 'Short video series that end in a verifiable credential.', live: false },
] as const;

const TITLE = 'Explore Developers Hub in 3D';
const DESCRIPTION =
  'An interactive 3D model of Developers Hub: the hub, its four service districts, its own products and the three sectors it serves, with a plain-text guide.';

const ExplorePage = () => {
  const canonical = canonicalUrl('/explore');
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }, { name: 'Explore in 3D' }];

  useSeo({
    title: pageTitle(TITLE),
    description: DESCRIPTION,
    path: '/explore/',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      webPageNode({ canonical, name: TITLE, description: DESCRIPTION, mainEntityId: ID.organization }),
      breadcrumbNode(canonical, crumbs),
    ],
  });

  // A plain hash anchor: ExploreStage listens for the change and opens the
  // scene on that spot, and the URL stays shareable.
  const viewLink = (hash: string, name: string) => (
    <a
      href={hash}
      className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 rounded"
    >
      View in 3D<span className="sr-only">: {name}</span>
    </a>
  );

  return (
    <PageShell
      crumbs={crumbs}
      title={TITLE}
      lede="An interactive model of Developers Hub: one hub tower linked to four service districts, the company's own products in the Platforms district, and a ring for the three sectors it serves. It runs in the browser with WebGL; everything it shows is also described below."
    >
      <ExploreStage />

      <Section title="The hub">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          The tower at the centre is the company itself. Click it in the model for the vision, mission and a short
          history, or read the full story on the{' '}
          <Link to="/about/" className="text-blue-700 dark:text-blue-300 hover:underline">
            About page
          </Link>
          . {viewLink('#about', 'the hub')}
        </p>
      </Section>

      <Section title="Four service districts">
        <ul className="grid sm:grid-cols-2 gap-4">
          {DISTRICTS.map((district) => (
            <li key={district.hash} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">{district.name}</h3>
              <p className="mt-1 text-slate-900 dark:text-slate-100">{district.line}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{district.body}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 items-center">
                {viewLink(district.hash, district.name)}
                {district.related?.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-slate-600 dark:text-slate-300 underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The model groups the work by how a client meets it. On this site the same work is described as four
          services:{' '}
          {SERVICES.map((service, index) => (
            <span key={service.slug}>
              {index > 0 && (index === SERVICES.length - 1 ? ' and ' : ', ')}
              <Link to={`/services/${service.slug}/`} className="text-blue-700 dark:text-blue-300 hover:underline">
                {service.name}
              </Link>
            </span>
          ))}
          .
        </p>
      </Section>

      <Section title="Products in the Platforms district">
        <ul className="divide-y divide-slate-200 dark:divide-slate-700 border-y border-slate-200 dark:border-slate-700">
          {PRODUCTS.map((product) => (
            <li key={product.hash} className="py-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span>
                <span className="font-semibold text-slate-900 dark:text-white">{product.name}</span>
                <span className="text-slate-600 dark:text-slate-300"> · {product.line}</span>
                {!product.live && (
                  <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                    Coming soon
                  </span>
                )}
              </span>
              {viewLink(product.hash, product.name)}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Three sectors">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          The glowing ring around the districts marks the three sectors the services reach: government and the
          public sector, higher education, and industry. A train runs the ring, and drones fly from the hub to each
          district.
        </p>
      </Section>
    </PageShell>
  );
};

export default ExplorePage;
