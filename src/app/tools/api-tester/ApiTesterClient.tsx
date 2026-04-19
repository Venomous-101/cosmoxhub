"use client";

import React, { useState, useEffect } from 'react';
import { Send, Play, Plus, Trash2, Check, Copy, Activity, Zap, RefreshCw, Hexagon, Shield, Code2, MoveRight } from 'lucide-react';
import Link from 'next/link';

type RowData = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export default function ApiTesterClient() {
  const [method, setMethod] = useState<MethodType>('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params');
  
  const [headers, setHeaders] = useState<RowData[]>([
    { id: '1', key: 'Accept', value: '*/*', enabled: true },
    { id: '2', key: '', value: '', enabled: true }
  ]);
  
  const [params, setParams] = useState<RowData[]>([
    { id: '1', key: '', value: '', enabled: true }
  ]);
  
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'apikey'>('none');
  const [bearerToken, setBearerToken] = useState('');
  const [apiKeyKey, setApiKeyKey] = useState('x-api-key');
  const [apiKeyValue, setApiKeyValue] = useState('');

  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-sync query params with URL
  useEffect(() => {
    try {
      const urlObj = new URL(url);
      const searchParams = new URLSearchParams(urlObj.search);
      // This is a minimal implementation. A full version would completely sync both ways.
      // For simplicity and avoiding infinite loops, we'll let users edit URL directly.
    } catch (e) {
      // Invalid URL handled silently during typing
    }
  }, [url]);

  const handleAddRow = (setter: React.Dispatch<React.SetStateAction<RowData[]>>) => {
    setter(prev => [...prev, { id: Date.now().toString(), key: '', value: '', enabled: true }]);
  };

  const handleUpdateRow = (setter: React.Dispatch<React.SetStateAction<RowData[]>>, id: string, field: keyof RowData, value: string | boolean) => {
    setter(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleDeleteRow = (setter: React.Dispatch<React.SetStateAction<RowData[]>>, id: string) => {
    setter(prev => prev.filter(row => row.id !== id));
  };

  const handleCopy = () => {
    if (response?.data) {
      navigator.clipboard.writeText(typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSend = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    // Prepare active headers
    const finalHeaders = headers.filter(h => h.enabled && h.key).map(h => ({ key: h.key, value: h.value }));
    
    // Inject Auth Headers
    if (authType === 'bearer' && bearerToken) {
      finalHeaders.push({ key: 'Authorization', value: `Bearer ${bearerToken}` });
    } else if (authType === 'apikey' && apiKeyValue) {
      finalHeaders.push({ key: apiKeyKey || 'x-api-key', value: apiKeyValue });
    }

    // Default Content-Type if body is present and not explicitly set
    if (body && ['POST', 'PUT', 'PATCH'].includes(method) && !finalHeaders.find(h => h.key.toLowerCase() === 'content-type')) {
       finalHeaders.push({ key: 'Content-Type', value: 'application/json' });
    }

    // Construct final URL with params
    let finalUrl = url;
    const activeParams = params.filter(p => p.enabled && p.key);
    if (activeParams.length > 0) {
      try {
        const urlObj = new URL(url);
        activeParams.forEach(p => {
          urlObj.searchParams.set(p.key, p.value);
        });
        finalUrl = urlObj.toString();
      } catch (e) {
        // Fallback gracefully if URL parse fails
      }
    }

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url: finalUrl,
          headers: finalHeaders,
          body: ['GET', 'HEAD'].includes(method) ? undefined : body
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data);
      } else {
        setError(data.error || "Failed to fetch response");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodColor = (m: string) => {
    switch (m) {
      case 'GET': return 'text-green-400 font-bold';
      case 'POST': return 'text-yellow-400 font-bold';
      case 'PUT': return 'text-blue-400 font-bold';
      case 'DELETE': return 'text-red-400 font-bold';
      case 'PATCH': return 'text-purple-400 font-bold';
      default: return 'text-gray-400 font-bold';
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1117] text-[#C9D1D9] font-sans">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Header Title Section */}
        <div className="mb-8 pl-2 border-l-4 border-indigo-500">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-center">
             <Code2 className="w-10 h-10 mr-4 text-indigo-500 border-2 rounded-xl border-indigo-500 p-1 bg-indigo-500/10" />
             API &amp; Webhook Playground
          </h1>
          <p className="text-[#8B949E] text-lg max-w-3xl">Instantly test APIs, fire webhooks, and debug requests right from your browser. Zero setup. No account required. <span className="text-indigo-400 font-medium">100% Free &amp; Private.</span></p>
        </div>

        {/* Top Controls: Method + URL + Send */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 bg-[#161B22] p-2 rounded-xl shadow-xl border border-[#30363D]">
          <div className="relative flex-shrink-0">
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value as MethodType)}
              className={`${getMethodColor(method)} appearance-none bg-[#0D1117] border border-[#30363D] px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm w-32`}
            >
              <option value="GET" className="text-green-400">GET</option>
              <option value="POST" className="text-yellow-400">POST</option>
              <option value="PUT" className="text-blue-400">PUT</option>
              <option value="PATCH" className="text-purple-400">PATCH</option>
              <option value="DELETE" className="text-red-400">DELETE</option>
              <option value="OPTIONS" className="text-gray-400">OPTIONS</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/resource"
            className="flex-grow bg-[#0D1117] border border-[#30363D] px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-600 font-mono text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-10 py-4 font-bold rounded-lg transition-colors flex items-center justify-center min-w-[140px]"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5 mr-3" /> SEND</>}
          </button>
        </div>

        {/* Main Interface: Dual Pane */}
        <div className="flex flex-col lg:flex-row gap-6 h-[700px] mb-20">
          
          {/* LEFT PANE - Request Config */}
          <div className="w-full lg:w-1/2 flex flex-col bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-[#30363D] bg-[#0D1117] px-2 pt-2">
              {[
                { id: 'params', label: 'Params' },
                { id: 'auth', label: 'Auth' },
                { id: 'headers', label: 'Headers' },
                { id: 'body', label: 'Body' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-[#8B949E] hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              
              {/* Params / Headers UI Array Builder */}
              {(activeTab === 'params' || activeTab === 'headers') && (
                <div className="space-y-3">
                  <div className="flex text-xs font-semibold text-[#8B949E] px-2 mb-1 uppercase tracking-wider">
                    <div className="w-8"></div>
                    <div className="w-5/12 pl-3">Key</div>
                    <div className="w-6/12 pl-3">Value</div>
                    <div className="w-10"></div>
                  </div>
                  {(activeTab === 'params' ? params : headers).map((row, index) => (
                    <div key={row.id} className="flex items-center gap-2 group">
                      <div className="w-8 flex justify-center">
                        <input 
                          type="checkbox" 
                          checked={row.enabled} 
                          onChange={(e) => handleUpdateRow(activeTab === 'params' ? setParams : setHeaders, row.id, 'enabled', e.target.checked)}
                          className="w-4 h-4 rounded bg-[#0D1117] border-[#30363D] text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-500"
                        />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Key" 
                        value={row.key}
                        onChange={(e) => handleUpdateRow(activeTab === 'params' ? setParams : setHeaders, row.id, 'key', e.target.value)}
                        className="flex-1 bg-[#0D1117] border border-[#30363D] px-3 py-2.5 rounded text-sm text-white focus:border-indigo-500 focus:outline-none font-mono"
                      />
                      <input 
                        type="text" 
                        placeholder="Value" 
                        value={row.value}
                        onChange={(e) => handleUpdateRow(activeTab === 'params' ? setParams : setHeaders, row.id, 'value', e.target.value)}
                        className="flex-1 bg-[#0D1117] border border-[#30363D] px-3 py-2.5 rounded text-sm text-white focus:border-indigo-500 focus:outline-none font-mono"
                      />
                      <button 
                        onClick={() => handleDeleteRow(activeTab === 'params' ? setParams : setHeaders, row.id)}
                        className="w-10 flex justify-center text-[#484F58] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => handleAddRow(activeTab === 'params' ? setParams : setHeaders)}
                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 ml-10 mt-4 px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add row
                  </button>
                </div>
              )}

              {/* Body Tab */}
              {activeTab === 'body' && (
                <div className="h-full flex flex-col">
                  {['GET', 'HEAD'].includes(method) ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#8B949E] text-sm italic border-2 border-dashed border-[#30363D] rounded-lg">
                      <p>A body payload cannot be sent with a {method} request.</p>
                      <p className="mt-2 text-xs">Switch to POST, PUT, or PATCH to send a JSON body.</p>
                    </div>
                  ) : (
                    <div className="h-full">
                      <div className="text-xs text-[#8B949E] mb-2 px-1 flex justify-between">
                         <span>JSON Body Payload</span>
                         <span className="bg-[#0D1117] border border-[#30363D] px-2 py-0.5 rounded text-[10px] uppercase font-mono">application/json</span>
                      </div>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="{\n  // enter your json payload here\n}"
                        className="w-full h-[calc(100%-2rem)] bg-[#0D1117] border border-[#30363D] p-4 rounded-lg text-sm text-[#E6EDF3] focus:border-indigo-500 focus:outline-none font-mono resize-none custom-scrollbar"
                        spellCheck="false"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Auth Tab */}
              {activeTab === 'auth' && (
                <div className="space-y-6">
                  <div className="bg-[#0D1117] border border-[#30363D] p-1 rounded-lg inline-flex w-full md:w-auto overflow-hidden">
                    {(['none', 'bearer', 'apikey'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setAuthType(type)}
                        className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${authType === type ? 'bg-[#21262D] text-white shadow-sm' : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]/50'}`}
                      >
                        {type === 'none' ? 'No Auth' : type === 'bearer' ? 'Bearer Token' : 'API Key'}
                      </button>
                    ))}
                  </div>

                  <div className="border border-[#30363D] rounded-xl p-6 bg-[#0D1117] shadow-inner relative overflow-hidden">
                    <Shield className="absolute -bottom-6 -right-6 w-32 h-32 text-[#161B22] opacity-50 pointer-events-none" />
                    
                    {authType === 'none' && (
                      <p className="text-sm text-[#8B949E]">This request does not use any specific authentication configuration.</p>
                    )}
                    
                    {authType === 'bearer' && (
                      <div className="space-y-4 relative z-10">
                        <label className="block text-sm font-medium text-white">Token</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-[#8B949E] font-mono text-sm">Bearer</span>
                          </div>
                          <input
                            type="text"
                            value={bearerToken}
                            onChange={(e) => setBearerToken(e.target.value)}
                            placeholder="ey..."
                            className="w-full bg-[#161B22] border border-[#30363D] py-3 pl-20 pr-4 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                        <p className="text-xs text-[#8B949E] mt-2 border-t border-[#30363D] pt-3">
                          Typically used with JWTs and OAuth 2.0. The header <code className="text-[#E6EDF3] bg-[#21262D] px-1 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code> will automatically be injected when you invoke the request.
                        </p>
                      </div>
                    )}

                    {authType === 'apikey' && (
                      <div className="space-y-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Key Variable</label>
                            <input
                              type="text"
                              value={apiKeyKey}
                              onChange={(e) => setApiKeyKey(e.target.value)}
                              className="w-full bg-[#161B22] border border-[#30363D] py-3 px-4 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Value</label>
                            <input
                              type="text"
                              value={apiKeyValue}
                              onChange={(e) => setApiKeyValue(e.target.value)}
                              placeholder="api_sk_..."
                              className="w-full bg-[#161B22] border border-[#30363D] py-3 px-4 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-[#8B949E] mt-2 border-t border-[#30363D] pt-3">
                          A static secret token. It will be passed exactly matching your configured key name in the headers.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE - Response View */}
          <div className="w-full lg:w-1/2 flex flex-col bg-[#0D1117] rounded-xl border border-[#30363D] overflow-hidden shadow-inset relative">
            <div className="flex items-center justify-between border-b border-[#30363D] bg-[#161B22] px-6 py-4">
              <h2 className="text-sm font-bold tracking-widest text-[#8B949E] uppercase">Response</h2>
              
              {response && (
                <div className="flex gap-4 text-xs font-mono">
                  <span className={`px-2 py-0.5 rounded font-bold ${response.status >= 200 && response.status < 300 ? 'bg-green-500/20 text-green-400' : response.status >= 400 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    Status: <span className="ml-1">{response.status} {response.statusText}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#21262D] text-[#8B949E]">
                    Time: <span className="text-white ml-1">{response.time} ms</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#21262D] text-[#8B949E]">
                    Size: <span className="text-white ml-1">{(response.size / 1024).toFixed(2)} KB</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto p-4 custom-scrollbar relative">
              {error ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                   <div className="bg-red-500/10 p-4 rounded-full mb-4">
                     <Activity className="w-10 h-10 text-red-500" />
                   </div>
                   <h3 className="text-red-400 font-bold text-lg mb-2">Request Failed</h3>
                   <p className="text-[#8B949E] text-sm break-all">{error}</p>
                   <p className="text-xs text-gray-500 mt-6">- Ensure the destination URL is correct.<br/>- Ensure target accepts public connections.</p>
                </div>
              ) : response ? (
                <div className="relative group min-h-full">
                  <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                    title="Copy payload"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <pre className="text-[13px] font-mono leading-relaxed text-[#E6EDF3] pb-10">
                    {typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div className="w-full max-w-sm space-y-8">
                    
                    <div className="text-center">
                      <Hexagon className="w-16 h-16 text-[#30363D] mx-auto mb-4" strokeWidth={1} />
                      <h3 className="text-white font-medium text-lg mb-2">Awaiting Execution</h3>
                      <p className="text-[#8B949E] text-sm leading-relaxed">Enter an endpoint URL on the left, define your payloads, and hit <strong className="text-white">SEND</strong> to invoke the proxy.</p>
                    </div>

                    {/* Quick Examples mimicking the Playground UI */}
                    <div className="border border-[#30363D] rounded-xl overflow-hidden bg-[#161B22]/50">
                      <div className="text-xs font-bold text-[#8B949E] p-3 border-b border-[#30363D] uppercase tracking-wider bg-[#0D1117]">Try a Sample Payload</div>
                      
                      <button onClick={() => { setMethod('GET'); setUrl('https://api.github.com/users/github'); }} className="w-full flex items-center justify-between p-4 hover:bg-[#21262D] transition-colors border-b border-[#30363D] text-left group">
                        <div>
                          <span className="text-green-400 font-bold text-xs mr-3">GET</span>
                          <span className="text-sm text-white font-medium">Public Feed</span>
                          <p className="text-xs text-[#8B949E] mt-1 ml-9">Fetch GitHub user metadata.</p>
                        </div>
                        <MoveRight className="w-4 h-4 text-[#8B949E] group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </button>
                      
                      <button onClick={() => { setMethod('POST'); setUrl('https://jsonplaceholder.typicode.com/posts'); setBody('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}'); setActiveTab('body'); }} className="w-full flex items-center justify-between p-4 hover:bg-[#21262D] transition-colors text-left group">
                        <div>
                          <span className="text-yellow-400 font-bold text-xs mr-3">POST</span>
                          <span className="text-sm text-white font-medium">Inject JSON</span>
                          <p className="text-xs text-[#8B949E] mt-1 ml-9">Submit a dummy structured dataset.</p>
                        </div>
                        <MoveRight className="w-4 h-4 text-[#8B949E] group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </button>

                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global SEO Content Hook Layer */}
        <div className="mt-16 bg-[#161B22] p-8 md:p-12 rounded-2xl border border-[#30363D] shadow-2xl relative overflow-hidden">
             
             {/* Decorative tech background elements */}
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
             </div>

             <div className="max-w-4xl relative z-10">
                <h2 className="text-3xl font-black text-white mb-6">Master Your Integrations with the Ultimate API Playground</h2>
                
                <div className="prose prose-invert prose-indigo max-w-none prose-p:leading-relaxed">
                  <p className="text-lg text-[#8B949E]">
                    Welcome to the definitive browser-based API Tester. Say goodbye to downloading massive desktop applications, dealing with mandatory account creations, or navigating paywalled limits. The CosmoxHub API Playground runs 100% inside your chromium engine.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center mb-3">
                         <Zap className="w-5 h-5 mr-2 text-yellow-400" /> Postman Alternative
                      </h3>
                      <p className="text-[#8B949E] text-sm leading-relaxed">
                        Why wait 45 seconds for a heavy Electron app to load just to ping an endpoint? We built this tool for pure, frictionless velocity. Insert your URL, execute the payload, review the JSON. No telemetry tracking, zero bloatware.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center mb-3">
                         <Shield className="w-5 h-5 mr-2 text-green-400" /> Bypassing CORS Securely
                      </h3>
                      <p className="text-[#8B949E] text-sm leading-relaxed">
                        Browser CORS policies traditionally block native client-side fetch requests. We engineered a proprietary Edge Proxy router that processes your payload statelessly and bounces it instantly without logging records or exposing your keys.
                      </p>
                    </div>
                  </div>

                  <hr className="border-[#30363D] my-10" />

                  <h3 className="text-2xl font-bold text-white mb-4">How to Test Webhooks Instantly</h3>
                  <p className="text-[#8B949E] mb-6">
                    Building a Zapier integration or a Make.com scenario? Use the <span className="bg-[#21262D] px-2 py-0.5 rounded text-white font-mono text-sm border border-[#30363D]">POST</span> method selector, construct your JSON payload matching the platform documentation, and fire directly into their Webhook Catchers to simulate live environments.
                  </p>

                  <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-6">
                     <h4 className="font-bold text-white mb-4">Supported Architectures:</h4>
                     <ul className="space-y-2 text-[#8B949E] text-sm list-disc pl-4 marker:text-indigo-500">
                       <li><strong>RESTful Architecture:</strong> Full CRUD operations (GET, POST, PUT, DELETE, PATCH).</li>
                       <li><strong>GraphQL:</strong> Pass your operations mapping inside the Body tab using explicit JSON structure.</li>
                       <li><strong>OAuth & Bearer Schemes:</strong> Seamless mapping through the Auth execution panel.</li>
                     </ul>
                  </div>
                </div>
             </div>
        </div>

        {/* Latest Developer Tutorials & Guides (Mimicking playgroundapi articles) */}
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-white flex items-center">
              <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3"></span>
              Latest Post
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/blog/best-postman-alternatives-2026" className="group rounded-2xl bg-[#161B22] border border-[#30363D] overflow-hidden hover:border-indigo-500/50 transition-colors shadow-lg">
               <div className="h-40 bg-gradient-to-br from-[#0D1117] relative to-[#161B22] border-b border-[#30363D] p-6 flex flex-col justify-between">
                 <div className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 inline-block w-max rounded-full">Dev Tools</div>
                 <Code2 className="w-12 h-12 text-[#30363D] absolute bottom-4 right-4 group-hover:text-indigo-500/20 transition-colors" />
               </div>
               <div className="p-6">
                 <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Top lightweight Postman alternatives for API Testing</h4>
                 <p className="text-sm text-[#8B949E] line-clamp-2">Discover how browser-based API clients are replacing massive electron-based desktop applications for rapid web development workflows.</p>
                 <div className="mt-4 text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Read Article &rarr;</div>
               </div>
            </Link>
            
            <Link href="/blog/understanding-cors-and-bypassing" className="group rounded-2xl bg-[#161B22] border border-[#30363D] overflow-hidden hover:border-green-500/50 transition-colors shadow-lg">
               <div className="h-40 bg-gradient-to-br from-[#0D1117] relative to-[#161B22] border-b border-[#30363D] p-6 flex flex-col justify-between">
                 <div className="text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 inline-block w-max rounded-full">Security</div>
                 <Shield className="w-12 h-12 text-[#30363D] absolute bottom-4 right-4 group-hover:text-green-500/20 transition-colors" />
               </div>
               <div className="p-6">
                 <h4 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Understanding CORS & How API Proxies Work</h4>
                 <p className="text-sm text-[#8B949E] line-clamp-2">A deep dive into why browsers block cross-origin requests, what CORS actually means, and how edge proxies can solve this securely.</p>
                 <div className="mt-4 text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Read Article &rarr;</div>
               </div>
            </Link>

            <Link href="/blog/how-to-test-zapier-webhooks" className="group rounded-2xl bg-[#161B22] border border-[#30363D] overflow-hidden hover:border-yellow-500/50 transition-colors shadow-lg">
               <div className="h-40 bg-gradient-to-br from-[#0D1117] relative to-[#161B22] border-b border-[#30363D] p-6 flex flex-col justify-between">
                 <div className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-3 py-1 inline-block w-max rounded-full">Guides</div>
                 <Zap className="w-12 h-12 text-[#30363D] absolute bottom-4 right-4 group-hover:text-yellow-500/20 transition-colors" />
               </div>
               <div className="p-6">
                 <h4 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">How to Test Webhook Catchers (Zapier, Make)</h4>
                 <p className="text-sm text-[#8B949E] line-clamp-2">Learn how to instantly fire mocked JSON payloads into webhooks to build and troubleshoot your automation scenarios quickly.</p>
                 <div className="mt-4 text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Read Article &rarr;</div>
               </div>
            </Link>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #30363D;
          border-radius: 20px;
          border: 3px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #484F58;
        }
        .shadow-inset {
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
        }
      `}} />
    </div>
  );
}
