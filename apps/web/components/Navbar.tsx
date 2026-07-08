"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    
      
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between py-6 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 16L10 8L14 13L19 5"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="text-2xl font-bold tracking-tight text-black">
            Sketchly
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-10">
          <Link
            href="#features"
            className="text-lg font-medium text-black/70 transition hover:text-black"
          >
            Features
          </Link>

          <Link
            href="#demo"
            className="text-lg font-medium text-black/70 transition hover:text-black"
          >
            Demo
          </Link>

          <Link
            href="/signin"
            className="text-lg font-medium text-black/70 transition hover:text-black"
          >
            Sign in
          </Link>

          <Link
            href="/room"
            className="rounded-2xl bg-black px-6 py-3 text-lg font-semibold text-white transition hover:bg-black/90"
          >
            Open App
          </Link>
        </div>
      </div>
    </nav>
   
  );
} 