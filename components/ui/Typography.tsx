import React from "react";

interface TypographyProps {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  variant?: "h1" | "h2" | "h3" | "body" | "sub" | "eyebrow";
  className?: string;
  children: React.ReactNode;
}

export function Typography({
  as: Component = "p",
  variant = "body",
  className = "",
  children,
}: TypographyProps) {
  const styles = {
    h1: "font-serif text-[clamp(40px,7vw,72px)] font-bold leading-[1.1] mb-7 animate-fade-up [animation-delay:0.1s]",
    h2: "font-serif text-[clamp(28px,4vw,42px)] font-bold mb-0 animate-fade-up [animation-delay:0.1s]",
    h3: "font-serif text-[22px] font-semibold mb-3",
    body: "font-sans text-[clamp(16px,2.5vw,20px)] text-text-muted leading-[1.7] mb-12 animate-fade-up [animation-delay:0.2s]",
    sub: "font-sans text-xs uppercase tracking-wider text-text-faint mb-4",
    eyebrow: "font-sans text-[11px] font-bold tracking-[2px] uppercase text-text-muted mb-4 animate-fade-up",
  };

  return <Component className={`${styles[variant]} ${className}`}>{children}</Component>;
}
