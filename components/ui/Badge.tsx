import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export function Badge({ children, icon, className = "" }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 text-[12px] text-brand-light font-sans font-black tracking-widest uppercase animate-fade-up ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
}
