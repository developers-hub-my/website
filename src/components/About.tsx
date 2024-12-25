import React from 'react';
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
    <section id="about-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">About Us</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We are committed to fostering innovation and excellence in technology education,
            helping individuals and organizations thrive in the digital era through
            comprehensive training and solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="relative group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-blue-50 rounded-xl transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
              <goal.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{goal.title}</h3>
              <p className="text-gray-600">{goal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;