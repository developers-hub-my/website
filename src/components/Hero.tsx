import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>

      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <div className="absolute top-0 -left-4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-400 dark:bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-400 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400 dark:bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-20 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-400 dark:bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-float opacity-40 dark:opacity-60"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-500 dark:bg-purple-400 rounded-full animate-float animation-delay-2000 opacity-40 dark:opacity-60"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-float animation-delay-4000 opacity-40 dark:opacity-60"></div>
      <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-float animation-delay-6000 opacity-40 dark:opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900/5 dark:bg-white/10 backdrop-blur-sm border border-slate-900/10 dark:border-white/10 text-sm text-slate-600 dark:text-slate-300 mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
            Building Digital Excellence Since 2020
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            Empowering Businesses
            <br />
            <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
              Through Technology
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            We provide comprehensive solutions for education, software development,
            and IT consultation to help your organization thrive in the digital age.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <a
              href="#services"
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-slate-900/20 dark:shadow-white/10"
            >
              Explore Services
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-slate-900/5 dark:bg-white/10 backdrop-blur-sm border border-slate-900/10 dark:border-white/20 text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-900/10 dark:hover:bg-white/20 transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>

          {/* Tech Stack Pills */}
          <div className="mt-12 sm:mt-16 flex flex-wrap gap-2 sm:gap-3 justify-center px-4 sm:px-0">
            {['React', 'Laravel', 'Node.js', 'Flutter', 'AWS'].map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-900/5 dark:bg-white/5 backdrop-blur-sm border border-slate-900/10 dark:border-white/10 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-900/30 dark:hover:border-white/30 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#about-us" className="flex flex-col items-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <span className="text-xs mb-2">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
    </section>
  );
};

export default Hero;
