import React from 'react';
import { Laptop, Code2, Headphones, BarChart } from 'lucide-react';
import ServiceCard from './ServiceCard';

const services = [
  {
    icon: Laptop,
    title: 'Education and Training',
    description: 'Comprehensive tech education programs designed for modern industry needs.',
    features: ['Professional Certification', 'Hands-on Workshops', 'Industry Expert Training'],
  },
  {
    icon: Code2,
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business requirements.',
    features: ['Web Applications', 'Mobile Apps', 'Enterprise Solutions'],
  },
  {
    icon: Headphones,
    title: 'IT Consultation',
    description: 'Expert guidance for your technology implementation and strategy.',
    features: ['Tech Strategy', 'System Architecture', 'Digital Transformation'],
  },
  {
    icon: BarChart,
    title: 'Business Solutions',
    description: 'End-to-end business technology solutions for optimal growth.',
    features: ['Process Automation', 'Data Analytics', 'Cloud Solutions'],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive solutions to drive your success in the digital world
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;