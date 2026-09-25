import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ChevronDown, Menu, X } from 'lucide-react';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

// A group renders as a disclosure menu on desktop and flattens on mobile.
interface NavGroup {
  name: string;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

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

// Kept to four top-level entries so the bar reads calm. Home is the logo and
// Contact is the "Get in Touch" button, so neither needs its own item. Group
// children are always in the server-rendered DOM (hidden with CSS, never
// mounted on click) so the prerendered HTML keeps every link crawlable.
const navEntries: NavEntry[] = [
  {
    name: 'Services',
    children: [
      { name: 'All Services', href: '/services/' },
      { name: 'Technologies', href: '/technologies/' },
    ],
  },
  { name: 'Trainings', href: '/trainings/' },
  { name: 'Resources', href: '/resources/' },
  {
    name: 'About',
    children: [
      { name: 'About DevHub', href: '/about/' },
      ...(companyProfileUrl ? [{ name: 'Company Profile', href: companyProfileUrl, external: true }] : []),
    ],
  },
];

// A one-child group is just a link: without a company profile URL, "About"
// stays a direct link instead of a menu with a single entry.
const asLink = (entry: NavEntry): NavItem | null =>
  'href' in entry ? entry : entry.children.length === 1 ? { ...entry.children[0], name: entry.name } : null;

const mobileItems: NavItem[] = navEntries.flatMap((e) => ('href' in e ? [e] : e.children));

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-900';
const topItemClass = `px-3 lg:px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 ${focusRing}`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Close an open menu on outside click or Escape. Effect-only, so SSR-safe.
  useEffect(() => {
    if (!openGroup) return;
    const onPointer = (e: MouseEvent) => {
      if (!desktopRef.current?.contains(e.target as Node)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      desktopRef.current?.querySelector<HTMLButtonElement>(`[data-group="${openGroup}"]`)?.focus();
      setOpenGroup(null);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [openGroup]);

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
          <div ref={desktopRef} className="hidden md:flex md:items-center md:space-x-1">
            {navEntries.map((entry) => {
              const link = asLink(entry);
              if (link) return <NavLink key={entry.name} item={link} className={topItemClass} />;
              const group = entry as NavGroup;
              const open = openGroup === group.name;
              const menuId = `nav-menu-${group.name.toLowerCase()}`;
              return (
                <div key={group.name} className="relative">
                  <button
                    type="button"
                    data-group={group.name}
                    aria-expanded={open}
                    aria-controls={menuId}
                    onClick={() => setOpenGroup(open ? null : group.name)}
                    className={`inline-flex items-center gap-1 ${topItemClass}`}
                  >
                    {group.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <ul
                    id={menuId}
                    className={`${open ? 'block' : 'hidden'} absolute left-0 top-full mt-2 min-w-48 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg`}
                  >
                    {group.children.map((child) => (
                      <li key={child.name}>
                        <NavLink
                          item={child}
                          onClick={() => setOpenGroup(null)}
                          className={`block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors ${focusRing}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <DarkModeToggle />
            <Link
              to="/contact/"
              className={`ml-2 lg:ml-4 px-4 lg:px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors ${focusRing}`}
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
              className={`inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${focusRing}`}
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
            {mobileItems.map((item) => (
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
