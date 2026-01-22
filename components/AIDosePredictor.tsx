
import React, { useState } from 'react';
import { generateDosePrediction } from '../services/geminiService';
import { BrainCircuit, Loader2, AlertTriangle, Sparkles, CheckCircle2, User as UserIcon } from 'lucide-react';

const AIDosePredictor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    weight: '',
    modality: 'CT Scan',
    bodyPart: 'Chest'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const [text] = await Promise.all([
        generateDosePrediction(
          formData.age,
          formData.gender,
          formData.modality,
          formData.bodyPart,
          formData.weight
        ),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      setResult(text);
    } catch (error) {
      setResult("AI Core unreachable. Check API configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-purple-600 text-white rounded-[1.5rem] shadow-xl shadow-purple-200">
           <BrainCircuit size={32} className={loading ? 'animate-pulse' : ''} />
        </div>
        <div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight">AI DOSE PREDICTOR</h2>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Clinical Dose Simulation • Gemini Neural Core</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Imaging Modality</label>
              <select name="modality" value={formData.modality} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 transition-all outline-none">
                <option>CT Scan</option>
                <option>X-Ray (Radiography)</option>
                <option>Fluoroscopy</option>
                <option>Mammography</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Anatomy</label>
              <select name="bodyPart" value={formData.bodyPart} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none">
                <option>Head</option>
                <option>Chest</option>
                <option>Abdomen</option>
                <option>Pelvis</option>
                <option>Spine</option>
                <option>Extremities</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Gender</label>
              <div className="grid grid-cols-2 gap-2">
                {['Male', 'Female'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`py-3 rounded-xl text-xs font-black uppercase border-2 transition-all ${formData.gender === g ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-100'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age (Yrs)</label>
                <input required name="age" type="number" value={formData.age} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none" placeholder="25" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight (Kg)</label>
                <input required name="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none" placeholder="70" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black disabled:opacity-50 flex justify-center items-center gap-2 transition-all shadow-xl active:scale-95">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? 'Analyzing...' : 'Predict Dose'}
            </button>
          </form>
          
          <div className="mt-6 p-6 bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl flex gap-3">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase">
              Educational simulation only. Not for clinical diagnostic use. Values are estimates based on standard physics protocols.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          {loading ? (
             <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-50 h-full flex flex-col items-center justify-center space-y-6 text-center animate-pulse">
                <div className="relative">
                  <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center">
                     <BrainCircuit size={48} className="text-purple-300" />
                  </div>
                  <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-800 mb-1 uppercase tracking-tighter">AI Analysis in Progress</h3>
                   <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Consulting Medical Physics Dataset...</p>
                </div>
             </div>
          ) : result ? (
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 h-full animate-slide-up relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <CheckCircle2 size={120} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Sparkles size={24} className="text-purple-600" />
                Dose Analysis Summary
              </h3>
              <div className="space-y-4">
                 {result.split('\n').filter(Boolean).map((line, i) => (
                    <div key={i} className={`p-5 rounded-2xl ${line.includes('Dose Range') || line.includes('mSv') ? 'bg-purple-600 text-white font-black text-lg shadow-lg' : 'bg-slate-50 border border-slate-100 font-medium text-slate-700'}`}>
                      {line.replace(/\*\*/g, '')}
                    </div>
                 ))}
              </div>
            </div>
          ) : (
             <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-[3rem] h-full min-h-[450px] flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                <UserIcon size={64} className="mb-6 opacity-10" />
                <h3 className="text-xl font-black opacity-30">AWAITING INPUT</h3>
                <p className="text-xs font-bold uppercase tracking-widest opacity-20 mt-2">Enter patient clinical parameters to initiate AI Dose logic</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDosePredictor;
