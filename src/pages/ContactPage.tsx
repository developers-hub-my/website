import { Clock, Mail, MapPin } from 'lucide-react';
import PageShell, { Section } from '../components/PageShell';
import { useSeo } from '../hooks/useSeo';
import { SITE, canonicalUrl, ID } from '../data/site';
import {
  breadcrumbNode,
  localBusinessNode,
  logoNode,
  organizationNode,
  webPageNode,
  webSiteNode,
} from '../lib/schema';

// The contact page — LocalBusiness, PostalAddress and GeoCoordinates, per the
// Phase 03 minimum content list.
//
// There is deliberately no phone number: the company has not published one, and
// rule 05 treats an empty `telephone` as worse than an absent one. Add it to
// src/data/site.ts when it exists, and it appears here and in the graph at the
// same time.

const ContactPage = () => {
  const canonical = canonicalUrl('/contact');
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Contact' }];
  const { address, openingHours } = SITE;

  useSeo({
    title: 'Contact Developers Hub | Johor Bahru',
    description: `Contact ${SITE.legalName} in ${address.addressLocality} — email ${SITE.email}, or visit the office at ${address.streetAddress}.`,
    path: '/contact',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      localBusinessNode(),
      webPageNode({
        canonical,
        type: 'ContactPage',
        name: 'Contact Developers Hub | Johor Bahru',
        description: `How to reach ${SITE.legalName} in ${address.addressLocality}, Malaysia.`,
        mainEntityId: ID.localBusiness,
      }),
      breadcrumbNode(canonical, crumbs),
    ],
  });

  const mapQuery = encodeURIComponent(
    `${address.streetAddress}, ${address.postalCode} ${address.addressLocality}, ${address.addressRegion}`,
  );

  return (
    <PageShell
      crumbs={crumbs}
      title="Contact DevHub"
      lede={`${SITE.legalName} works from ${address.addressLocality}, ${address.addressRegion}. Email reaches the team fastest; the office is open on weekdays.`}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Mail className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-slate-900 dark:text-white">Email</h2>
          <a href={`mailto:${SITE.email}`} className="mt-1 block text-blue-600 dark:text-blue-400 hover:underline">
            {SITE.email}
          </a>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Clock className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-slate-900 dark:text-white">Opening hours</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Monday to Friday, {openingHours.opens}–{openingHours.closes}
          </p>
        </div>

        <div className="sm:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <MapPin className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-slate-900 dark:text-white">Office</h2>
          <address className="mt-1 not-italic text-slate-600 dark:text-slate-300 leading-relaxed">
            {address.streetAddress}
            <br />
            {address.postalCode} {address.addressLocality}
            <br />
            {address.addressRegion}, Malaysia
          </address>
        </div>
      </div>

      <Section title="Find us">
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <iframe
            title={`Map showing ${SITE.legalName} in ${address.addressLocality}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="w-full h-80 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Section>

      <Section title="Send an enquiry">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Tell us what you are trying to build, fix or learn, and roughly when you need it. Email{' '}
          <a href={`mailto:${SITE.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {SITE.email}
          </a>{' '}
          and a person will reply — there is no autoresponder in front of it.
        </p>
      </Section>
    </PageShell>
  );
};

export default ContactPage;
