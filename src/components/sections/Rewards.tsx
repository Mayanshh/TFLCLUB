'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import content from '@/data/rewards.json';
import { useDevice } from '@/hooks/useDevice';

gsap.registerPlugin(ScrollTrigger);

const formatCounter = (num: string | number) => {
  return String(num).padStart(2, '0'); 
};

const DiagonalCarousel = () => {
  const component = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLHeadingElement>(null);

  const { slides } = content;
  const { isMobile } = useDevice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted || isMobile || !component.current) return;

    const root = component.current;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.card-item'));
      const texts = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.description-text'));
      const navItems = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.nav-item'));

      if (!cards.length) return;

      const cardOffset = 105;

      // INITIAL STATE
      gsap.set(cards, {
        xPercent: (i) => i * cardOffset,
        yPercent: (i) => i * cardOffset,
        filter: (i) => (i === 0 ? 'grayscale(0%)' : 'grayscale(100%)'),
        opacity: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: `+=${slides.length * 1000}`,
          anticipatePin: 1,
          // ✅ FIX: Use onUpdate to sync the counter and nav with scroll progress
          onUpdate: (self) => {
            // Calculate the current active index based on scroll progress
            const progress = self.progress;
            const activeIndex = Math.round(progress * (slides.length - 1));

            // Update Counter
            if (countRef.current && slides[activeIndex]) {
              countRef.current.textContent = formatCounter(slides[activeIndex].id);
            }

            // Update Nav Items Opacity
            navItems.forEach((nav, idx) => {
              gsap.to(nav, {
                opacity: idx === activeIndex ? 1 : 0.4,
                duration: 0.1,
                overwrite: 'auto'
              });
            });
          },
        },
      });

      // Handle Card and Text Transitions
      slides.forEach((_, i) => {
        if (i !== 0) {
          // Move all cards diagonally
          cards.forEach((card, cardIndex) => {
            tl.to(card, {
              xPercent: (cardIndex - i) * cardOffset,
              yPercent: (cardIndex - i) * cardOffset,
              filter: cardIndex === i ? 'grayscale(0%)' : 'grayscale(100%)',
              duration: 1,
              ease: 'none',
            }, i);
          });

          // Animate text descriptions
          tl.to(texts[i - 1], { opacity: 0, y: -20, duration: 0.5 }, i)
            .fromTo(texts[i], 
              { opacity: 0, y: 20 }, 
              { opacity: 1, y: 0, duration: 0.5 }, 
              i
            );
        }
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [mounted, slides, isMobile]);

  // MOBILE VIEW
  if (isMobile) {
    return (
      <section id='rewards' className="w-full bg-[#fffef1] px-4 py-20 flex flex-col gap-16">
        <h1 className='dirtyline text-5xl md:hidden block mt-25'>Trade for Real FunDInG</h1>
        {slides.map((slide, i) => (
          <div key={i} className="flex flex-col gap-4">
            <img
              src={slide.img}
              alt={slide.place}
              className="w-full h-[50vh] object-cover rounded-2xl"
            />
            <h3 className="nohemi uppercase text-sm text-zinc-500">{slide.account}</h3>
            <p className="dirtyline text-xl text-zinc-700">{slide.text}</p>
          </div>
        ))}
      </section>
    );
  }

  // DESKTOP VIEW
  return (
    <div
      ref={component}
      className="relative w-full h-screen min-h-screen bg-[#fffef1] overflow-hidden text-black font-sans"
    >
      {/* Sidebar Navigation */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 sm:gap-6 text-[9px] sm:text-[10px] italic">
        {slides.map((slide, i) => (
          <div key={i} className="nav-item dirtyline flex items-center gap-2 opacity-40">
            <span>{formatCounter(slide.id)}</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-px bg-black" />
              <span className="uppercase nohemi tracking-widest">{slide.reward}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Large Counter */}
      <div className="absolute bottom-[-1.5%] left-[5%] sm:left-[8%] z-10 pointer-events-none">
        <h1
          ref={countRef}
          suppressHydrationWarning
          className="text-zinc-500 text-[15vw] tracking-wide dirtyline font-bold opacity-10 leading-none"
        >
          {mounted ? formatCounter(slides[0]?.id) : '00'}
        </h1>
      </div>

      {/* Description Text */}
      <div className="absolute right-[5%] sm:right-[10%] top-[35%] sm:top-[30%] -translate-y-1/2 w-64 sm:w-80 z-50">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`description-text absolute ${i !== 0 ? 'opacity-0' : ''}`}
          >
            <h3 className="text-black nohemi font-thin uppercase mb-2">{slide.account}</h3>
            <p className="text-base sm:text-lg text-zinc-500 dirtyline leading-none">{slide.text}</p>
          </div>
        ))}
      </div>

      {/* Carousel Cards */}
      <div className="flex items-center justify-center h-full w-full relative">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="card-item absolute w-[70vw] sm:w-105 h-[90vw] sm:h-130 shadow-2xl overflow-hidden"
            style={{ zIndex: slides.length - i }}
          >
            <img src={slide.img} alt={slide.place} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagonalCarousel;