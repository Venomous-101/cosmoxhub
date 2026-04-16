'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Download, Plus, Trash2, User, Briefcase, GraduationCap, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Wrench, Globe, Mail, Phone, MapPin, Link as LinkIcon, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  RotateCcw, Save, CheckCircle, ExternalLink, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

interface ResumeData {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
}

const DEFAULT_DATA: ResumeData = {
  personal: {
    fullName: "Alex Rivera",
    title: "Senior Full Stack Developer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 000-0000",
    location: "San Francisco, CA",
    website: "alexrivera.dev",
    summary: "Dedicated full-stack developer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and Cloud Infrastructure. Passionate about clean code and exceptional user experiences."
  },
  experience: [
    {
      id: '1',
      company: "TechFlow Systems",
      position: "Senior Software Engineer",
      duration: "2020 - Present",
      description: "Led the development of a high-traffic e-commerce platform using Next.js and Microservices. Improved page load times by 40% and mentored a team of 5 junior developers."
    },
    {
      id: '2',
      company: "Innovate Digital",
      position: "Full Stack Developer",
      duration: "2017 - 2020",
      description: "Developed and maintained multiple client projects. Implemented real-time dashboard analytics using WebSockets and D3.js."
    }
  ],
  education: [
    {
      id: '1',
      school: "University of Technology",
      degree: "B.S. in Computer Science",
      year: "2013 - 2017"
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "AWS", "Docker", "Tailwind CSS", "GraphQL"]
};

export default function ResumeBuilderClient() {
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'exp' | 'edu' | 'skills'>('info');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('cosmox_resume_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.error("Failed to load saved resume data");
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cosmox_resume_data', JSON.stringify(data));
      setIsSaved(true);
      const timer = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [data, isClient]);

  const handlePersonalChange = (field: keyof ResumeData['personal'], value: string) => {
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), company: '', position: '', duration: '', description: '' };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), school: '', degree: '', year: '' };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const addSkill = (skill: string) => {
    if (!skill.trim() || data.skills.includes(skill)) return;
    setData(prev => ({ ...prev, skills: [...prev.skills, skill.trim()] }));
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const resetData = () => {
    if (confirm("Are you sure you want to reset all data to default? This cannot be undone.")) {
      setData(DEFAULT_DATA);
    }
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);
    
    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Resume Builder Pro
          </h1>
          <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
            <CheckCircle className={`w-4 h-4 transition-colors ${isSaved ? 'text-green-500' : 'text-zinc-700'}`} />
            {isSaved ? 'Auto-saved to local browser' : 'Syncing...'}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={resetData}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={downloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            {isExporting ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,550px] xl:grid-cols-[1fr,800px] gap-8 pb-20">
        
        {/* EDITOR PANEL */}
        <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden h-fit">
          
          {/* Section Navigation */}
          <div className="flex border-b border-zinc-800 mb-8 sticky top-0 bg-[#111111] z-20 overflow-x-auto pb-1 gap-2 scrollbar-none">
            {[
              { id: 'info', label: 'Personal', icon: User },
              { id: 'exp', label: 'Experience', icon: Briefcase },
              { id: 'edu', label: 'Education', icon: GraduationCap },
              { id: 'skills', label: 'Skills', icon: Wrench },
            ].map((tab) => (
              <button
                key={tab.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id 
                  ? 'text-purple-400 border-purple-500 bg-purple-500/5' 
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* PERSONAL INFO */}
            {activeTab === 'info' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullname" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
                    <input 
                      id="fullname"
                      type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all font-medium" 
                      value={data.personal.fullName} onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="jobtitle" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Job Title</label>
                    <input 
                      id="jobtitle"
                      type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all font-medium" 
                      value={data.personal.title} onChange={(e) => handlePersonalChange('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email</label>
                    <input 
                      id="email"
                      type="email" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all font-medium" 
                      value={data.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Phone</label>
                    <input 
                      id="phone"
                      type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all font-medium" 
                      value={data.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="summary" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Summary</label>
                  <textarea 
                    id="summary"
                    rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all font-medium resize-none" 
                    value={data.personal.summary} onChange={(e) => handlePersonalChange('summary', e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {/* EXPERIENCE */}
            {activeTab === 'exp' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                {data.experience.map((exp, index) => (
                  <div key={exp.id} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl relative group">
                    <button 
                      aria-label="Remove experience"
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input 
                        aria-label="Company name"
                        placeholder="Company" className="bg-transparent text-lg font-bold text-white focus:outline-none border-b border-zinc-800 focus:border-purple-500 pb-1"
                        value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      />
                      <input 
                        aria-label="Duration"
                        placeholder="Duration (e.g. 2020 - Present)" className="bg-transparent text-sm text-zinc-400 focus:outline-none border-b border-zinc-800 focus:border-purple-500 pb-1"
                        value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                      />
                    </div>
                    <input 
                      aria-label="Position"
                      placeholder="Position" className="w-full bg-transparent text-purple-400 font-medium mb-4 focus:outline-none border-b border-zinc-800 focus:border-purple-500 pb-1"
                      value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    />
                    <textarea 
                      aria-label="Description"
                      placeholder="Describe your role and impact..."
                      rows={3} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-300 text-sm focus:outline-none focus:border-purple-500 resize-none"
                      value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    />
                  </div>
                ))}
                <button 
                  onClick={addExperience}
                  className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:text-purple-400 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Plus className="w-5 h-5" /> Add Experience
                </button>
              </motion.div>
            )}

            {/* EDUCATION */}
            {activeTab === 'edu' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {data.education.map((edu) => (
                   <div key={edu.id} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl relative grid md:grid-cols-[1fr,150px] gap-4">
                      <button 
                        aria-label="Remove education"
                        onClick={() => removeEducation(edu.id)}
                        className="absolute -top-2 -right-2 p-2 bg-zinc-800 text-zinc-500 hover:text-red-500 border border-zinc-700 rounded-full shadow-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-4">
                        <input 
                          aria-label="University/School"
                          placeholder="University/School" className="w-full bg-transparent text-lg font-bold text-white focus:outline-none border-b border-zinc-800 focus:border-purple-500 pb-1"
                          value={edu.school} onChange={(e) => setData(prev => ({ ...prev, education: prev.education.map(item => item.id === edu.id ? { ...item, school: e.target.value } : item) }))}
                        />
                        <input 
                          aria-label="Degree/Major"
                          placeholder="Degree / Major" className="w-full bg-transparent text-zinc-400 focus:outline-none border-b border-zinc-800 focus:border-purple-500 pb-1"
                          value={edu.degree} onChange={(e) => setData(prev => ({ ...prev, education: prev.education.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item) }))}
                        />
                      </div>
                      <input 
                        aria-label="Graduation Year"
                        placeholder="Year" className="bg-transparent text-sm text-zinc-500 text-right focus:outline-none border-b border-zinc-800 focus:border-purple-500 pb-1 h-fit pt-1"
                        value={edu.year} onChange={(e) => setData(prev => ({ ...prev, education: prev.education.map(item => item.id === edu.id ? { ...item, year: e.target.value } : item) }))}
                      />
                   </div>
                ))}
                <button 
                  onClick={addEducation}
                  className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:text-purple-400 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Plus className="w-5 h-5" /> Add Education
                </button>
              </motion.div>
            )}

            {/* SKILLS */}
            {activeTab === 'skills' && (
               <motion.div 
                 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                 className="space-y-6"
               >
                 <div>
                   <label htmlFor="skill-input" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Core Competencies</label>
                   <div className="flex flex-wrap gap-2 mb-6">
                     {data.skills.map((skill) => (
                       <span key={skill} className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-lg text-sm border border-purple-500/20 group">
                         {skill}
                         <button aria-label={`Remove skill ${skill}`} onClick={() => removeSkill(skill)} className="text-zinc-600 hover:text-red-400 transition-colors">
                           <Trash2 className="w-3 h-3" />
                         </button>
                       </span>
                     ))}
                   </div>
                   <div className="flex gap-2">
                     <input 
                       id="skill-input"
                       type="text" placeholder="Add a skill (e.g. React, UX Design)" 
                       className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                       onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                           addSkill((e.target as HTMLInputElement).value);
                           (e.target as HTMLInputElement).value = '';
                         }
                       }}
                     />
                     <button 
                       aria-label="Add skill"
                       onClick={() => {
                         const input = document.getElementById('skill-input') as HTMLInputElement;
                         addSkill(input.value);
                         input.value = '';
                       }}
                       className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-colors"
                     >
                       <Plus />
                     </button>
                   </div>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* PREVIEW PANEL */}
        <div className="relative group">
           {/* Device Frame */}
           <div className="bg-zinc-900 p-4 md:p-12 rounded-[2.5rem] border-[8px] border-zinc-800 shadow-3xl sticky top-8">
              
              {/* Actual Professional Resume Render */}
              <div 
                ref={resumeRef}
                className="bg-white text-zinc-900 p-10 min-h-[842px] w-full shadow-inner overflow-hidden font-serif"
                id="resume-content"
              >
                {/* Header */}
                <div className="border-b-4 border-zinc-900 pb-6 mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-1 text-zinc-900 leading-none">{data.personal.fullName}</h2>
                    <p className="text-lg font-bold text-zinc-600 uppercase tracking-widest">{data.personal.title}</p>
                  </div>
                  <div className="text-right text-xs space-y-1 font-sans text-zinc-500">
                    <div className="flex items-center justify-end gap-2"><Mail className="w-3 h-3" /> {data.personal.email}</div>
                    <div className="flex items-center justify-end gap-2"><Phone className="w-3 h-3" /> {data.personal.phone}</div>
                    <div className="flex items-center justify-end gap-2"><MapPin className="w-3 h-3" /> {data.personal.location}</div>
                    <div className="flex items-center justify-end gap-2"><Globe className="w-3 h-3" /> {data.personal.website}</div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,220px] gap-10">
                   
                   <div className="space-y-8">
                      {/* Summary */}
                      <section>
                        <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-200 pb-1 mb-3">Professional Profile</h3>
                        <p className="text-zinc-600 text-sm leading-relaxed">{data.personal.summary}</p>
                      </section>

                      {/* Experience */}
                      <section>
                        <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-200 pb-1 mb-4">Experience</h3>
                        <div className="space-y-6">
                           {data.experience.map((exp) => (
                             <div key={exp.id}>
                               <div className="flex justify-between items-start mb-0.5">
                                 <h4 className="font-bold text-zinc-900">{exp.company}</h4>
                                 <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">{exp.duration}</span>
                               </div>
                               <p className="text-xs font-bold text-zinc-500 italic mb-2">{exp.position}</p>
                               <p className="text-zinc-600 text-[11px] leading-relaxed whitespace-pre-line">{exp.description}</p>
                             </div>
                           ))}
                        </div>
                      </section>
                   </div>

                   <div className="space-y-8">
                      {/* Skills */}
                      <section>
                        <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-200 pb-1 mb-3">Competencies</h3>
                        <div className="flex flex-wrap gap-x-1 gap-y-1">
                          {data.skills.map(skill => (
                            <span key={skill} className="text-[10px] font-bold px-2 py-1 bg-zinc-900 text-white rounded-sm">{skill}</span>
                          ))}
                        </div>
                      </section>

                      {/* Education */}
                      <section>
                        <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-200 pb-1 mb-3">Education</h3>
                        <div className="space-y-4">
                           {data.education.map(edu => (
                             <div key={edu.id}>
                                <h4 className="font-bold text-zinc-900 text-[11px] leading-tight">{edu.school}</h4>
                                <p className="text-zinc-500 text-[10px]">{edu.degree}</p>
                                <p className="text-zinc-400 text-[9px] mt-1">{edu.year}</p>
                             </div>
                           ))}
                        </div>
                      </section>
                   </div>

                </div>

                <div className="mt-12 text-[9px] text-zinc-300 font-sans italic text-center border-t border-zinc-100 pt-4">
                  Generated via CosmoxHub Resume Builder Pro
                </div>
              </div>

           </div>
           
           {/* Quality Indicator */}
           <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-4 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-xs text-zinc-500 font-medium">Auto-formatting optimized for ATS (Applicant Tracking Systems)</p>
           </div>
        </div>

      </div>

    </div>
  );
}
