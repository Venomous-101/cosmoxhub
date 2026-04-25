"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, ShieldAlert, Globe, Activity, FileSearch, Fingerprint, Database, Cpu, Wifi, Eye, RefreshCw, ChevronRight } from "lucide-react";

// --- Glitch Text Component ---
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function GlitchText({ text, active }: { text: string, active?: boolean }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((char, i) => {
        if (i < iter) return text[i];
        if (char === " ") return " ";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      iter += 0.5;
      if (iter >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text, active]);
  return <span>{display}</span>;
}

// --- Terminal Output Component ---
function TerminalOutput({ lines, loading }: { lines: React.ReactNode[], loading: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  return (
    <div className="bg-[#000502] border border-[#00ff88]/30 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto relative shadow-[inset_0_0_20px_rgba(0,255,136,0.05)]">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(0,255,136,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />
      <div className="relative z-10 space-y-1.5">
        {lines.map((line, i) => (
          <div key={i} className="text-[#00ff88] flex items-start gap-2 animate-fade-in">
            <span className="text-[#00ff88]/50 select-none">{'>'}</span>
            <span className="break-all">{line}</span>
          </div>
        ))}
        {loading && (
          <div className="text-[#00ff88] flex items-center gap-2 mt-2">
            <span className="text-[#00ff88]/50 select-none">{'>'}</span>
            <span className="animate-pulse">_</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function OSINTDashboard() {
  const [activeTab, setActiveTab] = useState<"github" | "domain" | "ip" | "username" | "wayback">("github");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<React.ReactNode[]>(["SYSTEM INITIALIZED...", "AWAITING TARGET INPUT."]);
  const [results, setResults] = useState<any>(null);

  const addLog = (msg: string | React.ReactNode) => setLogs(p => [...p, msg]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setResults(null);
    setLogs([`[INIT] STARTING ${activeTab.toUpperCase()} SCAN ON TARGET: ${input}`]);

    try {
      if (activeTab === "github") {
        addLog("QUERYING GITHUB API...");
        addLog("EXTRACTING PUBLIC REPOSITORIES...");
        const res = await fetch(`/api/osint/github?username=${encodeURIComponent(input)}`);
        const data = await res.json();
        if (data.error) {
          addLog(<span className="text-red-500">[ERROR] {data.error}</span>);
        } else {
          addLog("[SUCCESS] DATA RETRIEVED.");
          addLog(`ANALYZING ${data.commitCount} COMMITS FOR INTEL...`);
          setResults(data);
          addLog(<span className="text-[#00ff88] font-bold">[!] INTEL EXTRACTION COMPLETE.</span>);
        }
      } 
      else if (activeTab === "domain") {
        addLog("RESOLVING DNS RECORDS...");
        addLog("QUERYING CRT.SH FOR CERTIFICATE LOGS...");
        const res = await fetch(`/api/osint/domain?domain=${encodeURIComponent(input)}`);
        const data = await res.json();
        if (data.error) addLog(<span className="text-red-500">[ERROR] {data.error}</span>);
        else {
          addLog(`[SUCCESS] FOUND ${data.ips?.length || 0} IPs AND ${data.subdomains?.length || 0} SUBDOMAINS.`);
          setResults(data);
          addLog(<span className="text-[#00ff88] font-bold">[!] DOMAIN MAPPING COMPLETE.</span>);
        }
      }
      else if (activeTab === "ip") {
        addLog("EXECUTING GEOLOCATION LOOKUP...");
        addLog("QUERYING REVERSE DNS...");
        const res = await fetch(`/api/osint/ip?ip=${encodeURIComponent(input)}`);
        const data = await res.json();
        if (data.error) addLog(<span className="text-red-500">[ERROR] {data.error}</span>);
        else {
          addLog(`[SUCCESS] GEOLOCATION: ${data.geo?.city}, ${data.geo?.country}`);
          setResults(data);
        }
      }
      else if (activeTab === "username") {
        addLog("LAUNCHING ASYNC PROBES ACROSS 22 PLATFORMS...");
        const res = await fetch(`/api/osint/username?username=${encodeURIComponent(input)}`);
        const data = await res.json();
        if (data.error) addLog(<span className="text-red-500">[ERROR] {data.error}</span>);
        else {
          const foundCount = data.platforms?.filter((p: any) => p.found).length || 0;
          addLog(`[SUCCESS] FOUND ${foundCount} LINKED ACCOUNTS.`);
          setResults(data);
        }
      }
      else if (activeTab === "wayback") {
        addLog("CONNECTING TO ARCHIVE.ORG CDX API...");
        const res = await fetch(`/api/osint/wayback?domain=${encodeURIComponent(input)}`);
        const data = await res.json();
        if (data.error) addLog(<span className="text-red-500">[ERROR] {data.error}</span>);
        else {
          addLog(`[SUCCESS] RETRIEVED ${data.total || 0} HISTORICAL SNAPSHOTS.`);
          setResults(data);
        }
      }
    } catch (err) {
      addLog(<span className="text-red-500">[FATAL ERROR] CONNECTION REFUSED OR TIMEOUT.</span>);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000502] text-[#00ff88] font-mono selection:bg-[#00ff88] selection:text-black">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      
      {/* Header */}
      <header className="border-b border-[#00ff88]/20 bg-[#000a04]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-[#00ff88] animate-pulse" size={24} />
            <h1 className="text-xl font-bold tracking-[0.2em] shadow-[#00ff88]">
              <GlitchText text="OSINT::NEXUS" active={loading} />
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs tracking-widest">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" /> SYS:ONLINE</span>
            <span className="text-[#00ff88]/50 hidden sm:inline">AUTH:BYPASS</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Target Input */}
            <div className="bg-[#000a04] border border-[#00ff88]/30 rounded-xl p-5 shadow-[0_0_30px_rgba(0,255,136,0.05)]">
              <h2 className="text-sm font-bold tracking-widest mb-4 flex items-center gap-2 border-b border-[#00ff88]/20 pb-2">
                <Terminal size={16} /> TARGET_ACQUISITION
              </h2>
              <form onSubmit={handleScan} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#00ff88]/60 mb-1">SELECT VECTOR</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "github", icon: GithubIcon, label: "DEV_INTEL" },
                      { id: "domain", icon: Globe, label: "INFRA_MAP" },
                      { id: "ip", icon: Wifi, label: "IP_TRACE" },
                      { id: "username", icon: Fingerprint, label: "ID_HUNT" },
                      { id: "wayback", icon: Database, label: "TIMELINE" }
                    ].map(t => (
                      <button
                        key={t.id} type="button"
                        onClick={() => { setActiveTab(t.id as any); setInput(""); setResults(null); }}
                        className={`flex items-center gap-2 p-2 text-xs border transition-all ${activeTab === t.id ? "bg-[#00ff88]/10 border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.2)]" : "border-[#00ff88]/20 text-[#00ff88]/50 hover:border-[#00ff88]/50 hover:text-[#00ff88]"}`}
                      >
                        <t.icon size={14} /> {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-[#00ff88]/60 mb-1">TARGET IDENTIFIER</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ff88]/50">{'>'}</span>
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder={activeTab === 'github' || activeTab === 'username' ? "Enter username..." : activeTab === 'ip' ? "Enter IP address..." : "Enter domain (e.g. example.com)..."}
                      className="w-full bg-[#000502] border border-[#00ff88]/40 focus:border-[#00ff88] focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] outline-none rounded py-2 pl-8 pr-3 text-sm transition-all placeholder:text-[#00ff88]/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-full bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88] text-[#00ff88] font-bold py-2.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.15)] hover:shadow-[0_0_25px_rgba(0,255,136,0.3)]"
                >
                  {loading ? <RefreshCw className="animate-spin" size={16} /> : <Activity size={16} />}
                  {loading ? "EXECUTING..." : "INITIATE SCAN"}
                </button>
              </form>
            </div>

            {/* Terminal */}
            <div className="bg-[#000a04] border border-[#00ff88]/30 rounded-xl p-1 shadow-[0_0_30px_rgba(0,255,136,0.05)]">
               <div className="bg-[#00ff88]/10 px-3 py-1 border-b border-[#00ff88]/20 text-xs font-bold tracking-widest flex items-center justify-between">
                 <span>TERMINAL_OUTPUT</span>
                 <span className="animate-pulse">_</span>
               </div>
               <TerminalOutput lines={logs} loading={loading} />
            </div>

          </div>

          {/* Right Panel: Data Visualization */}
          <div className="lg:col-span-8">
            <div className="bg-[#000a04] border border-[#00ff88]/30 rounded-xl min-h-[600px] shadow-[0_0_40px_rgba(0,255,136,0.08)] relative overflow-hidden flex flex-col">
              
              <div className="border-b border-[#00ff88]/20 px-5 py-3 flex items-center justify-between bg-[#00ff88]/5">
                <h2 className="text-sm font-bold tracking-widest flex items-center gap-2">
                  <Eye size={16} /> INTEL_VISUALIZER
                </h2>
                {results && <span className="text-xs bg-[#00ff88]/20 border border-[#00ff88]/40 px-2 py-0.5 rounded text-[#00ff88]">DATA_SECURED</span>}
              </div>

              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {!results && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-[#00ff88]/30 space-y-4">
                    <FileSearch size={48} className="animate-pulse" />
                    <p className="text-sm tracking-[0.2em]">AWAITING TARGET DATA</p>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center text-[#00ff88] space-y-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-[#00ff88]/20 border-t-[#00ff88] rounded-full animate-spin" />
                      <div className="absolute inset-2 border-2 border-[#00ff88]/20 border-b-[#00ff88] rounded-full animate-spin animation-delay-150" style={{ animationDirection: 'reverse' }} />
                      <Cpu className="animate-pulse" size={24} />
                    </div>
                    <p className="text-sm tracking-[0.2em] animate-pulse">DECRYPTING...</p>
                  </div>
                )}

                {results && !loading && (
                  <div className="animate-fade-in space-y-8">
                    
                    {/* --- GITHUB INTEL RESULTS --- */}
                    {activeTab === "github" && (
                      <>
                        <div className="flex items-start gap-6 pb-6 border-b border-[#00ff88]/20">
                          {results.profile?.avatar && (
                            <img src={results.profile.avatar} alt="Avatar" className="w-24 h-24 rounded border border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)] filter grayscale hover:grayscale-0 transition-all duration-500" />
                          )}
                          <div>
                            <h3 className="text-2xl font-bold">{results.profile?.name || "UNKNOWN"} <span className="text-[#00ff88]/50 text-base">(@{results.profile?.login})</span></h3>
                            <p className="text-sm text-[#00ff88]/70 mt-1">{results.profile?.bio}</p>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-3 text-xs">
                              <div><span className="text-[#00ff88]/50">LOC:</span> {results.profile?.location || "UNKNOWN"}</div>
                              <div><span className="text-[#00ff88]/50">CO:</span> {results.profile?.company || "NONE"}</div>
                              <div><span className="text-[#00ff88]/50">REPOS:</span> {results.profile?.publicRepos}</div>
                              <div><span className="text-[#00ff88]/50">FOLLOWERS:</span> {results.profile?.followers}</div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Emails */}
                          <div className="border border-[#00ff88]/30 rounded bg-[#00ff88]/5 p-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-2 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold border-b border-l border-red-500/30">HIGH RISK</div>
                            <h4 className="text-sm font-bold tracking-widest mb-3 border-b border-[#00ff88]/20 pb-1">EXPOSED_EMAILS</h4>
                            {results.emails?.length > 0 ? (
                              <ul className="space-y-2">
                                {results.emails.map((e: any, i: number) => (
                                  <li key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-red-400 break-all">{e.email}</span>
                                    <span className="text-[10px] text-[#00ff88]/50 px-2 border border-[#00ff88]/20 rounded">{e.count} hits</span>
                                  </li>
                                ))}
                              </ul>
                            ) : <p className="text-xs text-[#00ff88]/50">NO EMAILS DETECTED.</p>}
                          </div>

                          {/* Timezone */}
                          <div className="border border-[#00ff88]/30 rounded bg-[#00ff88]/5 p-4">
                            <h4 className="text-sm font-bold tracking-widest mb-3 border-b border-[#00ff88]/20 pb-1">BEHAVIORAL_TZ_INFERENCE</h4>
                            <div className="flex items-end gap-3">
                              <span className="text-3xl font-bold text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">{results.timezone?.inferred}</span>
                              <span className="text-xs text-[#00ff88]/60 mb-1">({results.timezone?.confidence}% confidence)</span>
                            </div>
                            <p className="text-[10px] text-[#00ff88]/50 mt-2">Calculated from timestamp metadata of {results.commitCount} commits.</p>
                          </div>
                          
                          {/* Tech Stack */}
                          <div className="border border-[#00ff88]/30 rounded bg-[#00ff88]/5 p-4 md:col-span-2">
                            <h4 className="text-sm font-bold tracking-widest mb-3 border-b border-[#00ff88]/20 pb-1">TECH_STACK_FINGERPRINT</h4>
                            <div className="space-y-2">
                              {results.techStack?.map((t: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-xs">
                                  <span className="w-24 shrink-0 truncate">{t.lang}</span>
                                  <div className="flex-1 h-1.5 bg-[#00ff88]/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.8)]" style={{ width: `${t.percent}%` }} />
                                  </div>
                                  <span className="w-8 text-right text-[#00ff88]/70">{t.percent}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* --- DOMAIN INTEL RESULTS --- */}
                    {activeTab === "domain" && (
                      <div className="space-y-6">
                        <div className="border border-[#00ff88]/30 p-4 rounded bg-[#00ff88]/5">
                          <h4 className="text-sm font-bold tracking-widest mb-3 border-b border-[#00ff88]/20 pb-1">WHOIS_DATA</h4>
                          {results.whois ? (
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div><span className="text-[#00ff88]/50 block">REGISTRAR</span>{results.whois.registrar}</div>
                              <div><span className="text-[#00ff88]/50 block">CREATED</span>{results.whois.created?.split('T')[0] || 'N/A'}</div>
                              <div><span className="text-[#00ff88]/50 block">STATUS</span>{results.whois.status?.[0] || 'N/A'}</div>
                              <div><span className="text-[#00ff88]/50 block">NAMESERVERS</span>{results.whois.nameservers?.slice(0,2).join(', ') || 'N/A'}</div>
                            </div>
                          ) : <p className="text-xs text-[#00ff88]/50">NO WHOIS DATA.</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="border border-[#00ff88]/30 p-4 rounded bg-[#00ff88]/5">
                            <h4 className="text-sm font-bold tracking-widest mb-3 border-b border-[#00ff88]/20 pb-1">SUBDOMAINS_DISCOVERED</h4>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                              {results.subdomains?.map((s: string, i: number) => (
                                <div key={i} className="text-xs flex items-center gap-2"><ChevronRight size={10} className="text-[#00ff88]/50" /> {s}</div>
                              ))}
                              {results.subdomains?.length === 0 && <p className="text-xs text-[#00ff88]/50">NONE FOUND.</p>}
                            </div>
                          </div>
                          
                          <div className="border border-[#00ff88]/30 p-4 rounded bg-[#00ff88]/5">
                            <h4 className="text-sm font-bold tracking-widest mb-3 border-b border-[#00ff88]/20 pb-1">IP_MAPPING</h4>
                            <div className="space-y-3">
                              {results.ips?.map((ip: string, i: number) => (
                                <div key={i}>
                                  <div className="text-sm font-bold text-cyan-400 mb-1">{ip}</div>
                                  <div className="text-[10px] text-[#00ff88]/60 ml-2 border-l border-[#00ff88]/20 pl-2">
                                    {results.reverseIpData?.[ip] ? (
                                      results.reverseIpData[ip].map((d: string, j: number) => <div key={j}>{d}</div>)
                                    ) : <div>NO REVERSE DOMAINS FOUND</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- IP INTEL RESULTS --- */}
                    {activeTab === "ip" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-[#00ff88]/30 p-4 rounded bg-[#00ff88]/5 md:col-span-2 flex items-center gap-4">
                          <div className="w-16 h-16 rounded border border-[#00ff88]/50 flex items-center justify-center text-2xl bg-[#000502]">
                            {results.geo?.countryCode || "?"}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold tracking-wider">{results.geo?.query}</h3>
                            <p className="text-sm text-[#00ff88]/60">{results.geo?.city}, {results.geo?.regionName}, {results.geo?.country}</p>
                          </div>
                        </div>

                        <div className="border border-[#00ff88]/30 p-4 rounded bg-[#00ff88]/5 space-y-3 text-sm">
                          <div className="flex justify-between border-b border-[#00ff88]/10 pb-1"><span className="text-[#00ff88]/50">ISP</span> <span className="text-right max-w-[150px] truncate">{results.geo?.isp || "N/A"}</span></div>
                          <div className="flex justify-between border-b border-[#00ff88]/10 pb-1"><span className="text-[#00ff88]/50">ORG</span> <span className="text-right max-w-[150px] truncate">{results.geo?.org || "N/A"}</span></div>
                          <div className="flex justify-between border-b border-[#00ff88]/10 pb-1"><span className="text-[#00ff88]/50">ASN</span> <span className="text-right max-w-[150px] truncate">{results.geo?.as || "N/A"}</span></div>
                          <div className="flex justify-between border-b border-[#00ff88]/10 pb-1"><span className="text-[#00ff88]/50">TIMEZONE</span> <span>{results.geo?.timezone || "N/A"}</span></div>
                        </div>

                        <div className="border border-[#00ff88]/30 p-4 rounded bg-[#00ff88]/5 space-y-3 text-sm">
                          <div className="flex justify-between border-b border-[#00ff88]/10 pb-1"><span className="text-[#00ff88]/50">REVERSE DNS</span> <span className="text-right max-w-[150px] truncate">{results.rdns || "N/A"}</span></div>
                          <div className="flex justify-between border-b border-[#00ff88]/10 pb-1"><span className="text-[#00ff88]/50">PROXY/VPN</span> <span className={results.geo?.proxy ? "text-red-400" : "text-[#00ff88]"}>{results.geo?.proxy ? "DETECTED" : "CLEAN"}</span></div>
                          <div className="flex justify-between border-b border-[#00ff88]/10 pb-1"><span className="text-[#00ff88]/50">HOSTING</span> <span className={results.geo?.hosting ? "text-amber-400" : "text-[#00ff88]"}>{results.geo?.hosting ? "YES" : "NO"}</span></div>
                          <div className="flex justify-between border-b border-[#00ff88]/10 pb-1"><span className="text-[#00ff88]/50">MOBILE</span> <span className="text-[#00ff88]">{results.geo?.mobile ? "YES" : "NO"}</span></div>
                        </div>
                      </div>
                    )}

                    {/* --- USERNAME RACE RESULTS --- */}
                    {activeTab === "username" && (
                      <div>
                        <h4 className="text-sm font-bold tracking-widest mb-4">PLATFORM_PRESENCE: <span className="text-white">@{results.username}</span></h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {results.platforms?.map((p: any, i: number) => (
                            <a
                              key={i} href={p.found ? p.url : undefined} target="_blank" rel="noreferrer"
                              className={`p-3 rounded border text-xs flex flex-col items-center justify-center text-center gap-2 transition-all ${p.found ? "border-[#00ff88] bg-[#00ff88]/10 hover:bg-[#00ff88]/20 cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.15)]" : "border-[#00ff88]/10 text-[#00ff88]/30 bg-black cursor-default opacity-50"}`}
                            >
                              <span className="font-bold">{p.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded ${p.found ? "bg-[#00ff88] text-black" : "bg-[#00ff88]/10"}`}>{p.found ? "FOUND" : "NULL"}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* --- WAYBACK RESULTS --- */}
                    {activeTab === "wayback" && (
                      <div className="space-y-6">
                        <div className="border border-[#00ff88]/30 p-4 rounded bg-[#00ff88]/5">
                          <h4 className="text-sm font-bold tracking-widest mb-4 border-b border-[#00ff88]/20 pb-1">HISTORICAL_DENSITY</h4>
                          <div className="flex items-end h-32 gap-1 overflow-x-auto pb-2">
                            {Object.entries(results.byYear || {}).map(([year, count]: [string, any]) => {
                              const height = Math.max(10, Math.min(100, (count / (results.total || 1)) * 300));
                              return (
                                <div key={year} className="flex flex-col items-center flex-1 min-w-[30px] group">
                                  <div className="w-full bg-[#00ff88]/30 group-hover:bg-[#00ff88] transition-all rounded-t relative" style={{ height: `${height}%` }}>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity bg-black px-1 rounded border border-[#00ff88]/50 z-10">{count}</div>
                                  </div>
                                  <div className="text-[10px] mt-1 text-[#00ff88]/50">{year}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="border border-[#00ff88]/30 rounded bg-[#00ff88]/5 overflow-hidden">
                          <h4 className="text-sm font-bold tracking-widest p-4 border-b border-[#00ff88]/20 bg-[#00ff88]/10">LATEST_SNAPSHOTS</h4>
                          <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-[#000502] text-[#00ff88]/50 sticky top-0">
                                <tr><th className="p-3 font-normal">DATE</th><th className="p-3 font-normal">STATUS</th><th className="p-3 font-normal">MIME</th><th className="p-3 font-normal text-right">ACTION</th></tr>
                              </thead>
                              <tbody>
                                {results.snapshots?.map((s: any, i: number) => (
                                  <tr key={i} className="border-t border-[#00ff88]/10 hover:bg-[#00ff88]/5 transition-colors">
                                    <td className="p-3 font-mono">{s.date}</td>
                                    <td className="p-3"><span className={`px-1.5 py-0.5 rounded text-[10px] ${s.status === '200' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{s.status}</span></td>
                                    <td className="p-3 text-[#00ff88]/50">{s.mime}</td>
                                    <td className="p-3 text-right">
                                      <a href={s.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">VIEW_ARCHIVE</a>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 255, 136, 0.05); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 136, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 136, 0.5); }
      `}} />
    </div>
  );
}

// Simple github icon component since it's not in standard lucide sometimes
function GithubIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width={props.size||24} height={props.size||24} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  );
}
