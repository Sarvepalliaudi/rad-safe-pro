
import React, { useState } from 'react';
import { CalculatorType } from '../types';
import { Calculator, Zap, Shield, Clock, Ruler, ArrowRightLeft, Info } from 'lucide-react';

const DoseCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>(CalculatorType.INVERSE_SQUARE);
  const [result, setResult] = useState<{val: number, unit: string} | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('mR');
  const [convFrom, setConvFrom] = useState<string>('mSv');
  const [convTo, setConvTo] = useState<string>('mGy');
  const [inputs, setInputs] = useState<any>({});

  const unitsList = ['mR', 'R', 'mGy', 'Gy', 'mSv', 'Sv'];

  const handleInput = (key: string, val: string) => {
    setInputs({ ...inputs, [key]: parseFloat(val) });
  };

  const calculate = () => {
    let res = 0;
    let unit = '';

    switch (activeTab) {
      case CalculatorType.INVERSE_SQUARE:
        if (inputs.i1 && inputs.d1 && inputs.d2) {
          // I2 = I1 * (D1/D2)^2
          res = inputs.i1 * Math.pow(inputs.d1 / inputs.d2, 2);
          unit = selectedUnit;
        }
        break;
      case CalculatorType.MAS_RECIPROCITY:
        if (inputs.ma && inputs.s) {
          // mAs = mA * s
          res = inputs.ma * inputs.s;
          unit = 'mAs';
        }
        break;
      case CalculatorType.EXPOSURE_TIME:
        if (inputs.mas && inputs.ma) {
          // s = mAs / mA
          res = inputs.mas / inputs.ma;
          unit = 'sec';
        }
        break;
      case CalculatorType.SHIELDING:
        if (inputs.i0 && inputs.hvl && inputs.x) {
          // I = I0 * (0.5)^(x/HVL) - Exponential Attenuation
          res = inputs.i0 * Math.pow(0.5, inputs.x / inputs.hvl);
          unit = selectedUnit;
        }
        break;
      case CalculatorType.UNIT_CONVERTER:
        if (inputs.val) {
             const factors: Record<string, number> = {
                'mGy': 1,
                'Gy': 1000,
                'mSv': 1, 
                'Sv': 1000,
                'mR': 0.00877,
                'R': 8.77
             };
             const valInmGy = inputs.val * factors[convFrom];
             res = valInmGy / factors[convTo];
             unit = convTo;
        }
        break;
    }
    setResult({ val: parseFloat(res.toFixed(5)), unit });
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4 md:px-0">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-100 p-2 flex overflow-x-auto hide-scrollbar whitespace-nowrap">
          {[
            { id: CalculatorType.INVERSE_SQUARE, label: 'Inv. Square', icon: <Ruler size={16}/> },
            { id: CalculatorType.MAS_RECIPROCITY, label: 'mAs Calc', icon: <Zap size={16}/> },
            { id: CalculatorType.EXPOSURE_TIME, label: 'Time', icon: <Clock size={16}/> },
            { id: CalculatorType.SHIELDING, label: 'Shielding', icon: <Shield size={16}/> },
            { id: CalculatorType.UNIT_CONVERTER, label: 'Converter', icon: <ArrowRightLeft size={16}/> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); setInputs({}); }}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id ? 'bg-white text-rad-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-10">
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-black text-slate-800">
              {activeTab === CalculatorType.INVERSE_SQUARE && "Inverse Square Law"}
              {activeTab === CalculatorType.MAS_RECIPROCITY && "mAs Reciprocity"}
              {activeTab === CalculatorType.EXPOSURE_TIME && "Time / mA Control"}
              {activeTab === CalculatorType.SHIELDING && "Attenuation & HVL"}
              {activeTab === CalculatorType.UNIT_CONVERTER && "Scientific Unit Bridge"}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-2">Precision clinical physics modeling engine v3.1</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTab === CalculatorType.INVERSE_SQUARE && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Intensity (I1)</label>
                    <input type="number" inputMode="decimal" className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-lg outline-none border border-transparent focus:border-rad-300 focus:bg-white transition-all" onChange={e => handleInput('i1', e.target.value)}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Dist 1 (D1)</label>
                    <input type="number" inputMode="decimal" className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-lg outline-none border border-transparent focus:border-rad-300 focus:bg-white transition-all" onChange={e => handleInput('d1', e.target.value)}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Dist 2 (D2)</label>
                    <input type="number" inputMode="decimal" className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-lg outline-none border border-transparent focus:border-rad-300 focus:bg-white transition-all" onChange={e => handleInput('d2', e.target.value)}/>
                  </div>
                </>
              )}

              {activeTab === CalculatorType.MAS_RECIPROCITY && (
                <>
                  <div className="space-y-1 col-span-1 md:col-span-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Milliampere (mA)</label>
                    <input type="number" inputMode="decimal" className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-lg outline-none border border-transparent focus:border-rad-300 focus:bg-white transition-all" onChange={e => handleInput('ma', e.target.value)}/>
                  </div>
                  <div className="space-y-1 col-span-1 md:col-span-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Seconds (s)</label>
                    <input type="number" inputMode="decimal" className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-lg outline-none border border-transparent focus:border-rad-300 focus:bg-white transition-all" onChange={e => handleInput('s', e.target.value)}/>
                  </div>
                </>
              )}

              {activeTab === CalculatorType.SHIELDING && (
                <>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400">Initial (I₀)</label>
                     <input type="number" inputMode="decimal" className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-lg outline-none border border-transparent focus:border-rad-300 focus:bg-white transition-all" onChange={e => handleInput('i0', e.target.value)}/>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400">HVL (mm)</label>
                     <input type="number" inputMode="decimal" className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-lg outline-none border border-transparent focus:border-rad-300 focus:bg-white transition-all" onChange={e => handleInput('hvl', e.target.value)}/>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400">Thickness (x)</label>
                     <input type="number" inputMode="decimal" className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-lg outline-none border border-transparent focus:border-rad-300 focus:bg-white transition-all" onChange={e => handleInput('x', e.target.value)}/>
                   </div>
                </>
              )}
            </div>

            <button onClick={calculate} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-[0.98]">
              Execute Calculation
            </button>

            {result && (
              <div className="mt-8 p-8 md:p-10 bg-rad-600 rounded-[2rem] text-white text-center shadow-2xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Final Magnitude</p>
                <div className="text-4xl md:text-6xl font-black">{result.val} <span className="text-lg md:text-xl opacity-60 font-medium">{result.unit}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoseCalculator;
