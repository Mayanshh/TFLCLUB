'use client';

import React, { useMemo } from 'react';
import CutoutParallax from '../effects/CutOutParallax';
import {useDevice} from '@/hooks/useDevice';

// -----------------------------
// TYPES
// -----------------------------
interface ProjectItem {
  id: string;
  src: string;
  title: string;

  // Desktop layout (unchanged)
  desktop: {
    width: string;
    height: string;
  };

  // Mobile layout (clean override)
  mobile?: {
    width?: string;
    height?: string;
  };
}

interface ProjectRow {
  items: ProjectItem[];
  rowClassName?: string;
}

// -----------------------------
// DATA (BACKEND READY)
// -----------------------------
const PROJECTS_CONFIG: ProjectRow[] = [
  {
    items: [
      {
        id: '1',
        src: '/images/parallax1.avif',
        title:
          'Structured daily routines at scenic locations across India. Build discipline away from the noise.',
        desktop: { width: '48vw', height: '80vh' },
      },
      {
        id: '2',
        src: '/images/parallax2.avif',
        title:
          'Trade alongside profitable mentors in real-time. Watch, learn, and execute with a 100K tournament account.',
        desktop: { width: '48%', height: '60vh' },
      },
    ],
  },
  {
    rowClassName: 'lg:pl-[7.5em] lg:pr-[3.5em]',
    items: [
      {
        id: '3',
        src: '/images/parallax3.avif',
        title:
          "Connect with India's most profitable traders. Learn their strategies, psychology, and risk management.",
        desktop: { width: '45vw', height: '52vh' },
        mobile: { height: '45vh' }, // 👈 clean override
      },
      {
        id: '4',
        src: '/images/parallax4.avif',
        title:
          'Closed tournament with real funded accounts as prizes — 100K, 50K, and 25K prop firm accounts.',
        desktop: { width: '36.5vw', height: '66vh' },
      },
    ],
  },
  {
    items: [
      {
        id: '5',
        src: '/images/parallax5.avif',
        title:
          'Get a personalised trading behaviour report and document your progress with like-minded creators.',
        desktop: { width: '45vw', height: '50vh' },
      },
      {
        id: '6',
        src: '/images/parallax6.avif',
        title:
          'Priority support, prop firm cashback, and access to every future opportunity — forever.',
        desktop: { width: '48vw', height: '80vh' },
      },
    ],
  },
];

// -----------------------------
// COMPONENT
// -----------------------------
const Projects: React.FC = () => {
  const { isMobile } = useDevice(); // ✅ use central hook

  // Parallax speed (stable)
  const parallaxSpeed = useMemo(() => (isMobile ? 5 : 15), [isMobile]);

  return (
    <section
      id="about"
      className="relative z-20 w-full bg-[#fffef1] px-4 lg:px-8 pt-[5vh] lg:pt-[10vh]"
    >
      {/* -----------------------------
          HEADER
      ----------------------------- */}
      <div className="w-full mb-10 lg:mb-20">
        <p className="text-black uppercase font-light tracking-[0.2em] mb-6 text-xs md:text-sm">
          What is TFLCLUB
        </p>

        <h1 className="font-bold dirtyline text-black leading-[0.95]
          text-[clamp(2.5rem,6vw,4.5rem)] max-w-[90%] lg:max-w-[70vw]"
        >
          Not a course. An experience.
        </h1>
      </div>

      {/* -----------------------------
          PROJECT GRID
      ----------------------------- */}
      <div className="flex flex-col items-center">

        {PROJECTS_CONFIG.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`
              flex flex-col lg:flex-row justify-between items-center lg:items-start
              w-full min-h-auto lg:min-h-screen
              pt-[5vh] lg:pt-[10vh]
              gap-10 lg:gap-0
              ${row.rowClassName || ''}
            `}
          >
            {row.items.map((project) => {
              const width = isMobile
                ? project.mobile?.width || '90vw'
                : project.desktop.width;

              const height = isMobile
                ? project.mobile?.height || '50vh'
                : project.desktop.height;

              return (
                <CutoutParallax
                  key={project.id}
                  inset="0"
                  src={project.src}
                  title={project.title}
                  width={width}
                  height={height}
                  speed={parallaxSpeed}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;