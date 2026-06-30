import type { Metadata } from "next";
import { ContentVariantsLibrary } from "@/components/ContentVariantsLibrary";

export const metadata: Metadata = {
  title: "Варіанти контенту — My Transfer",
  description: "Готові варіанти контенту для публікацій My Transfer",
};

export default function ContentPage() {
  return <ContentVariantsLibrary />;
}
