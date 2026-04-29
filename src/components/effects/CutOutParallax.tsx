"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CutoutParallaxProps {
  src: string;
  title?: string;
  width?: string;
  height?: string;
  inset?: string;
  radius?: number;
  speed?: number;
  className?: string;
  linkText?: string;
  linkStyles?: string;
}

const CutoutParallax: React.FC<CutoutParallaxProps> = ({
  src,
  title = "",
  width = "100%",
  height = "70vh",
  inset = "16% 12%",
  radius = 8,
  speed = 10,
  className = "",
  linkText = 'Explore',
  linkStyles = "",
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const imageHeight = `calc(100% + ${speed * 2}%)`;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!imageRef.current || !wrapperRef.current) return;

      gsap.fromTo(
        imageRef.current,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={wrapperRef}
      style={{ width }}
      className="flex flex-col items-start"
    >
      {/* CUTOUT WINDOW */}
      <div
        style={{ height }}
        className="relative w-full overflow-hidden"
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(${inset} round ${radius}px)`,
          }}
        >
          <img
            loading="eager"
            // @ts-ignore - fetchpriority is a newer browser feature not yet in standard React types
            fetchPriority="high"
            ref={imageRef}
            src={src}
            alt={title}
            draggable={false}
            style={{ height: imageHeight }}
            className="absolute inset-0 w-full object-cover select-none will-change-transform"
          />
        </div>
      </div>

      {/* TEXT AREA*/}
      {title && (
        <div 
          className="w-full flex flex-col gap-2 text-left relative text-black pt-[1.2em] z-100"
        >
          <p className={`uppercase whitespace-pre-line text-[1.725em] tracking-tighter leading-[1.15] ${className}`}>
            {title}
          </p>

          <a
            href="#"
            className={`inline-flex items-center gap-1 text-[0.87em] uppercase ${linkStyles}`}
          >
            <span>{linkText}</span>
            <ArrowDownRight className="w-[0.9em] h-[0.9em]" />
          </a>
        </div>
      )}
    </div>
  );
};

export default CutoutParallax;