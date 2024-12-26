import React from 'react';
import { LucideIcon } from 'lucide-react';
import NotificationSubscribe from './notification/NotificationSubscribe';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onSubscribe: (email: string) => void;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  onSubscribe
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12 px-4">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <NotificationSubscribe onSubscribe={onSubscribe} />
    </div>
  );
};

export default EmptyState;
