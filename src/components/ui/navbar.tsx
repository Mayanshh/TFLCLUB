'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Speakers', href: '#' },
  { name: 'Benefits', href: '#' },
  { name: 'Venue', href: '#' },
  { name: 'About', href: '#' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.2,
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // 2. Mobile Menu Toggle Animation
  useLayoutEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      gsap.to(menuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        display: 'block',
      });
      // Staggered link entrance
      gsap.fromTo(
        '.mobile-link',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        display: 'none',
      });
    }
  }, [isOpen]);

  return (
    <div ref={container} className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        ref={navRef}
        className="
          relative flex flex-col items-center
          w-full md:w-1/3 min-w-85 lg:min-w-150
          bg-zinc-950/40 backdrop-blur-2xl 
          rounded-[40px] shadow-2xl shadow-black/10 px-6 py-4.5
        "
      >
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo */}
          <h1 className="text-2xl dirtyline font-black tracking-[0.09em]! leading-[0.70] text-zinc-900 dark:text-[#fffef1]">
            TFLclub
          </h1>

          {/* Center: Desktop Items */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm uppercase tracking-widest font-light text-zinc-300 hover:text-zinc-900 dark:hover:text-[#fffef1] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right: Hamburger (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-900 dark:text-[#fffef1] focus:outline-none"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown (Animated via GSAP) */}
        <div
          ref={menuRef}
          className="hidden overflow-hidden w-full md:hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-4 py-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="mobile-link text-lg font-medium text-zinc-800 dark:text-zinc-200"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;