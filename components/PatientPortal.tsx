import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckSquare, Square, Video, Wind, Music, Clock, 
  Share2, AlertCircle, Smile, Youtube, Download, 
  Play, Pause, RotateCcw, Phone, Languages, Send, 
  Bot, User, Sparkles, Trees, CloudRain, ChevronRight,
  ClipboardList, Heart, HelpCircle
} from 'lucide-react';
import { askTutor } from '../services/geminiService';
import { ChatMessage } from '../types';

const PatientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PREPARE' | 'COMFORT' | 'RESULTS'>('PREPARE');
  
  // --- PREPARATION CHECKLIST ---
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Bring a Valid Photo ID & Doctor's Referral", checked: false },
    { id: 2, text: "Remove all jewelry, piercings, and metal watches", checked: false },
    { id: 3, text: "Wear loose, comfortable clothing (Avoid metal zippers)", checked: false },
    { id: 4, text: "Fasting for 4-6 hours (If specifically instructed)", checked: false },
    { id: 5, text: "Inform staff if you are pregnant or nursing", checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // --- BREATHING & COMFORT ---
  const [breathState, setBreathState] = useState<'Ready' | 'Inhale' | 'Hold' | 'Exhale' | 'Well Done' | 'Paused'>('Ready');
  const [breathScale, setBreathScale] = useState(1);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [activeAudio, setActiveAudio] = useState<'ocean' | 'rain' | 'forest' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cycleTimer: any;
    let mainTimer: any;

    if (isBreathingActive && timeLeft > 0) {
      mainTimer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);

      const breathSequence = [
        { state: 'Inhale', scale: 1.5, duration: 4000 },
        { state: 'Hold', scale: 1.5, duration: 2000 },
        { state: 'Exhale', scale: 1.0, duration: 4000 },
        { state: 'Hold', scale: 1.0, duration: 2000 },
      ];

      let currentStep = 0;
      const runCycle = () => {
        const step = breathSequence[currentStep];
        setBreathState(step.state as any);
        setBreathScale(step.scale);
        
        cycleTimer = setTimeout(() => {
          currentStep = (currentStep + 1) % breathSequence.length;
          runCycle();
        }, step.duration);
      };

      runCycle();
    } else {
      setBreathScale(1);
      if (timeLeft <= 0) setBreathState('Well Done');
      else if (!isBreathingActive) setBreathState('Paused');
    }

    return () => {
      clearTimeout(cycleTimer);
      clearInterval(mainTimer);
    };
  }, [isBreathingActive, timeLeft === 0]);

  const toggleBreathing = () => {
    if (timeLeft <= 0) setTimeLeft(60);
    setIsBreathingActive(!isBreathingActive);
  };

  const toggleSound = (type: 'ocean' | 'rain' | 'forest') => {
    if (activeAudio === type && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setActiveAudio(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();

    const urls = {
      ocean: "https://cdn.pixabay.com/audio/2022/10/24/audio_024b171577.mp3",
      rain: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
      forest: "https://cdn.pixabay.com/audio/2022/02/07/audio_65922383d4.mp3"
    };

    const audio = new Audio(urls[type]);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    audio.play().then(() => {
      setIsPlaying(true);
      setActiveAudio(type);
    }).catch(e => console.error("Audio Playback Error", e));
  };

  // --- AI NURSE CHAT ---
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
      const response = await askTutor(userMsg.text, "You are a comforting nurse in a radiology waiting room. Use very simple, empathetic, and reassuring language. Answer questions about scan wait times, comfort, or generic safety myths.", chatHistory);
      setChatHistory(prev => [...prev, { id: (Date.now()+1).toString(), role: 'model', text: response, timestamp: Date.now() }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { id: 'err', role: 'model', text: "I'm having trouble connecting, but the friendly staff at the front desk can help you right now!", timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in font-sans">
      <header className="bg-rose-600 rounded-[3rem] p-10 text-white shadow-2xl mb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-10">
          <Heart size={240} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Patient Companion</h1>
          <p className="text-rose-100 font-bold max-w-lg">Everything you need to feel calm, prepared, and informed for your imaging visit.</p>
          
          <div className="flex bg-rose-900/20 p-1 rounded-2xl mt-8 backdrop-blur-md border border-white/10">
            {['PREPARE', 'COMFORT', 'RESULTS'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-rose-700 shadow-xl' : 'text-white/70 hover:bg-white/10'}`}
              >
                {tab === 'PREPARE' ? '1. Before You Arrive' : tab === 'COMFORT' ? '2. Waiting Room Support' : '3. My Results'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Main Tab Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {activeTab === 'PREPARE' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <ClipboardList className="text-rose-500" /> Pre-Scan Checklist
                </h3>
                <div className="space-y-3">
                  {checklist.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`w-full text-left p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                        item.checked ? 'border-green-500 bg-green-50 text-green-800 opacity-60' : 'border-slate-50 bg-slate-50 hover:border-rose-200 hover:bg-white'
                      }`}
                    >
                      {item.checked ? <CheckSquare className="text-green-600" /> : <Square className="text-slate-300" />}
                      <span className="font-bold text-sm">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <Video className="text-red-600" /> Visual Guides
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="https://www.youtube.com/watch?v=nFkBhUYynUw" target="_blank" className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg border border-transparent hover:border-red-100 transition-all group">
                    <Youtube className="text-red-600 mb-3" size={32} />
                    <p className="font-black text-slate-800 text-sm">MRI Sounds & Experience</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Video Guide • 3:45</p>
                  </a>
                  <a href="https://www.youtube.com/watch?v=aQZ8tTZnQ8A" target="_blank" className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg border border-transparent hover:border-red-100 transition-all group">
                    <Youtube className="text-red-600 mb-3" size={32} />
                    <p className="font-black text-slate-800 text-sm">The CT Scan Journey</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Video Guide • 4:12</p>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COMFORT' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center text-center">
                 <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-3"><Wind className="text-blue-500" /> Guided Breathing</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Essential for clear MRI & CT images</p>
                 
                 <div className="relative mb-12">
                   <div 
                    className="w-48 h-48 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center transition-all duration-1000 ease-in-out shadow-2xl"
                    style={{ transform: `scale(${breathScale})` }}
                   >
                     <span className="text-2xl font-black text-blue-700 uppercase tracking-widest">{breathState}</span>
                   </div>
                   {isBreathingActive && <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>}
                 </div>

                 <div className="flex items-center gap-6">
                    <div className="text-4xl font-black text-slate-800 font-mono w-24">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <button onClick={toggleBreathing} className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-white shadow-xl transition-all active:scale-95 ${isBreathingActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {isBreathingActive ? 'Pause Session' : 'Start Session'}
                    </button>
                    <button onClick={() => { setIsBreathingActive(false); setTimeLeft(60); setBreathState('Ready'); }} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200">
                      <RotateCcw size={20} />
                    </button>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><Music className="text-purple-600" /> Relaxation Audio</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'ocean', label: 'Ocean', icon: <Play size={18} /> },
                    { id: 'rain', label: 'Rain', icon: <CloudRain size={18} /> },
                    { id: 'forest', label: 'Forest', icon: <Trees size={18} /> }
                  ].map(audio => (
                    <button 
                      key={audio.id}
                      onClick={() => toggleSound(audio.id as any)}
                      className={`p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all ${activeAudio === audio.id ? 'bg-purple-600 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-600'}`}
                    >
                      {activeAudio === audio.id && isPlaying ? <Pause size={24} className="animate-pulse" /> : audio.icon}
                      <span className="font-black text-[10px] uppercase tracking-widest">{audio.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RESULTS' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <Smile size={180} className="absolute -bottom-10 -right-10 opacity-10" />
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3"><Sparkles /> Understanding Your Result</h3>
                <p className="text-teal-50 font-medium leading-relaxed mb-6">"Unremarkable" or "Within normal limits" are medical terms that mean everything looks healthy. You did amazing today!</p>
                <button className="bg-white text-teal-700 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Download Result PDF</button>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Common Medical Terms</h4>
                 <div className="space-y-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="font-black text-slate-800 text-sm">Normal / Unremarkable</p>
                       <p className="text-xs text-slate-500 mt-1">This is great! It means no new issues or abnormalities were found.</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="font-black text-slate-800 text-sm">Chronic vs. Acute</p>
                       <p className="text-xs text-slate-500 mt-1">"Chronic" means long-term/old. "Acute" means new or happening right now.</p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Nurse & Helplines */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col h-[500px] overflow-hidden">
            <div className="bg-rose-600 p-6 text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                 <Bot size={20} />
              </div>
              <div>
                 <h4 className="font-black text-sm uppercase tracking-tighter">Nurse Rad AI</h4>
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Reassurance Assistant</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
               {chatHistory.length === 0 && (
                 <div className="text-center py-10 opacity-30">
                    <HelpCircle size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">How can I help you feel better today?</p>
                 </div>
               )}
               {chatHistory.map(msg => (
                 <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-rose-100 text-rose-600'}`}>
                       {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>
                       {msg.text}
                    </div>
                 </div>
               ))}
               {isChatLoading && <div className="text-[10px] font-black text-rose-400 animate-pulse uppercase px-10">Nurse is typing...</div>}
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask a question..." 
                  className="w-full p-4 pr-12 bg-slate-100 border-none rounded-2xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none" 
                />
                <button onClick={handleChat} className="absolute right-2 top-2 p-2 bg-rose-600 text-white rounded-xl shadow-lg hover:bg-rose-700 transition-all"><Send size={16}/></button>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
             <h4 className="font-black text-red-600 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <AlertCircle size={16} /> Emergency Help
             </h4>
             <div className="space-y-4">
                <a href="tel:108" className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-red-50 hover:scale-105 transition-all group">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ambulance</p>
                     <p className="text-xl font-mono font-black text-red-600">108</p>
                   </div>
                   <Phone size={20} className="text-red-600 group-hover:rotate-12 transition-transform" />
                </a>
                <a href="tel:112" className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-red-50 hover:scale-105 transition-all group">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All Emergencies</p>
                     <p className="text-xl font-mono font-black text-red-600">112</p>
                   </div>
                   <Phone size={20} className="text-red-600 group-hover:rotate-12 transition-transform" />
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;