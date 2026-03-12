import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  href?: string;
}

export function Button({ variant = "primary", href, children, className = "", ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold font-sans transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-linear-to-br from-gold-warm to-gold text-[#1a1a2e] px-9 py-4 text-[17px] tracking-[0.3px] shadow-[0_8px_32px_rgba(247,151,30,0.35)] hover:scale-105 active:scale-95",
    ghost: "bg-white/8 border border-white/15 text-text px-[18px] py-[10px] text-sm hover:bg-white/12",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
