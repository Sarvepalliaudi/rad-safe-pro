import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Atom, ShieldAlert, Scan, Move, Calculator, HelpCircle, X, Eye, LogOut, Smartphone, Heart, Languages, Radar
} from 'lucide-react';
import { Section, UserRole } from '../types';
import { getUserProfile } from '../services/userService';
import { logoutUser } from '../services/authService';

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Atom: <Atom size={18} />,
  ShieldAlert: <ShieldAlert size={18} />,
  Scan: <Scan size={18} />,
  Move: <Move size={18} />,
  Eye: <Eye size={18} />,
};

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, onSelectSection, isOpen, toggleSidebar, onLogout }) => {
  const [role, setRole] = useState<UserRole>('student');

  useEffect(() => {
    const p = getUserProfile();
    setRole(p.role);
  }, [isOpen]);

  const handleLogout = () => {
    logoutUser();
    onLogout();
    toggleSidebar();
  };

  const isPatient = role === 'patient';
  const isPublic = role === 'public';
  const isStudentOrPro = role === 'student' || role === 'radiology_officer' || role === 'admin';

  const filteredSections = sections.filter(s => {
    if (role === 'admin') return true;
    if (isPatient || isPublic) return s.category === 'public';
    return true;
  });

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}
      />

      <div className={`fixed top-0 left-0 h-full bg-slate-850 text-white w-64 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center h-16 shrink-0">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rad-400 to-rad-200 bg-clip-text text-transparent uppercase tracking-tighter">RAD SAFE PRO</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{role.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-64px)] custom-scrollbar">
          <div className="space-y-6 pb-96"> 
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Knowledge Base</p>
              <ul className="space-y-1">
                {filteredSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        onSelectSection(section.id);
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeSection === section.id 
                          ? 'bg-rad-600 text-white shadow-lg' 
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className={activeSection === section.id ? 'text-white' : 'text-rad-400'}>
                        {iconMap[section.icon] || <BookOpen size={18} />}
                      </span>
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Role-Specific Special Sections */}
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Quick Access</p>
               <ul className="space-y-1">
                  {isPatient && (
                    <li>
                      <button onClick={() => onSelectSection('patient-portal')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'patient-portal' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'}`}>
                        <Heart size={18} className={activeSection === 'patient-portal' ? 'text-white' : 'text-rose-400'} /> Patient Companion
                      </button>
                    </li>
                  )}
                  {isPublic && (
                    <li>
                      <button onClick={() => onSelectSection('awareness')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'awareness' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'}`}>
                        <Languages size={18} className={activeSection === 'awareness' ? 'text-white' : 'text-teal-400'} /> Awareness Hub
                      </button>
                    </li>
                  )}
                  <li>
                    <button onClick={() => onSelectSection('geo-map')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'geo-map' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'}`}>
                      <Radar size={18} className={activeSection === 'geo-map' ? 'text-white' : 'text-indigo-400'} /> Mapping Hub
                    </button>
                  </li>
               </ul>
            </div>

            {isStudentOrPro && (
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Clinical Tools</p>
                <ul className="space-y-1">
                   <li>
                      <button onClick={() => onSelectSection('calculator')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'calculator' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'}`}>
                        <Calculator size={18} className={activeSection === 'calculator' ? 'text-white' : 'text-emerald-400'} /> Dose Calculator
                      </button>
                   </li>
                   <li>
                      <button onClick={() => onSelectSection('sensor-lab')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'sensor-lab' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'}`}>
                        <Smartphone size={18} className={activeSection === 'sensor-lab' ? 'text-white' : 'text-red-400'} /> Sensor Lab
                      </button>
                   </li>
                   <li>
                      <button onClick={() => onSelectSection('quiz')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'quiz' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'}`}>
                        <HelpCircle size={18} className={activeSection === 'quiz' ? 'text-white' : 'text-orange-400'} /> Quiz Bank
                      </button>
                   </li>
                </ul>
              </div>
            )}

            <div className="pt-8 border-t border-slate-700 mb-24">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 transition-all shadow-2xl active:scale-95 border-2 border-red-500"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;