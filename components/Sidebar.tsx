
import React from 'react';
import { 
  BookOpen, 
  Atom, 
  Ruler, 
  ShieldAlert, 
  Scan, 
  FlaskConical, 
  Move,
  BrainCircuit,
  Calculator,
  HelpCircle,
  Menu,
  X,
  Eye,
  HeartHandshake
} from 'lucide-react';
import { Section } from '../types';

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
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

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, onSelectSection, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <div className={`fixed top-0 left-0 h-full bg-slate-850 text-white w-64 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rad-400 to-rad-200 bg-clip-text text-transparent">RAD SAFE PRO</h1>
            <p className="text-xs text-slate-400">AHS Radiology Learning</p>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Learning Modules</p>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        onSelectSection(section.id);
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id 
                          ? section.category === 'public' ? 'bg-teal-600 text-white font-medium' : 'bg-rad-600 text-white font-medium shadow-md shadow-rad-900/20' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Interactive Tools</p>
              <ul className="space-y-1">
                 <li>
                    <button
                      onClick={() => {
                        onSelectSection('calculator');
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === 'calculator' 
                          ? 'bg-rad-600 text-white font-medium' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Calculator size={18} className="text-emerald-400" />
                      Dose Calculator
                    </button>
                 </li>
                 <li>
                    <button
                      onClick={() => {
                        onSelectSection('ai-predict');
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === 'ai-predict' 
                          ? 'bg-rad-600 text-white font-medium' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <BrainCircuit size={18} className="text-purple-400" />
                      AI Dose Predictor
                    </button>
                 </li>
                  <li>
                    <button
                      onClick={() => {
                        onSelectSection('spotters');
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === 'spotters' 
                          ? 'bg-rad-600 text-white font-medium' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Eye size={18} className="text-yellow-400" />
                      Anatomy Spotters
                    </button>
                 </li>
                 <li>
                    <button
                      onClick={() => {
                        onSelectSection('quiz');
                        if (window.innerWidth < 768) toggleSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === 'quiz' 
                          ? 'bg-rad-600 text-white font-medium' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <HelpCircle size={18} className="text-orange-400" />
                      Quiz Bank
                    </button>
                 </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;