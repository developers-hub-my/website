const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about-us' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
  { name: 'Blog', href: 'https://blog.devhub.my', external: true },
];

const services = [
  'Education & Training',
  'Software Development',
  'IT Consultation',
  'Business Solutions',
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-baseline">
                <span className="text-lg sm:text-xl font-bold text-white">Developers</span>
                <span className="text-lg sm:text-xl font-bold text-blue-400">Hub</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              Empowering businesses through technology and innovation. Your trusted partner for
              education, software development, and IT solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    {...(link.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                    className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 sm:mb-4">
              Services
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-slate-400 text-xs sm:text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 sm:mb-4">
              Contact
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
              <li>
                <a href="mailto:hello@devhub.my" className="hover:text-white transition-colors">
                  hello@devhub.my
                </a>
              </li>
              <li>
                No.24-01, Jalan Padi Emas 2,<br />
                Bandar Baru Uda,<br />
                81200 Johor Bahru, Johor
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
              <p>© {currentYear} Developers Hub Sdn. Bhd. (202001019928 / 1376248-V)</p>
            </div>
            <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
