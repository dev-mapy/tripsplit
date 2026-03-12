import Image from "next/image";

interface AffiliateCardProps {
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  cta: string;
  href: string;
  qrCode: string;
  accentColor: string;
}

export default function AffiliateCard({
  emoji,
  name,
  tagline,
  description,
  cta,
  href,
  qrCode,
  accentColor,
}: AffiliateCardProps) {
  return (
    <div
      style={{
        background: "var(--glass)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
        borderRadius: 20,
        padding: "20px 24px",
        display: "flex",
        gap: 20,
        alignItems: "center",
        flexWrap: "wrap",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.07,
          pointerEvents: "none",
          filter: "blur(30px)",
        }}
      />

      {/* Left: info */}
      <div style={{ flex: 1, minWidth: 200 }}>
        {/* Sponsored label */}
        <div
          style={{
            fontSize: 10,
            fontFamily: "'Lato', sans-serif",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "rgba(240,235,227,0.25)",
            marginBottom: 10,
          }}
        >
          Sponsored
        </div>

        {/* Logo + Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>{emoji}</span>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 17,
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 12,
                color: accentColor,
                fontWeight: 700,
                letterSpacing: "0.3px",
              }}
            >
              {tagline}
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            color: "rgba(240,235,227,0.5)",
            lineHeight: 1.6,
            margin: "0 0 16px",
          }}
        >
          {description}
        </p>

        {/* CTA Button */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: "inline-block",
            background: accentColor,
            color: "#fff",
            borderRadius: 10,
            padding: "10px 20px",
            fontFamily: "'Lato', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none",
            letterSpacing: "0.3px",
          }}
        >
          {cta} →
        </a>
      </div>

      {/* Right: QR Code */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 8,
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={qrCode}
            alt={`${name} QR code`}
            width={80}
            height={80}
            style={{ borderRadius: 6 }}
          />
        </div>
        <div
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 10,
            color: "rgba(240,235,227,0.3)",
            textAlign: "center",
            letterSpacing: "0.3px",
          }}
        >
          Scan to open
        </div>
      </div>
    </div>
  );
}
