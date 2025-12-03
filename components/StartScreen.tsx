import React from 'react';
import { Radiation, Activity, Scan, ChevronRight } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-10 left-10 transform rotate-12"><Scan size={120} /></div>
        <div className="absolute bottom-20 right-10 transform -rotate-12"><Radiation size={150} /></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><Activity size={300} /></div>
      </div>

      <div className="z-10 text-center space-y-8 max-w-md w-full">
        <div className="bg-gradient-to-br from-rad-500 to-rad-700 w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-lg shadow-rad-500/30 mb-4 animate-bounce-slow">
          <Radiation size={48} className="text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            RAD SAFE PRO
          </h1>
          <p className="text-rad-300 text-lg font-medium">Radiology & Allied Health Sciences</p>
          <p className="text-slate-400 text-sm mt-2">Your Smart Learning & Safety Assistant</p>
        </div>

        <div className="space-y-4 pt-8">
          <button 
            onClick={onStart}
            className="w-full bg-rad-500 hover:bg-rad-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all hover:scale-105 hover:shadow-rad-500/50 flex items-center justify-center gap-3"
          >
            START APPLICATION <ChevronRight size={20} />
          </button>
          
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-8">Mobile First • AI Powered</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;