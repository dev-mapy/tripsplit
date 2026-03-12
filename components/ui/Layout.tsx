import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  className?: string;
}

export function Container({ children, maxWidth = 1000, className = "" }: ContainerProps) {
  return (
    <div
      className={`relative z-10 px-6 mx-auto ${className}`}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export function Section({ children, className = "", padding = "py-20 md:py-30" }: SectionProps) {
  return <section className={`${padding} ${className}`}>{children}</section>;
}
