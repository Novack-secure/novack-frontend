import { Navbar } from "@/components/public/ui/navbar/navbar";
import Footer from "@/components/ui/footer/footer";
import HeroSection from "@/components/public/features/ui/sections/hero-section";
import BentoSection from "@/components/public/features/ui/sections/bento-section";
import HowItWorksSection from "@/components/public/features/ui/sections/how-it-works-section";
import FaqSection from "@/components/public/features/ui/sections/faq-section";
import CtaSection from "@/components/public/features/ui/sections/cta-section";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20 sm:pt-24 md:pt-28">
        <HeroSection />
        <BentoSection />
        <HowItWorksSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}