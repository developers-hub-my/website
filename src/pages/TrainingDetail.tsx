import { ReactNode, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle2, ChevronDown, ShieldCheck } from 'lucide-react';
import {
  SHOW_HRD_CORP,
  STAGES,
  trainingByPath,
  trainingFaqs,
  trainingImage,
  trainingLogo,
  trainingPath,
  trainings,
} from '../data/trainings';
import { GATHERHUB_ORG_URL, SUBSCRIBE_IS_EXTERNAL, SUBSCRIBE_URL } from '../lib/gatherhub';
import { useDarkModeContext } from '../context/DarkModeContext';
import { SITE_URL, absoluteUrl, useSeo } from '../hooks/useSeo';

// Landing page copy follows AIDCA, section by section:
//   Attention  → hero (cover artwork + pain-hook headline + audience promise)
//   Interest   → "Sound familiar?" pains
//   Desire     → "What you walk away with" outcomes
//   Conviction → stat tiles + proof list
//   Action     → sticky CTA rail (desktop) / sticky bottom bar (mobile)
// The eyebrow rule and diamond markers echo the social-kit posters (their
// blue→coral gradient strip and diamond motif) so page and artwork read as
// one system. Delivery format and duration are decided per run — never shown.

const gradientStrip = 'bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-400';

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 dark:text-rose-400 mb-3">
    <span className={`h-px w-8 ${gradientStrip}`} />
    {children}
  </p>
);

const TrainingDetail = () => {
  const { stage, slug } = useParams<{ stage: string; slug: string }>();
  const training = stage && slug ? trainingByPath(stage, slug) : undefined;
  const { isDark } = useDarkModeContext();
  // Social-kit artwork ships in dark + light variants — match the site theme.
  const theme = isDark ? 'dark' : 'light';

  // SEO: OG image is always the light cover so social previews don't depend on
  // the visitor's theme. Course + BreadcrumbList schema come from the same
  // catalogue copy — no pricing/schedule (those live on GatherHub, contract rule).
  useSeo(
    training
      ? {
          title: `${training.title} Training | Developers Hub Malaysia`,
          description: training.tagline,
          path: trainingPath(training),
          image: trainingImage(training, 'cover', 'light'),
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: training.title,
              description: training.tagline,
              url: absoluteUrl(trainingPath(training)),
              image: absoluteUrl(trainingImage(training, 'cover', 'light')),
              provider: {
                '@type': 'Organization',
                name: 'Developers Hub Sdn Bhd',
                url: SITE_URL,
              },
              educationalLevel: STAGES[training.stage].label,
              about: training.tags,
              teaches: training.outcomes,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: trainingFaqs(training).map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Trainings',
                  item: `${SITE_URL}/trainings`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: training.title,
                  item: absoluteUrl(trainingPath(training)),
                },
              ],
            },
          ],
        }
      : {
          title: 'Training Not Found — Developers Hub',
          description: 'The training you are looking for does not exist or may have moved.',
          path: '/trainings',
          noindex: true,
        },
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [training]);

  if (!training) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Training not found
          </h1>
          <Link to="/trainings" className="text-blue-600 dark:text-blue-400 hover:underline">
            Browse all trainings
          </Link>
        </div>
      </main>
    );
  }

  const stageInfo = STAGES[training.stage];
  const faqs = trainingFaqs(training);
  const related = trainings
    .filter((t) => t.stage === training.stage && t.slug !== training.slug)
    .slice(0, 3);

  const primaryCta = GATHERHUB_ORG_URL
    ? { href: GATHERHUB_ORG_URL, label: 'See Available Sessions', external: true }
    : { href: SUBSCRIBE_URL, label: 'Get Notified', external: SUBSCRIBE_IS_EXTERNAL };

  const ctaButtons = (
    <>
      <a
        href={primaryCta.href}
        {...(primaryCta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="block w-full py-3 px-6 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
      >
        {primaryCta.label}
      </a>
      {GATHERHUB_ORG_URL && (
        <a
          href={SUBSCRIBE_URL}
          {...(SUBSCRIBE_IS_EXTERNAL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="block w-full py-3 px-6 text-center font-semibold rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Get Notified
        </a>
      )}
    </>
  );

  return (
    <main className="pt-24 pb-24 lg:pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/trainings"
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> All trainings
        </Link>

        {/* Attention — hero */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden mb-12">
          <img
            src={trainingImage(training, 'cover', theme)}
            alt={`${training.title} — course poster`}
            className="w-full aspect-video object-cover"
          />
          <div className="p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {training.logos?.map((logo) => (
                <div
                  key={logo}
                  className="bg-white dark:bg-slate-100 border border-gray-200 dark:border-slate-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm shrink-0"
                >
                  <img src={trainingLogo(logo)} alt={`${logo} logo`} className="w-7 h-7" />
                </div>
              ))}
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300">
                Stage {stageInfo.order} · {stageInfo.label}
              </span>
            </div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              {training.title}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {training.headline}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{training.audience}</p>

            {/* Delivery format and duration are decided per run — tags only here */}
            <div className="flex flex-wrap items-center gap-2">
              {training.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {SHOW_HRD_CORP && training.hrdCorp && (
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <Award className="w-4 h-4 text-blue-600" /> HRD Corp claimable
                </span>
              )}
              {training.priceNote && (
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {training.priceNote}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          {/* Content column */}
          <div>
            {/* Interest — pains */}
            <section className="mb-14">
              <Eyebrow>The problem</Eyebrow>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Sound familiar?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {training.pains.map((pain) => (
                  <div
                    key={pain}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 flex items-start gap-3"
                  >
                    <span className="mt-1.5 w-2 h-2 rotate-45 bg-rose-400 shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">{pain}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Course visual from the marketing kit */}
            <img
              src={trainingImage(training, 'diagram', theme)}
              alt={`${training.title} — course visual`}
              className="w-full rounded-2xl shadow-md mb-14"
              loading="lazy"
            />

            {/* Desire — outcomes */}
            <section className="mb-14">
              <Eyebrow>What you leave with</Eyebrow>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                What you walk away with
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Not notes — artifacts you built yourself, ready to use on Monday.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {training.outcomes.map((outcome) => (
                  <div
                    key={outcome}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Conviction — stats + proof */}
            <section className="mb-14">
              <Eyebrow>The proof</Eyebrow>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why this course delivers
              </h2>
              {training.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
                  {training.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 text-center"
                    >
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
              <ul className="space-y-4">
                {training.proof.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-gray-600 dark:text-gray-300">{point}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Objections — FAQ, mirrored into FAQPage JSON-LD via trainingFaqs.
                Sits right before the CTA so unanswered doubts don't block Action. */}
            <section className="mb-14">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently asked
              </h2>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 text-sm font-semibold text-gray-900 dark:text-white">
                      {faq.q}
                      <ChevronDown className="w-4 h-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Action — full-width CTA (all viewports) */}
            <section className="relative bg-blue-600 dark:bg-blue-700 rounded-2xl shadow-md p-8 sm:p-10 text-center overflow-hidden mb-14">
              <h2 className="text-2xl font-bold text-white mb-3">Ready to take a seat?</h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Dates, venues, pricing and registration are on our GatherHub page. No run
                scheduled yet? Get notified and be first in line when registration opens.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                {ctaButtons}
              </div>
              <div className={`absolute bottom-0 inset-x-0 h-1 ${gradientStrip}`} />
            </section>

            {/* Related trainings, same stage */}
            {related.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  More in Stage {stageInfo.order} · {stageInfo.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      to={trainingPath(item)}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-5"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.headline}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky CTA rail (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden">
                <div className={`h-1.5 ${gradientStrip}`} />
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {training.logos?.map((logo) => (
                      <div
                        key={logo}
                        className="bg-white dark:bg-slate-100 border border-gray-200 dark:border-slate-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                      >
                        <img src={trainingLogo(logo)} alt={`${logo} logo`} className="w-6 h-6" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {training.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Stage {stageInfo.order} · {stageInfo.label}
                  </p>
                  {training.priceNote && (
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
                      {training.priceNote}
                    </p>
                  )}
                  <div className="space-y-3">{ctaButtons}</div>
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Dates, venues and pricing live on our GatherHub page.
                  </p>
                </div>
              </div>
              <img
                src={trainingImage(training, 'quote', theme)}
                alt={`${training.title} — tagline poster`}
                className="w-full rounded-2xl shadow-md"
                loading="lazy"
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky bottom CTA bar (mobile) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-gray-200 dark:border-slate-700 p-3">
        <a
          href={primaryCta.href}
          {...(primaryCta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="block w-full py-3 px-6 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {primaryCta.label}
        </a>
      </div>
    </main>
  );
};

export default TrainingDetail;
