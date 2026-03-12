"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";

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
    <div style={wrapper}>
      <div style={labelRow}>
        <span style={label}>🔗 Shareable Link</span>
        <span style={hint}>Anyone with this link can view the split</span>
      </div>

      <div style={linkRow}>
        <div style={urlBox}>
          <span style={urlText}>{shareUrl}</span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            ...copyBtn,
            background: copied
              ? "rgba(74,222,128,0.2)"
              : "rgba(255,210,0,0.15)",
            borderColor: copied
              ? "rgba(74,222,128,0.5)"
              : "rgba(255,210,0,0.3)",
            color: copied ? "#4ade80" : "#ffd200",
          }}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

const wrapper: React.CSSProperties = {
  background: "rgba(255,210,0,0.06)",
  border: "1px solid rgba(255,210,0,0.2)",
  borderRadius: 16,
  padding: "18px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const labelRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 6,
};

const label: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#ffd200",
  letterSpacing: "0.3px",
};

const hint: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(240,235,227,0.4)",
};

const linkRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "stretch",
};

const urlBox: React.CSSProperties = {
  flex: 1,
  background: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 14px",
  overflow: "hidden",
};

const urlText: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(240,235,227,0.6)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "block",
  fontFamily: "monospace",
};

const copyBtn: React.CSSProperties = {
  border: "1px solid",
  borderRadius: 10,
  padding: "10px 18px",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
};
