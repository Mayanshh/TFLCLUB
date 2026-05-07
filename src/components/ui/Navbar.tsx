"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { useGSAP } from "@gsap/react";

import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollToPlugin);

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Benefits", href: "#benefits" },
  { name: "Mentors", href: "#mentors" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // =========================================
  // Smooth Scroll Handler
  // =========================================

  const handleScrollToSection = (href: string) => {
    if (typeof window === "undefined") return;

    const target = document.querySelector(href);

    if (!target) return;

    // Close mobile menu first
    setIsOpen(false);

    // Kill any active scroll tweens
    gsap.killTweensOf(window);

    gsap.to(window, {
      duration: 1.4,

      scrollTo: {
        y: target,
        offsetY: 40,
        autoKill: true,
      },

      ease: "expo.inOut",

      overwrite: "auto",
    });
  };

  // =========================================
  // Navbar Intro Animation
  // =========================================

  useGSAP(
    () => {
      if (!navRef.current) return;

      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5,
        clearProps: "transform",
      });
    },
    { scope: container }
  );

  // =========================================
  // Mobile Menu Animation
  // =========================================

  useGSAP(
    () => {
      if (!menuRef.current) return;

      if (isOpen) {
        gsap.killTweensOf(menuRef.current);

        gsap.set(menuRef.current, {
          display: "block",
        });

        gsap.to(menuRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.5,
          ease: "expo.out",
          overwrite: true,
        });

        gsap.fromTo(
          ".mobile-link",
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: "power3.out",
            delay: 0.08,
            overwrite: true,
          }
        );
      } else {
        gsap.killTweensOf(menuRef.current);

        gsap.to(menuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "expo.inOut",
          overwrite: true,

          onComplete: () => {
            if (!menuRef.current) return;

            gsap.set(menuRef.current, {
              display: "none",
            });
          },
        });
      }
    },
    {
      dependencies: [isOpen],
      scope: container,
    }
  );

  return (
    <header
      ref={container}
      className="pointer-events-none fixed left-0 right-0 top-4 z-50 flex justify-center px-4 md:top-6"
    >
      <nav
        ref={navRef}
        className={cn(
          "relative flex flex-col items-center pointer-events-auto",
          "w-full max-w-[95vw] md:w-auto md:min-w-125 lg:min-w-162.5",
          "rounded-[24px] md:rounded-[40px]",
          "border border-white/10",
          "bg-zinc-950/40 backdrop-blur-2xl",
          "shadow-2xl shadow-black/20",
          "px-5 py-3 md:px-8 md:py-4.5"
        )}
      >
        {/* ========================================= */}
        {/* Top Row */}
        {/* ========================================= */}

        <div className="flex w-full items-center justify-between">
          {/* Logo */}

          <Link
            href="/"
            className="dirtyline normalcase text-xl font-bold leading-[0.7] tracking-[0.09em] text-white md:text-2xl"
            aria-label="Home"
          >
            TFLCLUB
          </Link>

          {/* ========================================= */}
          {/* Desktop Nav */}
          {/* ========================================= */}

          <div className="hidden items-center gap-6 lg:gap-10 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() =>
                  handleScrollToSection(link.href)
                }
                className="text-[10px] lg:text-xs uppercase tracking-[0.2em] font-medium text-white transition-opacity duration-300 hover:opacity-70"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* ========================================= */}
          {/* Mobile Toggle */}
          {/* ========================================= */}

          <button
            type="button"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 text-white outline-none md:hidden"
          >
            {isOpen ? (
              <X
                size={20}
                strokeWidth={1.5}
              />
            ) : (
              <Menu
                size={20}
                strokeWidth={1.5}
              />
            )}
          </button>
        </div>

        {/* ========================================= */}
        {/* Mobile Menu */}
        {/* ========================================= */}

        <div
          ref={menuRef}
          className="hidden w-full overflow-hidden md:hidden"
          style={{
            height: 0,
            opacity: 0,
          }}
        >
          <div className="mt-2 flex flex-col items-center gap-6 border-t border-white/5 py-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() =>
                  handleScrollToSection(link.href)
                }
                className="mobile-link text-lg font-light uppercase tracking-widest text-zinc-300 transition-colors duration-300 hover:text-white"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;