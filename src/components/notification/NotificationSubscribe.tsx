import React, { useState } from 'react';
import EmailInput from './EmailInput';
import SubscribeButton from './SubscribeButton';

interface NotificationSubscribeProps {
  onSubscribe: (email: string) => void;
}

const NotificationSubscribe = ({ onSubscribe }: NotificationSubscribeProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubscribe(email);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 sm:flex sm:max-w-md mx-auto">
      <EmailInput email={email} onChange={setEmail} />
      <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
        <SubscribeButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
};

export default NotificationSubscribe;
