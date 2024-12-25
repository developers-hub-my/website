import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

const ServiceCard = ({ icon: Icon, title, description, features }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <Icon className="w-12 h-12 text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <ChevronRight className="w-4 h-4 text-blue-600 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ServiceCard;