import AffiliateCard from "@/components/AffiliateCard";

export default function YesimCard() {
  return (
    <AffiliateCard
      emoji="📡"
      name="Yesim"
      tagline="Travel eSIM"
      description="Stay connected anywhere with a travel eSIM. No physical SIM swap needed — instant data in 180+ countries."
      cta="Get connected before you land"
      href={process.env.NEXT_PUBLIC_YESIM_URL ?? "https://yesim.tpk.lu/zGSJseOC"}
      qrCode="/affiliates/yesim-qr-code.jpeg"
      accentColor="#f97316"
    />
  );
}
