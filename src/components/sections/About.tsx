"use client";

import React, { useMemo } from 'react';
import CutoutParallax from '../effects/CutOutParallax';
import { useDevice } from '@/hooks/useDevice';
import aboutData from '@/data/about.json';

// -----------------------------
// TYPES
// -----------------------------
interface ProjectDimensions {
  width: string;
  height: string;
}

interface ProjectItem {
  id: string;
  src: string;
  title: string;
  desktop: ProjectDimensions;
  mobile?: Partial<ProjectDimensions>;
}

interface ProjectRow {
  items: ProjectItem[];
  rowClassName?: string;
}

// -----------------------------
// COMPONENT
// -----------------------------
const Projects: React.FC = () => {
  const { isMobile } = useDevice();

  // Determine parallax intensity based on device
  const parallaxSpeed = useMemo(() => (isMobile ? 5 : 15), [isMobile]);

  return (
    <section
      id="about"
      className="relative z-20 w-full bg-[#fffef1] px-4 lg:px-8 pt-[5vh] lg:pt-[10vh] pb-[10vh]"
    >
      {/* HEADER - Loaded from JSON */}
      <div className="w-full mb-10 lg:mb-20">
        <p className="text-black uppercase font-light tracking-[0.2em] mb-6 text-xs md:text-sm">
          {aboutData.header.tagline}
        </p>

        <h1 className="font-bold dirtyline text-black leading-[0.95] 
          text-[clamp(2.5rem,6vw,4.5rem)] uppercase max-w-[90%] lg:max-w-[80vw]"
        >
          {aboutData.header.title}
        </h1>
      </div>

      {/* PROJECT GRID - Dynamically Mapped */}
      <div className="flex flex-col items-center">
        {(aboutData.rows as ProjectRow[]).map((row, rowIndex) => (
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
              // Fallback logic for dimensions
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