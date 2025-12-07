import { Laptop, Code2, Headphones, BarChart, ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
            Our Services
          </h2>
          <div className="mt-4 w-20 h-1 bg-linear-to-r from-blue-600 to-cyan-500 mx-auto rounded-full"></div>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4 sm:px-0">
            Comprehensive solutions to drive your success in the digital world
          </p>
        </div>

        {/* Bento Grid - 4 columns layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {/* 1. Featured - Education & Training (2x2) */}
          <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 p-5 sm:p-6 lg:p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <Laptop className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-2">Education & Training</h3>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-4 flex-grow">
                Comprehensive tech education programs with hands-on workshops and industry expert-led training.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {['Certification', 'Workshops', 'Expert Training'].map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <a href="#contact" className="inline-flex items-center text-sm font-semibold group/btn">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* 2. Software Development (1x1) */}
          <div className="col-span-1 group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300">
            <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1">Software Dev</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Custom web & mobile apps</p>
          </div>

          {/* 3. IT Consultation (1x1) */}
          <div className="col-span-1 group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1">IT Consultation</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Strategy & architecture</p>
          </div>

          {/* 4. Business Solutions (1x1) */}
          <div className="col-span-1 group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300">
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-rose-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1">Business Solutions</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Automation & analytics</p>
          </div>

          {/* 5. Established 2020 (1x1) */}
          <div className="col-span-1 relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-800 p-4 sm:p-5 text-white">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
            <span className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">2020</span>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Established</p>
          </div>

          {/* 6. Technologies - Full width card (4x1) */}
          <div className="col-span-2 lg:col-span-4 relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Technologies We Work With</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Laravel', 'Node.js', 'Python', 'AWS', 'Flutter', 'TypeScript', 'PostgreSQL', 'Docker', 'Tailwind CSS'].map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 7. CTA Card (4x1) */}
          <div className="col-span-2 lg:col-span-4 relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 p-5 sm:p-6 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1">Ready to Start Your Project?</h3>
                <p className="text-slate-400 text-sm sm:text-base">Let's discuss how we can help your business grow</p>
              </div>
              <a
                href="#contact"
                className="shrink-0 inline-flex items-center px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors group"
              >
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
