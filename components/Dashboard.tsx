import React, { useEffect, useState } from 'react';
import { Section, UserProfile } from '../types';
import { 
  BookOpen, Calculator, ShieldAlert, BrainCircuit, HelpCircle, 
  LogOut, Trophy, Heart, Sparkles, ChevronRight, 
  Languages, Radar, Smartphone, Bot, Activity, Info, 
  Stethoscope, Zap, ShieldCheck, HeartHandshake
} from 'lucide-react';
import { getUserProfile } from '../services/userService';

interface DashboardProps {
  onNavigate: (view: string) => void;
  sections: Section[];
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, sections, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const p = getUserProfile();
    if (!p.id) {
      onLogout();
      return;
    }
    setProfile(p);
  }, []);

  if (!profile) return null;

  const role = profile.role;
  const isPatient = role === 'patient';
  const isPublic = role === 'public';
  const isStudentOrPro = role === 'student' || role === 'radiology_officer' || role === 'admin';
  const isPro = profile.isPro || role === 'radiology_officer' || role === 'admin'; 

  const navItems = [
    { id: 'intro', label: 'X-Ray Physics', icon: <BookOpen size={24} />, color: 'bg-blue-100 text-blue-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'safety', label: 'Radiation Safety', icon: <ShieldAlert size={24} />, color: 'bg-red-100 text-red-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'calculator', label: 'Calculators', icon: <Calculator size={24} />, color: 'bg-emerald-100 text-emerald-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'ai-predictor', label: 'AI Dose Predictor', icon: <BrainCircuit size={24} />, color: 'bg-purple-100 text-purple-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'awareness', label: 'Awareness Hub', icon: <Languages size={24} />, color: 'bg-teal-100 text-teal-600', roles: ['student', 'radiology_officer', 'admin', 'patient', 'public'] },
    { id: 'patient-portal', label: 'Patient Companion', icon: <Heart size={24} />, color: 'bg-rose-100 text-rose-600', roles: ['patient'] },
    { id: 'geo-map', label: 'Mapping Hub', icon: <Radar size={24} />, color: 'bg-indigo-100 text-indigo-600', roles: ['student', 'radiology_officer', 'admin', 'patient', 'public'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  const getPrimaryFeature = () => {
    if (isPatient) return { id: 'patient-portal', title: 'Patient Companion', desc: 'Real-time support, breathing guides, and relaxation for your diagnostic visit.', color: 'from-rose-600 to-rose-700 shadow-rose-200', icon: <Heart size={56} className="text-white/20" /> };
    if (isPublic) return { id: 'awareness', title: 'Public Awareness', desc: 'Busting radiation myths in 6 languages. Learn why modern scans are safe.', color: 'from-teal-600 to-teal-700 shadow-teal-200', icon: <Languages size={56} className="text-white/20" /> };
    return { id: 'intro', title: 'Master Curriculum', desc: 'Professional grade physics, ALARA protocols, and clinical dosimetry simulations.', color: 'from-slate-800 to-slate-900 shadow-slate-300', icon: <ShieldCheck size={56} className="text-white/20" /> };
  };

  const primary = getPrimaryFeature();

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-12 animate-fade-in font-sans">
      <header className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
             {isPatient ? 'Companion Hub' : isPublic ? 'Awareness Center' : 'Clinical Portal'}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{profile.name}</p>
            <span className={`px-2 py-0.5 text-white text-[8px] font-black rounded-lg uppercase tracking-wider shadow-md ${isPro ? 'bg-rad-600' : isPatient ? 'bg-rose-600' : 'bg-teal-600'}`}>
              {role.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
           {isStudentOrPro && (
             <div className="flex-1 md:flex-none bg-white px-5 py-4 rounded-[1.5rem] shadow-xl border border-gray-50 flex items-center gap-4">
               <Trophy size={24} className="text-yellow-500 shrink-0" />
               <div className="text-left overflow-hidden">
                 <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest truncate">Academic Rank {profile.level}</p>
                 <p className="text-[9px] text-slate-400 font-bold truncate">{profile.totalXp} Cumulative XP</p>
               </div>
             </div>
           )}
           <button onClick={onLogout} className="bg-slate-900 text-white p-4 rounded-[1.5rem] hover:bg-black shadow-lg transition-transform active:scale-90 flex items-center justify-center">
             <LogOut size={22} />
           </button>
        </div>
      </header>

      {/* PRIMARY "SHINING" ACTION CARD */}
      <div className="mb-8 md:mb-12">
        <button
          onClick={() => onNavigate(primary.id)}
          className={`w-full relative overflow-hidden p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl transition-all hover:scale-[1.01] text-left group border-4 border-white bg-gradient-to-br ${primary.color}`}
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1 flex gap-8">
              <div className="hidden sm:block shrink-0 bg-white/10 p-6 rounded-[2rem] border border-white/10">
                {primary.icon}
              </div>
              <div>
                <h3 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-4 tracking-tighter uppercase leading-none">
                  {primary.title}
                </h3>
                <p className="text-white/80 font-bold text-xs md:text-lg max-w-xl leading-relaxed">
                  {primary.desc}
                </p>
              </div>
            </div>
            
            <div className="bg-white text-slate-900 px-8 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 shadow-xl group-hover:scale-105 transition-all">
              Launch Portal <ChevronRight size={22} />
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-transparent hover:border-rad-300 transition-all active:scale-95 text-center group min-h-[180px]"
          >
            <div className={`p-5 rounded-[1.5rem] mb-4 ${item.color} group-hover:rotate-6 transition-transform shadow-sm`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <span className="font-black text-slate-800 text-[10px] md:text-xs uppercase tracking-widest leading-tight">{item.label}</span>
          </button>
        ))}
        {(isPublic || isPatient) && (
          <button
            onClick={() => onNavigate('about')}
            className="flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-transparent hover:border-rad-300 transition-all active:scale-95 text-center group min-h-[180px]"
          >
            <div className="p-5 rounded-[1.5rem] mb-4 bg-slate-100 text-slate-600 group-hover:rotate-6 transition-transform shadow-sm">
              <Info size={28} />
            </div>
            <span className="font-black text-slate-800 text-[10px] md:text-xs uppercase tracking-widest leading-tight">Project Credits</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8">
          <div className="bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-xl relative overflow-hidden h-full">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Activity size={240} />
             </div>
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
               <Zap size={14} className="text-rad-500" /> Professional Insight Stream
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 hover:bg-white hover:shadow-lg transition-all cursor-default">
                  <h4 className="font-black text-blue-800 text-sm uppercase mb-3">Diagnostic Physics</h4>
                  <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                    Clinical imaging relies on selective attenuation. Mastery of the K-shell interaction is the foundation of high-quality radiography.
                  </p>
                </div>
                <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 hover:bg-white hover:shadow-lg transition-all cursor-default">
                  <h4 className="font-black text-emerald-800 text-sm uppercase mb-3">Clinical Safety</h4>
                  <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                    Distance remains the most effective protection. Doubling your distance from the source reduces exposure by 75% instantly.
                  </p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden group border-4 border-slate-800 h-full flex flex-col justify-center">
            <Sparkles className="absolute -top-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-45 transition-transform duration-1000 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-rad-600/20 rounded-2xl flex items-center justify-center mb-8 border border-rad-500/20">
                <Bot size={32} className="text-rad-400" />
              </div>
              <h3 className="font-black text-2xl mb-4 tracking-tighter uppercase">Rad AI Lab</h3>
              <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10">
                Advanced neural assistance for safety verification, dose modeling, and anatomical identification.
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-rad-400">Physics Engine Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;