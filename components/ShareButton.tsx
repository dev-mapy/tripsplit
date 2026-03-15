"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";

interface Props {
  overrideUrl?: string;
}

export default function ShareButton({ overrideUrl }: Props = {}) {
  const { shareUrl: contextUrl, trip, isReadOnly } = useTrip();
  const [allowEditing, setAllowEditing] = useState(trip.isEditable ?? false);
  const [copied, setCopied] = useState(false);

  // Generate the URL with the correct 'ie' flag based on allowEditing
  const getShareUrl = () => {
    if (overrideUrl) return overrideUrl;
    if (!contextUrl) return "";

    const url = new URL(contextUrl);
    // Re-encode with the specific isEditable flag we want
    const currentTrip = { ...trip, isEditable: allowEditing };
    const { encodeTrip } = require("@/lib/share");
    url.searchParams.set("trip", encodeTrip(currentTrip));
    return url.toString();
  };

  const shareUrl = getShareUrl();

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
    <Card className="bg-gold/5 border-gold/20 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col">
          <Typography variant="small" className="font-bold text-gold tracking-wide">
            🔗 Shareable Link
          </Typography>
          <Typography variant="small" className="opacity-40 text-[11px]">
            Anyone with this link can view the split
          </Typography>
        </div>

        {!overrideUrl && !isReadOnly && (
          <label className="flex items-center gap-2 cursor-pointer group">
            <Typography variant="small" className="text-[10px] font-bold uppercase tracking-wider opacity-50 group-hover:opacity-100 transition-opacity text-right max-w-[120px] sm:max-w-none">
              Allow others to make their own version
            </Typography>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={allowEditing}
                onChange={(e) => setAllowEditing(e.target.checked)}
              />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
            </div>
          </label>
        )}
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
