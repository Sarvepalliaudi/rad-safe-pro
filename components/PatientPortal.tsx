
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckSquare, Square, Video, Wind, Music, Clock, 
  Share2, AlertCircle, 
  Smile, Youtube, Download, Play, Pause, RotateCcw, Phone, Languages, Send, Bot, User, Sparkles, Trees, CloudRain
} from 'lucide-react';
import { askTutor } from '../services/geminiService';
import { ChatMessage } from '../types';

const PatientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PREPARE' | 'COMFORT' | 'RESULTS'>('PREPARE');
  
  // --- STATE FOR PREPARE ---
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Bring Photo ID & Insurance Card", checked: false },
    { id: 2, text: "Remove all jewelry and piercings", checked: false },
    { id: 3, text: "Wear comfortable, loose clothing", checked: false },
    { id: 4, text: "Stop eating solid food (if instructed)", checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

  // --- STATE FOR COMFORT (Breathing & Audio) ---
  const [breathState, setBreathState] = useState('Ready');
  const [breathScale, setBreathScale] = useState(1);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathDuration, setBreathDuration] = useState(60); 
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Audio State
  const [activeAudio, setActiveAudio] = useState<'ocean' | 'rain' | 'forest' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- BREATHING LOGIC ---
  useEffect(() => {
    let timerInterval: any;
    let breathCycleInterval: any;

    if (isBreathingActive && timeLeft > 0) {
      // 1. Initial Start State
      // We set this immediately when button is clicked, but this ensures consistency
      if (breathState === 'Ready' || breathState === 'Paused') {
        setBreathState('Inhale');
        setBreathScale(1.5);
      }

      // 2. Timer Countdown (Reduces total time left)
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopBreathing(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 3. Breathing Cycle (Switches every 4 seconds)
      breathCycleInterval = setInterval(() => {
        setBreathState((prev) => {
          if (prev === 'Inhale') {
            setBreathScale(1);   // Contract for Exhale
            return 'Exhale';
          } else {
            setBreathScale(1.5); // Expand for Inhale
            return 'Inhale';
          }
        });
      }, 4000); // 4 Seconds In, 4 Seconds Out

    } else if (!isBreathingActive) {
       // Paused or Stopped
       if (timeLeft > 0 && breathState !== 'Well Done') {
         setBreathState('Paused');
       }
       if (breathState !== 'Well Done') {
         setBreathScale(1);
       }
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(breathCycleInterval);
    };
  }, [isBreathingActive, timeLeft]);

  const stopBreathing = (finished = false) => {
    setIsBreathingActive(false);
    setBreathState(finished ? 'Well Done' : 'Ready');
    setBreathScale(1);
    if (finished) setTimeLeft(0);
  };

  const handleStartBreathing = () => {
    if (timeLeft === 0) {
        setTimeLeft(breathDuration);
        setBreathState('Inhale');
        setBreathScale(1.5);
    } else {
        // If resuming, start inhaling immediately
        setBreathState('Inhale');
        setBreathScale(1.5);
    }
    setIsBreathingActive(!isBreathingActive);
  };

  const handleSetDuration = (seconds: number) => {
    setIsBreathingActive(false);
    setBreathDuration(seconds);
    setTimeLeft(seconds);
    setBreathState('Ready');
    setBreathScale(1);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- AUDIO LOGIC ---
  const toggleSound = (type: 'ocean' | 'rain' | 'forest') => {
    // If clicking the currently playing sound, pause it
    if (activeAudio === type && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setActiveAudio(null);
      return;
    }

    // Stop any existing sound before starting new one
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // High-Quality MP3 Sources (Pixabay) - Reliable and loop-friendly
    const urls = {
      ocean: "https://cdn.pixabay.com/audio/2022/10/24/audio_024b171577.mp3", // Ocean Waves
      rain: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",  // Soft Rain
      forest: "https://cdn.pixabay.com/audio/2022/02/07/audio_65922383d4.mp3" // Forest Ambience
    };

    const audio = new Audio(urls[type]);
    audio.loop = true;
    audio.volume = 0.5; // Comfortable volume
    
    // Add Error Handling
    audio.addEventListener('error', (e) => {
      console.error("Audio Load Error", e);
      setIsPlaying(false);
      setActiveAudio(null);
      alert("Could not load audio. Please check your internet connection.");
    });

    audioRef.current = audio;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setActiveAudio(type);
        })
        .catch(error => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
          setActiveAudio(null);
        });
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // --- CHAT LOGIC ---
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: Date.now()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const context = "You are a comforting, friendly medical assistant nurse for a patient in a radiology waiting room. Answer questions in very simple, reassuring, non-medical terms. Keep answers short (under 2 sentences). Be empathetic.";
      const response = await askTutor(userMsg.text, context, chatHistory);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response,
        timestamp: Date.now()
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (e) {
      // Fallback
      setChatHistory(prev => [...prev, { id: 'err', role: 'model', text: 'I am having trouble connecting, but remember: asking the technician nearby is always best!', timestamp: Date.now()}]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- STATE FOR RESULTS ---
  const [plainEnglish, setPlainEnglish] = useState(false);

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-teal-600 text-white p-8 rounded-b-3xl -mx-4 md:mx-0 md:rounded-3xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Patient Care Portal</h1>
        <p className="opacity-90">We are here to support you through your radiology journey.</p>
        
        {/* Navigation Tabs */}
        <div className="flex bg-teal-800/30 p-1 rounded-xl mt-6 backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('PREPARE')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'PREPARE' ? 'bg-white text-teal-700 shadow-md' : 'text-white/70 hover:bg-white/10'}`}
          >
            1. Before Scan
          </button>
          <button 
            onClick={() => setActiveTab('COMFORT')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'COMFORT' ? 'bg-white text-teal-700 shadow-md' : 'text-white/70 hover:bg-white/10'}`}
          >
            2. During Visit
          </button>
          <button 
            onClick={() => setActiveTab('RESULTS')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'RESULTS' ? 'bg-white text-teal-700 shadow-md' : 'text-white/70 hover:bg-white/10'}`}
          >
            3. My Results
          </button>
        </div>
      </div>

      {/* --- TAB 1: PREPARE --- */}
      {activeTab === 'PREPARE' && (
        <div className="space-y-6 animate-fade-in">
          {/* Checklist */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckSquare className="text-teal-500"/> Your To-Do List
            </h2>
            <div className="space-y-3">
              {checklist.map(item => (
                <button 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                    item.checked ? 'border-teal-500 bg-teal-50 text-teal-800 line-through opacity-70' : 'border-gray-100 hover:border-teal-200'
                  }`}
                >
                   {item.checked ? <CheckSquare className="shrink-0 text-teal-600"/> : <Square className="shrink-0 text-slate-300"/>}
                   <span className="font-medium">{item.text}</span>
                </button>
              ))}
            </div>
            {checklist.every(i => i.checked) && (
              <div className="mt-4 text-center text-teal-600 font-bold animate-bounce-slow">
                You're all set! 🌟
              </div>
            )}
          </div>

          {/* What to Expect - Videos */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Video className="text-red-500"/> What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => openVideo('https://www.youtube.com/watch?v=nFkBhUYynUw')} 
                className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                   <Youtube className="text-red-600" />
                   <span className="font-bold text-slate-700">MRI Sounds</span>
                </div>
                <p className="text-xs text-slate-500">Video: What happens during an MRI scan?</p>
              </button>
              <button 
                onClick={() => openVideo('https://www.youtube.com/watch?v=aQZ8tTZnQ8A')}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                   <Youtube className="text-red-600" />
                   <span className="font-bold text-slate-700">CT Scan Guide</span>
                </div>
                <p className="text-xs text-slate-500">Video: What to expect during a CT scan.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: COMFORT --- */}
      {activeTab === 'COMFORT' && (
        <div className="space-y-6 animate-fade-in">
           {/* Wait Time */}
           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg flex items-center gap-2"><Clock /> Current Wait Time</h2>
                <p className="opacity-80 text-sm">We are running slightly ahead of schedule.</p>
              </div>
              <div className="text-4xl font-black">
                15 <span className="text-lg font-medium">mins</span>
              </div>
           </div>

           {/* Breathing App */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
             <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Wind className="text-teal-500"/> Guided Breathing</h3>
             <p className="text-slate-400 text-xs mb-6">Select duration and sync your breath with the circle.</p>
             
             {/* Timer Controls */}
             <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => handleSetDuration(60)}
                  disabled={isBreathingActive} 
                  className={`px-3 py-1 text-xs font-bold rounded ${breathDuration === 60 ? 'bg-white shadow text-teal-700' : 'text-slate-400'}`}
                >
                  1 Min
                </button>
                <button 
                  onClick={() => handleSetDuration(120)}
                  disabled={isBreathingActive} 
                  className={`px-3 py-1 text-xs font-bold rounded ${breathDuration === 120 ? 'bg-white shadow text-teal-700' : 'text-slate-400'}`}
                >
                  2 Min
                </button>
                <button 
                  onClick={() => handleSetDuration(300)}
                  disabled={isBreathingActive} 
                  className={`px-3 py-1 text-xs font-bold rounded ${breathDuration === 300 ? 'bg-white shadow text-teal-700' : 'text-slate-400'}`}
                >
                  5 Min
                </button>
             </div>

             <div className="relative mb-6">
                {/* Breathing Circle Animation */}
                <div 
                  className="w-48 h-48 rounded-full bg-teal-100 flex items-center justify-center border-4 border-teal-200 transition-all duration-[4000ms] ease-in-out relative z-10"
                  style={{ transform: `scale(${breathScale})` }}
                >
                    <span className="text-2xl font-bold text-teal-700 transition-none">{breathState}</span>
                </div>
                {/* Ripple Effect for Activity */}
                {isBreathingActive && (
                  <div className="absolute inset-0 rounded-full bg-teal-200 animate-ping opacity-30"></div>
                )}
             </div>

             <div className="flex items-center gap-4">
                <div className="text-3xl font-mono font-bold text-slate-700 w-20">
                  {formatTime(timeLeft)}
                </div>
                <button 
                  onClick={handleStartBreathing}
                  className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 text-white transition-all ${isBreathingActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-teal-600 hover:bg-teal-700'}`}
                >
                  {isBreathingActive ? <><Pause size={18} /> Stop</> : <><Play size={18} /> Start</>}
                </button>
                <button 
                  onClick={() => handleSetDuration(breathDuration)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <RotateCcw size={18} />
                </button>
             </div>
           </div>

           {/* Sounds */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Music className="text-purple-500"/> Relaxing Sounds</h3>
             <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => toggleSound('ocean')}
                  className={`p-3 rounded-xl font-medium transition-all flex flex-col items-center justify-center gap-2 ${
                    activeAudio === 'ocean' && isPlaying ? 'bg-purple-100 text-purple-700 border-2 border-purple-200' : 'bg-gray-50 text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  {activeAudio === 'ocean' && isPlaying ? <Pause size={18} className="animate-pulse" /> : <Play size={18} />} 
                  <span className="text-xs">Ocean</span>
                </button>
                <button 
                  onClick={() => toggleSound('rain')}
                  className={`p-3 rounded-xl font-medium transition-all flex flex-col items-center justify-center gap-2 ${
                    activeAudio === 'rain' && isPlaying ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' : 'bg-gray-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {activeAudio === 'rain' && isPlaying ? <Pause size={18} className="animate-pulse" /> : <Play size={18} />}
                  <CloudRain size={18} />
                  <span className="text-xs">Rain</span>
                </button>
                <button 
                  onClick={() => toggleSound('forest')}
                  className={`p-3 rounded-xl font-medium transition-all flex flex-col items-center justify-center gap-2 ${
                    activeAudio === 'forest' && isPlaying ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-gray-50 text-slate-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  {activeAudio === 'forest' && isPlaying ? <Pause size={18} className="animate-pulse" /> : <Play size={18} />}
                  <Trees size={18} />
                  <span className="text-xs">Forest</span>
                </button>
             </div>
             {activeAudio && isPlaying && (
               <p className="text-xs text-center text-slate-400 mt-2 animate-pulse">Playing soothing sounds...</p>
             )}
           </div>

           {/* Ask Question Chatbot */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px]">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Bot className="text-teal-600" size={20}/> Ask Dr. Rad (Nurse Assistant)
              </h3>
              
              <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl p-4 mb-3 space-y-3">
                 {chatHistory.length === 0 && (
                   <p className="text-center text-slate-400 text-sm mt-8">
                     "Can I take my medication?"<br/>"How long will it take?"<br/>
                     <span className="text-xs">Type below to ask...</span>
                   </p>
                 )}
                 {chatHistory.map(msg => (
                   <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-teal-100 text-teal-600'}`}>
                        {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>}
                      </div>
                      <div className={`p-2 px-3 rounded-lg text-xs max-w-[80%] ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white border border-gray-200 text-slate-700'}`}>
                        {msg.text}
                      </div>
                   </div>
                 ))}
                 {isChatLoading && (
                   <div className="flex gap-2">
                     <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center"><Bot size={12}/></div>
                     <div className="text-xs text-slate-400 flex items-center h-8">Typing...</div>
                   </div>
                 )}
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your question..." 
                  className="w-full bg-slate-50 p-3 pr-10 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                />
                <button 
                  onClick={handleChatSubmit}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="absolute right-2 top-2 p-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
           </div>
        </div>
      )}

      {/* --- TAB 3: RESULTS --- */}
      {activeTab === 'RESULTS' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-end items-center gap-3">
             <span className="text-sm font-bold text-slate-500">Plain English Mode</span>
             <button 
               onClick={() => setPlainEnglish(!plainEnglish)}
               className={`w-14 h-8 rounded-full p-1 transition-colors ${plainEnglish ? 'bg-green-500' : 'bg-slate-300'}`}
             >
               <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${plainEnglish ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
          </div>

          {/* Happy Note Card */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-100 p-6 rounded-2xl relative overflow-hidden">
             <div className="flex items-start gap-4 z-10 relative">
                <div className="p-3 bg-white rounded-full shadow-sm text-yellow-500">
                  <Sparkles size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-800 text-lg mb-1">Dr. Rad's Reassurance</h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    "You did great today! Remember, a 'normal' or 'unremarkable' result is the best news we can get. It means your body is healthy and strong. Take a deep breath, smile, and have a wonderful day ahead!"
                  </p>
                </div>
             </div>
             <div className="absolute -right-6 -bottom-6 text-orange-100 opacity-50">
                <Smile size={120} />
             </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
            {plainEnglish && (
              <div className="absolute top-0 left-0 w-full bg-green-100 text-green-800 text-xs font-bold text-center py-1">
                SIMPLIFIED VIEW ACTIVE
              </div>
            )}
            
            <div className="mb-6 border-b border-gray-100 pb-4">
               <h2 className="text-2xl font-bold text-slate-800">Chest X-Ray Result</h2>
               <p className="text-slate-400 text-sm">Date: Today • Ref: #XR-9921</p>
            </div>

            <div className="space-y-6">
               <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Observation</h3>
                 {plainEnglish ? (
                   <p className="text-slate-700 leading-relaxed font-medium">
                     <Smile className="inline w-5 h-5 text-green-500 mr-1"/> 
                     Good news! Your lungs look clear. Your heart size is normal. We didn't see any broken bones or fluid buildup.
                   </p>
                 ) : (
                   <p className="text-slate-600 leading-relaxed font-mono text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                     "No evidence of active infiltrates or consolidation. Cardiac silhouette is within normal limits. Costophrenic angles are sharp. No acute osseous abnormalities."
                   </p>
                 )}
               </div>

               <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Conclusion</h3>
                 {plainEnglish ? (
                   <p className="text-lg font-bold text-green-600">
                     Everything looks normal. No new issues found.
                   </p>
                 ) : (
                   <p className="text-slate-800 font-bold">
                     Unremarkable chest radiograph.
                   </p>
                 )}
               </div>
            </div>
            
            <div className="mt-8 flex gap-3">
               <button className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 flex items-center justify-center gap-2">
                 <Share2 size={18} /> Share with Doctor
               </button>
               <button className="flex-1 py-3 bg-white border border-gray-200 text-slate-600 rounded-xl font-bold hover:bg-gray-50">
                 <Download size={18} className="inline mr-2"/> PDF
               </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Languages size={18}/> Medical Dictionary</h3>
            <ul className="text-sm space-y-2 text-blue-700">
              <li><strong>Unremarkable:</strong> Means "Normal". Nothing bad was found.</li>
              <li><strong>Acute:</strong> Means "New" or "Happening right now".</li>
              <li><strong>Lesion:</strong> A vague word for "spot" or "abnormality". Doesn't always mean cancer.</li>
            </ul>
          </div>
        </div>
      )}

      {/* --- EMERGENCY FOOTER --- */}
      <div className="mt-12 border-t-2 border-dashed border-gray-200 pt-8">
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-red-100 text-red-600 rounded-full">
               <AlertCircle size={24} />
             </div>
             <div>
               <h3 className="font-bold text-red-700">Emergency Contacts</h3>
               <p className="text-xs text-red-500">Official National Helplines (India)</p>
             </div>
           </div>
           
           <div className="text-right space-y-1">
             <div className="bg-white px-4 py-2 rounded-lg border border-red-100 shadow-sm flex items-center justify-between gap-4">
               <span className="text-xs font-bold text-slate-400 block">AMBULANCE</span>
               <a href="tel:108" className="font-mono font-bold text-slate-800 text-lg flex items-center gap-1 hover:text-red-600">
                 <Phone size={14} /> 108
               </a>
             </div>
             <div className="bg-white px-4 py-2 rounded-lg border border-red-100 shadow-sm flex items-center justify-between gap-4">
               <span className="text-xs font-bold text-slate-400 block">GENERAL EMERGENCY</span>
               <a href="tel:112" className="font-mono font-bold text-slate-800 text-lg flex items-center gap-1 hover:text-red-600">
                 <Phone size={14} /> 112
               </a>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;
