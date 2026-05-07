"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import content from "@/data/rewards.json";
import { useDevice } from "@/hooks/useDevice";

gsap.registerPlugin(ScrollTrigger);

/**
 * Clamp helper
 */
const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

/**
 * Format counter → 01, 02...
 */
const formatCounter = (num: number | string) =>
  String(num).padStart(2, "0");

const DiagonalCarousel = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLHeadingElement | null>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { slides } = content;
  const { isMobile } = useDevice();

  /**
   * CONFIG
   */
  const CARD_GAP = 100;
  const SCALE_DROP = 0.08;
  const OPACITY_DROP = 0.25;

  useLayoutEffect(() => {
    if (!rootRef.current || isMobile) return;

    const root = rootRef.current;

    /**
     * IMPORTANT:
     * Scope everything to THIS component only
     */
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".card-item")
      );

      if (!cards.length) return;

      const total = slides.length;
      const spacing = 1 / (total - 1);

      /**
       * Main state sync
       */
      const setState = (progress: number) => {
        const rawIndex = progress / spacing;
        const activeIndex = Math.round(rawIndex);

        // ---------- CARDS ----------
        cards.forEach((card, i) => {
          const dist = i - rawIndex;

          const x = dist * CARD_GAP;
          const y = dist * CARD_GAP;

          const scale = clamp(1 - Math.abs(dist) * SCALE_DROP, 0.85, 1);
          const opacity = clamp(1 - Math.abs(dist) * OPACITY_DROP, 0.35, 1);
          const grayscale = Math.abs(dist) < 0.5 ? 0 : 1;

          gsap.set(card, {
            xPercent: x,
            yPercent: y,
            scale,
            opacity,
            filter: `grayscale(${grayscale})`,
            zIndex: total - Math.round(Math.abs(dist)),
            force3D: true,
          });
        });

        // ---------- TEXT ----------
        textRefs.current.forEach((el, i) => {
          if (!el) return;

          const dist = Math.abs(i - rawIndex);

          gsap.set(el, {
            opacity: clamp(1 - dist * 1.8, 0, 1),
            y: dist * 40,
          });
        });

        // ---------- COUNTER ----------
        if (countRef.current && slides[activeIndex]) {
          countRef.current.textContent = formatCounter(
            slides[activeIndex].id
          );
        }
      };

      /**
       * ScrollTrigger (ISOLATED + STABLE)
       */
      const trigger = ScrollTrigger.create({
        id: "rewards-carousel",

        trigger: root,
        start: "top top",
        end: `+=${window.innerHeight * 2.2}`,

        scrub: 1.1,
        pin: true,
        pinSpacing: true,

        anticipatePin: 1,
        invalidateOnRefresh: true,

        /**
         * CRITICAL: prevents layout shift glitches
         */
        pinType: root.style.transform ? "transform" : "fixed",

        /**
         * Smooth updates
         */
        onUpdate: (self) => {
          setState(self.progress);
        },

        /**
         * Prevents sudden jumps on fast scroll
         */
        fastScrollEnd: true,
      });

      /**
       * Initial render
       */
      setState(0);

      /**
       * Refresh handling (important with Lenis / dynamic layouts)
       */
      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();

      /**
       * Kill ONLY this component trigger (not global ones)
       */
      ScrollTrigger.getById("rewards-carousel")?.kill();
    };
  }, [slides, isMobile]);

  /**
   * MOBILE (unchanged)
   */
  if (isMobile) {
    return (
      <section id='benefits' className="w-full bg-[#fffef1] px-4 py-20 flex flex-col gap-16">
        {slides.map((slide, i) => (
          <div key={i} className="flex flex-col gap-4">
            <img
              src={slide.img}
              alt={slide.place}
              className="w-full h-[50vh] object-cover rounded-2xl"
            />
            <h3 className="nohemi uppercase text-sm text-zinc-500">
              {slide.account}
            </h3>
            <p className="dirtyline text-xl text-zinc-700">
              {slide.text}
            </p>
          </div>
        ))}
      </section>
    );
  }

  /**
   * DESKTOP
   */
  return (
    <section
    id='benefits'
      ref={rootRef}
      className="relative w-full h-screen bg-[#fffef1] overflow-hidden"
    >
      {/* Counter */}
      <div className="absolute bottom-0 left-[8%] z-10 pointer-events-none">
        <h1
          ref={countRef}
          className="text-zinc-500 text-[15vw] opacity-10 dirtyline"
        >
          01
        </h1>
      </div>

      {/* Text */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-80 z-50">
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => {
              textRefs.current[i] = el;
            }}
            className="absolute"
          >
            <h3 className="nohemi uppercase text-sm text-black mb-2">
              {slide.account}
            </h3>
            <p className="dirtyline text-lg text-zinc-500">
              {slide.text}
            </p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="flex items-center justify-center h-full">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="card-item absolute w-[70vw] sm:w-105 h-[90vw] sm:h-130 shadow-2xl overflow-hidden"
          >
            <img
              src={slide.img}
              alt={slide.place}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiagonalCarousel;