import { ChevronDown } from 'lucide-react';
import { TrainingFaq } from '../data/trainings';

// Shared FAQ accordion (trainings listing + landing pages). Copy comes from
// the catalogue helpers and is mirrored into FAQPage JSON-LD by each page —
// this component only renders.
const FaqList = ({ faqs }: { faqs: TrainingFaq[] }) => (
  <div className="space-y-3">
    {faqs.map((faq) => (
      <details key={faq.q} className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm">
        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 text-sm font-semibold text-gray-900 dark:text-white">
          {faq.q}
          <ChevronDown className="w-4 h-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
        </summary>
        <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300">{faq.a}</p>
      </details>
    ))}
  </div>
);

export default FaqList;
