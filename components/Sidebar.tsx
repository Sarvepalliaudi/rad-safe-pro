
import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Atom, Ruler, ShieldAlert, Scan, FlaskConical, Move, BrainCircuit, Calculator, HelpCircle, X, Eye, HeartHandshake, LogOut
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
  BookOpen: <BookOpen size={18} />,
  Atom: <Atom size={18} />,
  Ruler: <Ruler size={18} />,
  ShieldAlert: <ShieldAlert size={18} />,
  Scan: <Scan size={18} />,
  FlaskConical: <FlaskConical size={18} />,
  Move: <Move size={18} />,
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
    // Admin sees everything
    if (role === 'admin') return true;

    // Public/Patients only see Public Awareness
    if (role === 'patient' || role === 'public') return s.category === 'public';
    
    // Radiology Officers see everything except maybe basic positioning (tech work), similar to previous Officer role
    // But they might want reference, so we'll keep it open or restricted based on preference. 
    // Previous logic: hidden 'positioning' for officers.
    if (role === 'radiology_officer') {
       return s.id !== 'positioning'; 
    }
    
    // Students see everything
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
            <h1 className="text-xl font-bold bg-gradient-to-r from-rad-400 to-rad-200 bg-clip-text text-transparent">RAD SAFE PRO</h1>
            <div className="flex items-center gap-1 mt-1">
              <span className={`w-2 h-2 rounded-full ${role === 'student' ? 'bg-green-400' : role === 'admin' ? 'bg-red-500' : role === 'radiology_officer' ? 'bg-blue-400' : 'bg-orange-400'}`}></span>
              <p className="text-xs text-slate-400 capitalize">{role.replace('_', ' ')} Mode</p>
              {isPro && <span className="ml-1 px-1 bg-yellow-500 text-black text-[9px] font-bold rounded">PRO</span>}
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)] flex flex-col justify-between">
          <div className="space-y-6">
            {filteredSections.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Learning Modules</p>
                <ul className="space-y-1">
                  {filteredSections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => {
                          onSelectSection(section.id);
                          if (window.innerWidth < 768) toggleSidebar();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === section.id 
                            ? section.category === 'public' ? 'bg-teal-600 text-white' : 'bg-rad-600 text-white' 
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
            )}

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Tools</p>
              <ul className="space-y-1">
                 {/* Calculator: Students, Officers, Admins */}
                 {(role === 'student' || role === 'radiology_officer' || role === 'admin') && (
                   <li>
                      <button onClick={() => onSelectSection('calculator')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700">
                        <Calculator size={18} className="text-emerald-400" /> Dose Calculator
                      </button>
                   </li>
                 )}
                 
                 {/* AI Assistant: Available to everyone */}
                 <li>
                    <button onClick={() => onSelectSection('ai-predict')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700">
                      <BrainCircuit size={18} className="text-purple-400" /> AI Assistant
                    </button>
                 </li>

                 {/* Learning Tools: Students Only */}
                 {(role === 'student') && (
                   <>
                    <li>
                        <button onClick={() => onSelectSection('spotters')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700">
                          <Eye size={18} className="text-yellow-400" /> Anatomy Spotters
                        </button>
                    </li>
                    <li>
                        <button onClick={() => onSelectSection('quiz')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700">
                          <HelpCircle size={18} className="text-orange-400" /> Quiz Bank
                        </button>
                    </li>
                   </>
                 )}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 mt-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
