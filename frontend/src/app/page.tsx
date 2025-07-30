"use client";
// import SiteNavbar from "@/components/layout/site-navbar"; // Not needed if already imported by HeroSectionOne
import { HeroSectionOne } from "@/components/ui/hero";
import SiteNavbar from "@/components/layout/site-navbar"; // Ensure SiteNavbar is imported for direct use here if not nested

export default function HomePage() {
  return (
    // Render SiteNavbar directly
    <div className="relative w-full">
      <SiteNavbar /> {/* SiteNavbar is now self-sufficient regarding user data */}
      <HeroSectionOne />
    </div>
  );
}