"use client";

import { useEffect, useRef } from "react";

interface BackgroundVideoProps {
  className?: string;
  opacityClassName?: string;
  overlayClassName?: string;
}

export function BackgroundVideo({
  className = "w-full h-full object-cover filter brightness-95 contrast-105",
  opacityClassName = "opacity-65",
  overlayClassName = "bg-gradient-to-b from-[#080808]/75 via-[#080808]/30 to-[#080808]",
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay error:", err);
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${opacityClassName}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={className}
      >
        <source src="/bg-animation.mp4" type="video/mp4" />
      </video>
      {/* Sleek gradient overlay to ensure text contrast */}
      <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
    </div>
  );
}
