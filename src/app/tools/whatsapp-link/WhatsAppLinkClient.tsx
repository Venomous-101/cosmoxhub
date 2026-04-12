"use client";

import { useState, useMemo } from "react";
import { 
  MessageSquare, 
  Copy, 
  CheckCircle2, 
  Settings, 
  Zap, 
  Sparkles, 
  Phone, 
  QrCode,
  ExternalLink,
  Smartphone,
  HelpCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import ToolGuide from "@/components/ToolGuide";
import { motion, AnimatePresence } from "framer-motion";
import { QRCode } from "react-qrcode-logo";

export default function WhatsAppLinkClient() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const guideSections = [
    {
      title: "How to Use (Easy Steps)",
      content: "1. Enter your phone number starting with the country code (e.g., 92 for Pakistan). 2. Type your greeting or pre-filled message in the 'Default Dispatch' box. 3. Check the 'WA.ME Link Protocol' card for a live preview. 4. Click 'Extract Link' to copy or toggle the 'QR Code' icon. 5. Share your link via social media or buttons.",
      icon: HelpCircle
    },
    {
      title: "Direct Chat Protocol",
      content: "We use the official WhatsApp 'Click to Chat' API (wa.me). This allows you to start a direct coversation with someone without having their phone number saved in your phone's address book.",
      icon: Zap
    },
    {
      title: "Pre-filled Message Magic",
      content: "Increase conversion rates by using pre-filled messages. When a user clicks your link, the message automatically appears in their text field, making it easier for them to start the conversation with you.",
      icon: MessageSquare
    },
    {
      title: "Privacy and Security",
      content: "CosmoxHub is a zero-tracking platform. We don't log phone numbers or messages. All link generation happens locally in your browser, ensuring your business leads and personal data remain confidential.",
      icon: Phone
    }
  ];

  const faqs = [
    {
      question: "Do I need to include the '+' sign in the phone number?",
      answer: "No. Our tool automatically cleans the number. Just enter the country code followed by the mobile number (e.g., 923001234567)."
    },
    {
      question: "Can I use this link on Instagram or TikTok?",
      answer: "Yes! This is perfect for 'Link in Bio' sections. It provides a professional way for your followers to reach you directly on WhatsApp."
    },
    {
      question: "Is there a limit to the message length?",
      answer: "While there isn't a strict limit, we recommend keeping pre-filled messages concise (under 500 characters) for the best mobile user experience."
    }
  ];

  const waLink = useMemo(() => {
    if (!phoneNumber) return "";
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const encodedMsg = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMsg}` : ""}`;
  }, [phoneNumber, message]);

  const copyToClipboard = () => {
    if (!waLink) return;
    navigator.clipboard.writeText(waLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="WhatsApp Link Generator - Free Online Utility Tool"
      description="Forge professional WhatsApp chat links with pre-filled messages using our high-speed free online tool. 100% private and mobile-optimized."
      icon={MessageSquare}
      color="#22c55e"
    >
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[3.5rem] -z-10" />
            
            <div className="bg-[#0a0a1a]/80 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Smartphone size={120} className="text-white" />
                </div>

                <div className="relative group/card w-full max-w-sm">
                    <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative bg-[#050510] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden ring-1 ring-white/10">
                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                <MessageSquare size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Secure Direct Link</div>
                                <div className="text-sm font-black text-white tracking-tighter">WA.ME Link Protocol</div>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 relative">
                                <div className="text-[9px] font-black uppercase text-slate-500 mb-2">Target Identity</div>
                                <div className="text-lg font-black text-white tracking-widest font-mono text-ellipsis overflow-hidden">
                                    {phoneNumber || '+00 000 000 0000'}
                                </div>
                            </div>

                            <div className="bg-emerald-500/10 p-5 rounded-2xl rounded-tr-none border border-emerald-500/20 relative">
                                <div className="text-[9px] font-black uppercase text-emerald-500 mb-2 italic">Automated Dispatch Message</div>
                                <p className="text-xs font-medium text-slate-300 leading-relaxed italic break-words">
                                    {message || 'Type your message in the sidebar to preview...'}
                                </p>
                                <div className="absolute top-0 right-0 -mr-1 -mt-1">
                                    <ClaritySparklesIcon size={12} className="text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                             <button
                                onClick={copyToClipboard}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black px-4 uppercase tracking-[0.1em] transition-all border ${
                                    copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
                                } shadow-xl`}
                             >
                                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                {copied ? 'CAPTURED' : 'EXTRACT LINK'}
                             </button>
                             <button 
                                onClick={() => setShowQR(!showQR)}
                                aria-label="Toggle QR code"
                                title="Toggle QR code"
                                className={`p-3 rounded-xl transition-all border ${
                                    showQR ? "bg-white/10 text-white border-white/20" : "bg-white/5 text-slate-500 border-white/5 hover:border-emerald-500/30"
                                }`}
                             >
                                <QrCode size={18} />
                             </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showQR && waLink && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a1a]/95 backdrop-blur-xl p-10"
                        >
                            <div className="text-center group/qr relative">
                               <div className="absolute -inset-8 bg-emerald-500/5 rounded-full blur-3xl opacity-50 group-hover/qr:opacity-100 transition-opacity" />
                                <div className="bg-white p-4 rounded-3xl mb-6 relative z-10">
                                    <QRCode value={waLink} size={200} fgColor="#000000" />
                                </div>
                                <h4 className="text-lg font-black text-white uppercase tracking-widest mb-2 relative z-10">Bridge Scan</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 relative z-10">Scan to initiate direct chat on device</p>
                                <button 
                                    onClick={() => setShowQR(false)}
                                    className="text-[10px] font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-widest relative z-10"
                                >
                                    DESTROY OVERLAY
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <aside className="space-y-6 sticky top-8">
          <div className="bg-[#0a0a1a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-green-400 shadow-[0_2px_15px_rgba(34,197,94,0.3)]" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
                <Settings className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Identity Suite</h3>
            </div>

            <div className="space-y-8">
                <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block font-black flex items-center gap-2">
                        <Phone size={12} className="text-emerald-500" /> WhatsApp Identity
                    </label>
                    <input 
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 923123456789"
                        title="Enter WhatsApp number with country code"
                        aria-label="Enter WhatsApp number with country code"
                        className="w-full bg-white/5 border border-white/5 text-white font-mono text-sm px-6 py-4 rounded-2xl outline-none focus:border-emerald-500/30 transition-all shadow-inner placeholder:text-slate-800"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block font-black flex items-center gap-2">
                        <Zap size={12} className="text-emerald-500" /> Default Dispatch
                    </label>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type the message you want people to start with..."
                        title="Enter pre-filled message"
                        aria-label="Enter pre-filled message"
                        className="w-full bg-white/5 border border-white/5 text-white font-medium text-xs px-6 py-4 rounded-2xl outline-none focus:border-emerald-500/30 transition-all shadow-inner h-32 resize-none placeholder:text-slate-800"
                    />
                </div>

                <div className="pt-4">
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all ${
                            !phoneNumber ? "bg-white/5 text-slate-600 pointer-events-none" : "bg-[#0a0a1a] text-emerald-500 border border-emerald-500/20 hover:border-emerald-500 shadow-xl"
                        }`}
                    >
                        <ExternalLink size={16} /> Command Test Link
                    </a>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 text-emerald-500 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                        <Zap size={16} className="shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold uppercase leading-tight tracking-wider relative z-10">
                            Protocol optimized for wa.me redirect, ensuring maximum compatibility across all OS kernels.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </aside>

        {/* SEO Enrichment Layer */}
        <div className="lg:col-span-2 space-y-12 py-12">
          <ToolGuide 
            toolName="WhatsApp Link Generator" 
            sections={guideSections}
            faqs={faqs}
          />

          <div className="p-8 bg-[#0a0a1f]/40 border border-white/5 rounded-[2.5rem] prose prose-invert max-w-none">
            <p className="text-slate-400 leading-relaxed italic">
              Transform the way your customers connect with you. Our **WhatsApp Link Generator - Free Online Utility Tool** allows you to skip the manual 'add contact' step and move straight to the conversation. By creating a direct 'Click-to-Chat' link with a custom pre-filled message, you remove friction from your sales funnel, customer support, or personal networking. Simply enter your country code, phone number, and greeting, and your shortened wa.me link is ready to be shared on Instagram, Facebook, or your website.
            </p>
            <p className="text-slate-400 leading-relaxed mt-4">
              At CosmoxHub, we believe in efficiency without compromise. Our **WhatsApp Link Generator** is optimized for high-speed performance and mobile responsiveness. Whether you are a business owner needing a 'Contact Us' button or an individual simplifying your digital identity, our tool provides the most reliable way to create professional communication links. Like all CosmoxHub utilities, your data is processed instantly without being logged, ensuring your marketing strategy remains both effective and private.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function ClaritySparklesIcon({ size, className }: { size: number, className: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}
