import { ArrowUpRight, CircleCheck, Clock } from 'lucide-react';
import { PRODUCTS, productHref } from '../../data/offer';
import { trackCta } from '../../lib/track';
import { container } from './styles';

const linkClass =
  'inline-flex items-center gap-1 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800';

// g8suite: DevHub's own products. A dark field in both themes; status is said
// in words with an icon, never by colour alone.
const Products = () => (
  <section id="products" aria-labelledby="products-title" className="bg-slate-900 dark:bg-black py-20 sm:py-28 text-white scroll-mt-20">
    <div className={container}>
      <div className="grid lg:grid-cols-12 gap-6 items-end">
        <h2 id="products-title" className="lg:col-span-7 text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-tight">
          Our own products: the g8suite
        </h2>
        <p className="lg:col-span-5 text-lg leading-relaxed text-slate-200">
          Built and supported by the DevHub team. Install them on your own servers or use them hosted.
        </p>
      </div>

      <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTS.map((product) => {
          const href = product.url ? productHref(product.url) : null;
          const host = product.url ? new URL(product.url).host : null;
          return (
            <li key={product.key} className="flex flex-col rounded-xl bg-slate-800 p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="grid place-items-center w-14 h-14 rounded-lg bg-white">
                  <img
                    src={`/images/home/marks/${product.key}.svg`}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-9 h-9 object-contain"
                  />
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-200">
                  {product.live ? (
                    <CircleCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-300" aria-hidden="true" />
                  )}
                  {product.live ? `Live · ${product.delivery}` : 'Coming soon'}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold">{product.name}</h3>
              <p className="mt-2 leading-relaxed text-slate-200 grow">{product.line}</p>
              {href && host && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className={`mt-5 self-start ${linkClass}`}
                  onClick={() => trackCta('home_products', product.name, href)}
                >
                  {host}
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default Products;
