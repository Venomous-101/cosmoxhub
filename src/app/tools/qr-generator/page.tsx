"use client";
import { useState, useRef } from "react";
import { QrCode, Download, Link2, Wifi, MessageSquare } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import ToolLayout from "@/components/ToolLayout";

export default function QRGeneratorPage() {
  const [activeTab, setActiveTab] = useState("url");
  const [data, setData] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [size, setSize] = useState(200);

  // WiFi specific
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");

  const qrRef = useRef<HTMLDivElement>(null);

  const getQRData = () => {
    switch (activeTab) {
      case "url":
      case "text":
        return data || "https://cosmoxhub.com";
      case "wifi":
        return `WIFI:S:${ssid};T:${encryption};P:${password};;`;
      case "email":
        return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      case "sms":
        return `smsto:${to}:${body}`;
      default:
        return "https://cosmoxhub.com";
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "cosmoxhub-qrcode.png";
    a.click();
  };

  const tabs = [
    { id: "url", icon: Link2, label: "URL / Link" },
    { id: "text", icon: MessageSquare, label: "Text" },
    { id: "wifi", icon: Wifi, label: "WiFi" },
  ];

  const qrData = getQRData();

  return (
    <ToolLayout title="QR Code Generator" description="Generate high-quality QR codes for links, text, WiFi, and more. Customize colors and download instantly." icon={QrCode} color="#f59e0b">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 items-start">
        
        {/* Editor */}
        <div className="card p-6">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[#f59e0b]/20 pb-4">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 border-none rounded-lg cursor-pointer font-medium transition-all duration-200 ${activeTab === t.id ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "bg-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"}`}
                title={`Select ${t.label} Tab`} aria-label={`Select ${t.label} Tab`}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          {activeTab === "url" && (
            <div>
              <label htmlFor="qrUrl" className="block text-slate-100 text-sm mb-2">Website URL</label>
              <input id="qrUrl" type="url" placeholder="https://example.com" value={data} onChange={(e) => setData(e.target.value)}
                className="input-field p-3" title="Website URL" aria-label="Website URL" />
            </div>
          )}

          {activeTab === "text" && (
            <div>
              <label htmlFor="qrText" className="block text-slate-100 text-sm mb-2">Any Text</label>
              <textarea id="qrText" placeholder="Enter your text here..." value={data} onChange={(e) => setData(e.target.value)}
                className="input-field min-h-[120px] p-3" title="QR Text" aria-label="QR Text" />
            </div>
          )}

          {activeTab === "wifi" && (
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="qrWifiSsid" className="block text-slate-100 text-sm mb-2">Network Name (SSID)</label>
                <input id="qrWifiSsid" type="text" placeholder="MyWiFiNetwork" value={ssid} onChange={(e) => setSsid(e.target.value)}
                  className="input-field p-3" title="WiFi Network Name" aria-label="WiFi Network Name" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="qrWifiPassword" className="block text-slate-100 text-sm mb-2">Password</label>
                  <input id="qrWifiPassword" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="input-field p-3" title="WiFi Password" aria-label="WiFi Password" />
                </div>
                <div>
                  <label htmlFor="qrWifiEncryption" className="block text-slate-100 text-sm mb-2">Security</label>
                  <select id="qrWifiEncryption" value={encryption} onChange={(e) => setEncryption(e.target.value)}
                    className="input-field p-3 w-full sm:w-[120px]" title="WiFi Security Level" aria-label="WiFi Security Level">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <hr className="border-0 border-t border-[#f59e0b]/10 my-8" />

          {/* Customization */}
          <div>
            <h3 className="text-slate-100 text-base mb-4 font-medium">Customize</h3>
            <div className="flex gap-8">
              <div>
                <label htmlFor="qrColor" className="block text-slate-400 text-sm mb-2">Foreground Color</label>
                <input id="qrColor" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                  className="w-[60px] h-[40px] cursor-pointer bg-transparent border border-white/10 rounded-md p-1" title="QR Code Color" aria-label="QR Code Color" />
              </div>
              <div className="flex-1">
                <label htmlFor="qrSize" className="block text-slate-400 text-sm mb-2">Size ({size}px)</label>
                <input id="qrSize" type="range" min="100" max="1000" step="50" value={size} onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-[#f59e0b] h-1 bg-white/10 appearance-none outline-none rounded-sm" title="QR Code Size" aria-label="QR Code Size" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="card p-8 text-center sticky top-[100px]">
          <h3 className="text-slate-100 text-lg mb-6 font-medium">Live Preview</h3>
          
          <div ref={qrRef} className="bg-white p-4 rounded-xl inline-block shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
            <QRCodeCanvas value={qrData} size={200} fgColor={fgColor} level="H" includeMargin />
          </div>

          <p className="text-slate-400 text-xs mt-4 mb-6 break-all px-4">
            {qrData.substring(0, 50)}{qrData.length > 50 ? "..." : ""}
          </p>

          <button className="btn-primary w-full justify-center bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.4)]" onClick={downloadQR} title="Download QR Code" aria-label="Download QR Code">
            <Download size={16} /> Download PNG
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
