"use client";

import { useEffect, useState } from "react";

interface UserWatermarkProps {
  /** The text to display (e.g. "Student Name • 017XXXXXXXX • ID: 1234") */
  text?: string;
  /** Opacity of the watermark (0-1), default: 0.28 */
  opacity?: number;
  /** How often (in seconds) the watermark moves, default: 12 */
  intervalSeconds?: number;
}

/**
 * UserWatermark
 * 
 * Dynamic anti-piracy floating watermark.
 * Moves to random positions across the video viewport periodically.
 * If a student attempts to screen-record or share footage, their identity
 * (name, phone, student ID) is permanently embedded into the video.
 */
export function UserWatermark({
  text,
  opacity = 0.28,
  intervalSeconds = 12,
}: UserWatermarkProps) {
  const [position, setPosition] = useState({ top: "20%", left: "25%" });

  useEffect(() => {
    if (!text) return;

    const moveWatermark = () => {
      // Random coordinates between 10% and 80% to keep watermark within bounds
      const randomTop = Math.floor(Math.random() * 70 + 10);
      const randomLeft = Math.floor(Math.random() * 65 + 10);
      setPosition({
        top: `${randomTop}%`,
        left: `${randomLeft}%`,
      });
    };

    // Initial random position
    moveWatermark();

    const interval = setInterval(moveWatermark, intervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [text, intervalSeconds]);

  if (!text) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-25">
      <div
        style={{
          top: position.top,
          left: position.left,
          opacity,
          transition: "top 2.5s ease-in-out, left 2.5s ease-in-out",
        }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-[1px] border border-white/10 text-white/90 text-[10px] sm:text-xs font-mono font-medium whitespace-nowrap tracking-wider shadow-lg flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
        <span>{text}</span>
      </div>
    </div>
  );
}
