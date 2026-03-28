export const metadata = {
  title: "Terms of Service | CosmoxHub",
  description: "Read our rules of usage: CosmoxHub is free for everyone, providing ethical and privacy-first online tools.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050510] text-slate-300 py-20 px-4 font-inter leading-relaxed">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-64 h-64 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 bg-violet-500/10 blur-[120px] rounded-full"></div>
        
        <h1 className="text-4xl md:text-5xl font-space font-bold text-white mb-8 relative z-10 tracking-tight">
          Terms of Service
        </h1>
        
        <div className="space-y-10 relative z-10 text-slate-400">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using CosmoxHub, you agree to follow and be bound by these Terms of Service. 
              If you do not agree with any part of these terms, please refrain from using our tools and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>
              CosmoxHub provides various free online utility tools (such as PDF editors, Image converters, 
              and text tools). These tools are provided "as is" and "as available." While we strive for 
              perfection, output accuracy is not 100% guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Permitted and Ethical Use</h2>
            <p>
              You agree to use our tools only for lawful, ethical purposes. You may not use CosmoxHub to 
              generate or process harmful, illegal, or malicious content. We reserve the right to 
              limit access to any user found violating these principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Intellectual Property</h2>
            <p>
              The CosmoxHub branding, original user interface designs, and site-specific code are 
              the property of the CosmoxHub founder. You may use our tools freely for personal or 
              commercial use, but you may not scrape, clone, or redistribute our site's original assets without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
            <p>
              CosmoxHub is not liable for any direct or indirect damages resulting from the use (or inability 
              to use) our tools. Since all processing is done locally in your browser, the founder is not responsible 
              for data loss or hardware failures that occur during tool usage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Advertising Policy</h2>
            <p>
              We prioritize user experience; however, to maintain zero-cost availability, we display 
              advertisements. By using the site, you acknowledge that our third-party ad partners may 
              display promotional material based on anonymous browsing history.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be reflected with 
              an updated "Last Modified" date at the bottom. Continued use of the site signifies your 
              acceptance of any new terms.
            </p>
          </section>

          <div className="pt-8 text-xs text-slate-500 italic">
            Last Updated: March 2026
          </div>
        </div>
      </div>
    </div>
  );
}
