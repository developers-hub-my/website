import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Program {
  /** Required by ProgramCard. Absent here until now, which only went unnoticed
      because defaultPrograms is empty and nothing ever rendered a card. */
  icon: LucideIcon;
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
