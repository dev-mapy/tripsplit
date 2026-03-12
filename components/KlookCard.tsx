import AffiliateCard from "@/components/AffiliateCard";

export default function KlookCard() {
  return (
    <AffiliateCard
      emoji="🎭"
      name="Klook"
      tagline="Tours & Activities"
      description="Discover tours, tickets, and experiences at your destination. Best price guaranteed."
      cta="Book activities for your trip"
      href={process.env.NEXT_PUBLIC_KLOOK_URL ?? "https://klook.tpk.lu/5aVCwLaU"}
      qrCode="/affiliates/klook-qr-code.jpeg"
      accentColor="#ef4444"
    />
  );
}
