import React from 'react';

interface EmailInputProps {
  email: string;
  onChange: (value: string) => void;
}

const EmailInput = ({ email, onChange }: EmailInputProps) => {
  return (
    <div className="w-full">
      <label htmlFor="email-address" className="sr-only">
        Email address
      </label>
      <input
        type="email"
        name="email-address"
        id="email-address"
        autoComplete="email"
        required
        className="w-full min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:max-w-xs"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default EmailInput;
