"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";

interface Props {
  overrideUrl?: string;
}

export default function ShareButton({ overrideUrl }: Props = {}) {
  const { shareUrl: contextUrl } = useTrip();
  const shareUrl = overrideUrl ?? contextUrl;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers or insecure contexts
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!shareUrl) return null;

  return (
    <Card className="bg-gold/5 border-gold/20 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Typography variant="small" className="font-bold text-gold tracking-wide">
          🔗 Shareable Link
        </Typography>
        <Typography variant="small" className="opacity-40 text-[11px]">
          Anyone with this link can view the split
        </Typography>
      </div>

      <div className="flex gap-2 items-stretch">
        <div className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 overflow-hidden flex items-center">
          <span className="font-mono text-xs text-text-muted truncate opacity-80">
            {shareUrl}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`
            px-5 rounded-xl font-bold text-sm transition-all border cursor-pointer
            ${copied
              ? "bg-green-500/20 border-green-500/50 text-green-400"
              : "bg-gold/15 border-gold/30 text-gold hover:bg-gold/25"}
          `}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
    </Card>
  );
}
