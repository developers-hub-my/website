import { Target, Users, Rocket, Workflow } from 'lucide-react';

const goals = [
  {
    icon: Users,
    title: 'Develop Talent',
    description: 'Through Education and Training',
  },
  {
    icon: Target,
    title: 'Strengthen Partnerships',
    description: 'With Key Stakeholders',
  },
  {
    icon: Rocket,
    title: 'Deliver Flagship Products',
    description: 'And Premium Services',
  },
  {
    icon: Workflow,
    title: 'Improve Internal Processes',
    description: 'And Optimize Workflow',
  },
];

const About = () => {
  return (
    <section id="about-us" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">About Us</h2>
          <div className="mt-4 w-20 h-1 bg-linear-to-r from-blue-600 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Company Narrative */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6">
              Building the Future of Technology in Malaysia
            </h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              <p>
                Founded in 2020, Developers Hub Sdn Bhd is committed to fostering innovation and
                excellence in technology education. We help individuals and organizations thrive
                in the digital era through comprehensive training and solutions.
              </p>
              <p>
                Our mission is to bridge the gap between education and industry by delivering
                practical, hands-on learning experiences and cutting-edge software solutions
                that drive real business results.
              </p>
              <p>
                Based in Johor Bahru, we serve clients across Malaysia and beyond, partnering
                with enterprises, startups, and educational institutions to build a stronger
                tech ecosystem.
              </p>
            </div>
          </div>

          {/* Right Column - Goals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="group p-4 sm:p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <goal.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">{goal.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{goal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
