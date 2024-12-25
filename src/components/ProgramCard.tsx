import React from 'react';
import { LucideIcon, Clock, BarChart3, DollarSign } from 'lucide-react';

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  duration: string;
  level: string;
  description: string;
  price: string;
}

const ProgramCard = ({ icon: Icon, title, duration, level, description, price }: ProgramCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <Icon className="w-12 h-12 text-blue-600 mb-4 transform group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
            {duration}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
            {level}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-blue-600 mr-2" />
            {price}
          </div>
        </div>

        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Enroll Now
        </button>
      </div>
    </div>
  );
}

export default ProgramCard;