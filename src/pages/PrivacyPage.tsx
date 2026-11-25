import { Link } from 'react-router';
import PageShell, { Section } from '../components/PageShell';
import { useSeo } from '../hooks/useSeo';
import { SITE, canonicalUrl, ID } from '../data/site';
import { breadcrumbNode, logoNode, organizationNode, webPageNode, webSiteNode } from '../lib/schema';

// Public privacy policy. Stripe links to it from Checkout, receipts and the
// hosted payment-recovery page, so it has to be a real URL, not a footer modal.
// Bump UPDATED whenever the text changes in substance.
const UPDATED = '25 November 2026';

const P = 'text-slate-600 dark:text-slate-300 leading-relaxed';
const UL = 'list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2 mt-3';

const PrivacyPage = () => {
  const canonical = canonicalUrl('/privacy');
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Privacy Policy' }];
  const { address } = SITE;

  useSeo({
    title: 'Privacy Policy | Developers Hub',
    description: `How ${SITE.legalName} collects, uses and protects personal data under the Personal Data Protection Act 2010.`,
    path: '/privacy',
    crumbs,
    nodes: [
      organizationNode(),
      logoNode(),
      webSiteNode(),
      webPageNode({
        canonical,
        name: 'Privacy Policy | Developers Hub',
        description: `Privacy policy of ${SITE.legalName} under the Personal Data Protection Act 2010.`,
        mainEntityId: ID.organization,
      }),
      breadcrumbNode(canonical, crumbs),
    ],
  });

  return (
    <PageShell
      crumbs={crumbs}
      title="Privacy Policy"
      lede={`This policy explains what personal data ${SITE.legalName} collects through devhub.my and our products, including Bliptrace, why we collect it, and the rights you have under the Personal Data Protection Act 2010.`}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {UPDATED}</p>

      <Section title="1. Who we are">
        <p className={P}>
          {SITE.legalName} (Company No. 202001019928 / 1376248-V) (&quot;DevHub&quot;, &quot;we&quot;,
          &quot;us&quot;) is the data user responsible for your personal data. This policy covers our
          website, our training and consulting services, and our software products, including
          Bliptrace (bliptrace.com).
        </p>
      </Section>

      <Section title="2. Data we collect">
        <ul className={UL}>
          <li>Name and contact details, such as email address and phone number</li>
          <li>Company or organisation details</li>
          <li>Information you send us through contact forms, email or support requests</li>
          <li>Account data for our products: sign-in email, team members and roles</li>
          <li>
            Billing data: billing name, address, country, tax details and payment history. Card
            details are entered directly with our payment processor, Stripe. We never receive or
            store full card numbers.
          </li>
          <li>Technical data such as IP address, browser type, device information and usage data</li>
          <li>
            For Bliptrace: error and diagnostic data that our customers&apos; applications send to us.
            Personal data in that telemetry is scrubbed before it is stored, and customers control
            what their applications send.
          </li>
        </ul>
      </Section>

      <Section title="3. Why we use it">
        <ul className={UL}>
          <li>To provide, run and support our services and products</li>
          <li>To process payments, issue invoices and receipts, and keep tax and accounting records</li>
          <li>To answer enquiries and give customer support</li>
          <li>To send service notices, such as receipts, failed-payment and card-expiry reminders</li>
          <li>To send updates and marketing, only with your consent</li>
          <li>To keep our services secure and prevent fraud</li>
          <li>To comply with Malaysian law, including tax law</li>
        </ul>
      </Section>

      <Section title="4. PDPA principles">
        <p className={P}>We process personal data in line with the seven principles of the PDPA 2010:</p>
        <ul className={UL}>
          <li><strong>General:</strong> only lawfully, for a purpose related to our activities</li>
          <li><strong>Notice and choice:</strong> we tell you what we collect and why, as in this policy</li>
          <li><strong>Disclosure:</strong> only for the purposes in this policy or with your consent</li>
          <li><strong>Security:</strong> practical steps to protect data from loss, misuse or unauthorised access</li>
          <li><strong>Retention:</strong> kept no longer than needed for the purpose or required by law</li>
          <li><strong>Data integrity:</strong> reasonable steps to keep data accurate and up to date</li>
          <li><strong>Access:</strong> you can ask to see and correct your personal data</li>
        </ul>
      </Section>

      <Section title="5. Who we share it with">
        <p className={P}>
          We do not sell, trade or rent personal data. We share it only with service providers who
          help us run our business, under confidentiality and data-protection obligations:
        </p>
        <ul className={UL}>
          <li>Stripe, which processes card payments, subscriptions, invoices and receipts</li>
          <li>Hosting and infrastructure providers that run our websites and products</li>
          <li>Email delivery providers that send receipts and service notices</li>
        </ul>
        <p className={`${P} mt-3`}>
          Some providers process data outside Malaysia. Where they do, we rely on their contractual
          safeguards. We also disclose data when Malaysian law requires it or to protect our legal
          rights.
        </p>
      </Section>

      <Section title="6. How long we keep it">
        <p className={P}>
          Account data is kept while your account is active. Billing and tax records are kept for
          at least seven years, as Malaysian tax law requires. Bliptrace error data is deleted
          automatically at the end of the retention period of the customer&apos;s plan.
        </p>
      </Section>

      <Section title="7. Your rights">
        <ul className={UL}>
          <li>Access your personal data</li>
          <li>Correct data that is inaccurate or incomplete</li>
          <li>Withdraw consent, including for marketing</li>
          <li>Ask us to stop processing for direct marketing</li>
          <li>Ask for your data to be deleted where we no longer need to keep it</li>
        </ul>
        <p className={`${P} mt-3`}>
          Email <a href={`mailto:${SITE.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{SITE.email}</a> to
          make a request. We reply within 21 days.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p className={P}>
          Our websites use cookies that are needed to sign in and keep the service working, and
          may use analytics cookies to understand how they are used. You can block cookies in your
          browser, though some features may then stop working.
        </p>
      </Section>

      <Section title="9. Changes">
        <p className={P}>
          We may update this policy. Changes are posted on this page with a new date. See also our{' '}
          <Link to="/terms/" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>.
        </p>
      </Section>

      <Section title="10. Contact">
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

export default PrivacyPage;
