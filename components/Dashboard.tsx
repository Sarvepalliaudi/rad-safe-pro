
import React, { useEffect, useState } from 'react';
import { Section, UserProfile, UserRole } from '../types';
import { BookOpen, Calculator, ShieldAlert, BrainCircuit, HelpCircle, Download, Info, Move, Scan, Trophy, HeartHandshake, LogOut, Sparkles, Users } from 'lucide-react';
import { getUserProfile } from '../services/userService';
import { logoutUser } from '../services/authService';

interface DashboardProps {
  onNavigate: (view: string) => void;
  sections: Section[];
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, sections, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const role = profile?.role || 'student';
  const isPro = profile?.isPro || role === 'officer'; // Officers get demo access too

  const showPublicContent = role === 'patient' || role === 'public' || role === 'student';

  const studentItems = [
    { id: 'intro', label: 'Learning Hub', icon: <BookOpen size={24} />, color: 'bg-blue-100 text-blue-600', roles: ['student'] },
    { id: 'calculator', label: 'Calculators', icon: <Calculator size={24} />, color: 'bg-emerald-100 text-emerald-600', roles: ['student', 'officer'] },
    { id: 'safety', label: 'Safety Protocols', icon: <ShieldAlert size={24} />, color: 'bg-red-100 text-red-600', roles: ['student', 'officer'] },
    { id: 'positioning', label: 'Positioning', icon: <Move size={24} />, color: 'bg-orange-100 text-orange-600', roles: ['student'] },
    { id: 'modalities', label: 'CT / MRI / USG', icon: <Scan size={24} />, color: 'bg-indigo-100 text-indigo-600', roles: ['student', 'officer'] },
    { id: 'quiz', label: 'Quiz Zone', icon: <HelpCircle size={24} />, color: 'bg-yellow-100 text-yellow-600', roles: ['student'] },
    { id: 'ai-predict', label: 'AI Assistant', icon: <BrainCircuit size={24} />, color: 'bg-purple-100 text-purple-600', roles: ['student', 'patient', 'public'] },
    { id: 'image-gen', label: 'AI Image Lab', icon: <Sparkles size={24} />, color: 'bg-pink-100 text-pink-600', roles: ['student'] }, // Added Image Gen
  ];

  const filteredItems = studentItems.filter(item => item.roles.includes(role));

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
             {role === 'patient' ? 'Welcome, Patient' : 
              role === 'officer' ? 'Officer Dashboard' : 
              role === 'public' ? 'Public Portal' : 'Student Hub'}
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-slate-500 capitalize">{profile?.name || 'Guest'}</p>
            {isPro && <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded uppercase">PRO</span>}
          </div>
        </div>
        
        <div className="flex gap-2">
           {profile && role === 'student' && (
             <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
               <Trophy size={16} className="text-yellow-500" />
               <div className="text-right">
                 <p className="text-xs font-bold text-slate-800">LVL {profile.level}</p>
                 <p className="text-xs text-slate-400">{profile.totalXp} XP</p>
               </div>
             </div>
           )}
           <button onClick={handleLogout} className="bg-slate-100 p-2 rounded-xl text-slate-600 hover:bg-slate-200">
             <LogOut size={20} />
           </button>
        </div>
      </header>

      {/* Primary Role Content */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          {role === 'patient' || role === 'public' ? 'Recommended for You' : 'Quick Access'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95 text-center h-32 relative overflow-hidden group"
            >
              <div className={`p-3 rounded-xl mb-3 ${item.color} z-10 relative`}>
                {item.icon}
              </div>
              <span className="font-semibold text-slate-700 text-sm z-10 relative">{item.label}</span>
              {item.id === 'image-gen' && !isPro && (
                 <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="text-[10px] font-bold bg-gray-800 text-white px-2 py-1 rounded">PRO</span>
                 </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Public Division */}
      {(showPublicContent) && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {role === 'patient' ? 'Patient Safety' : 'Public Awareness'}
          </h3>
          <button
            onClick={() => onNavigate('awareness')}
            className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg shadow-teal-200 text-white hover:opacity-95 transition-opacity"
          >
            <div className="p-3 bg-white/20 rounded-full">
              <HeartHandshake size={28} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Safety Guide</h3>
              <p className="text-teal-100 text-sm">Understand radiation risks & myths</p>
            </div>
          </button>
        </div>
      )}

      {/* Info Zone */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">App Info</h3>
        <div className="grid grid-cols-2 gap-4">
           <button onClick={() => onNavigate('downloads')} className="p-4 bg-slate-50 rounded-xl border border-gray-200 hover:bg-white text-center">
               <Download size={24} className="mx-auto mb-2 text-slate-500" />
               <span className="font-medium text-slate-600 text-xs">Downloads</span>
            </button>
            <button onClick={() => onNavigate('guide')} className="p-4 bg-slate-50 rounded-xl border border-gray-200 hover:bg-white text-center">
               <Info size={24} className="mx-auto mb-2 text-slate-500" />
               <span className="font-medium text-slate-600 text-xs">User Manual</span>
            </button>
            <button onClick={() => onNavigate('about')} className="col-span-2 p-4 bg-slate-50 rounded-xl border border-gray-200 hover:bg-white text-center flex items-center justify-center gap-2">
               <Users size={20} className="text-slate-500" />
               <span className="font-medium text-slate-600 text-xs">About Team & Project</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
