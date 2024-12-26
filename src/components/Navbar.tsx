import React, { useState, useEffect } from 'react';
import { Menu, X, Code2, MessageSquare, Home, Users, Newspaper } from 'lucide-react';
import Logo from './Logo';

interface NavItem {
  name: string;
  icon: React.ElementType;
  url?: string;
}

const navItems: NavItem[] = [
  { name: 'Home', icon: Home },
  { name: 'About Us', icon: Users },
  { name: 'Services', icon: Code2 },
  { name: 'Blog', icon: Newspaper, url: 'https://blog.devhub.my' },
  { name: 'Contact', icon: MessageSquare },
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

  const renderNavLink = (item: NavItem) => {
    const linkProps = item.url
      ? {
          href: item.url,
          target: "_blank",
          rel: "noopener noreferrer"
        }
      : {
          href: `#${item.name.toLowerCase().replace(' ', '-')}`
        };

    return (
      <a
        key={item.name}
        {...linkProps}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      >
        <item.icon className="w-4 h-4 mr-1" />
        {item.name}
      </a>
    );
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map(renderNavLink)}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navItems.map((item) => {
              const linkProps = item.url
                ? {
                    href: item.url,
                    target: "_blank",
                    rel: "noopener noreferrer"
                  }
                : {
                    href: `#${item.name.toLowerCase().replace(' ', '-')}`
                  };

              return (
                <a
                  key={item.name}
                  {...linkProps}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
