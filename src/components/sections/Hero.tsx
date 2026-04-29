"use client";

import Navbar from "@/components/ui/navbar";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section 
      id="hero-section" 
      className="relative h-svh w-full overflow-hidden bg-zinc-950 flex flex-col items-center justify-center lg:items-start lg:justify-end"
    >
        <Navbar />
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // poster="/images/motionGIF-BG.jpg"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-60"
      >
        <source src="/videos/heroBgVid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 flex h-fit w-fit mb-10 flex-col items-start justify-center px-6 text-center">
        <p className="text-[#fffef1]/90 font-light tracking-[0.2em] mb-8 ml-1 text-xs md:text-sm">
           INVITE ONLY · 30 SPOTS PER SEASON
          </p>
        <h1 className="font-bold max-w-[70vw] lg:text-left dirtyline text-5xl md:text-8xl text-[#fffefb] tracking-normal leading-[0.95]">
          India's Most Exclusive <br /> Trading Bootcamp
        </h1>
        <div className="flex h-20 flex-col lg:flex-row items-center lg:w-[55vw] justify-between">
          <p className="text-[#fffef1]/80 ml-1 font-light tracking-[0.2em] text-xs md:text-sm">
           5 days. Live trading. Profitable mentors. Real funding opportunities. <br /> Build discipline, network, and strategy in one immersive experience.
          </p>
            <Button className="w-40 md:w-45 md:h-11 uppercase" variant="solid" showArrow>
           Apply For Next Season
          </Button>
        </div>
      </div>
      {/* Bottom Gradient for smooth transition to next section */}
      <div className="absolute inset-0 z-5 bg-linear-to-b from-transparent via-transparent to-zinc-950/80" />
    </section>
  );
}