import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

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
    <Card className="p-7 md:p-8 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden group">
      {/* Accent glow */}
      <div
        className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-10 pointer-events-none blur-3xl transition-opacity group-hover:opacity-15"
        style={{ backgroundColor: accentColor }}
      />

      {/* Left: info */}
      <div className="flex-1 min-w-0">
        {/* Sponsored label */}
        <Typography variant="small" className="uppercase tracking-[2px] opacity-25 font-bold mb-4 block text-[9px]">
          Sponsored
        </Typography>

        {/* Logo + Name */}
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <Typography variant="h3" className="font-bold">{name}</Typography>
            <Typography variant="small" className="font-bold tracking-wide" style={{ color: accentColor }}>
              {tagline}
            </Typography>
          </div>
        </div>

        {/* Description */}
        <Typography variant="body" className="opacity-50 mb-6 leading-relaxed">
          {description}
        </Typography>

        {/* CTA Button */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 no-underline shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          {cta} →
        </a>
      </div>

      {/* Right: QR Code */}
      <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <div className="bg-white rounded-2xl p-2.5 shadow-2xl flex items-center justify-center">
          <Image
            src={qrCode}
            alt={`${name} QR code`}
            width={84}
            height={84}
            className="rounded-lg"
          />
        </div>
        <Typography variant="small" className="opacity-30 tracking-tight text-[10px] font-bold">
          Scan to open
        </Typography>
      </div>
    </Card>
  );
}
