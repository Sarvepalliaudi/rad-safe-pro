
import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizCategory, Difficulty, UserProfile } from '../types';
import { CheckCircle, XCircle, RefreshCw, HelpCircle, Settings, Play, Trophy, BarChart2, Star } from 'lucide-react';
import { getUserProfile, saveQuizResult } from '../services/userService';

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
  
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [resultData, setResultData] = useState<{ xp: number, leveledUp: boolean } | null>(null);

  useEffect(() => {
    // Refresh profile whenever we enter SETUP or STATS
    if (phase === 'SETUP' || phase === 'STATS') {
      setUserProfile(getUserProfile());
    }
  }, [phase]);

  // Setup Handlers
  const startQuiz = () => {
    let filtered = allQuestions.filter(q => q.difficulty === config.difficulty);
    
    if (config.category !== 'All') {
      filtered = filtered.filter(q => q.category === config.category);
    }
    
    // Shuffle and slice
    filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, config.count);
    
    if (filtered.length === 0) {
      alert(`No ${config.difficulty} questions found for ${config.category} yet! Try a different combo.`);
      return;
    }

    setActiveQuestions(filtered);
    setPhase('ACTIVE');
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setResultData(null);
  };

  // Quiz Logic
  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === activeQuestions[currentIdx].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(curr => curr + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const { xpGained, leveledUp } = saveQuizResult(score, activeQuestions.length, config.category, config.difficulty);
    setResultData({ xp: xpGained, leveledUp });
    setPhase('RESULT');
  };

  // Setup Screen
  if (phase === 'SETUP') {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <Settings size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Quiz Setup</h2>
          </div>
          <button 
            onClick={() => setPhase('STATS')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 text-sm font-medium"
          >
            <BarChart2 size={16} /> My Stats
          </button>
        </div>

        <div className="space-y-6">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 uppercase mb-2">Select Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => setConfig({ ...config, difficulty: diff })}
                  className={`px-2 py-3 rounded-lg text-center text-sm font-bold transition-all border-2 ${
                    config.difficulty === diff 
                      ? diff === 'Beginner' ? 'bg-green-50 border-green-500 text-green-700'
                      : diff === 'Intermediate' ? 'bg-orange-50 border-orange-500 text-orange-700'
                      : 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-gray-200 text-slate-400 hover:border-gray-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 uppercase mb-2">Select Category</label>
            <div className="grid grid-cols-1 gap-2">
              {['All', 'Radiology Basics', 'Safety & ALARA', 'Anatomy Spotters', 'Physics', 'Modalities', 'Positioning'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setConfig({ ...config, category: cat as QuizCategory })}
                  className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors border ${
                    config.category === cat 
                      ? 'bg-rad-50 border-rad-500 text-rad-700' 
                      : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 uppercase mb-2">Number of Questions</label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 20, 25, 50].map(num => (
                <button
                  key={num}
                  onClick={() => setConfig({ ...config, count: num })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    config.count === num
                      ? 'bg-rad-600 text-white border-rad-600'
                      : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={startQuiz}
            className="w-full bg-rad-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-rad-700 shadow-lg shadow-rad-200 flex items-center justify-center gap-2 mt-4"
          >
            Start Quiz <Play size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    );
  }

  // Stats Screen
  if (phase === 'STATS') {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Trophy className="text-yellow-500"/> Student Profile</h2>
           <button onClick={() => setPhase('SETUP')} className="text-rad-600 font-medium hover:underline">Back to Setup</button>
         </div>

         <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-rad-100 rounded-full flex items-center justify-center text-rad-600 font-black text-3xl border-4 border-rad-200">
              {userProfile.level}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">Level {userProfile.level}</span>
                <span className="text-rad-600">{userProfile.currentXp} / {userProfile.nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                 <div className="bg-rad-500 h-full transition-all" style={{ width: `${(userProfile.currentXp / userProfile.nextLevelXp) * 100}%`}}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Total Career XP: {userProfile.totalXp}</p>
            </div>
         </div>

         <h3 className="font-bold text-slate-800 mb-4">Recent History</h3>
         <div className="space-y-3 max-h-96 overflow-y-auto">
           {userProfile.history.length === 0 ? (
             <p className="text-slate-400 text-center py-8">No quizzes taken yet.</p>
           ) : (
             userProfile.history.map((h) => (
               <div key={h.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-gray-100">
                 <div>
                   <div className="font-semibold text-slate-700">{h.category}</div>
                   <div className="text-xs text-slate-500 flex gap-2">
                     <span className={`${h.difficulty === 'Advanced' ? 'text-red-500' : h.difficulty === 'Intermediate' ? 'text-orange-500' : 'text-green-600'}`}>{h.difficulty}</span>
                     <span>•</span>
                     <span>{new Date(h.date).toLocaleDateString()}</span>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="font-bold text-slate-800">{h.score}/{h.totalQuestions}</div>
                   <div className="text-xs text-rad-500 font-medium">+{h.xpEarned} XP</div>
                 </div>
               </div>
             ))
           )}
         </div>
      </div>
    )
  }

  // Result Screen
  if (phase === 'RESULT') {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    return (
      <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className={`inline-flex p-6 rounded-full mb-2 ${percentage >= 70 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
          {percentage >= 70 ? <CheckCircle size={48} /> : <RefreshCw size={48} />}
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{percentage >= 70 ? 'Great Job!' : 'Keep Practicing!'}</h2>
          <p className="text-slate-500 mt-2">You scored</p>
          <div className="text-5xl font-black text-rad-600 my-2">{percentage}%</div>
          <p className="text-sm text-slate-400">{score} out of {activeQuestions.length} correct</p>
        </div>

        {resultData && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl animate-bounce-slow">
            <div className="flex justify-center items-center gap-2 font-bold text-yellow-800">
              <Star fill="currentColor" /> +{resultData.xp} XP Earned
            </div>
            {resultData.leveledUp && (
              <div className="text-purple-600 font-black uppercase text-sm mt-1">
                🎉 Level Up! You are now Level {userProfile.level + 1}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <button onClick={() => setPhase('SETUP')} className="w-full py-3 bg-rad-600 text-white rounded-xl font-bold hover:bg-rad-700">
            Take Another Quiz
          </button>
          <button onClick={onExit} className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Active Quiz
  const q = activeQuestions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-slate-500">
          Question {currentIdx + 1} / {activeQuestions.length}
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-rad-100 text-rad-700 rounded-full text-xs font-bold uppercase">{q.category}</span>
           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
             q.difficulty === 'Advanced' ? 'bg-red-100 text-red-700' :
             q.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700' :
             'bg-green-100 text-green-700'
           }`}>{q.difficulty}</span>
        </div>
      </div>

      <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
        <div 
          className="bg-rad-500 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{q.question}</h3>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let style = "border-gray-200 hover:bg-gray-50";
            if (showExplanation) {
              if (idx === q.correctIndex) style = "border-green-500 bg-green-50 text-green-800";
              else if (idx === selectedOption) style = "border-red-300 bg-red-50 text-red-800 opacity-60";
              else style = "border-gray-100 text-slate-300";
            } else if (idx === selectedOption) {
              style = "border-rad-500 bg-rad-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${style} flex justify-between items-center`}
              >
                <span>{opt}</span>
                {showExplanation && idx === q.correctIndex && <CheckCircle size={20} className="text-green-600 shrink-0" />}
                {showExplanation && idx === selectedOption && idx !== q.correctIndex && <XCircle size={20} className="text-red-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 animate-fade-in">
          <p className="font-bold text-blue-900 mb-1 flex items-center gap-2">
            <HelpCircle size={16} /> Explanation
          </p>
          <p className="text-blue-800 text-sm leading-relaxed">{q.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {showExplanation && (
          <button 
            onClick={nextQuestion}
            className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors flex items-center gap-2"
          >
            {currentIdx === activeQuestions.length - 1 ? "See Results" : "Next"} <Play size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
