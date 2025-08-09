import { Navbar } from "@/components/home/ui/navbar/navbar";
import CtaSection from "@/components/home/ui/secctions/cta/cta-section";
import HeroSection from "@/components/home/ui/secctions/hero/hero-section";
import Footer from "@/components/home/ui/footer/footer";
import Example from "@/components/home/ui/secctions/example/example";

export default function page() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="sm:mt-24.5 md:mt-24.5 mt-22">
        <HeroSection />
        <Example />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
