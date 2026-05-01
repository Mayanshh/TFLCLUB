"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import EventStack from "@/components/effects/EventStack";
import EventCard from "@/components/ui/EventCard";
import TextReveal from "@/components/effects/TextReveal";
import seasonsData from "@/data/seasons.json";
import {useDevice} from "@/hooks/useDevice";

// Register GSAP safely
gsap.registerPlugin(ScrollTrigger);

export default function EventsPage() {
  const [showPast, setShowPast] = useState(false);
  const pageContainer = useRef<HTMLElement | null>(null);
  const pastRef = useRef<HTMLElement | null>(null);

  const { isMobile } = useDevice();

  // -----------------------------
  // HANDLE SCROLLTRIGGER REFRESH
  // -----------------------------
  useEffect(() => {
    if (showPast) {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  }, [showPast]);

  // -----------------------------
  // TOGGLE HANDLER (CLEAN)
  // -----------------------------
  const togglePastSeasons = useCallback(() => {
    setShowPast(true);
  }, []);

  // -----------------------------
  // SCROLL INTO VIEW (NO TIMEOUT HACK)
  // -----------------------------
  useEffect(() => {
    if (showPast && pastRef.current) {
      pastRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showPast]);

  return (
    <main
      id='events'
      ref={pageContainer}
      className="bg-[#fffef1] min-h-screen text-black selection:bg-black selection:text-[#fffef1]"
    >
      {/* -----------------------------
          HERO
      ----------------------------- */}
      <section className="relative h-[30svh] md:h-[65vh] sm:h-[70vh] flex flex-col items-center justify-end pb-6 overflow-hidden">

        {/* Background texture layer */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" />

        {/* Content */}
        <div className="relative z-10 text-center px-4">

          <p className="text-zinc-500 font-sans text-[9px] sm:text-[10px] tracking-[0.6em] uppercase mb-6 sm:mb-8">
            <TextReveal text="SEASONS" />
          </p>

          <h1
            className="
              dirtyline leading-[0.75] tracking-tighter
              text-[clamp(3rem,10vw,13rem)]
            "
          >
            <TextReveal text="upComing" />
            <br />
            <TextReveal text="EVENTS" delay={0.2} />
          </h1>
        </div>
      </section>

      {/* -----------------------------
          PINNED STACK
      ----------------------------- */}
      <EventStack onShowPast={togglePastSeasons} />

      {/* -----------------------------
          PAST SEASONS
      ----------------------------- */}
      {showPast && (
        <section
          ref={pastRef}
          id="past-seasons"
          className="py-20 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 lg:px-20 bg-[#fffef1]/30"
        >
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <header className="mb-12 sm:mb-16">
              <h2 className="dirtyline uppercase mb-4 text-[clamp(2.5rem,6vw,4rem)]">
                Past Seasons
              </h2>
              <p className="text-zinc-500 tracking-widest uppercase text-[10px] sm:text-xs">
                A legacy of performance
              </p>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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