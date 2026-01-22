
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckSquare, Square, Video, Music, 
  AlertCircle, Smile, Youtube, Play, Pause, RotateCcw, Phone, Send, 
  Bot, Wind, CloudRain, ChevronRight, Trees,
  ClipboardList, HelpCircle, Info, Sparkles, Heart
} from 'lucide-react';
import { askTutor } from '../services/geminiService';
import { ChatMessage } from '../types';

const PatientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PREPARE' | 'COMFORT' | 'RESULTS'>('PREPARE');
  
  // Preparation Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Photo ID & Referral", checked: false },
    { id: 2, text: "Remove jewelry & metal", checked: false },
    { id: 3, text: "Loose clothing", checked: false },
    { id: 4, text: "Fasting (if required)", checked: false },
    { id: 5, text: "Pregnancy info", checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // --- BREATHING GUIDE LOGIC ---
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Rest');
  const [breathScale, setBreathScale] = useState(1);
  const [breathDuration, setBreathDuration] = useState(1000);
  const [breathTimer, setBreathTimer] = useState(60);
  
  useEffect(() => {
    let mainTimer: any;
    let cycleTimeout: any;

    if (isBreathingActive && breathTimer > 0) {
      mainTimer = setInterval(() => {
        setBreathTimer(t => (t > 0 ? t - 1 : 0));
      }, 1000);

      const runCycle = () => {
        setBreathState('Inhale');
        setBreathScale(1.4);
        setBreathDuration(4000);
        
        cycleTimeout = setTimeout(() => {
          setBreathState('Hold');
          setBreathScale(1.4);
          setBreathDuration(2000);
          
          cycleTimeout = setTimeout(() => {
            setBreathState('Exhale');
            setBreathScale(0.85);
            setBreathDuration(4000);
            
            cycleTimeout = setTimeout(() => {
              setBreathState('Rest');
              setBreathScale(1);
              setBreathDuration(2000);
              
              cycleTimeout = setTimeout(runCycle, 2000);
            }, 4000);
          }, 2000);
        }, 4000);
      };

      runCycle();
    } else {
      setBreathScale(1);
      setBreathState('Rest');
      if (breathTimer <= 0) setIsBreathingActive(false);
    }

    return () => {
      clearInterval(mainTimer);
      clearTimeout(cycleTimeout);
    };
  }, [isBreathingActive, breathTimer === 0]);

  // --- AUDIO ENGINE ---
  const [activeAudioId, setActiveAudioId] = useState<'ocean' | 'rain' | 'forest' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioObj = useRef<HTMLAudioElement | null>(null);
  const playPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.5;
    audio.crossOrigin = "anonymous";
    audioObj.current = audio;

    return () => {
      if (audioObj.current) {
        audioObj.current.pause();
        audioObj.current.src = "";
      }
    };
  }, []);

  const toggleSound = async (type: 'ocean' | 'rain' | 'forest') => {
    if (!audioObj.current || isLoading) return;

    if (activeAudioId === type) {
      if (isPlaying) {
        audioObj.current.pause();
        setIsPlaying(false);
      } else {
        try {
          playPromise.current = audioObj.current.play();
          await playPromise.current;
          setIsPlaying(true);
        } catch (e) { console.error(e); }
      }
      return;
    }

    setIsLoading(true);
    setIsPlaying(false);
    setActiveAudioId(type);
    audioObj.current.pause();

    const audioPaths = {
      ocean: "/music/ocean.mp3",
      rain: "/music/rain.mp3",
      forest: "/music/forest.mp3"
    };

    const fallbacks = {
      ocean: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      rain: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      forest: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    };

    const executePlay = async (url: string) => {
      if (!audioObj.current) return false;
      try {
        audioObj.current.src = url;
        audioObj.current.load();
        await new Promise((resolve, reject) => {
          const t = setTimeout(() => reject(new Error("Timeout")), 10000);
          audioObj.current?.addEventListener('canplay', () => { clearTimeout(t); resolve(true); }, { once: true });
          audioObj.current?.addEventListener('error', () => { clearTimeout(t); reject(); }, { once: true });
        });
        playPromise.current = audioObj.current.play();
        await playPromise.current;
        setIsPlaying(true);
        return true;
      } catch (err) { return false; }
    };

    if (!await executePlay(audioPaths[type])) {
      await executePlay(fallbacks[type]);
    }
    setIsLoading(false);
  };

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await askTutor(userMsg.text, "Patient nurse assistant.", chatHistory);
      setChatHistory(prev => [...prev, { id: (Date.now()+1).toString(), role: 'model', text: response, timestamp: Date.now() }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { id: 'err', role: 'model', text: "Ask a staff member for assistance.", timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in font-sans px-2 pb-24">
      <header className="bg-rose-600 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 text-white shadow-2xl mb-10 md:mb-14 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">Companion Portal</h1>
          <p className="text-rose-100 text-[10px] md:text-sm font-bold uppercase tracking-widest opacity-80">Empowering your scan journey</p>
          
          <div className="flex bg-rose-900/20 p-2 rounded-[1.5rem] md:rounded-[2.5rem] mt-10 backdrop-blur-md border border-white/10">
            {['PREPARE', 'COMFORT', 'RESULTS'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 md:py-6 rounded-[1rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-rose-700 shadow-xl' : 'text-white/70 hover:text-white'}`}
              >
                {tab === 'PREPARE' ? 'Step 1' : tab === 'COMFORT' ? 'Step 2' : 'Step 3'}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Heart size={240} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          {activeTab === 'PREPARE' && (
            <div className="space-y-6 md:space-y-10 animate-slide-up">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shadow-sm"><ClipboardList size={22} /></div>
                  Pre-Scan Protocol
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {checklist.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`text-left p-6 rounded-2xl border-2 flex items-center gap-5 transition-all ${
                        item.checked ? 'bg-green-50 border-green-200 text-green-700 opacity-60' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'
                      }`}
                    >
                      {item.checked ? <CheckSquare size={24} /> : <Square size={24} className="opacity-20" />}
                      <span className="font-black text-xs md:text-sm uppercase tracking-wide">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-sm"><Video size={22} /></div>
                  Experience Previews
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="https://www.youtube.com/results?search_query=mri+scan+patient+experience" target="_blank" className="p-8 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all group flex flex-col items-center text-center">
                    <Youtube className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={40} />
                    <p className="font-black text-slate-800 text-xs uppercase tracking-widest">MRI Simulation</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">What to expect inside</p>
                  </a>
                  <a href="https://www.youtube.com/results?search_query=ct+scan+patient+guide" target="_blank" className="p-8 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all group flex flex-col items-center text-center">
                    <Youtube className="text-red-600 mb-4 group-hover:scale-110 transition-transform" size={40} />
                    <p className="font-black text-slate-800 text-xs uppercase tracking-widest">CT Scan Guide</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Step-by-step walkthrough</p>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COMFORT' && (
            <div className="space-y-6 md:space-y-10 animate-slide-up">
              <div className="bg-white p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-2xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                 <div className="absolute top-8 right-10 bg-slate-900 px-5 py-2 rounded-full text-[11px] font-black text-white uppercase tracking-widest shadow-xl">
                   Session Time {Math.floor(breathTimer / 60)}:{(breathTimer % 60).toString().padStart(2, '0')}
                 </div>
                 
                 <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-4">
                   <Wind className="text-blue-500" size={32}/> Guided Breath Control
                 </h3>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-16">Stable breathing improves image clarity significantly</p>
                 
                 <div className="relative mb-20 flex items-center justify-center">
                    {isBreathingActive && (
                      <div className="absolute w-48 h-48 bg-blue-500/10 rounded-full animate-ping"></div>
                    )}
                    
                    <div 
                      className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-[12px] flex items-center justify-center shadow-2xl transition-all ${
                        breathState === 'Inhale' ? 'bg-blue-600 border-blue-100 shadow-blue-300' : 
                        breathState === 'Exhale' ? 'bg-indigo-600 border-indigo-200 shadow-indigo-300' :
                        breathState === 'Hold' ? 'bg-teal-500 border-teal-100 shadow-teal-200' : 'bg-slate-100 border-slate-200'
                      }`}
                      style={{ 
                        transform: `scale(${breathScale})`,
                        transitionDuration: `${breathDuration}ms`,
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-lg md:text-2xl font-black uppercase text-white tracking-[0.2em]">{breathState}</span>
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsBreathingActive(!isBreathingActive)} 
                      className={`px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest text-white shadow-2xl transition-all active:scale-95 ${isBreathingActive ? 'bg-orange-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isBreathingActive ? 'Pause Routine' : 'Start Guidance'}
                    </button>
                    <button 
                      onClick={() => { setIsBreathingActive(false); setBreathTimer(60); setBreathScale(1); setBreathState('Rest'); }} 
                      className="p-6 bg-slate-100 text-slate-500 rounded-[2rem] hover:bg-slate-200 transition-colors shadow-sm"
                    >
                      <RotateCcw size={24} />
                    </button>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-sm"><Music size={22}/></div>
                  Ambient Calm
                </h3>
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  {[
                    { id: 'ocean', label: 'Ocean', icon: <Play size={18} /> },
                    { id: 'rain', label: 'Rain', icon: <CloudRain size={18} /> },
                    { id: 'forest', label: 'Forest', icon: <Trees size={18} /> }
                  ].map(audio => (
                    <button 
                      key={audio.id}
                      disabled={isLoading}
                      onClick={() => toggleSound(audio.id as any)}
                      className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center gap-4 transition-all border-2 ${activeAudioId === audio.id ? 'bg-purple-600 text-white border-purple-400 shadow-xl' : 'bg-slate-50 text-slate-500 border-transparent hover:bg-white hover:border-slate-200'} ${isLoading && activeAudioId === audio.id ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      <div className="p-4 bg-white/10 rounded-2xl">
                        {isLoading && activeAudioId === audio.id ? (
                          <RotateCcw size={24} className="animate-spin" />
                        ) : activeAudioId === audio.id && isPlaying ? (
                          <Pause size={24} className="animate-pulse" />
                        ) : (
                          audio.icon
                        )}
                      </div>
                      <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">{audio.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RESULTS' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                   <Smile size={180} />
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Your Diagnostic Result</h3>
                <p className="text-sm md:text-lg font-medium leading-relaxed opacity-90 mb-10">
                  Medical terminology can often sound scary, but remember that the vast majority of findings lead to better, more targeted treatment.
                </p>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                   <h4 className="font-black text-sm uppercase mb-3 flex items-center gap-2"><Sparkles size={16} /> Patient Tip</h4>
                   <p className="text-xs md:text-sm font-bold opacity-80">
                      If you see the word "Unremarkable" in your clinical report, it actually means your scan looks perfectly healthy and normal!
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COMPANION SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col h-[600px] overflow-hidden">
            <div className="bg-rose-600 p-6 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <Bot size={24} />
                <h4 className="font-black text-xs uppercase tracking-tighter">Visit Support AI</h4>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
               {chatHistory.length === 0 && (
                 <div className="text-center py-28 opacity-20 flex flex-col items-center">
                    <HelpCircle size={72} className="mb-6 text-slate-400" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] max-w-[180px]">How can I support your visit today?</p>
                 </div>
               )}
               {chatHistory.map(msg => (
                 <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-5 rounded-[1.5rem] text-[11px] md:text-xs font-bold shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                       {msg.text}
                    </div>
                 </div>
               ))}
               {isChatLoading && <div className="text-[10px] font-black text-rose-500 animate-pulse uppercase px-4 flex items-center gap-2">Connecting to clinical assistant...</div>}
            </div>
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask a question..." 
                  className="w-full p-5 pr-14 bg-slate-100 rounded-2xl text-[11px] md:text-xs font-bold outline-none border border-transparent focus:border-rose-200 focus:bg-white transition-all shadow-inner" 
                />
                <button onClick={handleChat} className="absolute right-2 top-2 p-3 bg-rose-600 text-white rounded-xl shadow-xl active:scale-95 transition-all"><Send size={20}/></button>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform">
                <Phone size={80} className="text-red-900" />
             </div>
             <h4 className="font-black text-red-600 text-[11px] uppercase tracking-widest mb-6 flex items-center gap-3">
                <AlertCircle size={18} /> Emergency Assist
             </h4>
             <a href="tel:108" className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all group border border-red-100 active:scale-95">
                <p className="text-lg font-black text-red-600 uppercase">Emergency: 108</p>
                <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg"><Phone size={24} /></div>
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;
