"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Button from "@/components/ui/Button";
import EventCard from "@/components/ui/EventCard";
import seasonsData from "@/data/seasons.json";
import {useDevice} from "@/hooks/useDevice";

gsap.registerPlugin(ScrollTrigger);

interface EventStackProps {
  onShowPast: () => void;
}

export default function EventStack({ onShowPast }: EventStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDevice();

  // -----------------------------
  // GSAP ANIMATION (DESKTOP ONLY)
  // -----------------------------
  useLayoutEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".event-card");

      if (!cards.length) return;

      // ✅ INITIAL STATE (ALL CARDS HIDDEN)
      gsap.set(cards, {
        yPercent: 100,
        opacity: 0,
        scale: 0.9,
        rotate: 5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${cards.length * 120}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      cards.forEach((card, i) => {
        // ✅ ENTRY ANIMATION (EVERY CARD)
        tl.to(
          card,
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1,
            ease: "power2.out",
          },
          i * 0.8
        );

        // ✅ STACK / EXIT EFFECT
        if (i < cards.length - 1) {
          tl.to(
            card,
            {
              scale: 0.92,
              y: -30,
              opacity: 0.4,
              filter: "blur(8px)",
              duration: 1,
              ease: "power2.inOut",
            },
            i * 0.8 + 0.6
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <section
      ref={containerRef}
      className="relative flex flex-col lg:flex-row w-full overflow-hidden min-h-screen"
    >
      {/* -----------------------------
          LEFT CONTENT
      ----------------------------- */}
      <div className="w-full lg:w-1/2 h-auto lg:h-screen flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-20 py-12 lg:py-0 z-20">
        <div className="space-y-6">
          <h2
            className="
              dirtyline leading-none tracking-tight text-black
              text-[clamp(2.5rem,6vw,5rem)]
            "
          >
            CurAtEd <br /> EXpErInCeS
          </h2>

          <p className="max-w-sm text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
            From the heights of Manali to the skyline of Dubai. Join a global
            network of high-performance traders.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              variant="solid"
              size="md"
              blur="sm"
              className="bg-zinc-900/80 text-[#fffef1] hover:text-black hover:bg-[#fffef1] hover:border border-black"
            >
              Request Invitation
            </Button>

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

      {/* -----------------------------
          RIGHT STACK
      ----------------------------- */}
      <div className="relative w-full lg:w-1/2 min-h-[60vh] lg:h-screen flex items-center justify-center perspective-[2000px] px-4">

        {/* 📱 MOBILE → SIMPLE STACK */}
        {isMobile ? (
          <div className="flex flex-col gap-6 w-full items-center py-10">
            {seasonsData.upcoming.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          /* 🖥 DESKTOP → ANIMATED STACK */
          seasonsData.upcoming.map((item, i) => (
            <EventCard
              key={item.id}
              item={item}
              className="event-card absolute will-change-transform"
              style={{ zIndex: i }}
            />
          ))
        )}
      </div>
    </section>
  );
}