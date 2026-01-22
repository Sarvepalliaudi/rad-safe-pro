
import React from 'react';
import { Users, MapPin, Award, GraduationCap, Code, Heart, BookOpen } from 'lucide-react';

const AboutProject: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      {/* Hero Banner */}
      <div className="text-center mb-12">
        <div className="inline-block p-5 bg-rad-50 rounded-[2rem] mb-6 shadow-xl shadow-rad-100">
          <Award size={56} className="text-rad-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 uppercase">RAD SAFE PRO</h1>
        <p className="text-rad-600 font-black uppercase tracking-[0.4em] text-xs">Innovation in Medical Physics</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Hackathon Edition 2025-26</span>
        </div>
      </div>

      {/* University & Institutional Header */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden mb-10 transform hover:scale-[1.01] transition-all">
        <div className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 translate-x-32"></div>
          <GraduationCap size={48} className="mx-auto mb-4 text-rad-400" />
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-4">Dhanalakshmi Srinivasan University</h2>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <MapPin size={14} /> Samayapuram, Trichy - 621 112
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-rad-50 rounded-2xl border border-rad-100">
            <p className="text-[10px] font-black text-rad-600 uppercase tracking-widest mb-1">School of</p>
            <p className="font-black text-slate-800 uppercase text-sm">Allied Health Science</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">School of</p>
            <p className="font-black text-slate-800 uppercase text-sm">Engineering and Technology</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Guidance & Lead Dev */}
        <div className="lg:col-span-5 space-y-8">
          {/* Guide Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 border-l-8 border-l-purple-600">
            <h4 className="flex items-center gap-2 font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">
              <Users className="text-purple-600" size={18} /> Project Guide
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-black text-xl shadow-inner">
                N
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg leading-none">Prof. Nivethitha</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Assistant Professor</p>
                <p className="text-[10px] font-black text-purple-600 uppercase mt-1">AHS / DSU</p>
              </div>
            </div>
          </div>

          {/* Developer Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 border-l-8 border-l-rad-500 text-white">
            <h4 className="flex items-center gap-2 font-black text-rad-400 mb-6 uppercase text-xs tracking-widest">
              <Code size={18} /> Lead Developer
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-rad-400 font-black text-xl border border-white/10">
                S
              </div>
              <div>
                <p className="font-black text-white text-lg leading-tight">Sarvepalli Audi Siva Bhanuvardhan</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">CYS / SET / DSU</p>
                <p className="text-[10px] font-black text-rad-400 uppercase mt-1">Full Stack & AI Engineer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Medical Team */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 border-l-8 border-l-teal-500 h-full">
            <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-xs tracking-widest">
              <Heart className="text-teal-600" size={18} />
              Core Medical & Design Team
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Keerthivasan J", dept: "Dept of RIT / AHS" },
                { name: "Madhavan RD", dept: "Dept of RIT / AHS" },
                { name: "Shalini M", dept: "Dept of RIT / AHS" },
                { name: "Navya K", dept: "Dept of RIT / AHS" },
                { name: "Thilakesh TM", dept: "Dept of BME / SET" }
              ].map((member, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                  <div className="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-150 transition-transform"></div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{member.name}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{member.dept}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed text-center">
                This project represents a multidisciplinary collaboration between Radiology imaging technicians and Cybersecurity/BME engineers at DSU.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
