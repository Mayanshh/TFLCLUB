'use client';
import React, { useMemo } from 'react';
import CutoutParallax from '../effects/CutOutParallax';
import { useDevice } from '@/hooks/useDevice';

// -----------------------------
// TYPES
// -----------------------------
interface ProjectItem {
  id: string;
  src: string;
  title: string;

  desktop: {
    width: string;
    height: string;
  };

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
// DATA (3 COLUMNS, 2 ROWS)
// -----------------------------
const PROJECTS_CONFIG: ProjectRow[] = [
  {
    // ROW 1
    items: [
      {
        id: '1',
        src: '/images/parallax1.avif',
        title: 'Structured daily routines at scenic locations across India. Build discipline away from the noise.',
        desktop: { width: '28vw', height: '65vh' }, // Increased height, decreased width
      },
      {
        id: '2',
        src: '/images/parallax2.avif',
        title: 'Trade alongside profitable mentors in real-time. Watch, learn, and execute with a 100K tournament account.',
        desktop: { width: '28vw', height: '65vh' },
      },
      {
        id: '3',
        src: '/images/parallax3.avif',
        title: "Connect with India's most profitable traders. Learn their strategies, psychology, and risk management.",
        desktop: { width: '28vw', height: '65vh' },
      },
    ],
  },
  {
    // ROW 2
    items: [
      {
        id: '4',
        src: '/images/parallax4.avif',
        title: 'Closed tournament with real funded accounts as prizes — 100K, 50K, and 25K prop firm accounts.',
        desktop: { width: '28vw', height: '65vh' },
      },
      {
        id: '5',
        src: '/images/parallax5.avif',
        title: 'Get a personalised trading behaviour report and document your progress with like-minded creators.',
        desktop: { width: '28vw', height: '65vh' },
      },
      {
        id: '6',
        src: '/images/parallax6.avif',
        title: 'Priority support, prop firm cashback, and access to every future opportunity — forever.',
        desktop: { width: '28vw', height: '65vh' },
      },
    ],
  },
];

// -----------------------------
// COMPONENT
// -----------------------------
const Projects: React.FC = () => {
  const { isMobile } = useDevice();

  const parallaxSpeed = useMemo(() => (isMobile ? 5 : 15), [isMobile]);

  return (
    <section
      id="about"
      className="relative z-20 w-full bg-[#fffef1] px-4 lg:px-8 pt-[5vh] lg:pt-[10vh]"
    >
      {/* HEADER */}
      <div className="w-full mb-10 lg:mb-20">
        <p className="text-black uppercase font-light tracking-[0.2em] mb-6 text-xs md:text-sm">
          What is TFLCLUB
        </p>

        <h1 className="font-bold dirtyline text-black leading-[0.95]
          text-[clamp(2.5rem,6vw,4.5rem)] uppercase max-w-[90%] lg:max-w-[80vw]"
        >
          Not a course. An experience.
        </h1>
      </div>

      {/* PROJECT GRID */}
      <div className="flex flex-col items-center">
        {PROJECTS_CONFIG.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`
              flex flex-col lg:flex-row justify-between items-center lg:items-start
              w-full min-h-auto
              pt-[2vh] lg:pt-[4vh]
              gap-6 lg:gap-4
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