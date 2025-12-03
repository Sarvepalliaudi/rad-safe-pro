import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SPOTTERS_DATA } from '../constants';

const Spotters: React.FC = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const toggleReveal = (id: number) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
           <Eye size={28} />
        </div>
        <div>
           <h2 className="text-3xl font-bold text-slate-800">Anatomy Spotters</h2>
           <p className="text-slate-500">Practice identifying anatomical structures</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SPOTTERS_DATA.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative bg-black h-80 w-full flex items-center justify-center overflow-hidden">
              {/* Image */}
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              
              {/* Overlay labels */}
              {revealed[item.id] && item.labels.map((label, idx) => (
                <div 
                  key={idx}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${label.x}%`, top: `${label.y}%` }}
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                  <span className="mt-1 px-2 py-0.5 bg-black bg-opacity-75 text-white text-xs rounded whitespace-nowrap">
                    {label.text}
                  </span>
                </div>
              ))}
              
              {!revealed[item.id] && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => toggleReveal(item.id)}
                      className="px-4 py-2 bg-black bg-opacity-60 text-white rounded-lg hover:bg-opacity-80 transition-all backdrop-blur-sm border border-white/20"
                    >
                      Reveal Labels
                    </button>
                 </div>
              )}
            </div>
            
            <div className="p-4 flex justify-between items-center bg-gray-50 border-t border-gray-100">
              <h3 className="font-bold text-slate-700">{item.title}</h3>
              <button 
                onClick={() => toggleReveal(item.id)}
                className="text-sm font-medium text-rad-600 flex items-center gap-1 hover:text-rad-800"
              >
                {revealed[item.id] ? <><EyeOff size={16}/> Hide Labels</> : <><Eye size={16}/> Show Labels</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spotters;
