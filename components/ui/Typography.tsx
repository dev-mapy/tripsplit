import React from "react";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  variant?: "h1" | "h2" | "h3" | "body" | "small" | "sub" | "eyebrow";
}

export function Typography({
  as: Component = "p" as any,
  variant = "body",
  className = "",
  children,
  ...props
}: TypographyProps) {
  const styles = {
    h1: "font-sans text-[clamp(40px,7vw,72px)] font-black leading-[1.05] tracking-tight",
    h2: "font-sans text-[clamp(24px,5vw,42px)] font-black tracking-tight",
    h3: "font-sans text-[clamp(18px,4.5vw,24px)] font-bold tracking-tight",
    body: "font-sans text-[clamp(16px,2.5vw,18px)] text-text-muted leading-relaxed",
    small: "font-sans text-sm text-text-muted leading-normal",
    sub: "font-sans text-xs uppercase tracking-widest text-text-faint font-bold",
    eyebrow: "font-sans text-[11px] font-black tracking-[2px] uppercase text-brand",
  };

  return (
    <Component className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
