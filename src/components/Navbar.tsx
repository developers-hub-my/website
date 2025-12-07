import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about-us' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700'
          : 'bg-transparent'
      }`}
    >
    <nav aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                {...(item.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
                className="px-3 lg:px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {item.name}
              </a>
            ))}
            <DarkModeToggle />
            <a
              href="#contact"
              className="ml-2 lg:ml-4 px-4 lg:px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <DarkModeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                {...(item.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
                className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              className="block mt-4 px-4 py-3 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </nav>
    </header>
  );
};

export default Navbar;
