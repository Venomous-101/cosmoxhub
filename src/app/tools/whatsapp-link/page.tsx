"use client";
import { useState } from "react";
import { MessageSquare, ExternalLink, Copy, Check } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function WhatsAppLinkPage() {
  const [countryCode, setCountryCode] = useState("1");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Remove any non-numeric characters from phone
  const cleanPhone = phone.replace(/\D/g, "");
  const cleanCode = countryCode.replace(/\D/g, "");
  
  const link = `https://wa.me/${cleanCode}${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  const isValid = cleanPhone.length > 5;

  const copy = () => {
    if (!isValid) return;
    navigator.clipboard.writeText(link);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolLayout title="WhatsApp Link Generator" description="Create a direct WhatsApp chat link without saving the phone number in your contacts. Great for businesses and Instagram bios." icon={MessageSquare} color="#10b981">
      <div className="card p-6 max-w-[600px] w-full">
        <div className="flex gap-4 mb-6">
            <div className="w-[100px]">
                <label htmlFor="countryCode" className="block text-slate-400 text-[0.85rem] mb-2">Code (+)</label>
                <input id="countryCode" type="text" placeholder="1" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                  className="input-field p-3" title="Country Code" aria-label="Country Code" />
            </div>
            <div className="flex-1">
                <label htmlFor="whatsappPhone" className="block text-slate-100 text-[0.85rem] mb-2 font-medium">WhatsApp Number</label>
                <input id="whatsappPhone" type="tel" placeholder="e.g. 555 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="input-field p-3" title="WhatsApp Number" aria-label="WhatsApp Number" />
            </div>
        </div>

        <div className="mb-6">
            <label htmlFor="whatsappMessage" className="block text-slate-100 text-[0.85rem] mb-2 font-medium">Pre-filled Message (Optional)</label>
            <textarea id="whatsappMessage" placeholder="e.g. Hello, I'm interested in your services!" value={message} onChange={(e) => setMessage(e.target.value)}
              className="input-field min-h-[100px] p-3" title="Pre-filled Message" aria-label="Pre-filled Message" />
        </div>

        <div className="p-4 bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg break-all mb-6">
            <p className="text-slate-400 text-xs mb-1">Your Generated Link:</p>
            <p className={`text-sm font-medium ${isValid ? "text-[#10b981]" : "text-slate-500"}`}>
                {isValid ? link : "Enter a valid phone number to generate link"}
            </p>
        </div>

        <div className="flex gap-4 mt-6">
            <button className="btn-primary flex-1 justify-center bg-gradient-to-br from-[#10b981] to-[#34d399] shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)]" onClick={copy} disabled={!isValid} title="Copy Link" aria-label="Copy Link">
                {copied ? <><Check size={16} /> Copied to Clipboard!</> : <><Copy size={16} /> Copy Link</>}
            </button>
            <a href={isValid ? link : "#"} target="_blank" rel="noopener noreferrer" 
              className={`btn-secondary flex-1 flex justify-center items-center gap-2 no-underline ${isValid ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"}`}
              title="Open in WhatsApp" aria-label="Open in WhatsApp">
                <ExternalLink size={16} /> Open in WhatsApp
            </a>
        </div>
      </div>
    </ToolLayout>
  );
}
