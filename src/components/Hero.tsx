import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
            Empowering Businesses Through{' '}
            <span className="text-blue-600 dark:text-blue-400">Technology</span> &{' '}
            <span className="text-blue-600 dark:text-blue-400">Innovation</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            We provide comprehensive solutions for education, software development, and IT consultation
            to help your organization thrive in the digital age.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <a
              href="#services"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-600/25"
            >
              Explore Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#about-us"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
