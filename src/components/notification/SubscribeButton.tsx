import React from 'react';
import { Bell } from 'lucide-react';

interface SubscribeButtonProps {
  isSubmitting: boolean;
}

const SubscribeButton = ({ isSubmitting }: SubscribeButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <Bell className="w-4 h-4 mr-2" />
      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
};

export default SubscribeButton;
