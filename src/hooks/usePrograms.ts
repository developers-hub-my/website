import { useState } from 'react';

interface Program {
  title: string;
  duration: string;
  level: string;
  description: string;
  price: string;
}

const defaultPrograms: Program[] = [];

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
