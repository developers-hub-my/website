import React from 'react';
import ProgramCard from './ProgramCard';
import { BookOpen, Code, Server, Database } from 'lucide-react';

const programs = [
  {
    icon: Code,
    title: 'Full-Stack Development',
    duration: '24 weeks',
    level: 'Intermediate to Advanced',
    description: 'Comprehensive program covering modern web development stack.',
    price: 'RM 12,000',
  },
  {
    icon: Server,
    title: 'DevOps Engineering',
    duration: '16 weeks',
    level: 'Advanced',
    description: 'Master modern DevOps practices and tools.',
    price: 'RM 8,000',
  },
  {
    icon: Database,
    title: 'Data Engineering',
    duration: '20 weeks',
    level: 'Intermediate',
    description: 'Learn data processing, ETL, and warehousing.',
    price: 'RM 10,000',
  },
  {
    icon: BookOpen,
    title: 'Cloud Architecture',
    duration: '12 weeks',
    level: 'Advanced',
    description: 'Design and implement cloud-native solutions.',
    price: 'RM 6,000',
  },
];

const Programs = () => {
  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Training Programs</h2>
          <p className="mt-4 text-lg text-gray-600">
            Industry-recognized certification programs to advance your career
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <ProgramCard key={index} {...program} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Programs;