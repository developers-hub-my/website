import React from 'react';
import ProgramCard from './ProgramCard';
import EmptyState from './EmptyState';
import { Calendar } from 'lucide-react';
import { usePrograms } from '../hooks/usePrograms';
import { useNotifications } from '../hooks/useNotifications';

const Programs = () => {
  const { programs, isEmpty } = usePrograms();
  const { handleSubscribe } = useNotifications();

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Training Programs</h2>
          <p className="mt-4 text-lg text-gray-600">
            Industry-recognized certification programs to advance your career
          </p>
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-xl shadow-md">
            <EmptyState
              icon={Calendar}
              title="No Programs Available"
              description="Subscribe to get notified when new programs are announced."
              onSubscribe={handleSubscribe}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <ProgramCard key={index} {...program} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;
