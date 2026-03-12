import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export function Badge({ children, icon, className = "" }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-4 py-1.5 text-[13px] text-gold font-sans font-bold tracking-[0.5px] uppercase animate-fade-up ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
}
