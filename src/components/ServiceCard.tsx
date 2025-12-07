import { LucideIcon, ChevronRight, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

const ServiceCard = ({ icon: Icon, title, description, features }: ServiceCardProps) => {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-5 sm:p-6 lg:p-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 leading-relaxed">{description}</p>

        <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/link"
        >
          Learn More
          <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

export default ServiceCard;
