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
        <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Hub</span>
      </div>
    </a>
  );
};

export default Logo;
