"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Button from "@/components/ui/Button";
import EventCard from "@/components/ui/EventCard";
import seasonsData from "@/data/seasons.json";
import { useDevice } from "@/hooks/useDevice";

gsap.registerPlugin(ScrollTrigger);

/**
 * INSTITUTIONAL CONFIGURATION
 * Centralized control for the stack's physics and speed.
 */
const STACK_CONFIG = {
  scrollDistanceFactor: 80,    // Higher = slower scroll through the stack
  scrubSpeed: 0.5,             // Lower = snappier response to wheel
  staggerDelay: 0.5,           // Delay between cards
  transitionDuration: 1.2,     // Duration of each individual card movement
  overlapFactor: 0.4,          // How soon the card starts exiting (0.4s into entry)
  initialRotate: 4,            // Starting tilt
  exitScale: 0.92,             // Scale of the card in the "background" stack
  exitOpacity: 0.25,           // Visibility of cards behind the active one
  exitBlur: "6px",             // Background depth of field
};

interface EventStackProps {
  onShowPast: () => void;
}

export default function EventStack({ onShowPast }: EventStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDevice();

  useLayoutEffect(() => {
    // 1. Mobile logic is handled via standard flex/grid in the JSX
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".event-card");
      if (!cards.length) return;

      // 2. Initial State Setup (GPU Accelerated)
      gsap.set(cards, {
        yPercent: 110,         // Start completely off-screen
        opacity: 0,
        scale: 0.85,
        rotate: STACK_CONFIG.initialRotate,
        force3D: true,
      });

      // 3. The Pinned Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",      // Pins when the top of section hits top of viewport
          end: `+=${cards.length * STACK_CONFIG.scrollDistanceFactor}%`,
          pin: true,             // Locks the section
          pinSpacing: true,      // Pushes following content down correctly
          scrub: STACK_CONFIG.scrubSpeed,
          anticipatePin: 1,      // CRITICAL: Pre-calculates pinning to prevent the "jump"
          invalidateOnRefresh: true, // Recalculates if window resizes or layout shifts
        },
      });

      cards.forEach((card, i) => {
        const position = i * STACK_CONFIG.staggerDelay;

        // ENTRY ANIMATION
        tl.to(
          card,
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: STACK_CONFIG.transitionDuration,
            ease: "expo.out", // Premium, smooth deceleration
          },
          position
        );

        // STACK/EXIT EFFECT
        // We only animate the exit for cards that aren't the last one
        if (i < cards.length - 1) {
          tl.to(
            card,
            {
              scale: STACK_CONFIG.exitScale,
              y: -40, // Moves slightly up to look like a physical stack
              opacity: STACK_CONFIG.exitOpacity,
              filter: `blur(${STACK_CONFIG.exitBlur})`,
              duration: STACK_CONFIG.transitionDuration,
              ease: "power2.inOut",
            },
            position + STACK_CONFIG.overlapFactor
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col lg:flex-row w-full overflow-hidden min-h-screen bg-[#fffef1] z-10"
    >
      {/* --- LEFT CONTENT (Sticky Text) --- */}
      <div className="w-full lg:w-1/2 h-auto lg:h-screen flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-20 py-12 lg:py-0 z-20">
        <div className="space-y-6">
          <h2 className="dirtyline normalcase leading-none tracking-tight text-black text-[clamp(2.5rem,6vw,5rem)]">
            Curated <br /> Experinces
          </h2>

          <p className="max-w-sm text-zinc-500 font-light text-base sm:text-lg leading-relaxed nohemi">
            From the heights of Manali to the skyline of Dubai. Join a global
            network of high-performance traders and master the markets.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              variant="solid"
              size="md"
              className="bg-black text-[#fffef1] hover:scale-105 hover:text-black hover:bg-transparent hover:border hover:border-black  transition-transform"
            >
              Request Invitation
            </Button>

            <Button
              variant="liquid"
              size="md"
              onClick={onShowPast}
              className="border-black text-black hover:bg-black hover:text-[#fffef1] transition-all"
            >
              Past Seasons
            </Button>
          </div>
        </div>
      </div>

      {/* --- RIGHT STACK (The Animated Deck) --- */}
      <div className="relative w-full lg:w-1/2 min-h-[60vh] lg:h-screen flex items-center justify-center perspective-[2000px] px-4">
        {isMobile ? (
          /* Mobile: Just a standard vertical list of cards */
          <div className="flex flex-col gap-6 w-full items-center py-10">
            {seasonsData.upcoming.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          /* Desktop: Absolute positioned cards for the GSAP stack */
          seasonsData.upcoming.map((item, i) => (
            <EventCard
              key={item.id}
              item={item}
              className="event-card absolute shadow-2xl will-change-transform"
              style={{ zIndex: i }}
            />
          ))
        )}
      </div>
    </section>
  );
}