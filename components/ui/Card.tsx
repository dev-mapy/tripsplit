import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function Card({ children, className = "", animate = false }: CardProps) {
  return (
    <div
      className={`bg-glass backdrop-blur-xl border border-glass-border rounded-3xl p-7 md:p-8 ${
        animate ? "animate-fade-up" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
