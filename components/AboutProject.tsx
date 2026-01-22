import React from 'react';
import { Users, MapPin, Award, GraduationCap, Heart, ShieldCheck, Microscope, Binary, Cpu, BookOpen, Star, Sparkles, Bot } from 'lucide-react';

const AboutProject: React.FC = () => {
  const teamMembers = [
    { name: "Keerthivasan J", role: "Clinical Research Lead", dept: "AHS - Radiology", icon: <Microscope size={20} /> },
    { name: "Madhavan RD", role: "Safety Protocol Analyst", dept: "AHS - Radiology", icon: <ShieldCheck size={20} /> },
    { name: "Shalini M", role: "Clinical Content Specialist", dept: "AHS - Radiology", icon: <BookOpen size={20} /> },
    { name: "Navya K", role: "Radiographic Research", dept: "AHS - Radiology", icon: <Heart size={20} /> },
    { name: "Sarvepalli Audi Siva Bhanuvardhan", role: "Lead Developer & AI Architect", dept: "SET - Cyber Security", icon: <Binary size={20} /> },
    { name: "Thilakesh TM", role: "Biomedical Systems Lead", dept: "SET - Biomedical", icon: <Cpu size={20} /> }
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20 px-4">
      {/* Institution Branding */}
      <div className="text-center mb-16">
        <div className="inline-block p-4 bg-white rounded-3xl shadow-xl mb-6 border border-slate-50">
          <GraduationCap size={48} className="text-rad-600" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rad-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-lg">
           <Star size={14} fill="white" /> DSU HACKATHON 2025
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
          Dhanalakshmi Srinivasan University
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
          <MapPin size={14} className="text-rad-500" /> Samayapuram, Trichy, Tamil Nadu , 621 112
        </div>
      </div>

      {/* Project Identity */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 translate-x-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-rad-400" size={32} />
            <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase">RAD SAFE PRO <span className="text-rad-500">2025</span></h2>
          </div>
          <p className="text-slate-400 font-medium text-sm md:text-lg leading-relaxed max-w-3xl mb-8">
            An interdisciplinary collaborative initiative specifically developed for the <span className="text-white font-bold underline decoration-rad-500 underline-offset-4">DSU Hackathon</span> between the <span className="text-white font-bold underline decoration-indigo-400 underline-offset-4">School of Allied Health Sciences (AHS)</span> and the <span className="text-white font-bold underline decoration-rad-500 underline-offset-4">School of Engineering and Technology (SET)</span>.
          </p>
          
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl inline-flex items-center gap-4">
            <div className="w-12 h-12 bg-rad-500 rounded-xl flex items-center justify-center font-black text-xl">N</div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-rad-400">Faculty Incharge</p>
              <p className="font-black text-lg">Ms. R. Nivethitha</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Assistant Professor</p>
              <p className="text-[10px] font-bold text-rad-300 uppercase mt-0.5">Radiography and Imaging Technology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-4">
          <Users className="text-rad-600" size={24} />
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Development & Research Team</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-rad-200/20 transition-all group">
              <div className="w-12 h-12 bg-slate-50 text-rad-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rad-600 group-hover:text-white transition-colors">
                {member.icon}
              </div>
              <h4 className="font-black text-slate-900 text-lg leading-tight mb-2">{member.name}</h4>
              <p className="text-[10px] font-black text-rad-600 uppercase tracking-widest mb-1">{member.role}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.dept}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recognition & Credits */}
      <div className="mt-20 p-10 bg-rad-50 rounded-[3rem] border border-rad-100 text-center relative overflow-hidden">
        <Sparkles className="absolute -top-10 -left-10 w-40 h-40 text-rad-200 opacity-30" />
        <p className="text-[10px] font-black text-rad-400 uppercase tracking-[0.5em] mb-4">Official Hackathon Submission</p>
        <p className="text-sm font-bold text-rad-800 max-w-2xl mx-auto leading-relaxed mb-10">
          RAD SAFE PRO is recognized as a pioneering pedagogical tool for Radiology Imaging Technology (RIT) students, combining clinical dosimetry with modern AI frameworks.
        </p>

        <div className="pt-8 border-t border-rad-200 flex flex-col items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">AI Intelligence Powered By</p>
          <div className="flex items-center gap-3 bg-white px-8 py-4 rounded-3xl shadow-xl border border-slate-100 group hover:border-rad-400 transition-all">
            <Bot className="text-rad-600 group-hover:scale-110 transition-transform" size={28} />
            <div className="text-left">
              <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Google Gemini</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Multimodal Neural Architecture</p>
            </div>
          </div>
          <p className="mt-6 text-[9px] font-black text-rad-400 uppercase tracking-widest">Credits to Google Gemini</p>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;