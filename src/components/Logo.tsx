import React from 'react';

const Logo = () => {
// Get the base URL from the current window location
const baseUrl = window.location.origin;

return (
<div className="flex items-center space-x-2">
    <img src={`${baseUrl}/logo.png`} alt="Developers Hub Logo" className="h-8 w-auto" />

    <span className="text-xl font-bold text-gray-700">Developers</span>
    <span className="text-lg font-medium text-gray-400">Hub</span>

</div>
);
};

export default Logo;
