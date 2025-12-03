import React, { useState } from 'react';
import { generateDosePrediction } from '../services/geminiService';
import { BrainCircuit, Loader2, AlertTriangle } from 'lucide-react';

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
      const text = await generateDosePrediction(
        formData.age,
        formData.gender,
        formData.modality,
        formData.bodyPart,
        formData.weight
      );
      setResult(text);
    } catch (error) {
      setResult("An error occurred while communicating with the AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
           <BrainCircuit size={28} />
        </div>
        <div>
           <h2 className="text-3xl font-bold text-slate-800">AI Dose Predictor & Safety Check</h2>
           <p className="text-slate-500">Simulate patient scenarios to learn about dose variables and specific safety protocols.</p>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
        <div className="flex gap-3">
          <AlertTriangle className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Educational Use Only:</strong> This tool uses AI to estimate doses and provide safety context for learning purposes. Do not use for actual clinical dosimetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-semibold text-slate-700 mb-2">Patient Parameters</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Modality</label>
              <select name="modality" value={formData.modality} onChange={handleChange} className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                <option>CT Scan</option>
                <option>X-Ray</option>
                <option>Fluoroscopy</option>
                <option>Mammography</option>
                <option>Nuclear Medicine</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Body Region</label>
              <select name="bodyPart" value={formData.bodyPart} onChange={handleChange} className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                <option>Head</option>
                <option>Chest</option>
                <option>Abdomen/Pelvis</option>
                <option>Spine</option>
                <option>Extremities</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Age (yrs)</label>
                <input required name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. 45" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Weight (kg)</label>
                <input required name="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. 70" />
              </div>
            </div>

            <div>
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Gender</label>
               <div className="flex gap-4">
                 <label className="flex items-center text-sm gap-2">
                   <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="text-purple-600" /> Male
                 </label>
                 <label className="flex items-center text-sm gap-2">
                   <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="text-purple-600" /> Female
                 </label>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-70 flex justify-center items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? 'Analyzing...' : 'Generate Prediction'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 h-full animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BrainCircuit size={20} className="text-purple-500" />
                AI Analysis Result
              </h3>
              <div className="prose prose-sm prose-slate max-w-none">
                 {result.split('\n').map((line, i) => (
                    <p key={i} className={`mb-2 ${line.includes('Estimated Dose Range') ? 'font-bold text-lg text-purple-700 bg-purple-50 p-2 rounded' : ''}`}>
                      {line.replace(/\*\*(.*?)\*\*/g, (_, p1) => `<strong>${p1}</strong>`).split(/<strong>(.*?)<\/strong>/g).map((part, index) => 
                        index % 2 === 1 ? <strong key={index} className="font-bold text-slate-900">{part}</strong> : part
                    )}
                    </p>
                 ))}
              </div>
            </div>
          ) : (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400">
                <BrainCircuit size={48} className="mb-4 opacity-20" />
                <p>Enter patient details to see dose prediction</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDosePredictor;
