import { Navbar } from "@/components/public/ui/navbar/navbar";
import Footer from "@/components/ui/footer/footer";
import ContactDetails from "@/components/public/contact/contact-details";
import ContactForm from "@/components/public/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="sm:mt-24.5 md:mt-24.5 mt-22">
        <div className="w-full py-16 md:py-24">
            <div className="mx-auto px-2 sm:px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    <ContactDetails />
                    <ContactForm />
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}