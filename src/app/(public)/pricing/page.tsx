"use client";

import { Navbar } from "@/components/public/ui/navbar/navbar";
import { WhyChooseSection } from "@/components/public/pricing/ui/why-choose-section";
import { PricingCardsSection } from "@/components/public/pricing/ui/pricing-cards-section";
import { SuccessStoriesSection } from "@/components/public/pricing/ui/sections/success-stories-section"; // New import
import { FaqSection } from "@/components/public/pricing/ui/sections/faq-section"; // New import
import Footer from "@/components/ui/footer/footer";
// Removed motion imports as they are now handled within the extracted components

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="sm:mt-24.5 md:mt-24.5 mt-22">
        <WhyChooseSection />
        <PricingCardsSection />
        <SuccessStoriesSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
