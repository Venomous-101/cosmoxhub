"use client";
import { useState } from "react";
import { Brain, Download, Copy, Check, Info } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function ClaudeSkillsCreatorPage() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    skills: "",
    style: "",
    instructions: ""
  });
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    const { name, role, skills, style, instructions } = formData;
    if (!name && !role) return "### Enter Agent details to generate Skills.md";

    return `---
name: ${name || "My AI Agent"}
role: ${role || "General Assistant"}
---

# ${name || "My AI Agent"} Skills & Persona

## 🎭 Role & Purpose
${role || "Describe the agent's primary purpose here."}

## 🚀 Core Skills & Capabilities
${skills ? skills.split("\n").map(s => `- ${s}`).join("\n") : "- List key skills here."}

## 🗣️ Communication Style & Tone
${style || "Describe how the agent should talk (e.g., Professional, Quirky, Minimalist)."}

## 🛡️ Critical Instructions & Guardrails
${instructions ? instructions.split("\n").map(i => `- ${i}`).join("\n") : "- List important rules or constraints here."}

---
*Created using CosmoxHub AI Agent Skills Creator*`;
  };

  const downloadFile = () => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.name.toLowerCase().replace(/\s+/g, "_") || "agent"}_skills.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="AI Agent Skills Creator" 
      description="Create a professional 'skills.md' file for Claude or other AI agents. Define roles, skills, and behavior in a structured format." 
      icon={Brain} 
      color="#a855f7"
    >
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Input Form */}
        <div className="card p-6 flex-1 h-fit">
          <div className="space-y-6">
            <div>
              <label className="label-text flex items-center gap-2">
                Agent Name <span className="text-indigo-400/50 text-xs font-normal">(e.g. CodeArchitect)</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g. ResearchMaster"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="label-text">Primary Role & Purpose</label>
              <textarea 
                placeholder="What is this agent's main job?"
                className="input-field min-h-[100px] py-3"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>

            <div>
              <label className="label-text">Skills (One per line)</label>
              <textarea 
                placeholder="e.g. Data Analysis&#10;Python Coding&#10;SEO Strategy"
                className="input-field min-h-[120px] py-3"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>

            <div>
              <label className="label-text">Communication Style</label>
              <input 
                type="text" 
                placeholder="e.g. Professional yet friendly, Concise, Scientific"
                className="input-field"
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
              />
            </div>

            <div>
              <label className="label-text">Instructions & Guardrails</label>
              <textarea 
                placeholder="Important rules or constraints..."
                className="input-field min-h-[100px] py-3"
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Live Preview & Actions */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="card p-0 overflow-hidden flex-1 border-indigo-500/30">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-indigo-500/20 flex justify-between items-center">
              <span className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                <Info size={14} /> LIVE PREVIEW (skills.md)
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            <pre className="p-6 text-slate-300 text-sm font-mono whitespace-pre-wrap min-h-[400px] leading-relaxed">
              {generateMarkdown()}
            </pre>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={downloadFile}
              className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-3"
              disabled={!formData.name && !formData.role}
            >
              <Download size={20} /> Download skills.md
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
