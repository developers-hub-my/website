import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import {
  SHOW_HRD_CORP,
  STAGES,
  Stage,
  trainingImage,
  trainingLogo,
  trainingPath,
  trainings,
} from '../data/trainings';
import { SITE_URL, useSeo } from '../hooks/useSeo';

// Catalogue layout modelled on g8suite.com/our-solutions: intro header, a
// facet filter rail (with counts + reset), and a flat card grid sorted by
// learning stage. Delivery format and duration are decided per run (event
// setup varies across the year) so they are deliberately not shown here —
// scheduling, pricing and registration live on GatherHub, never here.

const stageKeys = (Object.keys(STAGES) as Stage[]).sort(
  (a, b) => STAGES[a].order - STAGES[b].order,
);

const allTags = Array.from(new Set(trainings.flatMap((t) => t.tags))).sort((a, b) =>
  a.localeCompare(b),
);

// Flagship of the AI track — featured banner above the catalogue. The panel is
// deliberately dark in both themes: it frames the dark cover artwork, with the
// poster's blue→coral gradient strip as the signature accent.
const featured = trainings.find((t) => t.slug === 'augmented-developer');

// Static catalogue → static structured data. ItemList tells crawlers this is
// a catalogue page and links every course landing page for discovery.
const catalogueJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Developers Hub Trainings',
    numberOfItems: trainings.length,
    itemListElement: trainings.map((t, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t.title,
      url: `${SITE_URL}${trainingPath(t)}`,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Trainings', item: `${SITE_URL}/trainings` },
    ],
  },
];

const TrainingsIndex = () => {
  const [selectedStages, setSelectedStages] = useState<Stage[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hrdCorpOnly, setHrdCorpOnly] = useState(false);

  useSeo({
    title: 'Developer Trainings & Courses in Malaysia | Developers Hub',
    description:
      'Hands-on developer training in Malaysia — Linux, Git, Docker, modern PHP, Laravel, Flutter, APIs, AI-augmented development and software architecture. One learning path, four stages, taught by practitioners who ship production software daily.',
    path: '/trainings',
    jsonLd: catalogueJsonLd,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(
    () =>
      trainings
        .filter((t) => selectedStages.length === 0 || selectedStages.includes(t.stage))
        .filter(
          (t) => selectedTags.length === 0 || t.tags.some((tag) => selectedTags.includes(tag)),
        )
        .filter((t) => !hrdCorpOnly || t.hrdCorp)
        .sort((a, b) => STAGES[a.stage].order - STAGES[b.stage].order),
    [selectedStages, selectedTags, hrdCorpOnly],
  );

  const hasFilters = selectedStages.length > 0 || selectedTags.length > 0 || hrdCorpOnly;

  const toggle = <T,>(list: T[], value: T, set: (next: T[]) => void) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const countByStage = (stage: Stage) => trainings.filter((t) => t.stage === stage).length;
  const countByTag = (tag: string) => trainings.filter((t) => t.tags.includes(tag)).length;
  const hrdCorpCount = trainings.filter((t) => t.hrdCorp).length;

  const checkboxClass =
    'h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer';
  const filterLabelClass =
    'flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors';
  const facetTitleClass =
    'text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3';

  return (
    <main className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Trainings</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            One learning path, four stages. Hands-on courses by practitioners who ship
            production software daily — take the stage you need today, come back for the next
            as your craft matures.
          </p>
        </div>

        {/* Featured — flagship taster */}
        {featured && (
          <Link
            to={trainingPath(featured)}
            className="relative block rounded-2xl overflow-hidden bg-slate-900 shadow-lg mb-12 group"
          >
            <img
              src={trainingImage(featured, 'cover', 'dark')}
              alt=""
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-2/3 h-full object-cover object-right opacity-90 hidden sm:block"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/20" />
            <div className="relative p-8 sm:p-12 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold mb-4">
                {featured.priceNote}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {featured.title}
              </h2>
              <p className="text-slate-300 mb-6">{featured.tagline}</p>
              <span className="inline-flex items-center text-sm font-semibold text-white">
                View training
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-400" />
          </Link>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter rail */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 lg:sticky lg:top-28">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h2>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStages([]);
                      setSelectedTags([]);
                      setHrdCorpOnly(false);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h3 className={facetTitleClass}>Stage</h3>
                <div className="space-y-2">
                  {stageKeys.map((stage) => (
                    <label key={stage} className={filterLabelClass}>
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className={checkboxClass}
                          checked={selectedStages.includes(stage)}
                          onChange={() => toggle(selectedStages, stage, setSelectedStages)}
                        />
                        Stage {STAGES[stage].order} · {STAGES[stage].label}
                      </span>
                      <span className="text-xs text-gray-400">{countByStage(stage)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className={facetTitleClass}>Tags</h3>
                <div className="space-y-2">
                  {allTags.map((tag) => (
                    <label key={tag} className={filterLabelClass}>
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className={checkboxClass}
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggle(selectedTags, tag, setSelectedTags)}
                        />
                        {tag}
                      </span>
                      <span className="text-xs text-gray-400">{countByTag(tag)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {SHOW_HRD_CORP && (
                <div>
                  <h3 className={facetTitleClass}>Funding</h3>
                  <label className={filterLabelClass}>
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className={checkboxClass}
                        checked={hrdCorpOnly}
                        onChange={() => setHrdCorpOnly(!hrdCorpOnly)}
                      />
                      HRD Corp claimable
                    </span>
                    <span className="text-xs text-gray-400">{hrdCorpCount}</span>
                  </label>
                </div>
              )}
            </div>
          </aside>

          {/* Card grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {filtered.length} {filtered.length === 1 ? 'training' : 'trainings'}
            </p>

            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-10 text-center text-gray-600 dark:text-gray-300">
                No trainings match those filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((training) => {
                  const Icon = training.icon;
                  return (
                    <Link
                      key={`${training.stage}/${training.slug}`}
                      to={trainingPath(training)}
                      className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-4">
                        {training.logos?.length ? (
                          <div className="flex items-center gap-2">
                            {training.logos.slice(0, 3).map((logo) => (
                              <div
                                key={logo}
                                className="bg-white dark:bg-slate-100 border border-gray-200 dark:border-slate-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                              >
                                <img
                                  src={trainingLogo(logo)}
                                  alt={`${logo} logo`}
                                  className="w-7 h-7"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300">
                          Stage {STAGES[training.stage].order} · {STAGES[training.stage].label}
                        </span>
                      </div>

                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {training.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-1">
                        {training.tagline}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {training.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {SHOW_HRD_CORP && training.hrdCorp && (
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Award className="w-3.5 h-3.5 text-blue-600" />
                            HRD Corp claimable
                          </span>
                        )}
                        {training.priceNote && (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {training.priceNote}
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                        View details
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrainingsIndex;
