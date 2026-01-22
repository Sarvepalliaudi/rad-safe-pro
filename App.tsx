import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, ChevronLeft, ShieldCheck, X, HeartHandshake, Bot, Send, User, 
  Sparkles, Info, ShieldAlert, BookOpen, Calculator, Scan, Smartphone, 
  HelpCircle, Radar, Award, Search
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
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
          <Search size={64} className="opacity-20 mb-4" />
          <p className="font-black uppercase tracking-widest text-xs">Module not found or under development</p>
          <button onClick={() => setView('DASHBOARD')} className="mt-6 text-rad-600 font-bold hover:underline">Return to Dashboard</button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* GLOBAL NAVBAR (Visible after Auth) */}
      {(view === 'DASHBOARD' || view === 'SECTION') && (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors md:hidden"
            >
              <Menu size={24} className="text-slate-600" />
            </button>
            <div 
              onClick={() => setView('DASHBOARD')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="bg-rad-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <h1 className="text-lg font-black tracking-tighter uppercase text-slate-900">RAD SAFE PRO</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Member</p>
                <p className="text-xs font-bold text-slate-700">{user?.name || 'Guest'}</p>
             </div>
             <button 
               onClick={() => navigateTo('about')}
               className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-rad-50 hover:text-rad-600 transition-all"
               title="About Project"
             >
               <Award size={20} />
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
      <main className={`flex-1 transition-all duration-300 ${(view === 'DASHBOARD' || view === 'SECTION') ? 'pt-24 md:pl-64' : ''}`}>
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* DR. RAD UNIVERSAL CHAT BOT */}
      {(view === 'DASHBOARD' || view === 'SECTION') && (
        <>
          <button 
            onClick={() => setIsRadOpen(true)}
            className="fixed bottom-6 right-6 p-5 bg-slate-900 text-white rounded-[2rem] shadow-2xl hover:scale-110 active:scale-90 transition-all z-40 group border-4 border-white"
          >
            <div className="relative">
              <Bot size={28} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-rad-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              Dr. Rad AI
            </span>
          </button>

          {isRadOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-end p-4 animate-fade-in">
              <div className="bg-white w-full max-w-md h-[80vh] md:h-[600px] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rad-500/20 rounded-xl flex items-center justify-center border border-rad-500/30">
                      <Bot size={22} className="text-rad-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tighter">Dr. Rad AI Assistant</h4>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Neural Engine Active</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsRadOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                  {radChat.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-30">
                       <Sparkles size={48} className="mb-4 text-slate-400" />
                       <h5 className="font-black uppercase tracking-widest text-xs mb-2">Diagnostic Consultation</h5>
                       <p className="text-[10px] font-bold">I can assist with Physics, ALARA safety, or even mapping coordinates. How can I help today?</p>
                    </div>
                  )}
                  {radChat.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-200' : 'bg-white border border-slate-100 text-rad-600'}`}>
                        {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                      </div>
                      <div className={`p-4 rounded-[1.5rem] text-xs font-bold leading-relaxed shadow-sm max-w-[80%] ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                        <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                      </div>
                    </div>
                  ))}
                  {radLoading && (
                    <div className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-rad-400">
                         <Bot size={14} />
                       </div>
                       <div className="flex gap-1 py-4">
                         <div className="w-1.5 h-1.5 bg-rad-400 rounded-full animate-bounce"></div>
                         <div className="w-1.5 h-1.5 bg-rad-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                         <div className="w-1.5 h-1.5 bg-rad-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                       </div>
                    </div>
                  )}
                  <div ref={radChatEndRef} />
                </div>

                <div className="p-6 bg-white border-t border-slate-100">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={radInput}
                      onChange={e => setRadInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRadChat()}
                      placeholder="Ask Dr. Rad anything..." 
                      className="w-full p-4 pr-14 bg-slate-100 border-none rounded-2xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-rad-500 outline-none transition-all" 
                    />
                    <button 
                      onClick={handleRadChat}
                      disabled={!radInput.trim() || radLoading}
                      className="absolute right-2 top-2 p-2.5 bg-rad-600 text-white rounded-xl shadow-lg hover:bg-rad-700 disabled:opacity-50 transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* MOBILE TAB BAR (Only on mobile for quick access) */}
      {(view === 'DASHBOARD' || view === 'SECTION') && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 h-16 md:hidden z-30 flex items-center justify-around px-2">
           <button onClick={() => setView('DASHBOARD')} className={`flex flex-col items-center gap-1 p-2 ${view === 'DASHBOARD' ? 'text-rad-600' : 'text-slate-400'}`}>
              <ShieldCheck size={20} />
              <span className="text-[9px] font-black uppercase">Home</span>
           </button>
           <button onClick={() => navigateTo('quiz')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'quiz' ? 'text-orange-600' : 'text-slate-400'}`}>
              <HelpCircle size={20} />
              <span className="text-[9px] font-black uppercase">Quiz</span>
           </button>
           <button onClick={() => navigateTo('calculator')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'calculator' ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Calculator size={20} />
              <span className="text-[9px] font-black uppercase">Dose</span>
           </button>
           <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-1 p-2 text-slate-400">
              <Menu size={20} />
              <span className="text-[9px] font-black uppercase">Menu</span>
           </button>
        </nav>
      )}
    </div>
  );
};

export default App;