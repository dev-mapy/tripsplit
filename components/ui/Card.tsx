import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export function Card({
  children,
  className = "",
  animate = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-glass backdrop-blur-xl border border-glass-border rounded-3xl p-7 md:p-8 ${
        animate ? "animate-fade-up" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
