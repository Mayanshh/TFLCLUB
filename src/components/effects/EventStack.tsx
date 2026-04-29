"use client";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Button from '@/components/ui/Button';
import EventCard from '@/components/ui/EventCard';
import seasonsData from "@/data/seasons.json";

gsap.registerPlugin(ScrollTrigger);

interface EventStackProps {
  onShowPast: () => void;
}

export default function EventStack({ onShowPast }: EventStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.event-card');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${seasonsData.upcoming.length * 100}%`,
          pin: true,
          scrub: 1,
        }
      });

      cards.forEach((card, i) => {
        if (i > 0) {
          tl.fromTo(card, 
            { y: "100vh", rotate: 5, scale: 0.9 },
            { y: 0, rotate: 0, scale: 1, duration: 1, ease: "power2.out" },
            i * 0.8
          );
        }
        if (i < cards.length - 1) {
          tl.to(card, {
            scale: 0.92,
            y: -30,
            opacity: 0.4,
            filter: "blur(8px)",
            duration: 1,
            ease: "power2.inOut"
          }, (i + 1) * 0.8 - 0.2);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative flex flex-col md:flex-row w-full overflow-hidden min-h-screen">
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen flex flex-col justify-center px-8 md:px-20 z-20">
        <div className="space-y-6">
          <h2 className="dirtyline text-5xl md:text-8xl leading-none tracking-tight text-black">
            CurAtEd <br /> EXpErInCeS
          </h2>
          <p className="max-w-sm text-zinc-400 font-light text-lg leading-relaxed">
            From the heights of Manali to the skyline of Dubai. Join a global network of high-performance traders.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <Button variant="solid" size="md" blur="sm" className='bg-zinc-900/80 text-[#fffef1] hover:text-black hover:bg-[#fffef1] hover:border border-black'>Request Invitation</Button>
             <Button 
                variant="liquid" 
                size="md" 
                onClick={onShowPast}
                className="border-black h-12 text-zinc-500 hover:text-black"
             >
                Past Seasons
             </Button>
          </div>
        </div>
      </div>

      <div className="relative w-full md:w-1/2 h-screen flex items-center justify-center perspective-[2000px] px-4">
        {seasonsData.upcoming.map((item, i) => (
          <EventCard 
            key={item.id} 
            item={item} 
            className="event-card absolute" 
            style={{ zIndex: i }} 
          />
        ))}
      </div>
    </section>
  );
}