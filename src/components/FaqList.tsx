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
        <div className="px-5 pb-5 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">{faq.a}</p>
          {faq.bullets && (
            <ul className="space-y-2">
              {faq.bullets.map((bullet) => (
                <li
                  key={bullet.title ?? bullet.text}
                  className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300"
                >
                  {/* Diamond marker — echoes the landing pages' motif */}
                  <span className="mt-1.5 w-1.5 h-1.5 rotate-45 bg-blue-500 shrink-0" />
                  <span>
                    {bullet.title ? (
                      <>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {bullet.title}
                        </span>
                        {' — '}
                        {bullet.text}
                      </>
                    ) : (
                      bullet.text
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>
    ))}
  </div>
);

export default FaqList;
