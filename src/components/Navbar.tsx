import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

// Internal destinations use <Link> so navigation stays client-side after
// hydration; only the external company profile is a plain anchor. Rendering an
// internal route as <a href> would work — every URL is a real document now —
// but it would reload the whole app on every menu click.
const NavLink = ({ item, className, onClick }: { item: NavItem; className: string; onClick?: () => void }) =>
  item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {item.name}
    </a>
  ) : (
    <Link to={item.href} className={className} onClick={onClick}>
      {item.name}
    </Link>
  );

const companyProfileUrl = import.meta.env.VITE_COMPANY_PROFILE_URL;

const navItems: NavItem[] = [
  // Real URLs now that the pages exist. The old `/#about-us` form scrolled on
  // the homepage and went nowhere from any other page, so /about/ and
  // /contact/ had no inbound link in the primary navigation at all.
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about/' },
  { name: 'Services', href: '/services/' },
  { name: 'Technologies', href: '/technologies/' },
  { name: 'Trainings', href: '/trainings/' },
  { name: 'Blog', href: '/blog/' },
  { name: 'Contact', href: '/contact/' },
  ...(companyProfileUrl ? [{ name: 'Company Profile', href: companyProfileUrl, external: true }] : []),
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
              <NavLink
                key={item.name}
                item={item}
                className="px-3 lg:px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
              />
            ))}
            <DarkModeToggle />
            <Link
              to="/contact/"
              className="ml-2 lg:ml-4 px-4 lg:px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get in Touch
            </Link>
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
              <NavLink
                key={item.name}
                item={item}
                className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              />
            ))}
            <Link
              to="/contact/"
              className="block mt-4 px-4 py-3 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </nav>
    </header>
  );
};

export default Navbar;
