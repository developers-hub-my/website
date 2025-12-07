import Modal from './Modal';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfService = ({ isOpen, onClose }: TermsOfServiceProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Last updated: {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            1. Introduction
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            These Terms of Service ("Terms") govern your use of the website and services provided
            by Developers Hub Sdn. Bhd. (Company No. 202001019928 / 1376248-V), a company
            incorporated in Malaysia. By accessing our website or using our services, you agree
            to be bound by these Terms in accordance with the laws of Malaysia.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            2. Services
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Developers Hub provides the following services:
          </p>
          <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2">
            <li>Education and training programs in technology</li>
            <li>Software development and custom application development</li>
            <li>IT consultation and advisory services</li>
            <li>Business solutions and digital transformation services</li>
          </ul>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
            Specific terms for individual services may be outlined in separate agreements
            or contracts.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            3. User Obligations
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            By using our services, you agree to:
          </p>
          <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2">
            <li>Provide accurate and complete information when requested</li>
            <li>Use our services only for lawful purposes</li>
            <li>Not engage in any activity that disrupts or interferes with our services</li>
            <li>Comply with all applicable Malaysian laws and regulations</li>
            <li>Respect intellectual property rights of Developers Hub and third parties</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            4. Intellectual Property
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            All content on this website, including but not limited to text, graphics, logos,
            images, and software, is the property of Developers Hub Sdn. Bhd. and is protected
            under Malaysian intellectual property laws, including the Copyright Act 1987 and
            the Trademarks Act 2019. You may not reproduce, distribute, or create derivative
            works without our prior written consent.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            5. Payment Terms
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            For paid services:
          </p>
          <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2">
            <li>All fees are quoted in Malaysian Ringgit (MYR) unless otherwise stated</li>
            <li>Payment terms will be specified in the relevant service agreement or invoice</li>
            <li>Prices are subject to the prevailing Sales and Service Tax (SST) as applicable</li>
            <li>Late payments may incur additional charges as specified in the service agreement</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            6. Limitation of Liability
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            To the maximum extent permitted by Malaysian law, Developers Hub Sdn. Bhd. shall
            not be liable for any indirect, incidental, special, consequential, or punitive
            damages arising out of or related to your use of our services. Our total liability
            shall not exceed the amount paid by you for the specific service giving rise to
            the claim.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            7. Disclaimer of Warranties
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Our services are provided "as is" and "as available" without warranties of any
            kind, either express or implied. While we strive to provide accurate and up-to-date
            information, we do not warrant that our website or services will be uninterrupted,
            error-free, or free of viruses or other harmful components.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            8. Confidentiality
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Both parties agree to maintain the confidentiality of any proprietary or sensitive
            information shared during the course of our business relationship. This obligation
            shall survive the termination of any service agreement.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            9. Termination
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We reserve the right to suspend or terminate your access to our services at any
            time, with or without cause, and with or without notice. Upon termination, your
            right to use our services will immediately cease. Provisions that by their nature
            should survive termination shall remain in effect.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            10. Governing Law and Dispute Resolution
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of
            Malaysia. Any disputes arising out of or in connection with these Terms shall
            be subject to the exclusive jurisdiction of the courts of Malaysia. The parties
            agree to attempt to resolve any disputes through good faith negotiations before
            resorting to litigation.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            11. Force Majeure
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We shall not be liable for any failure or delay in performing our obligations
            due to circumstances beyond our reasonable control, including but not limited to
            natural disasters, war, terrorism, riots, government actions, or technical
            failures of the Internet.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            12. Amendments
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will be effective
            immediately upon posting on our website. Your continued use of our services after
            any changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            13. Severability
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            If any provision of these Terms is found to be unenforceable or invalid under
            Malaysian law, such provision shall be modified to the minimum extent necessary
            to make it enforceable, and the remaining provisions shall continue in full
            force and effect.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            14. Contact Information
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            For any questions regarding these Terms of Service, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
            <p className="font-medium text-slate-900 dark:text-white">Developers Hub Sdn. Bhd.</p>
            <p>No.24-01, Jalan Padi Emas 2,</p>
            <p>Bandar Baru Uda,</p>
            <p>81200 Johor Bahru, Johor, Malaysia</p>
            <p className="mt-2">Email: <a href="mailto:hello@devhub.my" className="text-blue-600 dark:text-blue-400 hover:underline">hello@devhub.my</a></p>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default TermsOfService;
