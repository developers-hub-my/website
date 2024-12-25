import React from 'react';
import { ArrowRight, Rocket, BookOpen, Code, HeartHandshake } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Empowering Innovation Through
              <span className="text-blue-600"> Education, Technology,</span> and
              <span className="text-blue-600"> Entrepreneurship</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Join us in shaping the future of technology and education. We provide comprehensive solutions
              for individuals and businesses looking to thrive in the digital age.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center">
                Join Us <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <div className="grid grid-cols-2 gap-4 mt-8 lg:mt-0">
              {[
                { icon: Rocket, title: 'Innovation', desc: 'Cutting-edge solutions' },
                { icon: BookOpen, title: 'Education', desc: 'Expert-led training' },
                { icon: Code, title: 'Development', desc: 'Custom software solutions' },
                { icon: HeartHandshake, title: 'Partnership', desc: 'Strategic collaboration' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <item.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;