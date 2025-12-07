const Logo = () => {
  const baseUrl = window.location.origin;

  return (
    <a href="#home" className="flex items-center space-x-2">
      <img
        src={`${baseUrl}/logo.png`}
        alt="Developers Hub Logo"
        className="h-8 sm:h-9 w-auto"
      />
      <div className="flex items-baseline">
        <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Developers</span>
        <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">Hub</span>
      </div>
    </a>
  );
};

export default Logo;
