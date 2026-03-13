import React from "react";

interface TypographyProps {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  variant?: "h1" | "h2" | "h3" | "body" | "small" | "sub" | "eyebrow";
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
    h1: "font-serif text-[clamp(40px,7vw,72px)] font-bold leading-[1.1]",
    h2: "font-serif text-[clamp(28px,4vw,42px)] font-bold",
    h3: "font-serif text-[22px] font-semibold",
    body: "font-sans text-[clamp(16px,2.5vw,20px)] text-text-muted leading-relaxed",
    small: "font-sans text-sm text-text-muted leading-normal",
    sub: "font-sans text-xs uppercase tracking-wider text-text-faint",
    eyebrow: "font-sans text-[11px] font-bold tracking-[2px] uppercase text-text-muted",
  };

  return <Component className={`${styles[variant]} ${className}`}>{children}</Component>;
}
