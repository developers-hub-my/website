import { Link } from 'react-router';
import PageShell, { Section } from '../components/PageShell';
import { useSeo } from '../hooks/useSeo';
import { SITE, canonicalUrl, ID } from '../data/site';
import { breadcrumbNode, logoNode, organizationNode, webPageNode, webSiteNode } from '../lib/schema';

// Public terms of service. Stripe links to it from Checkout and receipts, so the
// payment, subscription, SST and refund terms below must match how billing
// actually works (Stripe only, USD for online products — spec ADR-002).
// Bump UPDATED whenever the text changes in substance.
const UPDATED = '25 November 2026';

const P = 'text-slate-600 dark:text-slate-300 leading-relaxed';
const UL = 'list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2 mt-3';

const TermsPage = () => {
  const canonical = canonicalUrl('/terms');
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Terms of Service' }];
  const { address } = SITE;

  useSeo({
    title: 'Terms of Service | Developers Hub',
    description: `Terms for using ${SITE.legalName} websites, services and products, including payments, subscriptions, SST and refunds.`,
    path: '/terms',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      webPageNode({
        canonical,
        name: 'Terms of Service | Developers Hub',
        description: `Terms of service of ${SITE.legalName}.`,
        mainEntityId: ID.organization,
      }),
      breadcrumbNode(canonical, crumbs),
    ],
  });

  return (
    <PageShell
      crumbs={crumbs}
      title="Terms of Service"
      lede={`These terms apply when you use the websites, services and software products of ${SITE.legalName}, including Bliptrace, and when you pay us online.`}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {UPDATED}</p>

      <Section title="1. Agreement">
        <p className={P}>
          These Terms of Service (&quot;Terms&quot;) are between you and {SITE.legalName} (Company No.
          202001019928 / 1376248-V), a company incorporated in Malaysia (&quot;DevHub&quot;,
          &quot;we&quot;, &quot;us&quot;). By using our websites, signing up for a product or paying us,
          you agree to these Terms. If you use a product on behalf of an organisation, you confirm
          you may bind it to these Terms.
        </p>
      </Section>

      <Section title="2. Our services and products">
        <ul className={UL}>
          <li>Education and training programmes in technology</li>
          <li>Software development, IT consultation and business solutions</li>
          <li>
            Software products we host, such as Bliptrace (bliptrace.com), an error-tracking and
            observability service
          </li>
        </ul>
        <p className={`${P} mt-3`}>
          A signed agreement, quotation or contract for a project or training takes precedence over
          these Terms where they differ.
        </p>
      </Section>

      <Section title="3. Accounts">
        <ul className={UL}>
          <li>Give accurate information and keep it up to date</li>
          <li>Keep your sign-in details and API keys secure; you are responsible for activity under your account</li>
          <li>Tell us promptly at {SITE.email} if you suspect unauthorised use</li>
        </ul>
      </Section>

      <Section title="4. Acceptable use">
        <p className={P}>You agree not to:</p>
        <ul className={UL}>
          <li>Use our services for anything unlawful under Malaysian law or the law where you are</li>
          <li>Disrupt, overload or try to gain unauthorised access to our services</li>
          <li>Send data you have no right to send, or deliberately send sensitive personal data in telemetry</li>
          <li>Resell or copy our products without our written consent</li>
        </ul>
      </Section>

      <Section title="5. Prices, payment and SST">
        <ul className={UL}>
          <li>
            Online products such as Bliptrace are priced in US Dollars (USD). Projects, training and
            other services are quoted in Malaysian Ringgit (MYR) unless the quotation says otherwise.
          </li>
          <li>
            Online payments are processed by Stripe. Card details go directly to Stripe; we never see
            or store full card numbers.
          </li>
          <li>
            Prices are subject to Malaysian Sales and Service Tax (SST) where it applies. Any SST is
            shown at checkout and on your invoice or receipt.
          </li>
          <li>
            Invoices for services are payable within the period stated on the invoice. Late payment
            may incur charges as set out in the agreement.
          </li>
        </ul>
      </Section>

      <Section title="6. Subscriptions">
        <ul className={UL}>
          <li>
            Subscriptions, such as extra team seats, renew automatically each month or year until
            cancelled. We charge the payment method on file at the start of each period.
          </li>
          <li>You can cancel at any time. Cancellation takes effect at the end of the current period, and access continues until then.</li>
          <li>
            If a renewal payment fails, we retry it and email you. If it still cannot be collected,
            the subscription is cancelled and the related access, such as extra seats, is removed.
          </li>
          <li>We give at least 30 days&apos; notice of any price change to an existing subscription.</li>
        </ul>
      </Section>

      <Section title="7. One-time purchases">
        <p className={P}>
          Some capabilities, such as the Bliptrace unlock for dedicated API and MCP endpoints, are a
          one-time payment that grants a permanent capability to your account. A one-time purchase
          does not include hosting, which is a separate service.
        </p>
      </Section>

      <Section title="8. Refunds">
        <ul className={UL}>
          <li>Subscription periods already started are not refunded, except where the law requires it.</li>
          <li>
            A one-time purchase can be refunded in full if you ask within 14 days and have not used
            the capability, such as binding a project to a dedicated endpoint.
          </li>
          <li>If we charged you in error, or for a service we did not provide, we refund it in full.</li>
          <li>Email refund requests to {SITE.email}. Approved refunds go back to the original payment method.</li>
        </ul>
      </Section>

      <Section title="9. Your data">
        <p className={P}>
          You keep ownership of the data you send to our products. You give us the right to process it
          only to provide the service. How we handle personal data is set out in our{' '}
          <Link to="/privacy/" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
        </p>
      </Section>

      <Section title="10. Intellectual property">
        <p className={P}>
          Our websites, software, logos and content belong to {SITE.legalName} and are protected by
          Malaysian law, including the Copyright Act 1987 and the Trademarks Act 2019. Open-source
          components, such as our SDKs, are licensed under their own licences.
        </p>
      </Section>

      <Section title="11. Availability and warranties">
        <p className={P}>
          We work to keep our services available and accurate, but they are provided &quot;as is&quot; and
          &quot;as available&quot;, without warranties of any kind beyond those the law does not allow us
          to exclude.
        </p>
      </Section>

      <Section title="12. Limitation of liability">
        <p className={P}>
          To the extent Malaysian law allows, we are not liable for indirect, incidental, special or
          consequential loss, including lost profit or data. Our total liability for any claim is
          limited to the amount you paid us for the service concerned in the 12 months before the
          claim.
        </p>
      </Section>

      <Section title="13. Suspension and termination">
        <p className={P}>
          You may stop using our services at any time. We may suspend or close an account that breaks
          these Terms or puts our services or other customers at risk, and we will tell you why where
          we can.
        </p>
      </Section>

      <Section title="14. Force majeure">
        <p className={P}>
          We are not liable for failure or delay caused by events beyond our reasonable control, such
          as natural disasters, government action, or failure of the Internet or third-party
          infrastructure.
        </p>
      </Section>

      <Section title="15. Governing law">
        <p className={P}>
          These Terms are governed by the laws of Malaysia. Both parties will first try to settle a
          dispute in good faith; otherwise it goes to the courts of Malaysia.
        </p>
      </Section>

      <Section title="16. Changes">
        <p className={P}>
          We may update these Terms. Changes are posted on this page with a new date, and material
          changes to paid products are emailed to account owners. Continuing to use the service
          after a change means you accept it.
        </p>
      </Section>

      <Section title="17. Contact">
        <div className={`${P} p-4 bg-slate-100 dark:bg-slate-800 rounded-lg`}>
          <p className="font-medium text-slate-900 dark:text-white">{SITE.legalName}</p>
          <p>{address.streetAddress}</p>
          <p>
            {address.postalCode} {address.addressLocality}, {address.addressRegion}, Malaysia
          </p>
          <p className="mt-2">
            Email: <a href={`mailto:${SITE.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{SITE.email}</a>
          </p>
        </div>
      </Section>
    </PageShell>
  );
};

export default TermsPage;
