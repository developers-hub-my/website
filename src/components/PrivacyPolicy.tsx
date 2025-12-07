import Modal from './Modal';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy = ({ isOpen, onClose }: PrivacyPolicyProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Last updated: {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            1. Introduction
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Developers Hub Sdn. Bhd. (Company No. 202001019928 / 1376248-V) ("we", "our", or "us")
            is committed to protecting and respecting your privacy in accordance with the
            Personal Data Protection Act 2010 (PDPA) of Malaysia.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            2. Information We Collect
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            We may collect and process the following personal data:
          </p>
          <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2">
            <li>Name and contact information (email address, phone number)</li>
            <li>Company or organization details</li>
            <li>Information provided through our contact forms</li>
            <li>Technical data such as IP address, browser type, and device information</li>
            <li>Usage data and website interaction patterns</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            3. Purpose of Data Collection
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Your personal data is collected for the following purposes:
          </p>
          <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2">
            <li>To respond to your inquiries and provide customer support</li>
            <li>To deliver our services, including education, training, and software development</li>
            <li>To send relevant updates, newsletters, and promotional materials (with your consent)</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations under Malaysian law</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            4. Data Protection Under PDPA 2010
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            In compliance with the Personal Data Protection Act 2010, we adhere to the following principles:
          </p>
          <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2 mt-3">
            <li><strong>General Principle:</strong> Personal data shall be processed lawfully and fairly</li>
            <li><strong>Notice and Choice Principle:</strong> You will be informed of our data processing activities</li>
            <li><strong>Disclosure Principle:</strong> Your data will not be disclosed without your consent</li>
            <li><strong>Security Principle:</strong> We implement appropriate security measures to protect your data</li>
            <li><strong>Retention Principle:</strong> Data is retained only for as long as necessary</li>
            <li><strong>Data Integrity Principle:</strong> We ensure your data is accurate and up-to-date</li>
            <li><strong>Access Principle:</strong> You have the right to access and correct your personal data</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            5. Data Sharing and Disclosure
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We do not sell, trade, or rent your personal data to third parties. We may share your
            information with trusted service providers who assist us in operating our business,
            subject to confidentiality agreements. We may also disclose your data when required
            by Malaysian law or to protect our legal rights.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            6. Data Security
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your
            personal data against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            7. Your Rights
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Under the PDPA 2010, you have the following rights:
          </p>
          <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate or incomplete data</li>
            <li>Right to withdraw consent for data processing</li>
            <li>Right to prevent processing for direct marketing purposes</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            8. Cookies
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Our website may use cookies to enhance your browsing experience. Cookies are small
            files stored on your device that help us understand how you interact with our website.
            You can choose to disable cookies through your browser settings, though this may
            affect the functionality of our website.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            9. Changes to This Policy
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on
            this page with an updated revision date. We encourage you to review this policy
            periodically.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            10. Contact Us
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            If you have any questions about this Privacy Policy or wish to exercise your rights
            under the PDPA 2010, please contact us at:
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

export default PrivacyPolicy;
