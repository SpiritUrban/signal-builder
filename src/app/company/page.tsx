import type { Metadata } from "next";
import { CompanyInfoLibrary } from "@/components/CompanyInfoLibrary";

export const metadata: Metadata = {
  title: "Company Info — My Transfer",
  description: "Готові структуровані тексти та дані компанії My Transfer",
};

export default function CompanyPage() {
  return <CompanyInfoLibrary />;
}
