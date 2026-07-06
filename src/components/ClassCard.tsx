import { Clock, BarChart3, MapPin, CalendarDays } from 'lucide-react';
import { ClassDefinition, GatherHubEvent, GatherHubTicket } from '../types/gatherhub';

interface ClassCardProps {
  classDefinition: ClassDefinition;
  event?: GatherHubEvent;
}

// CTA rules follow the GatherHub landing contract (workspace doc 10):
// - open → register CTA linking register_url
// - only available tickets are shown; the cheapest is the primary price and a
//   pricier available one is struck through (early-bird without name-matching)
// - remaining_band renders copy only — never seat numbers
// - sold_out / closed / ended / no UUID → waitlist CTA
// - availability flags are rendered verbatim, never re-computed here

function formatPrice(ticket: GatherHubTicket): string {
  const prefix = ticket.currency === 'MYR' ? 'RM' : ticket.currency;
  return `${prefix} ${ticket.price.toLocaleString('en-MY')}`;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const BAND_COPY: Record<string, string | null> = {
  available: null,
  low: 'Seats are running low',
  last_few: 'Last few seats',
  none: null,
};

const ClassCard = ({ classDefinition, event }: ClassCardProps) => {
  const isOpen = event?.status === 'open';
  const isSoldOut = event?.status === 'sold_out';

  const availableTickets = (event?.tickets ?? [])
    .filter((ticket) => ticket.available)
    .sort((a, b) => a.price - b.price);
  const primaryTicket = availableTickets[0];
  const struckTicket = availableTickets.find((ticket) => ticket.price > (primaryTicket?.price ?? 0));

  const bandCopy = isOpen ? BAND_COPY[event.seats.remaining_band] : null;
  const startsAt = formatDate(event?.starts_at ?? null);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {classDefinition.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{classDefinition.description}</p>

        <div className="space-y-2 mb-4">
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
            </div>
          )}
          {event?.venue && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-blue-600 mr-2" />
              {event.venue}
            </div>
          )}
        </div>

        {isOpen && primaryTicket && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(primaryTicket)}
            </span>
            {struckTicket && (
              <span className="ml-2 text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(struckTicket)}
              </span>
            )}
            {bandCopy && (
              <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">{bandCopy}</p>
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
            className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Register Now
          </a>
        ) : (
          <a
            href="#contact"
            className="block w-full py-2 px-4 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 text-center border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Get Notified
          </a>
        )}
      </div>
    </div>
  );
};

export default ClassCard;
