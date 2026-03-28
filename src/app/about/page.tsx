import { Zap, Shield, Heart, Globe } from "lucide-react";

export const metadata = {
  title: "About Us | CosmoxHub",
  description: "Learn more about the vision and mission behind CosmoxHub, a privacy-first platform providing free online tools for everyone.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050510] text-slate-300 font-inter">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Zap size={14} />
            <span>The Cosmox Vision</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-space font-bold text-white mb-6 leading-tight">
            Empowering the Internet with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Better Tools.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            CosmoxHub was born out of a simple idea: premium utilities should be accessible to everyone, without the hidden costs of privacy or complex signups.
          </p>
        </div>

        {/* Vision Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-32 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-space font-bold text-white">Behind the Screen</h2>
            <p className="leading-relaxed">
              CosmoxHub is the brainchild of a single visionary founder who believed that the web had become too cluttered with "free" tools that actually sold user data behind the scenes.
            </p>
            <p className="leading-relaxed">
              Every tool on this platform was built with a code-first, privacy-first mindset. By leveraging modern edge computing and browser-side processing, we ensure that your files never even hit our servers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
              <Shield className="text-indigo-400 mb-4" size={24} />
              <h3 className="text-white font-bold mb-2">Privacy</h3>
              <p className="text-xs text-slate-500">100% Client-side processing for your data.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
              <Zap className="text-violet-400 mb-4" size={24} />
              <h3 className="text-white font-bold mb-2">Speed</h3>
              <p className="text-xs text-slate-500">Instant results powered by lightweight code.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
              <Globe className="text-blue-400 mb-4" size={24} />
              <h3 className="text-white font-bold mb-2">Global</h3>
              <p className="text-xs text-slate-500">Available to everyone, everywhere, for free.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
              <Heart className="text-rose-400 mb-4" size={24} />
              <h3 className="text-white font-bold mb-2">Open</h3>
              <p className="text-xs text-slate-500">Transparent utilities built with love.</p>
            </div>
          </div>
        </div>

        {/* Promise Section */}
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-white/10 overflow-hidden text-center max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-violet-500/20 blur-[100px] rounded-full"></div>
          
          <h2 className="text-3xl font-space font-bold text-white mb-6 relative z-10">Our Eternal Promise</h2>
          <p className="text-slate-300 max-w-2xl mx-auto relative z-10 text-lg">
            CosmoxHub will never charge you for basic utilities. Our commitment to being free forever is backed by a lean infrastructure and a simple goal: to be the most helpful utility hub on the internet.
          </p>
          <div className="mt-8 relative z-10">
            <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">— CosmoxHub Team</span>
          </div>
        </div>
      </div>
    </div>
  );
}
