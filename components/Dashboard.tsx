
import React, { useEffect, useState } from 'react';
import { Section, UserProfile, ActivityLog } from '../types';
import { BookOpen, Calculator, ShieldAlert, BrainCircuit, HelpCircle, Download, Info, Move, Scan, Trophy, HeartHandshake, LogOut, Users, Activity, Smartphone, Monitor, Building2, IdCard } from 'lucide-react';
import { getUserProfile, getActivityLogs } from '../services/userService';
import { logoutUser } from '../services/authService';

interface DashboardProps {
  onNavigate: (view: string) => void;
  sections: Section[];
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, sections, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const p = getUserProfile();
    
    if (!p.id) {
      onLogout();
      return;
    }

    setProfile(p);
    
    // Load sensitive logs only if role is ADMIN
    if (p.role === 'admin') {
      setLogs(getActivityLogs());
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  if (!profile) return null;

  const role = profile.role;
  const isPro = profile.isPro || role === 'radiology_officer' || role === 'admin'; 
  const showPublicContent = role !== 'admin'; // Everyone but Admin usually navigates content, though Admin can too

  // Define which roles can access which quick-link cards
  // Note: 'radiology_officer' acts like a Pro Student/Teacher
  const studentItems = [
    { id: 'intro', label: 'Physics Hub', icon: <BookOpen size={24} />, color: 'bg-blue-100 text-blue-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'calculator', label: 'Calculators', icon: <Calculator size={24} />, color: 'bg-emerald-100 text-emerald-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'safety', label: 'Safety Protocols', icon: <ShieldAlert size={24} />, color: 'bg-red-100 text-red-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'positioning', label: 'Positioning', icon: <Move size={24} />, color: 'bg-orange-100 text-orange-600', roles: ['student'] },
    { id: 'modalities', label: 'CT / MRI / USG', icon: <Scan size={24} />, color: 'bg-indigo-100 text-indigo-600', roles: ['student', 'radiology_officer', 'admin'] },
    { id: 'quiz', label: 'Quiz Zone', icon: <HelpCircle size={24} />, color: 'bg-yellow-100 text-yellow-600', roles: ['student'] },
    { id: 'ai-predict', label: 'AI Assistant', icon: <BrainCircuit size={24} />, color: 'bg-purple-100 text-purple-600', roles: ['student', 'patient', 'public', 'radiology_officer', 'admin'] },
  ];

  const filteredItems = studentItems.filter(item => item.roles.includes(role));

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
             {role === 'patient' ? 'Welcome, Patient' : 
              role === 'radiology_officer' ? 'Officer Dashboard' : 
              role === 'admin' ? 'Admin Control Panel' : 
              role === 'public' ? 'Public Portal' : 'Student Hub'}
          </h2>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-2">
              <p className="text-slate-500 font-medium capitalize">{profile.name}</p>
              {isPro && <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded uppercase">PRO</span>}
            </div>
            
            {/* Student Details Display */}
            {role === 'student' && profile.collegeName && (
              <div className="text-[10px] text-slate-400 flex flex-col">
                <span className="flex items-center gap-1"><Building2 size={10}/> {profile.collegeName}</span>
                <span className="flex items-center gap-1"><IdCard size={10}/> Roll: {profile.studentId}</span>
              </div>
            )}
            
            {/* Officer Details Display */}
            {role === 'radiology_officer' && profile.licenseId && (
               <span className="text-[10px] text-blue-500 flex items-center gap-1 font-mono">
                 <IdCard size={10}/> LIC: {profile.licenseId}
               </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
           {role === 'student' && (
             <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
               <Trophy size={16} className="text-yellow-500" />
               <div className="text-right">
                 <p className="text-xs font-bold text-slate-800">LVL {profile.level}</p>
                 <p className="text-xs text-slate-400">{profile.totalXp} XP</p>
               </div>
             </div>
           )}
           <button onClick={handleLogout} className="bg-slate-100 p-2 rounded-xl text-slate-600 hover:bg-slate-200" title="Logout">
             <LogOut size={20} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Main Nav */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Primary Role Content */}
          <div>
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
                </button>
              ))}
            </div>
          </div>

          {/* Public Division - ENHANCED FOR PATIENTS */}
          {(showPublicContent) && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {role === 'patient' ? 'Your Visit' : 'Public Awareness'}
              </h3>
              
              {role === 'patient' ? (
                <button
                  onClick={() => onNavigate('patient-portal')}
                  className="w-full flex items-center gap-4 p-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg shadow-teal-200 text-white hover:scale-[1.02] transition-transform"
                >
                  <div className="p-4 bg-white/20 rounded-full animate-pulse">
                    <HeartHandshake size={32} />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-xl">Go to Patient Portal</h3>
                    <p className="text-teal-100 text-sm mt-1">Prepare checklist, Wait times, Results & Relaxing sounds.</p>
                  </div>
                  <Move size={20} className="text-teal-200" />
                </button>
              ) : (
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
              )}
            </div>
          )}

          {/* Info Zone */}
          <div>
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

        {/* RIGHT COLUMN: Admin Monitor OR AI Promo */}
        <div className="md:col-span-1">
          {role === 'admin' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-4 h-full">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <Activity className="text-red-600" />
                <h3 className="font-bold text-slate-800">System Logs</h3>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {logs.length === 0 && <p className="text-sm text-slate-400 text-center mt-10">No activity recorded yet.</p>}
                {logs.map(log => (
                   <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-gray-100 text-xs">
                     <div className="flex justify-between items-start mb-1">
                       <span className={`font-bold ${log.action === 'LOGIN' ? 'text-green-600' : log.action === 'LOGOUT' ? 'text-orange-500' : 'text-blue-600'}`}>
                         {log.action}
                       </span>
                       <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                     </div>
                     <p className="font-medium text-slate-700">{log.userName}</p>
                     <p className="text-slate-400 truncate">{log.email}</p>
                     <div className="mt-2 pt-2 border-t border-gray-200 flex gap-2 text-[10px] text-slate-400">
                       {log.device?.includes('Mobile') ? <Smartphone size={10}/> : <Monitor size={10}/>}
                       <span className="truncate max-w-[150px]">{log.device}</span>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="bg-gradient-to-b from-rad-500 to-purple-600 rounded-2xl p-6 text-white h-full flex flex-col items-center justify-center text-center">
                <BrainCircuit size={64} className="mb-4 text-white/80" />
                <h3 className="font-bold text-xl mb-2">AI Assistant Active</h3>
                <p className="text-sm text-rad-100 mb-6">Your Google Account enables advanced AI features.</p>
                <div className="bg-white/10 rounded-xl p-4 w-full text-left space-y-2">
                   <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Database Connected
                   </div>
                   <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Gemini AI Ready
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
