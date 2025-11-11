import { Navbar } from "@/components/public/ui/navbar/navbar";
import Footer from "@/components/ui/footer/footer";

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-20 sm:pt-24 md:pt-28">
        <div className="w-full py-16 md:py-24">
          <div className="mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Cookie Policy
              </h1>
              <p className="text-white/70 mt-2">Last updated: August 10, 2025</p>
            </div>

            <div className="prose prose-invert prose-lg max-w-none mx-auto text-white/80 space-y-6">
              <p className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-300/80 text-base">
                <strong>Disclaimer:</strong> This is a template cookie policy and not legal advice. You should consult with a legal professional to ensure this policy meets your specific needs.
              </p>
              
              <h2 className="text-2xl font-bold text-white">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
              </p>

              <h2 className="text-2xl font-bold text-white">2. How We Use Cookies</h2>
              <p>
                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
              </p>
              <ul>
                <li>
                  <strong>Account related cookies:</strong> If you create an account with us, then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out; however, in some cases, they may remain afterward to remember your site preferences when logged out.
                </li>
                <li>
                  <strong>Session cookies:</strong> We use session cookies to operate our Service. These are temporary cookies that are erased when you close your browser.
                </li>
                 <li>
                  <strong>Analytics cookies:</strong> These cookies allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white">3. Disabling Cookies</h2>
              <p>
                You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site.
              </p>

              <h2 className="text-2xl font-bold text-white">4. More Information</h2>
              <p>
                Hopefully, that has clarified things for you. If you are still looking for more information, then you can contact us through one of our preferred contact methods.
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

export default CookiePolicyPage;