import { Navbar } from "@/components/public/ui/navbar/navbar";
import Footer from "@/components/ui/footer/footer";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-20 sm:pt-24 md:pt-28">
        <div className="w-full py-16 md:py-24">
          <div className="mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Terms of Service
              </h1>
              <p className="text-white/70 mt-2">Last updated: August 10, 2025</p>
            </div>

            <div className="prose prose-invert prose-lg max-w-none mx-auto text-white/80 space-y-6">
              <p className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-300/80 text-base">
                <strong>Disclaimer:</strong> This is a template Terms of Service and not legal advice. You should consult with a legal professional to ensure this document meets your specific needs.
              </p>
              
              <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
              <p>
                By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We may update these terms from time to time, and your continued use of the services constitutes acceptance of those changes.
              </p>

              <h2 className="text-2xl font-bold text-white">2. User Responsibilities</h2>
              <p>
                You are responsible for your use of the services and for any content you provide, including compliance with applicable laws, rules, and regulations. You should only provide content that you are comfortable sharing with others.
              </p>
              
              <h2 className="text-2xl font-bold text-white">3. Intellectual Property Rights</h2>
              <p>
                All content included on the service, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the site, is the property of Novack or its suppliers and protected by copyright and other laws.
              </p>

              <h2 className="text-2xl font-bold text-white">4. Prohibited Activities</h2>
              <p>
                You may not access or use the Service for any purpose other than that for which we make the Service available. Prohibited activity includes, but is not limited to:
              </p>
              <ul>
                <li>Engaging in any automated use of the system, such as using scripts to send comments or messages.</li>
                <li>Interfering with, disrupting, or creating an undue burden on the Service or the networks or services connected to the Service.</li>
                <li>Attempting to impersonate another user or person.</li>
                <li>Using any information obtained from the Service in order to harass, abuse, or harm another person.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white">5. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not in breach of the Terms.
              </p>

              <h2 className="text-2xl font-bold text-white">6. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-white">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
                <br />
                Novack Inc.
                <br />
                Email: legal@novack.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;