import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, ChevronLeft, ShieldCheck, X, HeartHandshake, Bot, Send, User, 
  Sparkles, Info, ShieldAlert, BookOpen, Calculator, Scan, Smartphone, 
  HelpCircle, Radar, Award, Search, GraduationCap, MapPin, Users,
  Binary, Microscope, Heart, Cpu, Box, Star, Globe
} from 'lucide-react';
import { ViewState, Section, ChatMessage, UserRole, UserProfile } from './types';
import { CONTENT_SECTIONS, QUIZ_QUESTIONS } from './constants';
import { getCurrentSession, logoutUser } from './services/authService';
import { askTutor } from './services/geminiService';

// Component Imports
import StartScreen from './components/StartScreen';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import LearningContent from './components/LearningContent';
import DoseCalculator from './components/DoseCalculator';
import AIDosePredictor from './components/AIDosePredictor';
import Quiz from './components/Quiz';
import RadiationSensor from './components/RadiationSensor';
import LocationRadiationScanner from './components/LocationRadiationScanner';
import PatientPortal from './components/PatientPortal';
import AboutProject from './components/AboutProject';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('START');
  const [activeTab, setActiveTab] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  
  // Dr. Rad Universal Assistant State
  const [isRadOpen, setIsRadOpen] = useState(false);
  const [radChat, setRadChat] = useState<ChatMessage[]>([]);
  const [radInput, setRadInput] = useState('');
  const [radLoading, setRadLoading] = useState(false);
  const radChatEndRef = useRef<HTMLDivElement>(null);

  // Check Session on Mount
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setUser(session);
      setView('DASHBOARD');
    }
  }, []);

  // Scroll Rad Chat to Bottom
  useEffect(() => {
    radChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [radChat, isRadOpen]);

  const handleRadChat = async () => {
    if (!radInput.trim() || radLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: radInput, timestamp: Date.now() };
    setRadChat(prev => [...prev, userMsg]);
    setRadInput('');
    setRadLoading(true);

    try {
      const response = await askTutor(
        userMsg.text, 
        `Universal Assistant Mode. Current View: ${view}, Active Module: ${activeTab}. User Role: ${user?.role}.`, 
        radChat
      );
      setRadChat(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response, timestamp: Date.now() }]);
    } catch (e) {
      setRadChat(prev => [...prev, { id: 'err', role: 'model', text: "I'm having a connection glitch, but I'm still here to help!", timestamp: Date.now() }]);
    } finally {
      setRadLoading(false);
    }
  };

  const navigateTo = (destination: string) => {
    setActiveTab(destination);
    setView('SECTION');
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setView('START');
    setActiveTab('');
    setRadChat([]);
  };

  const handleAuthSuccess = () => {
    const session = getCurrentSession();
    setUser(session);
    setView('DASHBOARD');
  };

  const teamMembers = [
    { name: "Keerthivasan J", role: "Clinical Research Lead", dept: "AHS - Radiology", icon: <Microscope size={18} /> },
    { name: "Madhavan RD", role: "Safety Protocol Analyst", dept: "AHS - Radiology", icon: <ShieldAlert size={18} /> },
    { name: "Shalini M", role: "Clinical Content Specialist", dept: "AHS - Radiology", icon: <BookOpen size={18} /> },
    { name: "Navya K", role: "Radiographic Research", dept: "AHS - Radiology", icon: <Heart size={18} /> },
    { name: "Sarvepalli Audi Siva Bhanuvardhan", role: "Developer & AI Architect", dept: "SET - Cyber Security", icon: <Binary size={18} /> },
    { name: "Thilakesh TM", role: "Biomedical Systems Lead", dept: "SET - Biomedical", icon: <Cpu size={18} /> }
  ];

  // Render Logic
  const renderContent = () => {
    if (view === 'START') return <StartScreen onStart={(isPublic) => setView('AUTH')} />;
    if (view === 'AUTH') return <AuthScreen onAuthSuccess={handleAuthSuccess} onBack={() => setView('START')} />;
    
    if (view === 'DASHBOARD') return (
      <Dashboard 
        sections={CONTENT_SECTIONS} 
        onNavigate={navigateTo} 
        onLogout={handleLogout} 
      />
    );

    if (view === 'SECTION') {
      if (activeTab === 'calculator') return <DoseCalculator />;
      if (activeTab === 'ai-predictor') return <AIDosePredictor />;
      if (activeTab === 'quiz') return <Quiz allQuestions={QUIZ_QUESTIONS} onExit={() => setView('DASHBOARD')} />;
      if (activeTab === 'sensor-lab') return <RadiationSensor />;
      if (activeTab === 'geo-map') return <LocationRadiationScanner />;
      if (activeTab === 'patient-portal') return <PatientPortal />;
      if (activeTab === 'about') return <AboutProject />;

      const section = CONTENT_SECTIONS.find(s => s.id === activeTab);
      if (section) return <LearningContent section={section} />;
      
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 px-4 text-center">
          <Search size={64} className="opacity-20 mb-4" />
          <p className="font-black uppercase tracking-widest text-xs">Module not found</p>
          <button onClick={() => setView('DASHBOARD')} className="mt-6 text-rad-600 font-bold hover:underline">Return to Dashboard</button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      {/* GLOBAL NAVBAR */}
      {(view === 'DASHBOARD' || view === 'SECTION') && (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors md:hidden"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <div 
              onClick={() => setView('DASHBOARD')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="bg-rad-600 p-1 rounded-lg text-white group-hover:rotate-12 transition-transform shrink-0">
                <ShieldCheck size={18} />
              </div>
              <h1 className="text-sm font-black tracking-tighter uppercase text-slate-900 truncate">RAD SAFE PRO</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             <button 
               onClick={() => setIsTeamOpen(true)}
               className="p-2 bg-rad-600 text-white rounded-xl hover:bg-rad-700 transition-all shadow-lg flex items-center gap-2"
             >
               <Users size={18} />
               <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">Team</span>
             </button>
          </div>
        </header>
      )}

      {/* SIDEBAR NAVIGATION */}
      {(view === 'DASHBOARD' || view === 'SECTION') && (
        <Sidebar 
          sections={CONTENT_SECTIONS}
          activeSection={activeTab}
          onSelectSection={navigateTo}
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 ${(view === 'DASHBOARD' || view === 'SECTION') ? 'pt-20 md:pt-24 md:pl-64' : ''}`}>
        <div className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-24 md:pb-20">
          {renderContent()}
        </div>

        {/* PERSISTENT FOOTER - Optimized for Mobile */}
        {(view === 'DASHBOARD' || view === 'SECTION') && (
          <div className="fixed bottom-20 md:bottom-6 left-0 right-0 md:left-64 flex flex-col items-center pointer-events-none z-20 px-4">
             <button 
              onClick={() => setIsTeamOpen(true)}
              className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white px-5 py-2 rounded-full shadow-2xl flex items-center gap-2.5 border border-slate-700 hover:bg-slate-800 transition-all active:scale-95 group mb-2"
             >
                <div className="flex -space-x-1.5">
                   <div className="w-4 h-4 bg-rad-500 rounded-full border border-slate-900 flex items-center justify-center text-[7px] font-black">K</div>
                   <div className="w-4 h-4 bg-purple-500 rounded-full border border-slate-900 flex items-center justify-center text-[7px] font-black">M</div>
                   <div className="w-4 h-4 bg-indigo-500 rounded-full border border-slate-900 flex items-center justify-center text-[7px] font-black">S</div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">Team Details</span>
                <ChevronLeft size={12} className="rotate-90 text-rad-400" />
             </button>
             <p className="pointer-events-auto text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
               Powered by <span className="text-rad-600">Google Gemini</span>
             </p>
          </div>
        )}
      </main>

      {/* TEAM MODAL - Fully Mobile Responsive */}
      {isTeamOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
           <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up relative max-h-[90vh] flex flex-col">
              <button 
                onClick={() => setIsTeamOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="bg-slate-900 p-6 sm:p-8 text-white shrink-0">
                 <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rad-600 rounded-full text-[8px] font-black uppercase tracking-widest mb-3">
                       <Star size={10} fill="white" /> DSU HACKATHON 2025
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-tight mb-1">Dhanalakshmi Srinivasan University</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin size={10} className="text-rad-500" /> Samayapuram, Trichy
                    </p>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
                 {/* Faculty */}
                 <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                       <Box size={12} className="text-rad-600" /> Faculty Incharge
                    </h4>
                    <div className="bg-rad-50 p-4 rounded-2xl border border-rad-100 flex items-center gap-4">
                       <div className="w-10 h-10 bg-rad-600 text-white rounded-xl flex items-center justify-center font-black text-lg">N</div>
                       <div>
                          <p className="text-sm font-black text-slate-900 leading-none">Ms. R. Nivethitha</p>
                          <p className="text-[8px] font-black text-rad-600 uppercase mt-1 tracking-widest">Assistant Professor</p>
                       </div>
                    </div>
                 </div>

                 {/* Team List */}
                 <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                       <Users size={12} className="text-rad-600" /> Research & Development
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                       {teamMembers.map((member, i) => (
                         <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-3.5">
                            <div className="p-2 bg-white rounded-lg text-rad-600 shadow-sm">{member.icon}</div>
                            <div className="overflow-hidden">
                               <p className="font-black text-slate-800 text-xs tracking-tight leading-none mb-1">{member.name}</p>
                               <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-black text-rad-600 uppercase tracking-widest">{member.role}</span>
                                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase">{member.dept}</span>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-2 shrink-0">
                 <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                   <Bot size={10} className="text-rad-400" />
                   <span className="text-[9px] font-black text-white uppercase tracking-tighter">Credits to Google Gemini</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* DR. RAD UNIVERSAL CHAT BOT - Scaled for Mobile */}
      {(view === 'DASHBOARD' || view === 'SECTION') && (
        <>
          <button 
            onClick={() => setIsRadOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 p-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl z-40 group border-2 border-white active:scale-90 transition-all"
          >
            <Bot size={20} />
          </button>

          {isRadOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-0 animate-fade-in">
              <div className="bg-white w-full max-w-md h-[85vh] rounded-t-[2rem] shadow-2xl flex flex-col overflow-hidden">
                <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-rad-500/20 rounded-lg flex items-center justify-center">
                      <Bot size={18} className="text-rad-400" />
                    </div>
                    <h4 className="font-black text-xs uppercase tracking-tighter">Dr. Rad AI</h4>
                  </div>
                  <button onClick={() => setIsRadOpen(false)} className="p-2"><X size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {radChat.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`p-3 rounded-xl text-[10px] font-bold shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={radChatEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={radInput}
                      onChange={e => setRadInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRadChat()}
                      placeholder="Ask Dr. Rad..." 
                      className="w-full p-3 pr-10 bg-slate-100 rounded-xl text-[10px] font-bold outline-none" 
                    />
                    <button onClick={handleRadChat} className="absolute right-1.5 top-1.5 p-1.5 bg-rad-600 text-white rounded-lg"><Send size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* MOBILE TAB BAR */}
      {(view === 'DASHBOARD' || view === 'SECTION') && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 h-16 md:hidden z-30 flex items-center justify-around px-2 shadow-lg">
           <button onClick={() => setView('DASHBOARD')} className={`flex flex-col items-center gap-0.5 p-2 ${view === 'DASHBOARD' ? 'text-rad-600' : 'text-slate-400'}`}>
              <ShieldCheck size={18} />
              <span className="text-[7px] font-black uppercase">Home</span>
           </button>
           <button onClick={() => navigateTo('quiz')} className={`flex flex-col items-center gap-0.5 p-2 ${activeTab === 'quiz' ? 'text-orange-600' : 'text-slate-400'}`}>
              <HelpCircle size={18} />
              <span className="text-[7px] font-black uppercase">Quiz</span>
           </button>
           <button onClick={() => navigateTo('calculator')} className={`flex flex-col items-center gap-0.5 p-2 ${activeTab === 'calculator' ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Calculator size={18} />
              <span className="text-[7px] font-black uppercase">Dose</span>
           </button>
           <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-0.5 p-2 text-slate-400">
              <Menu size={18} />
              <span className="text-[7px] font-black uppercase">Menu</span>
           </button>
        </nav>
      )}
    </div>
  );
};

export default App;