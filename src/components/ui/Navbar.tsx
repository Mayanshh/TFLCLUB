'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: 'About', href: '#about' },
  { name: 'Events', href: '#events' },
  { name: 'Benefits', href: '#rewards' },
  { name: 'Mentors', href: '#mentors' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const container = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.5,
    });
  }, { scope: container });

  useGSAP(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      gsap.to(menuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
        display: 'block',
      });

      gsap.fromTo(
        '.mobile-link',
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.08, 
          duration: 0.4, 
          ease: 'power3.out',
          delay: 0.1 
        }
      );
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'expo.inOut',
        display: 'none',
      });
    }
  }, { dependencies: [isOpen], scope: container });

  return (
    <header 
      ref={container} 
      className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <nav
        ref={navRef}
        className={cn(
          "relative flex flex-col items-center pointer-events-auto",
          "w-full max-w-[95vw] md:w-auto md:min-w-125 lg:min-w-162.5",
          "bg-zinc-950/40 backdrop-blur-2xl border border-white/10",
          "rounded-[24px] md:rounded-[40px] shadow-2xl shadow-black/20 px-5 py-3 md:px-8 md:py-4.5"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <Link 
            href="/" 
            className="text-xl md:text-2xl dirtyline font-black tracking-[0.09em] leading-[0.70] text-white"
          >
            TFLclub
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[10px] lg:text-xs uppercase tracking-[0.2em] font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="md:hidden p-2 text-white focus:outline-none"
          >
            {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>

        <div
          ref={menuRef}
          className="hidden overflow-hidden w-full md:hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-6 py-8 mt-2 border-t border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="mobile-link text-lg font-light tracking-widest text-zinc-300 hover:text-white uppercase"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
