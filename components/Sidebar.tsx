import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Atom, Ruler, ShieldAlert, Scan, FlaskConical, Move, BrainCircuit, Calculator, HelpCircle, X, Eye, HeartHandshake, LogOut, Smartphone, Globe, Info, Award
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
  HeartHandshake: <HeartHandshake size={18} />,
};

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, onSelectSection, isOpen, toggleSidebar, onLogout }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const p = getUserProfile();
    setRole(p.role);
    setIsPro(!!p.isPro);
  }, [isOpen]);

  const handleLogout = () => {
    logoutUser();
    onLogout();
    toggleSidebar();
  };

  const filteredSections = sections.filter(s => {
    if (role === 'admin') return true;
    if (role === 'patient' || role === 'public') return s.category === 'public';
    return true;
  });

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}
      />

      <div className={`fixed top-0 left-0 h-full bg-slate-850 text-white w-64 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rad-400 to-rad-200 bg-clip-text text-transparent uppercase tracking-tighter">RAD SAFE PRO</h1>
            <div className="flex items-center gap-1 mt-1">
              <span className={`w-2 h-2 rounded-full bg-green-400`}></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role.replace('_', ' ')} Mode</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)] flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Academic Curriculum</p>
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

            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Tools & Lab</p>
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
          </div>

          <div className="pt-4 border-t border-slate-700 mt-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;