"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-black/5 shadow-xs" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">

        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3" y="3" width="22" height="22" rx="5"
              stroke="currentColor" strokeWidth="2.5" className="text-black"
            />
            <path
              d="M8 18L12 12L16 16L20 8"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-indigo-600"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight text-black">
            Sketchly
          </span>
        </Link>

        {/* Right: Nav links & CTA */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-black/70 hover:text-black transition-colors"
          >
            Features
          </Link>
          <Link
            href="#demo"
            className="text-sm font-medium text-black/70 hover:text-black transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/room"
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 active:scale-95 transition-all"
          >
            Open App
          </Link>
        </div>

      </div>
    </nav>
  );
}