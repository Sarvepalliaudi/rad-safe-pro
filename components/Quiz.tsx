
import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizCategory, Difficulty, UserProfile } from '../types';
import { CheckCircle, XCircle, RefreshCw, HelpCircle, Settings, Play, Trophy, BarChart2, Star, AlertCircle, Sparkles, Loader2, ListChecks } from 'lucide-react';
import { getUserProfile, saveQuizResult } from '../services/userService';
import { generateAIQuiz } from '../services/geminiService';

interface QuizProps {
  allQuestions: QuizQuestion[];
  onExit: () => void;
}

const Quiz: React.FC<QuizProps> = ({ allQuestions, onExit }) => {
  const [phase, setPhase] = useState<'SETUP' | 'ACTIVE' | 'RESULT' | 'STATS'>('SETUP');
  const [config, setConfig] = useState<{ count: number; category: QuizCategory; difficulty: Difficulty }>({ 
    count: 5, 
    category: 'All', 
    difficulty: 'Beginner' 
  });
  
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [resultData, setResultData] = useState<{ xp: number, leveledUp: boolean } | null>(null);

  const startQuiz = () => {
    let filtered = allQuestions.filter(q => q.difficulty === config.difficulty);
    if (config.category !== 'All') filtered = filtered.filter(q => q.category === config.category);
    filtered = filtered.sort(() => 0.5 - Math.random());
    const finalCount = Math.min(config.count, filtered.length);
    filtered = filtered.slice(0, finalCount);
    
    if (filtered.length === 0) {
      alert(`No ${config.difficulty} questions found for ${config.category} yet!`);
      return;
    }

    setActiveQuestions(filtered);
    setPhase('ACTIVE');
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const startAiQuiz = async () => {
    if (!aiTopic.trim()) return;
    setIsAiLoading(true);
    try {
      const [qs] = await Promise.all([
        generateAIQuiz(aiTopic, config.count),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      if (qs && qs.length > 0) {
        setActiveQuestions(qs);
        setPhase('ACTIVE');
        setCurrentIdx(0);
        setScore(0);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        alert("AI Core timed out. Try a more common radiology topic.");
      }
    } catch (e) {
      alert("AI Generation failed. Check network.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === activeQuestions[currentIdx].correctIndex) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(curr => curr + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      const { xpGained, leveledUp } = saveQuizResult(score, activeQuestions.length, config.category, config.difficulty);
      setResultData({ xp: xpGained, leveledUp });
      setPhase('RESULT');
    }
  };

  if (isAiLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[60] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
        <div className="relative mb-10">
          <div className="w-32 h-32 bg-rad-500/20 rounded-full flex items-center justify-center">
            <Sparkles size={64} className="text-rad-400 animate-pulse" />
          </div>
          <div className="absolute inset-0 border-[6px] border-rad-500/30 border-t-rad-400 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase">Synthesizing Exam</h2>
        <p className="text-rad-200 text-sm font-black uppercase tracking-[0.3em] animate-pulse">Gemini Flash Neural Bridge Active</p>
        <div className="mt-12 space-y-4 w-full max-w-xs">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-rad-500 w-1/2 animate-[shimmer_2s_infinite_linear]"></div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generating {config.count} High-Fidelity Questions...</p>
        </div>
      </div>
    );
  }

  if (phase === 'SETUP') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-20 animate-fade-in">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Settings className="text-rad-600" /> Exam Setup
            </h2>
            <div className="px-4 py-2 bg-rad-50 text-rad-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
               Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ListChecks size={14}/> Question Count (Max 50)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[5, 10, 25, 50].map(n => (
                  <button key={n} onClick={() => setConfig({ ...config, count: n })} className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${config.count === n ? 'bg-rad-600 border-rad-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-100'}`}>{n}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Topic</label>
                  <select value={config.category} onChange={e => setConfig({...config, category: e.target.value as any})} className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-rad-400 transition-all">
                    {['All', 'Radiology Basics', 'Safety & ALARA', 'Anatomy Spotters', 'Physics'].map(c => <option key={c}>{c}</option>)}
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</label>
                  <select value={config.difficulty} onChange={e => setConfig({...config, difficulty: e.target.value as any})} className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-rad-400 transition-all">
                    {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
                  </select>
               </div>
            </div>

            <button onClick={startQuiz} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
              Launch Classical Exam
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
          <Sparkles className="absolute -top-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
          <h2 className="text-2xl font-black flex items-center gap-3 mb-2">
            <Sparkles className="text-yellow-400" /> AI Dynamic Generator
          </h2>
          <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-8">Gemini 3 Flash Powered</p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="e.g. Cranial Nerves or Chest X-ray Pathology"
              value={aiTopic}
              onChange={e => setAiTopic(e.target.value)}
              className="w-full p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl placeholder:text-white/40 font-bold outline-none focus:bg-white/20"
            />
            <button 
              onClick={startAiQuiz}
              disabled={isAiLoading || !aiTopic}
              className="w-full bg-white text-indigo-700 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Play size={18} fill="currentColor" /> Generate AI Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'RESULT') {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    return (
      <div className="max-w-md mx-auto text-center space-y-8 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 animate-slide-up">
        <div className="w-32 h-32 mx-auto bg-rad-50 rounded-full flex items-center justify-center text-rad-600 border-8 border-white shadow-xl">
          {percentage >= 70 ? <Trophy size={64} /> : <RefreshCw size={64} />}
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">{percentage >= 70 ? 'EXCELLENT' : 'RETRY'}</h2>
          <div className="text-7xl font-black text-rad-600 my-4">{percentage}%</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{score} Correct Answers</p>
        </div>
        {resultData && (
          <div className="p-6 bg-rad-50 rounded-3xl border border-rad-100">
             <p className="text-xs font-black text-rad-400 uppercase tracking-widest mb-1">XP Progression</p>
             <p className="text-3xl font-black text-rad-700">+{resultData.xp} XP</p>
             {resultData.leveledUp && <p className="text-xs font-black text-yellow-600 mt-2 uppercase animate-bounce">New Level Unlocked! 🌟</p>}
          </div>
        )}
        <div className="flex flex-col gap-3 pt-4">
          <button onClick={() => setPhase('SETUP')} className="w-full py-5 bg-rad-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-rad-700 shadow-xl shadow-rad-100 transition-all">New Round</button>
          <button onClick={onExit} className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest">Dashboard</button>
        </div>
      </div>
    );
  }

  const q = activeQuestions[currentIdx];
  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-mono text-sm shadow-xl">
          {currentIdx + 1} / {activeQuestions.length}
        </div>
        <div className="flex-1 mx-8 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-rad-500 transition-all duration-700 ease-out shadow-lg shadow-rad-200" style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}></div>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Exam</div>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 mb-8 animate-slide-up">
        <h3 className="text-2xl font-black text-slate-800 mb-10 leading-tight">{q.question}</h3>
        <div className="space-y-4">
          {q.options.map((opt, idx) => {
            let style = "border-slate-100 text-slate-600 hover:border-rad-400 hover:bg-rad-50";
            if (showExplanation) {
              if (idx === q.correctIndex) style = "bg-green-500 border-green-500 text-white scale-[1.02] shadow-xl z-10";
              else if (idx === selectedOption) style = "bg-red-500 border-red-500 text-white opacity-50";
              else style = "opacity-20 border-transparent grayscale";
            } else if (idx === selectedOption) style = "border-rad-600 bg-rad-50 ring-4 ring-rad-100";

            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={showExplanation} className={`w-full text-left p-6 rounded-2xl border-2 font-bold transition-all flex justify-between items-center gap-4 ${style}`}>
                <span className="text-sm md:text-base">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] mb-10 animate-fade-in shadow-2xl border-l-8 border-rad-500">
          <h4 className="flex items-center gap-2 text-rad-400 font-black text-[10px] uppercase mb-4 tracking-[0.4em]">
            Physics Rationale
          </h4>
          <p className="text-base font-medium leading-relaxed opacity-90">{q.explanation}</p>
          <button onClick={nextQuestion} className="mt-10 w-full py-5 bg-rad-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-rad-500 flex items-center justify-center gap-3 shadow-xl">
            {currentIdx === activeQuestions.length - 1 ? "Complete Exam" : "Next Question"} <Play size={18} fill="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
