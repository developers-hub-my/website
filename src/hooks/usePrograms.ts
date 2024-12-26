import { useState } from 'react';
import { Code, Server, Database, BookOpen } from 'lucide-react';

const defaultPrograms = [
//   {
//     icon: Code,
//     title: 'Full-Stack Development',
//     duration: '24 weeks',
//     level: 'Intermediate to Advanced',
//     description: 'Comprehensive program covering modern web development stack.',
//     price: 'RM 12,00',
//   },
];

export const usePrograms = () => {
  const [programs, setPrograms] = useState(defaultPrograms);
  const [showAll, setShowAll] = useState(true);

  const handleShowPrograms = () => {
    setShowAll(true);
    setPrograms(defaultPrograms);
  };

  return {
    programs,
    showAll,
    handleShowPrograms,
    isEmpty: !showAll || programs.length === 0,
  };
};
