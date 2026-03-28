import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-indigo-500/10 bg-[#050510]/90 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-md flex items-center justify-center">
                <Zap size={14} color="white" className="stroke-[2.5]" />
              </div>
              <span className="font-space font-bold text-lg text-slate-100">
                Cosmox<span className="text-indigo-500">Hub</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[220px]">
              Free online tools for everyone. No signup, no limits, no cost.
            </p>
          </div>

          {/* PDF Tools */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-4">PDF Tools</h4>
            {["Merge PDF", "Split PDF", "Image to PDF", "PDF to Image"].map((t) => (
              <Link key={t} href={`/tools/${t.toLowerCase().replace(/ /g, "-")}`}
                className="block text-slate-400 text-sm mb-2 transition-colors duration-200 hover:text-slate-300"
              >{t}</Link>
            ))}
          </div>

          {/* Text & Image */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-4">Text & Image</h4>
            {["Word Counter", "Case Converter", "PNG to JPG", "Image Resizer"].map((t) => (
              <Link key={t} href={`/tools/${t.toLowerCase().replace(/ /g, "-")}`}
                className="block text-slate-400 text-sm mb-2 transition-colors duration-200 hover:text-slate-300"
              >{t}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-4">Company</h4>
            {[
              { name: "About Us", href: "/about" },
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
            ].map((link) => (
              <Link key={link.name} href={link.href}
                className="block text-slate-400 text-sm mb-2 transition-colors duration-200 hover:text-slate-300"
              >{link.name}</Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-indigo-500/10 gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} CosmoxHub. All tools are free forever.
          </p>
          <p className="text-slate-600 text-sm">
            Built with ❤️ for the internet — No data stored. Ever.
          </p>
        </div>
      </div>
    </footer>
  );
}
