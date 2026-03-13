import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  variant?: "full" | "centered";
  className?: string;
}

export function Layout({ children, variant = "full", className = "" }: LayoutProps) {
  const maxWidth = variant === "centered" ? 720 : 1200;

  return (
    <main className={`min-h-screen pb-20 relative overflow-hidden bg-bg-deep text-text ${className}`}>
      <div
        className="relative z-10 px-6 mx-auto pt-10"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </main>
  );
}

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
