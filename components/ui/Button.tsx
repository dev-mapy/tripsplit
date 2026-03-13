import React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  href,
  className = "",
  ...props
}: ButtonProps) {
  const isLink = typeof href === "string";
  const Comp = asChild ? Slot : isLink ? "a" : "button";

  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-bold font-sans transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-linear-to-br from-gold-warm to-gold text-bg-deep shadow-[0_8px_32px_rgba(247,151,30,0.35)] hover:scale-105 active:scale-95",
    secondary:
      "bg-white/10 border border-white/20 text-text hover:bg-white/20 hover:border-white/30",
    ghost: "text-text-muted hover:text-white hover:bg-white/8",
    outline: "border-2 border-gold text-gold hover:bg-gold hover:text-bg-deep",
    danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-[18px] py-[10px] text-[15px]",
    lg: "px-9 py-4 text-[17px] tracking-[0.3px]",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (isLink && !asChild) {
    return (
      <Link href={href} className={combinedClasses}>
        {props.children}
      </Link>
    );
  }

  return <Comp className={combinedClasses} {...props} />;
}
