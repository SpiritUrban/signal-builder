import type { Metadata } from "next";
import { RoadmapDashboard } from "@/components/RoadmapDashboard";

export const metadata: Metadata = {
  title: "Закриті сервіси — My Transfer",
  description: "Архів закритих SEO-каталогів і сервісів My Transfer",
};

export default function ClosedServicesPage() {
  return <RoadmapDashboard view="closed" />;
}
