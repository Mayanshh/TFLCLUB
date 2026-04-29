"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const root = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".char", {
        y: "105%",
        stagger: 0.02,
        duration: 1,
        ease: "power4.out",
        delay: delay,
      });
    }, root);
    return () => ctx.revert();
  }, [delay]);

  return (
    <span ref={root} className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, i) => (
        <span 
          key={i} 
          className="relative inline-flex overflow-hidden py-[0.1em] my-[-0.1em]"
        >
          <span className="char inline-block whitespace-pre will-change-transform">
            {char}
          </span>
        </span>
      ))}
    </span>
  );
}