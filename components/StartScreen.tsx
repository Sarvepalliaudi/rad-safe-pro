
import React, { useState, useEffect } from 'react';
import { Radiation, ShieldCheck, HeartHandshake, ChevronRight, Languages, Globe, Star, Zap } from 'lucide-react';

interface StartScreenProps {
  onStart: (isPublic?: boolean) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [mythIndex, setMythIndex] = useState(0);

  const myths = [
    { m: "Will I glow in the dark?", f: "No, medical radiation doesn't make you glow." },
    { m: "Is it safe to hug my kids?", f: "Yes, you are safe to touch anyone immediately." },
    { m: "Is radiation only man-made?", f: "No, it's everywhere in nature—even in bananas!" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMythIndex((prev) => (prev + 1) % myths.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const publicLanguages = [
    { code: 'English', label: 'English' },
    { code: 'Tamil', label: 'தமிழ்' },
    { code: 'Hindi', label: 'हिन्दी' },
    { code: 'Telugu', label: 'తెలుగు' },
    { code: 'Malayalam', label: 'മലയാളം' },
    { code: 'Kannada', label: 'ಕನ್ನಡ' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-4 md:p-6 text-white overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rad-600 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="z-10 text-center w-full max-w-5xl">
        <div className="mb-10">
          <div className="bg-white/10 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border border-white/20 mb-6 shadow-2xl">
            <Radiation size={32} className="text-rad-400" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white via-rad-200 to-slate-500 bg-clip-text text-transparent">
            RAD SAFE PRO
          </h1>
          <p className="text-rad-400 text-sm font-black uppercase tracking-[0.5em]">Global Safety & Awareness Portal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-white p-1 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transform hover:scale-[1.01] transition-all">
            <div className="bg-teal-600 h-full rounded-[3.2rem] p-8 md:p-12 text-left relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 opacity-10">
                <HeartHandshake size={240} />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                   <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Star size={12} fill="currentColor" /> Public Safety Edition
                   </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">10 Myth Busters & Safety</h2>
                
                {/* Revolving Myth Card */}
                <div className="bg-white/10 p-5 rounded-2xl border border-white/20 mb-10 min-h-[100px] flex items-center gap-4 animate-fade-in" key={mythIndex}>
                   <div className="p-3 bg-white text-teal-700 rounded-xl shadow-lg">
                      <Zap size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Did you know?</p>
                      <p className="text-sm font-bold text-teal-50 leading-tight">"{myths[mythIndex].m}" <span className="text-white block mt-1">{myths[mythIndex].f}</span></p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {publicLanguages.map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => onStart(true)}
                    className="group bg-white/10 hover:bg-white text-white hover:text-teal-700 p-5 rounded-2xl text-center transition-all border border-white/10 hover:border-white shadow-lg active:scale-95"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{lang.code}</p>
                    <p className="text-lg font-black mt-1">{lang.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-10 text-left hover:bg-white/10 transition-all group flex flex-col justify-between">
              <div>
                <div className="p-4 bg-rad-600 text-white rounded-2xl w-fit mb-6 shadow-xl shadow-rad-900/40 group-hover:rotate-6 transition-transform">
                   <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">Academic Portal</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                  For Radiology Students (AHS) & Officers. Advanced tools and physics modules.
                </p>
              </div>
              <button 
                onClick={() => onStart(false)}
                className="w-full bg-white text-slate-900 font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-rad-100 transition-all shadow-2xl active:scale-95"
              >
                Sign In <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <Globe size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Data</p>
                    <p className="text-xs font-bold text-white uppercase tracking-tighter">v3.8 Multi-Language</p>
                  </div>
               </div>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
