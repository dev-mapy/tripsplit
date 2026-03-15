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

  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-bold font-sans transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:bg-brand-light hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-white/10 border border-white/10 text-text hover:bg-white/15 hover:border-white/20",
    ghost: "text-text-muted hover:text-white hover:bg-white/8",
    outline: "border-2 border-brand text-brand hover:bg-brand hover:text-white",
    danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-4 text-[17px] tracking-tight",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (isLink && !asChild) {
    return (
      <Link href={href} className={combinedClasses}>
        {props.children}
      </Link>
    );
  }

  const Comp = asChild ? Slot : "button";

  return <Comp className={combinedClasses} {...props} />;
}
