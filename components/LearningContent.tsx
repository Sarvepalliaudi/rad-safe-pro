
import React, { useState, useRef, useEffect } from 'react';
import { Section, ChatMessage } from '../types';
import { Bot, Lightbulb, X, Send, User, ChevronRight, Image as ImageIcon, Sparkles, Loader2, Download, AlertTriangle, Languages, Zap, ShieldCheck } from 'lucide-react';
import { askTutor, generateRadiologyImage } from '../services/geminiService';
import { getUserProfile } from '../services/userService';

interface LearningContentProps {
  section: Section;
}

const LearningContent: React.FC<LearningContentProps> = ({ section }) => {
  const [activeSubsection, setActiveSubsection] = useState<number | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'chat' | 'image'>('chat');
  const [selectedLang, setSelectedLang] = useState('All');
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [imgPrompt, setImgPrompt] = useState('');
  const [imgLoading, setImgLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  
  const isPublicSection = section.category === 'public';

  const languages = [
    { code: 'All', label: 'All' },
    { code: 'English', label: 'English' },
    { code: 'Tamil', label: 'தமிழ்' },
    { code: 'Hindi', label: 'हिन्दी' },
    { code: 'Telugu', label: 'తెలుగు' },
    { code: 'Malayalam', label: 'മലയാളം' },
    { code: 'Kannada', label: 'ಕನ್ನಡ' }
  ];

  const filteredSubsections = isPublicSection && selectedLang !== 'All' 
    ? section.subsections?.filter(s => s.title.includes(selectedLang))
    : section.subsections;

  useEffect(() => {
    if (aiMode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAiOpen, aiMode]);

  const toggleAi = () => {
    setIsAiOpen(!isAiOpen);
    if (!isAiOpen && chatHistory.length === 0) {
      const greeting = isPublicSection 
        ? `Hello! I am 'Dr. Rad', your friendly medical guide. I can answer questions in multiple languages about these myths. How can I help?`
        : `Hi! I'm your RAD AI Tutor. Module: "${section.title}". How can I help?`;

      setChatHistory([{
        id: 'init',
        role: 'model',
        text: greeting,
        timestamp: Date.now()
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputMsg, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    try {
      let context = isPublicSection 
        ? `You are 'Dr. Rad', a multilingual patient assistant. Help clarify radiation myths. Topic: ${section.title}.`
        : `You are 'RAD AI', Radiology Tutor. Module: "${section.title}".`;

      const responseText = await askTutor(userMsg.text, context, chatHistory);
      setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { id: 'err', role: 'model', text: "Network error.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] animate-fade-in">
      <div className={`flex-1 overflow-y-auto pr-2 pb-20 transition-all duration-500 ${isAiOpen ? 'lg:w-2/3' : 'w-full'}`}>
        <header className="pb-6 mb-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className={`text-3xl font-black tracking-tight ${isPublicSection ? 'text-teal-700' : 'text-slate-800'}`}>{section.title}</h2>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-Spectral Safety Hub v3.8</p>
            </div>
            
            <button 
              onClick={toggleAi}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-xs transition-all shadow-xl active:scale-95 ${
                isAiOpen 
                  ? 'bg-slate-200 text-slate-600' 
                  : isPublicSection 
                    ? 'bg-teal-600 text-white shadow-teal-100 hover:bg-teal-700' 
                    : 'bg-rad-600 text-white shadow-rad-100 hover:bg-rad-700'
              }`}
            >
              <Bot size={18} /> {isAiOpen ? 'Hide Dr. Rad' : 'Ask Dr. Rad'}
            </button>
          </div>

          {isPublicSection && (
            <div className="mt-8">
               <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Languages size={14} /> Languages / மொழிகள் / भाषाएँ
               </div>
               <div className="flex flex-wrap gap-2">
                 {languages.map(lang => (
                   <button 
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${selectedLang === lang.code ? 'bg-teal-600 border-teal-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-teal-200'}`}
                   >
                     {lang.label}
                   </button>
                 ))}
               </div>
            </div>
          )}
        </header>

        <div className="space-y-8">
          {filteredSubsections?.map((sub, idx) => (
            <div 
              key={idx} 
              className={`bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border transition-all ${
                isPublicSection ? 'border-teal-50' : 'border-slate-50'
              }`}
            >
              <h3 className={`text-2xl font-black mb-10 flex items-center gap-4 ${isPublicSection ? 'text-teal-700' : 'text-rad-700'}`}>
                {isPublicSection && <Zap size={24} className="text-orange-500" />} {sub.title}
              </h3>

              <div className="grid grid-cols-1 gap-6">
                {sub.body.split('###').filter(Boolean).map((block, i) => {
                  const isMythBlock = block.toLowerCase().includes('myth');
                  const lines = block.split('\n');
                  const title = lines[0];
                  const content = lines.slice(1).join('\n');

                  return (
                    <div key={i} className={`p-8 rounded-[2.5rem] ${isMythBlock ? 'bg-orange-50/50 border border-orange-100' : 'bg-slate-50 border border-slate-100'}`}>
                       <h4 className={`text-lg font-black mb-4 flex items-center gap-3 ${isMythBlock ? 'text-orange-700' : 'text-slate-800'}`}>
                          {isMythBlock ? <AlertTriangle size={20} /> : <ShieldCheck size={20} className="text-green-600" />}
                          {title}
                       </h4>
                       <div className="text-sm font-medium text-slate-600 leading-relaxed prose prose-slate">
                          {content.split('\n').map((line, j) => (
                            <p key={j} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>') }} />
                          ))}
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAiOpen && (
        <div className="fixed inset-0 z-40 lg:static lg:z-0 lg:block lg:w-96 flex flex-col bg-white lg:rounded-[3rem] lg:border lg:border-slate-100 shadow-2xl animate-slide-in-right">
          <div className={`p-6 text-white flex flex-col gap-4 lg:rounded-t-[3rem] ${isPublicSection ? 'bg-teal-700' : 'bg-slate-900'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bot size={24} />
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tighter">{isPublicSection ? 'Dr. Rad Assistant' : 'RAD AI Tutor'}</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Grounded Safety</p>
                </div>
              </div>
              <button onClick={toggleAi} className="p-2 hover:bg-white/10 rounded-full lg:hidden"><X size={20} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-200' : 'bg-white border border-slate-100 text-rad-600'}`}>
                  {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                </div>
                <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                   <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-white border-t border-slate-100 lg:rounded-b-[3rem]">
            <div className="relative">
              <input type="text" value={inputMsg} onChange={e => setInputMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask Dr. Rad..." className="w-full p-4 pr-12 bg-slate-100 border-none rounded-2xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-rad-500 transition-all" />
              <button onClick={handleSendMessage} className="absolute right-2 top-2 p-2 bg-rad-600 text-white rounded-xl shadow-lg hover:bg-rad-700"><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningContent;
