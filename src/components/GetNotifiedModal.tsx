import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { leadContext, submitLead } from '../lib/crm';

// "Get Notified" capture form — POSTs straight to the g8crm intake endpoint
// (see src/lib/crm.ts) so the visitor never leaves the page. Server-side
// validation (422) is mapped back onto the fields; only name + email are
// required, matching the LeadSubmission schema.

interface GetNotifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainingTitle: string;
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

const GetNotifiedModal = ({ isOpen, onClose, trainingTitle }: GetNotifiedModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [queued, setQueued] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  // Reset AFTER the Modal's 300ms exit transition, so the success panel (or a
  // stale error) doesn't flash back into the form mid-fade. A completed
  // submission also clears the fields so reopening starts a fresh lead.
  const handleClose = () => {
    onClose();
    window.setTimeout(() => {
      setFieldErrors({});
      setError(null);
      if (queued) {
        setQueued(false);
        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
      }
    }, 300);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setError(null);

    const result = await submitLead({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      // Lands on the contact's CRM timeline as an inbound note, so the team
      // sees which course the lead asked about.
      message: `Get Notified — ${trainingTitle}`,
      campaign: trainingTitle,
      ...leadContext(),
    });

    setSubmitting(false);
    if (result.status === 'queued') {
      setQueued(true);
    } else if (result.status === 'invalid') {
      setFieldErrors(result.errors);
      if (Object.keys(result.errors).length === 0) {
        setError('Please check your details and try again.');
      }
    } else {
      setError(result.message);
    }
  };

  const fieldError = (field: string) =>
    fieldErrors[field]?.[0] ? (
      <p className="mt-1.5 text-sm text-rose-500">{fieldErrors[field][0]}</p>
    ) : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Get Notified">
      {queued ? (
        <div className="text-center py-6">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            You&rsquo;re on the list!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-sm mx-auto">
            We&rsquo;ll email you as soon as registration opens for{' '}
            <span className="font-medium text-gray-900 dark:text-white">{trainingTitle}</span>.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="py-3 px-8 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate={false}>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Be first in line when registration opens for{' '}
            <span className="font-medium text-gray-900 dark:text-white">{trainingTitle}</span>.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="notify-name" className={labelClass}>
                Name
              </label>
              <input
                id="notify-name"
                type="text"
                required
                maxLength={255}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ali bin Abu"
                className={inputClass}
              />
              {fieldError('name')}
            </div>

            <div>
              <label htmlFor="notify-email" className={labelClass}>
                Email
              </label>
              <input
                id="notify-email"
                type="email"
                required
                maxLength={255}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@example.com"
                className={inputClass}
              />
              {fieldError('email')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="notify-phone" className={labelClass}>
                  Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="notify-phone"
                  type="tel"
                  maxLength={50}
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0123456789"
                  className={inputClass}
                />
                {fieldError('phone')}
              </div>

              <div>
                <label htmlFor="notify-company" className={labelClass}>
                  Company <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="notify-company"
                  type="text"
                  maxLength={255}
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Sdn Bhd"
                  className={inputClass}
                />
                {fieldError('company')}
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {submitting ? 'Submitting…' : 'Notify Me'}
          </button>

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            We&rsquo;ll only use your details to let you know when this course opens for
            registration.
          </p>
        </form>
      )}
    </Modal>
  );
};

export default GetNotifiedModal;
