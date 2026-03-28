export const metadata = {
  title: "Privacy Policy | CosmoxHub",
  description: "Read our privacy commitment: No data storage, no user tracking, and 100% privacy-focused online tools.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050510] text-slate-300 py-20 px-4 font-inter leading-relaxed">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-64 h-64 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 bg-violet-500/10 blur-[120px] rounded-full"></div>
        
        <h1 className="text-4xl md:text-5xl font-space font-bold text-white mb-8 relative z-10 tracking-tight">
          Privacy Policy
        </h1>
        
        <div className="space-y-10 relative z-10 text-slate-400">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Our Core Privacy Commitment</h2>
            <p>
              At CosmoxHub, privacy is not an afterthought—it's the core of everything we build. We believe that 
              utility should never come at the cost of your personal data. We are committed to maintaining a 
              transparent, secure environment for all users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Zero Data Collection</h2>
            <p>
              The most important thing you should know: **We do not collect, store, or share your personal data.** 
            </p>
            <p className="mt-4">
              When you use our PDF tools, Image converters, or text utilities, the processing happens entirely within your 
              own browser using client-side technologies. Your files are never uploaded to our servers, and we have 
              no access to your private documents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Log Data and Analytics</h2>
            <p>
              Like most websites, we use standard analytics tools (such as Google Analytics) to understand how 
              users interact with the site. This tracking is anonymous and helps us improve our tools based on 
              usage patterns (e.g., seeing which tools are most popular).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Advertising and Partners</h2>
            <p>
              To keep CosmoxHub free forever, we work with third-party advertising partners. These partners may use 
              cookies or similar tracking technologies to provide relevant ads. These technologies are managed 
              directly by the ad networks and help sustain our infrastructure costs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Use of Cookies</h2>
            <p>
              We use functional session cookies to provide a better user experience (such as maintaining your 
              preferences across page visits). You can disable cookies in your browser settings, though some 
              interactive features might be affected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Security</h2>
            <p>
              While no method of internet transmission is 100% secure, we use industry-standard HTTPS encryption 
              and client-side processing to minimize risks. Since we don't store your data, there is no database 
              of user files to be compromised.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out to the CosmoxHub team at 
              eclipsonai@gmail.com.
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
