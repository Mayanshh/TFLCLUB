"use client";

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import EventStack from '@/components/effects/EventStack';
import EventCard from '@/components/ui/EventCard';
import TextReveal from '@/components/effects/TextReveal';
import Button from '@/components/ui/Button';
import seasonsData from "@/data/seasons.json";

export default function EventsPage() {
  const [showPast, setShowPast] = useState(false);
  const pageContainer = useRef(null);

  useEffect(() => {
    if (showPast) {
      ScrollTrigger.refresh();
    }
  }, [showPast]);

  const togglePastSeasons = () => {
    setShowPast(true);
    setTimeout(() => {
      document.getElementById('past-seasons')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <main ref={pageContainer} className="bg-[#fffef1] min-h-screen text-black selection:bg-black selection:text-[#fffef1]">
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] flex flex-col items-center justify-end pb-6 overflow-hidden">
        <div className="bg-accent absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        </div>

        <div className="relative z-10 text-center">
          <p className="text-zinc-500 font-sans text-[10px] tracking-[0.6em] uppercase mb-8">
            <TextReveal text="SEASONS" />
          </p>
          
          <h1 className="dirtyline text-7xl md:text-[13rem] leading-[0.75] tracking-tighter">
            <TextReveal text="upComing" /> <br />
            <TextReveal text="EVENTS" delay={0.2} />
          </h1>
        </div>
      </section>

      {/* 2. The Pinned 3D Stack */}
      <EventStack onShowPast={togglePastSeasons} />

      {/* 3. Conditional Past Seasons Grid */}
      {showPast && (
        <section id="past-seasons" className="py-32 px-8 md:px-20 bg-[#fffef1]/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
               <h2 className="dirtyline text-6xl uppercase mb-4">Past Seasons</h2>
               <p className="text-zinc-500 tracking-widest uppercase text-xs">A legacy of performance</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seasonsData.past.map((item) => (
                <EventCard key={item.id} item={item} isPast />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}