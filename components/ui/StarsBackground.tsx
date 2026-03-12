import React from "react";

interface StarsBackgroundProps {
  count?: number;
}

export function StarsBackground({ count = 50 }: StarsBackgroundProps) {
  const stars = Array.from({ length: count }, (_, i) => ({
    top: `${(i * 37 + 11) % 100}%`,
    left: `${(i * 61 + 7) % 100}%`,
    size: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
    opacity: 0.2 + (i % 5) * 0.1,
    duration: 2 + (i % 4),
    delay: (i % 5) * 0.6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            top: s.top,
            left: s.left,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
