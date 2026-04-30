'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import content from '@/data/rewards.json'; 

gsap.registerPlugin(ScrollTrigger);

const DiagonalCarousel = () => {
  const component = useRef(null);
  const { slides } = content; // Destructure the slides from your JSON

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.card-item');
      const texts = gsap.utils.toArray<HTMLElement>('.description-text');
      const navItems = gsap.utils.toArray<HTMLElement>('.nav-item');
      const count = document.querySelector('.active-count');

      // Tweak this value to adjust the gap! 
      // < 100 = overlapping, 100 = corners touching, > 100 = separated with a gap
      const cardOffset = 105; 

      // 1. Initialize the staircase stack with the new gap
      gsap.set(cards, {
        xPercent: (index) => index * cardOffset,
        yPercent: (index) => index * cardOffset,
        filter: (index) => index === 0 ? 'grayscale(0%)' : 'grayscale(100%)',
        opacity: 1 // Ensure all cards are always visible to form the persistent stack
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=3000",
        }
      });

      slides.forEach((_, i) => {
        const isFirst = i === 0;

        // --- Slide Animation Logic ---
        if (!isFirst) {
          // Animate ALL cards dynamically together to keep the staircase intact and preserve gaps
          cards.forEach((card, cardIndex) => {
            tl.to(card, {
              xPercent: (cardIndex - i) * cardOffset,
              yPercent: (cardIndex - i) * cardOffset,
              filter: cardIndex === i ? 'grayscale(0%)' : 'grayscale(100%)',
              duration: 1,
              ease: "none"
            }, i);
          });

          // Text animations 
          tl.to(texts[i - 1], { opacity: 0, y: -20, duration: 0.5 }, i)
            .fromTo(texts[i], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, i);
        }

        // --- UI Updates (The count & Sidebar) ---
        tl.to({}, {
          duration: 0.1,
          onStart: () => {
            if(count) count.innerHTML = slides[i].id;
            navItems.forEach((nav, idx) => {
              (nav as HTMLElement).style.opacity = idx === i ? "1" : "0.4";
            });
          },
          onReverseComplete: () => {
            if (i > 0 && count) {
              count.innerHTML = slides[i - 1].id;
              navItems.forEach((nav, idx) => {
                (nav as HTMLElement).style.opacity = idx === (i - 1) ? "1" : "0.4";
              });
            }
          }
        }, i);
      });
    }, component);

    return () => ctx.revert();
  }, [slides]);

  return (
    <div ref={component} className="relative w-full h-screen min-h-screen bg-[#fffef1] overflow-hidden text-black font-sans">

      {/* Sidebar Navigation - Fixed and Dynamic */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 text-[10px] italic">
        {slides.map((slide, i) => (
            <div key={i} className="nav-item dirtyline flex items-center gap-2 opacity-40 transition-opacity duration-300">
                <span>{slide.id}</span>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-px! bg-black"></div> 
                    <span className="uppercase nohemi tracking-widest">{slide.reward}</span>
                </div>
            </div>
        ))}
      </div>

      {/* Background Large Counter */}
      <div className="absolute text-zinc-600! bottom-[-1.5%] left-[8%] z-10 pointer-events-none">
        <h1 className="active-count text-zinc-500! text-[15vw] tracking-wide dirtyline font-bold opacity-10 leading-none">
            {slides[0]?.id}
        </h1>
      </div>

      {/* Right Side Text Content */}
      <div className="absolute right-[10%] top-[30%] -translate-y-1/2 w-80 z-50">
        {slides.map((slide, i) => (
          <div key={i} className={`description-text absolute ${i !== 0 ? 'opacity-0' : ''}`}>
             <h3 className="text-black nohemi font-thin uppercase mb-2 tracking-normal">{slide.account}</h3>
             <p className="text-lg text-zinc-500 dirtyline tracking-wide leading-none">{slide.text}</p>
          </div>
        ))}
      </div>

      {/* Diagonal Card Container */}
      <div className="flex items-center justify-center h-full w-full relative">
        {slides.map((slide, i) => (
          <div 
            key={i} 
            className="card-item absolute w-100 h-125 shadow-2xl overflow-hidden"
            style={{ 
                zIndex: slides.length - i
            }}
          >
             <img src={slide.img} alt={slide.place} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagonalCarousel;