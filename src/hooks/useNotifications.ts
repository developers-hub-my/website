import { useState } from 'react';

export const useNotifications = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (email: string) => {
    // In a real app, this would call an API endpoint
    setIsSubscribed(true);
    setEmail(email);
  };

  return {
    email,
    setEmail,
    isSubscribed,
    handleSubscribe,
  };
};
