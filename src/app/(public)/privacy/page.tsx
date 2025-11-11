import { Navbar } from "@/components/public/ui/navbar/navbar";
import Footer from "@/components/ui/footer/footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-20 sm:pt-24 md:pt-28">
        <div className="w-full py-16 md:py-24">
          <div className="mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Privacy Policy
              </h1>
              <p className="text-white/70 mt-2">Last updated: August 10, 2025</p>
            </div>

            <div className="prose prose-invert prose-lg max-w-none mx-auto text-white/80 space-y-6">
              <p className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-300/80 text-base">
                <strong>Disclaimer:</strong> This is a template privacy policy and not legal advice. You should consult with a legal professional to ensure this policy meets your specific needs and complies with all applicable laws.
              </p>
              
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
              <p>
                Welcome to Novack. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our services.
              </p>

              <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
              <p>
                We may collect information about you in a variety of ways. The information we may collect on the Service includes:
              </p>
              <ul>
                <li>
                  <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Service or when you choose to participate in various activities related to the Service.
                </li>
                <li>
                  <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white">3. How We Use Your Information</h2>
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
              </p>
              <ul>
                <li>Create and manage your account.</li>
                <li>Email you regarding your account or order.</li>
                <li>Enable user-to-user communications.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                <li>Notify you of updates to the Service.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>

              <h2 className="text-2xl font-bold text-white">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data. You can also object to or restrict the processing of your data. You can exercise these rights by contacting us using the contact information provided below.
              </p>

              <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
                <br />
                Novack Inc.
                <br />
                Email: privacy@novack.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;