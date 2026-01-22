import React, { useState, useEffect } from 'react';
import { Radiation, ShieldCheck, HeartHandshake, ChevronRight, Languages, Globe, Star, Zap } from 'lucide-react';

interface StartScreenProps {
  onStart: (isPublic?: boolean) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [mythIndex, setMythIndex] = useState(0);

  const myths = [
    { m: "Will I glow in the dark?", f: "No, medical radiation doesn't make you glow." },
    { m: "Is it safe to hug my kids?", f: "Yes, you are safe immediately after an X-ray." },
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 md:p-8 text-white overflow-x-hidden font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-64 md:w-96 h-64 md:h-96 bg-rad-600 rounded-full blur-[100px] md:blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-teal-600 rounded-full blur-[100px] md:blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="z-10 text-center w-full max-w-5xl py-12 md:py-0">
        <div className="mb-8 md:mb-12">
          <div className="bg-white/10 w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl flex items-center justify-center border border-white/20 mb-6 shadow-2xl">
            <Radiation size={32} className="text-rad-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white via-rad-200 to-slate-500 bg-clip-text text-transparent leading-none">
            RAD SAFE PRO
          </h1>
          <p className="text-rad-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Global Safety & Awareness Portal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          <div className="lg:col-span-7 bg-white p-1 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl transform transition-all">
            <div className="bg-teal-600 h-full rounded-[2.2rem] md:rounded-[3.2rem] p-6 md:p-12 text-left relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
                <HeartHandshake size={240} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Star size={10} fill="currentColor" /> Public Awareness
                   </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">Patient Safety & Myth Busters</h2>
                
                {/* Revolving Myth Card */}
                <div className="bg-white/10 p-4 md:p-5 rounded-2xl border border-white/20 mb-8 min-h-[90px] flex items-center gap-4 animate-fade-in" key={mythIndex}>
                   <div className="p-2.5 bg-white text-teal-700 rounded-xl shadow-lg shrink-0">
                      <Zap size={20} />
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">Radiation Insight</p>
                      <p className="text-xs md:text-sm font-bold text-teal-50 leading-tight italic">"{myths[mythIndex].m}"</p>
                      <p className="text-xs md:text-sm font-black text-white mt-1 leading-tight">{myths[mythIndex].f}</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 relative z-10">
                {publicLanguages.map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => onStart(true)}
                    className="group bg-white/10 hover:bg-white text-white hover:text-teal-700 p-4 md:p-5 rounded-xl md:rounded-2xl text-center transition-all border border-white/10 hover:border-white shadow-lg active:scale-95"
                  >
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{lang.code}</p>
                    <p className="text-sm md:text-lg font-black mt-0.5">{lang.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 text-left hover:bg-white/10 transition-all group flex flex-col justify-between">
              <div>
                <div className="p-3.5 md:p-4 bg-rad-600 text-white rounded-2xl w-fit mb-6 shadow-xl shadow-rad-900/40 group-hover:rotate-6 transition-transform shrink-0">
                   <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-2 tracking-tight">Academic Portal</h3>
                <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed mb-8">
                  Designed for AHS Radiology students and professionals. Access physics and safety tools.
                </p>
              </div>
              <button 
                onClick={() => onStart(false)}
                className="w-full bg-white text-slate-900 font-black py-4 md:py-5 rounded-2xl md:rounded-3xl flex items-center justify-center gap-3 hover:bg-rad-100 transition-all shadow-2xl active:scale-95 text-sm uppercase tracking-widest"
              >
                Sign In <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all">
               <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <Globe size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Hub</p>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Multi-Language v3.8</p>
                  </div>
               </div>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;