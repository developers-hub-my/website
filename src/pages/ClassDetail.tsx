import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, BarChart3, MapPin, CalendarDays } from 'lucide-react';
import { availableTickets, BAND_COPY, classBySlug, eventFor, formatDate, formatPrice } from '../lib/gatherhub';

// CTA rules follow the GatherHub landing contract (workspace doc 10):
// - open → register CTA linking register_url (redirects to GatherHub checkout)
// - only available tickets are shown; the cheapest is the primary price and a
//   pricier available one is struck through (early-bird without name-matching)
// - remaining_band renders copy only — never seat numbers
// - sold_out / closed / ended / no UUID → waitlist CTA
// - availability flags are rendered verbatim, never re-computed here

const ClassDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const classDefinition = slug ? classBySlug(slug) : undefined;

  useEffect(() => {
    document.title = classDefinition
      ? `${classDefinition.title} — Developers Hub`
      : 'Class Not Found — Developers Hub';
    window.scrollTo(0, 0);
  }, [classDefinition]);

  if (!classDefinition) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Class not found</h1>
          <Link to="/classes" className="text-blue-600 dark:text-blue-400 hover:underline">
            Browse all classes
          </Link>
        </div>
      </main>
    );
  }

  const event = eventFor(classDefinition);
  const isOpen = event?.status === 'open';
  const isSoldOut = event?.status === 'sold_out';

  const tickets = availableTickets(event);
  const primaryTicket = tickets[0];
  const struckTicket = tickets.find((ticket) => ticket.price > (primaryTicket?.price ?? 0));
  const bandCopy = isOpen ? BAND_COPY[event.seats.remaining_band] : null;

  const startsAt = formatDate(event?.starts_at);
  const endsAt = formatDate(event?.ends_at);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/classes"
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> All classes
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {classDefinition.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{classDefinition.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                {classDefinition.duration}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
                {classDefinition.level}
              </div>
              {startsAt && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CalendarDays className="w-4 h-4 text-blue-600 mr-2" />
                  {startsAt}
                  {endsAt && endsAt !== startsAt ? ` – ${endsAt}` : ''}
                </div>
              )}
              {event?.venue && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                  {event.venue}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
              {isOpen && primaryTicket && (
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(primaryTicket)}
                  </span>
                  {struckTicket && (
                    <span className="ml-3 text-lg text-gray-400 dark:text-gray-500 line-through">
                      {formatPrice(struckTicket)}
                    </span>
                  )}
                  {bandCopy && (
                    <p className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                      {bandCopy}
                    </p>
                  )}
                </div>
              )}

              {isSoldOut && (
                <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Sold out — get notified for the next run.
                </p>
              )}

              {isOpen ? (
                <a
                  href={event.register_url}
                  className="inline-block py-3 px-8 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Register Now
                </a>
              ) : (
                <a
                  href="/#contact"
                  className="inline-block py-3 px-8 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 text-center border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  Get Notified
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClassDetail;
