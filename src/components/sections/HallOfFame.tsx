'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CircularGallery from '@/components/ui/CircularGallery';
import data from "@/data/hallOfFame.json";
import { useDevice } from '@/hooks/useDevice';

gsap.registerPlugin(ScrollTrigger);

export default function HallOfFame() {
  const sectionRef = useRef(null);
  const {isMobile} = useDevice();

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:  `${isMobile ? "top top" : "top+=10% top"}`,
      end: `${isMobile ? '+=10%' : '+=300%'}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      // markers: true,
    });

    return () => trigger.kill();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="bg-[#fffef1] relative min-h-screen w-full overflow-hidden"
    >
      <div className="w-full h-[10vh]" />

      <div className="bg-[#fffef1] w-full h-[40svh] p-4">
        <p className="text-zinc-500 uppercase font-light text-sm w-full text-center mb-12">
          community
        </p>

        <h1 className="text-zinc-600/90 dirtyline leading-[0.95] mb-3 text-6xl tracking-tight text-left">
          Profitable Traders
        </h1>

        <h1 className="text-black dirtyline leading-[0.95] tracking-tight text-[10vw] uppercase text-left">
          Hall OF FamE
        </h1>
      </div>

      <div style={{ height: `${isMobile ? '35vh' : '65vh'}`, width: '100vw', position: 'relative' }}>
        <CircularGallery
          items={data.slides.map((slide) => ({
            image: slide.img,
            text: slide.account,
            subText: slide.text,
            mainFontSize: 90,     
            mainColor: 'black',      
            subFontSize: '70px', 
          }))}
          bend={1}
          textColor="#ffffff"
          borderRadius={0.001}
          scrollSpeed={2}
          scrollEase={0.05}
          />
      </div>
    </section>
  );
}