import { Moon, Sun } from 'lucide-react';
import { useDarkModeContext } from '../context/DarkModeContext';

const DarkModeToggle = () => {
  const { isDark, toggle } = useDarkModeContext();

  return (
    <button
      onClick={toggle}
      type="button"
      className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default DarkModeToggle;
