"use client";

import { useEffect, useState } from "react";
import { Typography } from "./Typography";
import { Button } from "./Button";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  duration?: number;
  onClose: () => void;
  onRetry?: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 5000,
  onClose,
  onRetry,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    error: "bg-red-500/10 border-red-500/20",
    success: "bg-green-500/10 border-green-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
  }[type];

  const textColor = {
    error: "text-red-400",
    success: "text-green-400",
    info: "text-blue-400",
  }[type];

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] min-w-[320px] max-w-[90vw] p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      } ${bgColor}`}
    >
      <div className="flex items-center justify-between gap-4">
        <Typography variant="small" className={`font-bold ${textColor}`}>
          {type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️"} {message}
        </Typography>
        <div className="flex items-center gap-2">
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry} className="h-8 py-0 px-3 text-[11px]">
              Retry
            </Button>
          )}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="opacity-40 hover:opacity-100 transition-opacity p-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
