
import React, { useState, useRef, useEffect } from 'react';
import { Section, ChatMessage } from '../types';
import { Bot, Lightbulb, X, Send, User, ChevronRight } from 'lucide-react';
import { askTutor } from '../services/geminiService';

interface LearningContentProps {
  section: Section;
}

const LearningContent: React.FC<LearningContentProps> = ({ section }) => {
  const [activeSubsection, setActiveSubsection] = useState<number | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isPublicSection = section.category === 'public';

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiOpen]);

  const toggleAi = () => {
    setIsAiOpen(!isAiOpen);
    if (!isAiOpen && chatHistory.length === 0) {
      // Initial greeting based on section type
      const greeting = isPublicSection 
        ? `Hello! I am 'Dr. Rad', your friendly medical guide. I can answer any questions you have about radiation safety, X-rays, or myths. How can I help you today?`
        : `Hi! I'm your RAD AI Tutor. I'm reading the "${section.title}" module with you. Ask me anything about it!`;

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
      // Prepare context: Current subsection or general section info
      let context = isPublicSection 
        ? `You are 'Dr. Rad', a patient-friendly guide explaining radiology to the general public. Keep language simple, reassuring, and avoid jargon.`
        : `Module: ${section.title}. `;
      
      if (!isPublicSection) {
        if (activeSubsection !== null && section.subsections) {
          context += `Subsection: ${section.subsections[activeSubsection].title}. Content: ${section.subsections[activeSubsection].body}`;
        } else {
          context += `Overview of topics: ${section.subsections?.map(s => s.title).join(', ')}`;
        }
      } else {
        context += ` Topic: ${section.title}. Content: ${section.subsections?.map(s => s.title + ": " + s.body).join('\n')}`;
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
        text: "Sorry, I'm having trouble connecting to the network right now.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
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
                  <p key={i} className="mb-2">
                    {line.startsWith('•') ? (
                      <span className="block pl-4 -indent-4">{line}</span>
                    ) : line.startsWith('$$') ? (
                       <span className="block bg-gray-50 p-3 rounded-lg font-mono text-center text-rad-900 border border-gray-200 my-4">
                         {line.replace(/\$\$/g, '')}
                       </span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ 
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                      }} />
                    )}
                  </p>
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
          <div className={`p-4 text-white flex justify-between items-center lg:rounded-t-2xl ${isPublicSection ? 'bg-teal-600' : 'bg-gradient-to-r from-rad-600 to-purple-600'}`}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{isPublicSection ? 'Dr. Rad (Patient Guide)' : 'RAD AI Tutor'}</h3>
                <p className="text-[10px] text-white/80">
                  {isPublicSection ? 'Ask me anything about safety' : `Context: ${activeSubsection !== null ? 'Current Section' : 'Full Module'}`}
                </p>
              </div>
            </div>
            <button onClick={toggleAi} className="p-1 hover:bg-white/20 rounded-full lg:hidden">
              <X size={20} />
            </button>
          </div>

          {/* Chat History */}
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
                placeholder={isPublicSection ? "Ask a question..." : "Ask about this topic..."}
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
            <p className="text-[10px] text-center text-slate-400 mt-2">AI can make mistakes. Verify important info.</p>
          </div>

        </div>
      )}
    </div>
  );
};

export default LearningContent;
