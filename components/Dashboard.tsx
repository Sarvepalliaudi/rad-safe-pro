
import React, { useEffect, useState } from 'react';
import { Section, UserProfile } from '../types';
import { BookOpen, Calculator, ShieldAlert, BrainCircuit, HelpCircle, Download, Info, Move, Scan, Trophy, HeartHandshake } from 'lucide-react';
import { getUserProfile } from '../services/userService';

interface DashboardProps {
  onNavigate: (view: string) => void;
  sections: Section[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, sections }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const studentItems = [
    { id: 'intro', label: 'Learning Hub', icon: <BookOpen size={24} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'calculator', label: 'Calculators', icon: <Calculator size={24} />, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'safety', label: 'Safety Protocols', icon: <ShieldAlert size={24} />, color: 'bg-red-100 text-red-600' },
    { id: 'positioning', label: 'Positioning', icon: <Move size={24} />, color: 'bg-orange-100 text-orange-600' },
    { id: 'modalities', label: 'CT / MRI / USG', icon: <Scan size={24} />, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'quiz', label: 'Quiz Zone', icon: <HelpCircle size={24} />, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'ai-predict', label: 'AI Assistant', icon: <BrainCircuit size={24} />, color: 'bg-purple-100 text-purple-600' },
  ];

  const infoItems = [
     { id: 'downloads', label: 'Downloads', icon: <Download size={24} />, color: 'bg-slate-200 text-slate-700' },
     { id: 'guide', label: 'User Guide', icon: <Info size={24} />, color: 'bg-slate-200 text-slate-700' },
  ];

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome, Student</h2>
          <p className="text-slate-500">What would you like to study today?</p>
        </div>
        
        {profile && (
          <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <Trophy size={16} className="text-yellow-500" />
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">LVL {profile.level}</p>
              <p className="text-[10px] text-slate-400">{profile.totalXp} XP</p>
            </div>
          </div>
        )}
      </header>

      {/* Student Zone */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Student Zone</h3>
        <div className="grid grid-cols-2 gap-4">
          {studentItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95 text-center h-32"
            >
              <div className={`p-3 rounded-xl mb-3 ${item.color}`}>
                {item.icon}
              </div>
              <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Public Division */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Public Division</h3>
        <button
          onClick={() => onNavigate('awareness')}
          className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg shadow-teal-200 text-white hover:opacity-95 transition-opacity"
        >
          <div className="p-3 bg-white/20 rounded-full">
            <HeartHandshake size={28} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">Public Awareness</h3>
            <p className="text-teal-100 text-sm">Radiation safety for patients & families</p>
          </div>
        </button>
      </div>

      {/* Info Zone */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">App Info</h3>
        <div className="grid grid-cols-2 gap-4">
           {infoItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm transition-all"
            >
               <div className="text-slate-500 mb-2">{item.icon}</div>
               <span className="font-medium text-slate-600 text-xs">{item.label}</span>
            </button>
           ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;