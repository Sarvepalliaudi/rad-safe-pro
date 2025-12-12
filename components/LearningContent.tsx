
import React, { useState, useRef, useEffect } from 'react';
import { Section, ChatMessage } from '../types';
import { Bot, Lightbulb, X, Send, User, ChevronRight, Image as ImageIcon, Sparkles, Loader2, Download, AlertTriangle } from 'lucide-react';
import { askTutor, generateRadiologyImage } from '../services/geminiService';
import { getUserProfile } from '../services/userService';

interface LearningContentProps {
  section: Section;
}

const LearningContent: React.FC<LearningContentProps> = ({ section }) => {
  const [activeSubsection, setActiveSubsection] = useState<number | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'chat' | 'image'>('chat'); // 'chat' or 'image'
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Image Gen State
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgSize, setImgSize] = useState<'1K' | '2K'>('1K');
  const [imgLoading, setImgLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  
  const user = getUserProfile();
  const isPublicSection = section.category === 'public';

  // Auto-scroll chat
  useEffect(() => {
    if (aiMode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAiOpen, aiMode]);

  const toggleAi = () => {
    setIsAiOpen(!isAiOpen);
    if (!isAiOpen && chatHistory.length === 0) {
      // Initial greeting
      const greeting = isPublicSection 
        ? `Hello! I am 'Dr. Rad', your friendly medical guide. I can answer questions or generate educational diagrams. How can I help?`
        : `Hi! I'm your RAD AI Tutor. I can explain "${section.title}" or generate radiology images (check the Image Lab tab!).`;

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

    // Check for image generation intent in text
    if (inputMsg.toLowerCase().includes('generate') && inputMsg.toLowerCase().includes('image')) {
       const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: inputMsg,
        timestamp: Date.now()
      };
      setChatHistory(prev => [...prev, userMsg]);
      setInputMsg('');
      
      // Auto-reply suggesting the Image Lab
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: "I can help with that! Please **switch to the 'Image Lab' tab** at the top of this chat window to generate custom radiology images.",
          timestamp: Date.now()
        }]);
      }, 500);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputMsg,
      timestamp: Date.now()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    try {
      let context = '';
      if (isPublicSection) {
        context = `You are 'Dr. Rad'. Topic: ${section.title}. Reference: ${section.subsections?.map(s => s.title + ": " + s.body).join('\n')}. Simple language.`;
      } else {
        context = `You are 'RAD AI', Radiology Tutor. Module: "${section.title}".`;
        if (activeSubsection !== null && section.subsections) {
          const currentSub = section.subsections[activeSubsection];
          context += ` Student is reading: "${currentSub.title}". Content: ${currentSub.body}. Prioritize this.`;
        }
        context += ` Mention the 'Image Lab' feature if relevant.`;
      }

      const responseText = await askTutor(userMsg.text, context, chatHistory);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Network error. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imgPrompt.trim()) return;
    setImgLoading(true);
    setGeneratedImg(null);
    try {
      const url = await generateRadiologyImage(imgPrompt, imgSize);
      setGeneratedImg(url);
    } catch (e) {
      console.error(e);
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto pr-2 pb-20 ${isAiOpen ? 'lg:w-2/3' : 'w-full'}`}>
        <header className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
               <h2 className={`text-3xl font-bold ${isPublicSection ? 'text-teal-700' : 'text-slate-800'}`}>{section.title}</h2>
               <div className="flex gap-2 mt-2">
                 <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${isPublicSection ? 'bg-teal-100 text-teal-700' : 'bg-rad-100 text-rad-700'}`}>
                    {isPublicSection ? 'Public Awareness' : section.category}
                 </span>
               </div>
            </div>
            
            {/* AI Toggle Button */}
            <button 
              onClick={toggleAi}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${
                isAiOpen 
                  ? 'bg-slate-200 text-slate-600' 
                  : isPublicSection 
                    ? 'bg-teal-600 text-white shadow-teal-200 hover:bg-teal-700' 
                    : 'bg-gradient-to-r from-rad-500 to-purple-600 text-white shadow-rad-200'
              }`}
            >
              <Bot size={20} />
              {isAiOpen ? 'Close Assistant' : isPublicSection ? 'Ask Dr. Rad' : 'Open AI Tutor'}
            </button>
          </div>
        </header>

        <div className="space-y-8">
          {section.subsections?.map((sub, idx) => (
            <div 
              key={idx} 
              id={`sub-${idx}`}
              onClick={() => setActiveSubsection(idx)}
              className={`bg-white p-6 rounded-xl shadow-sm border transition-all cursor-pointer ${
                activeSubsection === idx 
                  ? isPublicSection ? 'border-teal-400 ring-2 ring-teal-50' : 'border-rad-400 ring-2 ring-rad-50' 
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <h3 className={`text-xl font-bold mb-3 flex justify-between items-center ${isPublicSection ? 'text-teal-700' : 'text-rad-700'}`}>
                {sub.title}
                {activeSubsection !== idx && <ChevronRight size={16} className="text-slate-300"/>}
              </h3>

              {/* Image Rendering */}
              {sub.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 max-h-60">
                   <img src={sub.imageUrl} alt={sub.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* Render Markdown-like content */}
              <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
                {sub.body.split('\n').map((line, i) => (
                  <div key={i}>
                    {line.startsWith('###') ? (
                       <h4 className="text-lg font-bold text-slate-800 mt-6 mb-2 border-l-4 border-rad-300 pl-3">
                         {line.replace('###', '')}
                       </h4>
                    ) : line.startsWith('•') ? (
                      <p className="mb-1 pl-4 relative">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-rad-400 rounded-full"></span>
                        <span dangerouslySetInnerHTML={{ 
                          __html: line.substring(1).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                        }} />
                      </p>
                    ) : line.startsWith('$$') ? (
                       <div className="bg-gray-50 p-3 rounded-lg font-mono text-center text-rad-900 border border-gray-200 my-4 shadow-inner">
                         {line.replace(/\$\$/g, '')}
                       </div>
                    ) : line.trim() === '' ? (
                      <div className="h-2"></div>
                    ) : (
                      <p className="mb-2" dangerouslySetInnerHTML={{ 
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Tutor Drawer / Sidebar */}
      {isAiOpen && (
        <div className="fixed inset-0 z-40 lg:static lg:z-0 lg:block lg:w-96 flex flex-col bg-white lg:rounded-2xl lg:border lg:border-gray-200 shadow-xl lg:shadow-none animate-slide-in-right">
          
          {/* Header */}
          <div className={`p-4 text-white flex flex-col gap-3 lg:rounded-t-2xl ${isPublicSection ? 'bg-teal-600' : 'bg-gradient-to-r from-rad-600 to-purple-600'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{isPublicSection ? 'Dr. Rad' : 'RAD AI Tutor'}</h3>
                  <p className="text-[10px] text-white/80">
                    {isPublicSection ? 'Patient Guide' : `Context: ${activeSubsection !== null ? 'Section' : 'Module'}`}
                  </p>
                </div>
              </div>
              <button onClick={toggleAi} className="p-1 hover:bg-white/20 rounded-full lg:hidden">
                <X size={20} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-black/20 p-1 rounded-xl">
               <button 
                onClick={() => setAiMode('chat')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${aiMode === 'chat' ? 'bg-white text-rad-700 shadow-sm' : 'text-white/70 hover:text-white'}`}
               >
                 <Bot size={14} /> Chat
               </button>
               <button 
                onClick={() => setAiMode('image')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${aiMode === 'image' ? 'bg-white text-pink-600 shadow-sm' : 'text-white/70 hover:text-white'}`}
               >
                 <Sparkles size={14} /> Image Lab
               </button>
            </div>
          </div>

          {/* CONTENT: CHAT MODE */}
          {aiMode === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-slate-200 text-slate-600' : isPublicSection ? 'bg-teal-100 text-teal-600' : 'bg-rad-100 text-rad-600'
                    }`}>
                      {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                      <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPublicSection ? 'bg-teal-100 text-teal-600' : 'bg-rad-100 text-rad-600'}`}><Bot size={14}/></div>
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200 lg:rounded-b-2xl">
                <div className="relative">
                  <input 
                    type="text" 
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about this topic or say 'Generate image'..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-rad-500 focus:bg-white transition-all text-sm"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputMsg.trim() || loading}
                    className={`absolute right-2 top-2 p-1.5 text-white rounded-lg disabled:opacity-50 transition-colors ${isPublicSection ? 'bg-teal-600 hover:bg-teal-700' : 'bg-rad-600 hover:bg-rad-700'}`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* CONTENT: IMAGE MODE */}
          {aiMode === 'image' && (
            <div className="flex-1 flex flex-col bg-slate-50 p-4 overflow-y-auto">
              {/* Promo Banner if not Pro */}
              {!user.isPro && user.role !== 'radiology_officer' && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl text-white text-xs mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="shrink-0 text-yellow-300" />
                  <div>
                    <p className="font-bold">Pro Feature</p>
                    <p className="opacity-90">Sign in with Google to unlock 2K Resolution.</p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase">Image Prompt</label>
                <textarea 
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  placeholder="Describe the anatomy or pathology (e.g., 'Normal chest X-ray PA view')"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none resize-none h-24"
                />
                
                <div className="flex gap-2 items-center">
                   <div className="flex-1">
                     <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Size</label>
                     <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                          onClick={() => setImgSize('1K')}
                          className={`flex-1 py-1 rounded text-xs font-bold ${imgSize === '1K' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
                        >
                          1K
                        </button>
                        <button 
                          onClick={() => setImgSize('2K')}
                          disabled={!user.isPro && user.role !== 'radiology_officer'}
                          className={`flex-1 py-1 rounded text-xs font-bold ${imgSize === '2K' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-300'}`}
                        >
                          2K {(!user.isPro && user.role !== 'radiology_officer') && '🔒'}
                        </button>
                     </div>
                   </div>
                   <button 
                    onClick={handleGenerateImage}
                    disabled={!imgPrompt || imgLoading}
                    className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-pink-200 hover:bg-pink-700 disabled:opacity-50 mt-4"
                   >
                     {imgLoading ? <Loader2 className="animate-spin" /> : 'Generate'}
                   </button>
                </div>
              </div>

              {/* Result Area */}
              <div className="flex-1 bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group min-h-[200px]">
                 {imgLoading ? (
                   <div className="text-center">
                     <Loader2 size={32} className="text-pink-500 animate-spin mx-auto mb-2" />
                     <p className="text-xs text-slate-400 animate-pulse">Drawing pixels...</p>
                   </div>
                 ) : generatedImg ? (
                   <>
                     <img src={generatedImg} alt="Generated" className="w-full h-full object-contain bg-black" />
                     <a 
                      href={generatedImg}
                      download={`rad-ai-${Date.now()}.png`}
                      className="absolute bottom-2 right-2 bg-white/90 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <Download size={14} /> Save
                     </a>
                   </>
                 ) : (
                   <div className="text-center text-slate-300">
                     <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                     <p className="text-xs">Preview Area</p>
                   </div>
                 )}
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                <AlertTriangle size={10} className="inline mr-1" />
                AI images are for educational simulation only.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default LearningContent;
