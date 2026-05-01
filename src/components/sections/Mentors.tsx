"use client";

import { useRef, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Play } from "lucide-react";
import mentorsData from "@/data/mentors.json";

export interface Mentor {
  id: string;
  name: string;
  initials: string;
  title: string;
  imageUrl: string;
  season: string;
}

interface MentorsSectionProps {
  customData?: Mentor[];
  // --- Developer Customization Options ---
  speed?: number;      // Base speed in seconds (Lower = Faster)
  gap?: number;        // Gap between items in pixels
  pauseOnHover?: boolean; 
}

export default function Mentors({ 
  customData, 
  speed = 40, 
  gap = 48, 
  pauseOnHover = true 
}: MentorsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const activeData = useMemo(() => customData || mentorsData, [customData]);

  // Create unique row variations
  const { row1, row2, row3 } = useMemo(() => {
    return {
      row1: activeData,
      row2: [...activeData].reverse(),
      row3: [...activeData.slice(Math.floor(activeData.length / 2)), ...activeData.slice(0, Math.floor(activeData.length / 2))],
    };
  }, [activeData]);

  return (
    <section 
      id='mentors'
      ref={containerRef}
      className="bg-[#fffef1] py-24 overflow-hidden select-none"
    >
      {/* Editorial Header */}
      <div className="mt-10 px-6 md:px-12 lg:px-20 mb-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="max-w-full">
          <h2 className="text-zinc-400 nohemi text-xs uppercase tracking-[0.4em] mb-4 font-light">
            06 / Expert Mentors
          </h2>
          <h3 className="mt-10 text-5xl dirtyline leading-[0.80] md:text-9xl font-medium tracking-tighter text-black">
            learn from <br /> <span className="italic tracking-normal text-6xl md:text-[10vw] font-light uppercase">the Best.</span>
          </h3>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-zinc-500 text-sm uppercase tracking-widest max-w-50 leading-relaxed">
            A curated collective of elite trading minds.
          </p>
        </div>
      </div>

      {/* Kinetic Grid System */}
      <div 
        className="flex flex-col" 
        style={{ gap: `${gap}px` }}
      >
        {/* Row 1: Normal Speed */}
        <MarqueeRow 
          items={row1} 
          direction={-1} 
          speed={speed} 
          gap={gap} 
          pauseOnHover={pauseOnHover} 
        />
        
        {/* Row 2: Reverse + Slightly slower (Speed * 1.2) */}
        <MarqueeRow 
          items={row2} 
          direction={1} 
          speed={speed * 1.2} 
          gap={gap} 
          pauseOnHover={pauseOnHover} 
        />
        
        {/* Row 3: Normal + Slightly different speed */}
        <MarqueeRow 
          items={row3} 
          direction={-1} 
          speed={speed * 1.1} 
          gap={gap} 
          pauseOnHover={pauseOnHover} 
        />
      </div>
    </section>
  );
}

interface MarqueeProps {
  items: Mentor[];
  direction: 1 | -1;
  speed: number;
  gap: number;
  pauseOnHover: boolean;
}

function MarqueeRow({ items, direction, speed, gap, pauseOnHover }: MarqueeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!scrollRef.current) return;

    // Fixed Animation: Explicitly set start and end points
    tl.current = gsap.fromTo(
      scrollRef.current, 
      { xPercent: direction === -1 ? 0 : -50 },
      {
        xPercent: direction === -1 ? -50 : 0,
        duration: speed,
        ease: "none",
        repeat: -1,
      }
    );
  }, { scope: scrollRef, dependencies: [speed, direction] });

  const handleMouseEnter = () => {
    if (pauseOnHover && tl.current) {
      gsap.to(tl.current, { timeScale: 0.1, duration: 1, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && tl.current) {
      gsap.to(tl.current, { timeScale: 1, duration: 1.5, ease: "power2.inOut" });
    }
  };

  return (
    <div 
      className="flex whitespace-nowrap overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={scrollRef} 
        className="flex shrink-0" 
        style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
      >
        {[...items, ...items].map((mentor, idx) => (
          <MentorItem key={`${mentor.id}-${idx}`} mentor={mentor} />
        ))}
      </div>
    </div>
  );
}

function MentorItem({ mentor }: { mentor: Mentor }) {
  return (
    <div className="group relative w-44 h-60 md:w-56 md:h-72 shrink-0 cursor-pointer rounded-2xl overflow-hidden bg-zinc-100 ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      <Image
        src={mentor.imageUrl}
        alt={mentor.name}
        fill
        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100"
        sizes="(max-width: 768px) 176px, 224px"
      />

      <div className="absolute top-4 left-4 z-20 px-2 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
        <span className="text-[10px] font-bold text-black tracking-tighter">{mentor.initials}</span>
      </div>

      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
            {mentor.season} • {mentor.title}
          </p>
          <h4 className="text-xl font-medium text-white mb-4">
            {mentor.name}
          </h4>
          
          <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase border-t border-white/20 pt-4">
            <Play className="w-3 h-3 fill-white" />
            <span>View Masterclass</span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}