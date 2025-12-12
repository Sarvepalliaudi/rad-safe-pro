
import React, { useState } from 'react';
import { CalculatorType } from '../types';
import { Calculator, Zap, Shield, Clock, Ruler, ArrowRightLeft } from 'lucide-react';

const DoseCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>(CalculatorType.INVERSE_SQUARE);
  const [result, setResult] = useState<{val: number, unit: string} | null>(null);

  // Unit Selection State
  const [selectedUnit, setSelectedUnit] = useState<string>('mR');
  const [convFrom, setConvFrom] = useState<string>('mSv');
  const [convTo, setConvTo] = useState<string>('mGy');

  const unitsList = ['mR', 'R', 'mGy', 'Gy', 'mSv', 'Sv'];

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
          unit = selectedUnit;
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
          unit = selectedUnit;
        }
        break;
      case CalculatorType.UNIT_CONVERTER:
        if (inputs.val) {
             // Base unit: mGy (Air Kerma) for standardized math
             // Assumptions: 
             // 1 R = 0.877 cGy = 8.77 mGy (Air Kerma)
             // 1 Sv = 1 Gy (Wr=1 assumption for X-ray/Gamma in diagnostics)
             // 1 mGy = 1 mSv (Wr=1)
             const factors: Record<string, number> = {
                'mGy': 1,
                'Gy': 1000,
                'mSv': 1, 
                'Sv': 1000,
                'mR': 0.00877,
                'R': 8.77
             };
             
             // Convert Input to mGy
             const valInmGy = inputs.val * factors[convFrom];
             // Convert mGy to Target
             res = valInmGy / factors[convTo];
             unit = convTo;
        }
        break;
    }
    setResult({ val: parseFloat(res.toFixed(4)), unit });
  };

  const tabs = [
    { id: CalculatorType.INVERSE_SQUARE, label: 'Inv. Square', icon: <Ruler size={16}/> },
    { id: CalculatorType.MAS_RECIPROCITY, label: 'mAs Calc', icon: <Zap size={16}/> },
    { id: CalculatorType.EXPOSURE_TIME, label: 'Time', icon: <Clock size={16}/> },
    { id: CalculatorType.SHIELDING, label: 'Shielding', icon: <Shield size={16}/> },
    { id: CalculatorType.UNIT_CONVERTER, label: 'Converter', icon: <ArrowRightLeft size={16}/> },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-200 p-2 flex overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); setInputs({}); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
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
               <div className="flex justify-between items-start">
                 <div>
                   <h3 className="font-bold text-lg">Inverse Square Law</h3>
                   <p className="text-sm text-slate-500">Calculate intensity change with distance.</p>
                 </div>
                 <div className="flex flex-col items-end">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Unit</label>
                    <select 
                      value={selectedUnit} 
                      onChange={e => setSelectedUnit(e.target.value)}
                      className="bg-slate-100 border-none text-sm font-bold text-rad-700 rounded-lg p-2 focus:ring-2 focus:ring-rad-400 outline-none"
                    >
                      {unitsList.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="relative">
                   <input type="number" placeholder="I1 (Intensity)" className="w-full p-3 border rounded-lg" onChange={e => handleInput('i1', e.target.value)}/>
                   <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">{selectedUnit}</span>
                 </div>
                 <div className="relative">
                   <input type="number" placeholder="D1 (Initial Dist)" className="w-full p-3 border rounded-lg" onChange={e => handleInput('d1', e.target.value)}/>
                   <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">m</span>
                 </div>
                 <div className="relative">
                   <input type="number" placeholder="D2 (New Dist)" className="w-full p-3 border rounded-lg" onChange={e => handleInput('d2', e.target.value)}/>
                   <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">m</span>
                 </div>
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
               <div className="flex justify-between items-start">
                 <div>
                   <h3 className="font-bold text-lg">Shielding Attenuation</h3>
                   <p className="text-sm text-slate-500">Calculate remaining intensity after shielding.</p>
                 </div>
                 <div className="flex flex-col items-end">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Unit</label>
                    <select 
                      value={selectedUnit} 
                      onChange={e => setSelectedUnit(e.target.value)}
                      className="bg-slate-100 border-none text-sm font-bold text-rad-700 rounded-lg p-2 focus:ring-2 focus:ring-rad-400 outline-none"
                    >
                      {unitsList.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="relative">
                   <input type="number" placeholder="I0 (Initial)" className="w-full p-3 border rounded-lg" onChange={e => handleInput('i0', e.target.value)}/>
                   <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">{selectedUnit}</span>
                 </div>
                 <input type="number" placeholder="HVL (Half Value Layer mm)" className="p-3 border rounded-lg" onChange={e => handleInput('hvl', e.target.value)}/>
                 <input type="number" placeholder="Shield Thickness (mm)" className="p-3 border rounded-lg" onChange={e => handleInput('x', e.target.value)}/>
               </div>
            </div>
          )}

          {activeTab === CalculatorType.UNIT_CONVERTER && (
             <div className="space-y-4">
               <h3 className="font-bold text-lg">Dose Unit Converter</h3>
               <p className="text-sm text-slate-500">Convert between Exposure (R), Air Kerma (Gy), and Effective Dose (Sv).</p>
               <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100 mb-2">
                 <strong>Note:</strong> Conversions assume diagnostic X-ray energy range. 
                 <br/>• 1 R ≈ 8.77 mGy (Air Kerma)
                 <br/>• 1 Gy ≈ 1 Sv (Weighting Factor = 1)
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Value</label>
                    <input type="number" placeholder="0.00" className="w-full p-3 border rounded-lg" onChange={e => handleInput('val', e.target.value)}/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From</label>
                    <select 
                      value={convFrom} 
                      onChange={e => setConvFrom(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white"
                    >
                      {unitsList.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                 </div>
                 <div className="flex justify-center items-center pb-3 text-slate-300">
                    <ArrowRightLeft />
                 </div>
                 <div className="md:col-span-1 md:col-start-3 md:row-start-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To</label>
                    <select 
                      value={convTo} 
                      onChange={e => setConvTo(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white"
                    >
                      {unitsList.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                 </div>
               </div>
            </div>
          )}

          <div className="mt-8">
            <button 
              onClick={calculate}
              className="w-full bg-rad-600 text-white py-3 rounded-xl font-bold hover:bg-rad-700 transition-colors shadow-lg shadow-rad-200"
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
