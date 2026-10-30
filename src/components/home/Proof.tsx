import Photo from './Photo';
import { PRODUCTS } from '../../data/offer';
import { container, h2 } from './styles';

// Company facts from the company profile. No client names, no invented
// numbers: change a figure here only when the profile changes. The product
// count is read from the product list so the two cannot drift.
const live = PRODUCTS.filter((p) => p.live).length;
const FACTS = [
  { value: '2020', label: 'Founded', detail: 'The team began as Cleanique Coders.' },
  { value: '9', label: 'Systems delivered', detail: 'Delivered by the team.' },
  {
    value: String(PRODUCTS.length),
    label: 'Products of our own',
    detail: `${live} live, ${PRODUCTS.length - live} coming soon.`,
  },
  { value: '3', label: 'Sectors', detail: 'Government, higher education and industry.' },
] as const;

const Proof = () => (
  <section aria-labelledby="proof-title" className="bg-white dark:bg-slate-950 py-20 sm:py-28">
    <div className={`${container} grid lg:grid-cols-12 gap-12 items-center`}>
      <div className="lg:col-span-7 lg:order-2">
        <h2 id="proof-title" className={h2}>
          Building for Malaysia since 2020
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-800 dark:text-slate-200">
          Headquartered in Johor Bahru, working with public institutions and companies across the country.
        </p>
        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10">
          {FACTS.map((fact) => (
            <div key={fact.label} className="flex flex-col">
              <dt className="order-2 mt-2 font-semibold text-slate-900 dark:text-white">{fact.label}</dt>
              <dd className="order-1 text-5xl sm:text-6xl font-bold tracking-[-0.04em] tabular-nums text-primary-600 dark:text-primary-300">
                {fact.value}
              </dd>
              <dd className="order-3 mt-1 text-slate-700 dark:text-slate-300">{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figure className="lg:col-span-5 lg:order-1">
        <Photo
          name="group-cohort"
          widths={[640, 1200]}
          width={1600}
          height={1200}
          sizes="(min-width: 1024px) 40vw, 100vw"
          alt="Group photo of a DevHub workshop cohort with the DevHub team, seated and standing in rows."
          className="w-full h-auto rounded-xl bg-slate-100 dark:bg-slate-800"
        />
        <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          A workshop cohort with the DevHub team, 2026.
        </figcaption>
      </figure>
    </div>
  </section>
);

export default Proof;
