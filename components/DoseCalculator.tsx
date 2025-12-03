import React, { useState } from 'react';
import { CalculatorType } from '../types';
import { Calculator, Zap, Shield, Clock, Ruler } from 'lucide-react';

const DoseCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>(CalculatorType.INVERSE_SQUARE);
  const [result, setResult] = useState<{val: number, unit: string} | null>(null);

  // Inputs
  const [inputs, setInputs] = useState<any>({});

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
          unit = 'mR';
        }
        break;
      case CalculatorType.MAS_RECIPROCITY:
        if (inputs.ma && inputs.s) {
          res = inputs.ma * inputs.s;
          unit = 'mAs';
        }
        break;
      case CalculatorType.EXPOSURE_TIME:
        if (inputs.mas && inputs.ma) {
          // s = mAs / mA
          res = inputs.mas / inputs.ma;
          unit = 'seconds';
        }
        break;
      case CalculatorType.SHIELDING:
        if (inputs.i0 && inputs.hvl && inputs.x) {
          // I = I0 * (0.5)^(x/HVL)
          res = inputs.i0 * Math.pow(0.5, inputs.x / inputs.hvl);
          unit = 'mR';
        }
        break;
    }
    setResult({ val: parseFloat(res.toFixed(3)), unit });
  };

  const tabs = [
    { id: CalculatorType.INVERSE_SQUARE, label: 'Inv. Square', icon: <Ruler size={16}/> },
    { id: CalculatorType.MAS_RECIPROCITY, label: 'mAs Calc', icon: <Zap size={16}/> },
    { id: CalculatorType.EXPOSURE_TIME, label: 'Time', icon: <Clock size={16}/> },
    { id: CalculatorType.SHIELDING, label: 'Shielding', icon: <Shield size={16}/> },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-200 p-2 flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); setInputs({}); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-rad-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {activeTab === CalculatorType.INVERSE_SQUARE && (
            <div className="space-y-4">
               <h3 className="font-bold text-lg">Inverse Square Law</h3>
               <p className="text-sm text-slate-500">Calculate intensity change with distance.</p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <input type="number" placeholder="I1 (Initial Intensity)" className="p-3 border rounded-lg" onChange={e => handleInput('i1', e.target.value)}/>
                 <input type="number" placeholder="D1 (Initial Dist)" className="p-3 border rounded-lg" onChange={e => handleInput('d1', e.target.value)}/>
                 <input type="number" placeholder="D2 (New Dist)" className="p-3 border rounded-lg" onChange={e => handleInput('d2', e.target.value)}/>
               </div>
            </div>
          )}

          {activeTab === CalculatorType.MAS_RECIPROCITY && (
             <div className="space-y-4">
               <h3 className="font-bold text-lg">mAs Calculator</h3>
               <p className="text-sm text-slate-500">Calculate total mAs from mA and Time.</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="number" placeholder="mA" className="p-3 border rounded-lg" onChange={e => handleInput('ma', e.target.value)}/>
                 <input type="number" placeholder="Seconds" className="p-3 border rounded-lg" onChange={e => handleInput('s', e.target.value)}/>
               </div>
            </div>
          )}

          {activeTab === CalculatorType.EXPOSURE_TIME && (
             <div className="space-y-4">
               <h3 className="font-bold text-lg">Exposure Time</h3>
               <p className="text-sm text-slate-500">Calculate required time for a desired mAs.</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="number" placeholder="Target mAs" className="p-3 border rounded-lg" onChange={e => handleInput('mas', e.target.value)}/>
                 <input type="number" placeholder="mA Setting" className="p-3 border rounded-lg" onChange={e => handleInput('ma', e.target.value)}/>
               </div>
            </div>
          )}

          {activeTab === CalculatorType.SHIELDING && (
             <div className="space-y-4">
               <h3 className="font-bold text-lg">Shielding Attenuation</h3>
               <p className="text-sm text-slate-500">Calculate remaining intensity after shielding.</p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <input type="number" placeholder="I0 (Initial)" className="p-3 border rounded-lg" onChange={e => handleInput('i0', e.target.value)}/>
                 <input type="number" placeholder="HVL (Half Value Layer mm)" className="p-3 border rounded-lg" onChange={e => handleInput('hvl', e.target.value)}/>
                 <input type="number" placeholder="Shield Thickness (mm)" className="p-3 border rounded-lg" onChange={e => handleInput('x', e.target.value)}/>
               </div>
            </div>
          )}

          <div className="mt-8">
            <button 
              onClick={calculate}
              className="w-full bg-rad-600 text-white py-3 rounded-xl font-bold hover:bg-rad-700 transition-colors"
            >
              Calculate
            </button>
          </div>

          {result && (
            <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center animate-fade-in">
              <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Result</p>
              <p className="text-4xl font-black text-slate-800 mt-2">
                {result.val} <span className="text-xl text-slate-500 font-medium">{result.unit}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoseCalculator;