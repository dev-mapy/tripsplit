import type { Metadata } from "next";
import SplitApp from "@/components/SplitApp";

export const metadata: Metadata = {
  title: "Split Your Trip Expenses",
  description:
    "Add your group expenses, choose who paid and who splits, and instantly see the fairest settlement. Share one link with your group.",
  alternates: {
    canonical: "/split",
  },
  openGraph: {
    title: "Split Your Trip Expenses — TripSplit",
    description:
      "Add your group expenses and instantly see who owes what. Share one link with your group.",
    url: "/split",
  },
};

export default function Page() {
  return <SplitApp />;
}
