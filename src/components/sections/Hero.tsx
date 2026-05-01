"use client";

import Navbar from "@/components/ui/navbar";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="hero-section"
      className="relative h-svh w-full overflow-hidden bg-zinc-950 flex flex-col items-center justify-center lg:items-start lg:justify-end"
    >
      {/* Navigation */}
      <Navbar />

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-60"
      >
        <source src="/videos/heroBgVid.mp4" type="video/mp4" />
      </video>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-350 flex flex-col items-center lg:items-start justify-end px-4 sm:px-6 md:px-10 lg:px-16 pb-10 lg:pb-14 text-center lg:text-left">

        {/* Tagline */}
        <p className="text-[#fffef1]/90 font-light tracking-[0.2em] mb-6 text-[10px] sm:text-xs md:text-sm">
          INVITE ONLY · 30 SPOTS PER SEASON
        </p>

        {/* Heading */}
        <h1 className="dirtyline font-bold text-[#fffef1] tracking-normal leading-[0.95]
          text-[clamp(2.5rem,6vw,6.5rem)] max-w-[95%] lg:max-w-[70vw]"
        >
          India's Most Exclusive <br className="hidden sm:block" />
          Trading Bootcamp
        </h1>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between w-full lg:w-[55vw] mt-6 gap-6 lg:gap-0">

          {/* Description */}
          <p className="text-[#fffef1]/80 font-light tracking-tight md:tracking-[0.2em]
            text-sm sm:text-base md:text-sm leading-snug md:leading-normal max-w-[90%] lg:max-w-none"
          >
            5 days. Live trading. Profitable mentors. Real funding opportunities.
            <br className="hidden md:block" />
            Build discipline, network, and strategy in one immersive experience.
          </p>

          {/* CTA */}
          <Button
            className="py-3 sm:py-4 w-48 sm:w-48 uppercase"
            variant="liquid"
            showArrow
          >
            Apply For <br /> Next Season
          </Button>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="pointer-events-none absolute inset-0 z-5 bg-linear-to-b from-transparent via-transparent to-zinc-950/80" />
    </section>
  );
}