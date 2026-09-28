"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Only show once per session to avoid blocking return navigation or repeated audits
    try {
      const seen = sessionStorage.getItem("ormission_splash_seen");
      if (!seen) {
        sessionStorage.setItem("ormission_splash_seen", "1");
        setIsVisible(true);
        // Start fade-out after a brief display
        const fadeTimer = setTimeout(() => {
          setIsFading(true);
        }, 150);
        // Remove from DOM after fade completes
        const removeTimer = setTimeout(() => {
          setIsVisible(false);
        }, 350);
        return () => {
          clearTimeout(fadeTimer);
          clearTimeout(removeTimer);
        };
      }
    } catch {}
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#050A18] select-none"
      style={{
        opacity: isFading ? 0 : 1,
        transition: "opacity 0.2s ease-out",
      }}
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />

      {/* Minimal Elegant Brand Centerpiece */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Glowing Logo Badge */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(1,44,148,0.7)] flex items-center justify-center overflow-hidden mb-3">
          <Image
            src="/images/brand-logo-v2.png"
            alt="Ormission Logo"
            width={80}
            height={80}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Brand Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
          <span>Orm</span>
          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
            ission
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-blue-200/80 uppercase mt-1">
          Learn · Build · Grow
        </p>
      </div>
    </div>
  );
}
