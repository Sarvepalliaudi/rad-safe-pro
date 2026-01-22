import React, { useEffect, useState } from 'react';
import { Section, UserProfile } from '../types';
import { 
  BookOpen, Calculator, ShieldAlert, BrainCircuit, HelpCircle, 
  Move, Scan, Trophy, HeartHandshake, LogOut, Users, 
  Activity, Smartphone, Eye, Sparkles, ChevronRight, 
  Languages, Heart, Music, Video, ClipboardCheck, Radar, Map as MapIcon
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
  const isPublic = role === 'public' || role === 'patient';
  const isPro = profile.isPro || role === 'radiology_officer' || role === 'admin'; 

  const navItems = [
    // Student & Pro Tools
    { id: 'intro', label: 'X-Ray Physics', icon: <BookOpen size={24} />, color: 'bg-blue-100 text-blue-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'safety', label: 'Radiation Safety', icon: <ShieldAlert size={24} />, color: 'bg-red-100 text-red-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'modalities', label: 'Modalities Hub', icon: <Scan size={24} />, color: 'bg-indigo-100 text-indigo-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'calculator', label: 'Calculators', icon: <Calculator size={24} />, color: 'bg-emerald-100 text-emerald-600', roles: ['student', 'radiology_officer', 'admin'] },
    
    // Shared Tools
    { id: 'geo-map', label: 'Mapping Assistant', icon: <Radar size={24} />, color: 'bg-indigo-600 text-white shadow-xl shadow-indigo-100', roles: ['student', 'radiology_officer', 'admin', 'patient', 'public'] },
    { id: 'sensor-lab', label: 'Sensor Lab', icon: <Smartphone size={24} />, color: 'bg-pink-100 text-pink-600', roles: ['student', 'radiology_officer', 'admin', 'patient', 'public'] },
    
    // Patient Specific Tools
    { id: 'patient-portal', label: 'Companion Portal', icon: <Heart size={24} />, color: 'bg-rose-100 text-rose-600', roles: ['patient', 'public'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in font-sans">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
             {isPublic ? 'Public Hub' : 
              role === 'radiology_officer' ? 'Command Center' : 
              role === 'admin' ? 'Master Systems' : 'Student Dashboard'}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{profile.name}</p>
            {isPro ? (
              <span className="px-2 py-0.5 bg-rad-600 text-white text-[9px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-rad-100">PRO ACCESS</span>
            ) : (
              <span className="px-2 py-0.5 bg-teal-600 text-white text-[9px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-teal-100">AWARENESS MODE</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
           {role === 'student' && (
             <div className="bg-white px-5 py-3 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3">
               <Trophy size={20} className="text-yellow-500" />
               <div className="text-left">
                 <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Level {profile.level}</p>
                 <p className="text-[9px] text-slate-400 font-bold">{profile.totalXp} XP</p>
               </div>
             </div>
           )}
           <button onClick={onLogout} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-black shadow-lg transition-transform active:scale-90">
             <LogOut size={20} />
           </button>
        </div>
      </header>

      {/* PRIMARY ACTION CARD */}
      <div className="mb-12">
        <button
          onClick={() => onNavigate(isPublic ? 'patient-portal' : 'intro')}
          className={`w-full relative overflow-hidden p-10 rounded-[3rem] shadow-2xl transition-all hover:scale-[1.01] text-left group border-4 border-white ${isPublic ? 'bg-rose-600 shadow-rose-100' : 'bg-slate-900 shadow-slate-200'}`}
        >
          <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 translate-x-32 group-hover:translate-x-16 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase leading-none">
                {isPublic ? 'Patient Companion Portal' : 'Academic Core Hub'}
              </h3>
              <p className="text-white/70 font-bold text-sm max-w-lg">
                {isPublic 
                  ? 'Access music, checklists, YouTube scan guides, and our AI Nurse assistant for a better imaging experience.' 
                  : 'Master advanced X-Ray physics, safety protocols, and clinical positioning via our pro curriculum.'}
              </p>
            </div>
            
            <div className="bg-white text-slate-900 px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl group-hover:bg-rad-100 transition-colors">
              Launch {isPublic ? 'Portal' : 'Curriculum'} <ChevronRight size={20} />
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-transparent hover:border-rad-300 hover:shadow-2xl transition-all active:scale-95 text-center group min-h-[160px]"
          >
            <div className={`p-4 rounded-2xl mb-4 ${item.color} group-hover:rotate-6 transition-transform`}>
              {item.icon}
            </div>
            <span className="font-black text-slate-800 text-[10px] uppercase tracking-widest leading-tight">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden h-full">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                <Activity size={180} />
             </div>
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">
               {isPublic ? 'Awareness & Safety' : 'Professional Resources'}
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => onNavigate('awareness')} className="p-6 bg-teal-50 rounded-3xl border border-teal-100 hover:bg-white text-center flex flex-col items-center gap-3 group transition-all">
                  <Languages size={24} className="text-teal-400 group-hover:text-teal-600 transition-colors" />
                  <span className="font-black text-[9px] text-slate-500 uppercase tracking-widest">Multi-Lingual Myths</span>
                </button>
                <button onClick={() => onNavigate('geo-map')} className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 hover:bg-white text-center flex flex-col items-center gap-3 group transition-all">
                  <Radar size={24} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="font-black text-[9px] text-slate-500 uppercase tracking-widest">Mapping Assistant</span>
                </button>
                <button onClick={() => onNavigate('sensor-lab')} className="p-6 bg-pink-50 rounded-3xl border border-pink-100 hover:bg-white text-center flex flex-col items-center gap-3 group transition-all">
                  <Smartphone size={24} className="text-pink-400 group-hover:text-pink-600 transition-colors" />
                  <span className="font-black text-[9px] text-slate-500 uppercase tracking-widest">Sensor Lab</span>
                </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border-4 border-slate-800 h-full flex flex-col">
            <Sparkles className="absolute -top-10 -right-10 w-40 h-40 opacity-10 group-hover:rotate-45 transition-transform duration-1000" />
            <h3 className="font-black text-lg mb-6 flex items-center gap-3">
              <BrainCircuit className="text-rad-400" /> Dr. Rad AI
            </h3>
            <p className="text-xs text-slate-400 font-bold leading-relaxed">
              {isPublic 
                ? "Have concerns about your scan or curious about a myth? Our AI assistant is here to help you feel calm and informed in simple, friendly terms."
                : "Professional grade AI tutoring for all academic modules. Get instant clarifications on physics, safety limits, and patient positioning."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;