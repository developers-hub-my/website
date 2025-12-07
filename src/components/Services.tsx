import { Laptop, Code2, Headphones, BarChart, ArrowRight, CheckCircle2, Zap, Users } from 'lucide-react';

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
            Our Services
          </h2>
          <div className="mt-4 w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4 sm:px-0">
            Comprehensive solutions to drive your success in the digital world
          </p>
        </div>

        {/* Bento Grid - 4 columns layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {/* 1. Featured - Education & Training (2x2) */}
          <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 p-5 sm:p-6 lg:p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

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
          <div className="col-span-1 group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 sm:p-5 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1">Software Dev</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Custom web & mobile apps</p>
          </div>

          {/* 3. IT Consultation (1x1) */}
          <div className="col-span-1 group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 sm:p-5 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1">IT Consultation</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Strategy & architecture</p>
          </div>

          {/* 4. Business Solutions (1x1) */}
          <div className="col-span-1 group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 sm:p-5 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1">Business Solutions</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Automation & analytics</p>
          </div>

          {/* 5. Since 2020 (1x1) */}
          <div className="col-span-1 relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-950 p-4 sm:p-5 text-white">
            <Zap className="w-5 h-5 text-yellow-400 mb-2" />
            <span className="text-2xl sm:text-3xl font-bold">2020</span>
            <p className="text-xs sm:text-sm text-slate-400">Established</p>
          </div>

          {/* 6. Technologies - Full width card (4x1) */}
          <div className="col-span-2 lg:col-span-4 relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-4 sm:p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Technologies We Work With</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Laravel', 'Node.js', 'Python', 'AWS', 'Flutter', 'TypeScript', 'PostgreSQL', 'Docker', 'Tailwind CSS'].map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white dark:bg-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 7. Client Focus (1x1) */}
          <div className="col-span-1 relative overflow-hidden rounded-2xl bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-5 border border-blue-100 dark:border-blue-800">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">Client-Focused</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Tailored solutions for your needs</p>
          </div>

          {/* 8. Quality Assurance (1x1) */}
          <div className="col-span-1 relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 sm:p-5">
            <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">Quality Assured</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Tested & reliable delivery</p>
          </div>

          {/* 9. CTA Card - Full width (4x1) */}
          <div className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 p-4 sm:p-5 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">Ready to Start?</h3>
                <p className="text-emerald-100 text-xs sm:text-sm">Let's discuss your project today</p>
              </div>
              <a
                href="#contact"
                className="shrink-0 px-4 py-2 bg-white text-emerald-600 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
