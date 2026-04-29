'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CutoutParallax from '../effects/CutOutParallax';


interface ProjectItem {
  id: string;
  src: string;
  title: string;
  desktopWidth: string;
  desktopHeight: string;
}

interface ProjectRow {
  items: ProjectItem[];
  rowClassName?: string;
}


const useIsMobile = (breakpoint = 1024): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    
    // Set initial value
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
};

// --- Data Configuration ---
const PROJECTS_CONFIG: ProjectRow[] = [
  {
    items: [
      { id: '1', src: '/images/parallax1.avif', title: 'Structured daily routines at scenic locations across India. Build discipline away from the noise.', desktopWidth: '48vw', desktopHeight: '80vh' },
      { id: '2', src: '/images/parallax2.avif', title: 'Trade alongside profitable mentors in real-time. Watch, learn, and execute with a 100K tournament account.', desktopWidth: '48%', desktopHeight: '40vh' },
    ],
  },
  {
    rowClassName: 'lg:pl-[7.5em] lg:pr-[3.5em]',
    items: [
      { id: '3', src: '/images/parallax3.avif', title: "Connect with India's most profitable traders. Learn their strategies, psychology, and risk management.", desktopWidth: '45vw', desktopHeight: '52vh' },
      { id: '4', src: '/images/parallax4.avif', title: 'Closed tournament with real funded accounts as prizes — 100K, 50K, and 25K prop firm accounts.', desktopWidth: '36.5vw', desktopHeight: '66vh' },
    ],
  },
  {
    items: [
      { id: '5', src: '/images/parallax5.avif', title: 'Get a personalised trading behaviour report and document your progress with like-minded creators.', desktopWidth: '45vw', desktopHeight: '50vh' },
      { id: '6', src: '/images/parallax6.avif', title: 'Priority support, prop firm cashback, and access to every future opportunity — forever.', desktopWidth: '48vw', desktopHeight: '80vh' },
    ],
  },
];

const Projects: React.FC = () => {
  const isMobile = useIsMobile();

  // Memoize the speed calculation to prevent re-renders during state updates
  const parallaxSpeed = useMemo(() => (isMobile ? 5 : 15), [isMobile]);

  return (
    <section
      id="projects-section"
      className="relative z-20 w-full h-auto lg:h-[340vh] bg-[#fffef1] px-4 lg:px-8 pt-[5vh] lg:pt-[10vh]"
    >
        <div className='h-[15vh] w-full'>
            <p className="text-black uppercase font-light tracking-[0.2em] mb-8 ml-1 text-xs md:text-sm">
           What is TFLCLUB
          </p>
        <h1 className="font-bold max-w-[70vw] lg:text-left dirtyline text-5xl md:text-6xl text-black tracking-normal leading-[0.95]">
          Not a course. An experience.
        </h1>
        </div>
      <div className="flex flex-col items-center justify-start gap-10 lg:gap-0">
        {PROJECTS_CONFIG.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`
              flex flex-col lg:flex-row justify-between items-center lg:items-start 
              w-full h-auto lg:h-screen pt-[5vh] lg:pt-[10vh] gap-10 lg:gap-0
              ${row.rowClassName || ''}
            `}
          >
            {row.items.map((project) => (
              <CutoutParallax
                key={project.id}
                inset="0"
                src={project.src}
                title={project.title}
                width={isMobile ? "90vw" : project.desktopWidth}
                height={isMobile ? (rowIndex === 1 && project.id === '3' ? "45vh" : "50vh") : project.desktopHeight}
                speed={parallaxSpeed}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;