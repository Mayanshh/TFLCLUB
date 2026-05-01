"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import data from "@/data/faq.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): "top" | "bottom" => {
  const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
  const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
  return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
};

const FAQRow = ({ faq, index }: { faq: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    gsap.to(answerRef.current, {
      height: isOpen ? 0 : "auto",
      duration: 0.7,
      ease: "expo.inOut",
    });
    gsap.to(iconRef.current, {
      rotate: isOpen ? 0 : 45,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!rowRef.current || !bgRef.current || isOpen) return;
    const rect = rowRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    
    gsap.timeline({ defaults: { duration: 0.5, ease: "expo.out" } })
      .set(bgRef.current, { y: edge === "top" ? "-100%" : "100%", opacity: 1 }, 0)
      .to(bgRef.current, { y: "0%" }, 0)
      .to(contentRef.current, { color: "#fffef1" }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!rowRef.current || !bgRef.current || isOpen) return;
    const rect = rowRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: { duration: 0.5, ease: "expo.out" } })
      .to(bgRef.current, { y: edge === "top" ? "-100%" : "100%" }, 0)
      .to(contentRef.current, { color: "#09090b" }, 0);
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toggleAccordion}
      className="relative border-b border-zinc-200 cursor-pointer overflow-hidden group"
    >
      {/* Directional Hover Background */}
      <div ref={bgRef} className="absolute inset-0 bg-zinc-950 translate-y-full pointer-events-none" />

      <div ref={contentRef} className="relative z-10 px-6 py-8 md:px-10 transition-colors duration-500">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-6 md:gap-12">
            <span className="text-xs font-mono text-zinc-400 opacity-60">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            <h3 className="text-xl md:text-2xl font-light nohemi tracking-tight">
              {faq.question}
            </h3>
          </div>
          <div ref={iconRef} className="shrink-0">
            <Plus className="w-6 h-6" />
          </div>
        </div>

        <div ref={answerRef} className="h-0 overflow-hidden">
          <div className="pt-6 pb-2 max-w-3xl">
            <p className="text-zinc-400 text-lg leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FAQElite() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".faq-reveal",
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#fffef1] text-zinc-950 py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Refined Header */}
        <div className="mb-20 uppercase tracking-tighter">
          <p className="overflow-hidden mb-2">
            <span className="faq-reveal mb-4 block text-xs font-bold text-zinc-400 tracking-[0.3em]">
              / {data.heading}
            </span>
          </p>
          <h2 className="text-5xl dirtyline md:text-7xl font-black flex flex-col md:flex-row md:items-baseline gap-4">
            <span className="faq-reveal lowercase block">{data.title}</span>
            <span className="faq-reveal uppercase block text-zinc-300 font-medium tracking-normal">
              {data.subtitle}
            </span>
          </h2>
        </div>

        {/* FAQ List */}
        <div className="border-t border-zinc-200">
          {data.faqs.map((faq, index) => (
            <FAQRow key={faq.id} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}