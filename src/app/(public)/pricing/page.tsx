"use client";

import { Navbar } from "@/components/public/ui/navbar/navbar";
import { WhyChooseSection } from "@/components/public/pricing/ui/why-choose-section";
import { PricingCardsSection } from "@/components/public/pricing/ui/pricing-cards-section";
import { TipsSection } from "@/components/public/pricing/ui/sections/tips-section"; // New import
import { FaqSection } from "@/components/public/pricing/ui/sections/faq-section"; // New import
import Footer from "@/components/ui/footer/footer";
// Removed motion imports as they are now handled within the extracted components

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20 sm:pt-24 md:pt-28">
        <WhyChooseSection />
        <PricingCardsSection />
        <TipsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
