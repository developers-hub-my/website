import { Link } from 'react-router-dom';
import { Clock, BarChart3, MapPin, CalendarDays, ArrowRight } from 'lucide-react';
import { ClassDefinition, GatherHubEvent } from '../types/gatherhub';
import { availableTickets, formatDate, formatPrice } from '../lib/gatherhub';

interface ClassCardProps {
  classDefinition: ClassDefinition;
  event?: GatherHubEvent;
}

// Summary card for the classes index / home section. The full CTA (register →
// GatherHub) lives on the /classes/:slug detail page; the card links there.

const STATUS_BADGE: Record<string, { label: string; classes: string } | null> = {
  open: { label: 'Registration Open', classes: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  sold_out: { label: 'Sold Out', classes: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  closed: { label: 'Registration Closed', classes: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300' },
  ended: { label: 'Past Run', classes: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300' },
};

const ClassCard = ({ classDefinition, event }: ClassCardProps) => {
  const badge = event ? STATUS_BADGE[event.status] : null;
  const tickets = availableTickets(event);
  const primaryTicket = event?.status === 'open' ? tickets[0] : undefined;
  const startsAt = formatDate(event?.starts_at);

  return (
    <Link
      to={`/classes/${classDefinition.slug}`}
      className="block bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {classDefinition.title}
          </h3>
          {badge && (
            <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${badge.classes}`}>
              {badge.label}
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {classDefinition.description}
        </p>

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

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
          {primaryTicket ? (
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(primaryTicket)}
              <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">onwards</span>
            </span>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">Details &amp; next run</span>
          )}
          <span className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
            View Class <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;
