import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import type { Crumb } from '../lib/schema';

// The visible half of the breadcrumb contract.
//
// Requirement R8 is that the BreadcrumbList in the graph matches the trail the
// visitor sees, in the same order. Both are rendered from the same `crumbs`
// array a page declares once — the schema through breadcrumbNode(), the markup
// through here — so the two cannot drift apart. Never build one without the
// other.
//
// The last crumb is the current page: it carries no link, because linking a
// page to itself is noise for both the reader and the crawler.

const Breadcrumbs = ({ crumbs }: { crumbs: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="mb-6">
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <li key={`${crumb.name}-${index}`} className="flex items-center gap-x-1.5">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            {isLast || !crumb.path ? (
              <span className="font-medium text-slate-700 dark:text-slate-300" aria-current="page">
                {crumb.name}
              </span>
            ) : (
              <Link to={crumb.path} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {crumb.name}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
