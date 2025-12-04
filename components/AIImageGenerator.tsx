
import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Download, AlertTriangle, Sparkles } from 'lucide-react';
import { generateRadiologyImage } from '../services/geminiService';
import { getUserProfile } from '../services/userService';

const AIImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K'>('1K');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const user = getUserProfile();

  // If user is not Pro (e.g. didn't log in with Google), show strict gate
  if (!user.isPro && user.role !== 'officer') { // Officers get it too for demo
    return (
      <div className="max-w-2xl mx-auto text-center p-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ImageIcon size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pro Feature Locked</h2>
        <p className="text-slate-500 mb-6">The AI Image Lab (Nano Banana Model) is available for Pro Users only.</p>
        <div className="p-4 bg-purple-50 text-purple-700 rounded-xl inline-block font-medium">
           Sign in with Google to unlock this feature for free!
        </div>
      </div>
    );
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateRadiologyImage(prompt, size);
      setGeneratedImage(imageUrl);
    } catch (err) {
      alert("Failed to generate image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-100 text-pink-600 rounded-lg">
           <Sparkles size={28} />
        </div>
        <div>
           <h2 className="text-3xl font-bold text-slate-800">AI Image Lab</h2>
           <p className="text-slate-500">Generate anatomical diagrams and pathology examples using Gemini 3 Pro.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Image Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A clear diagram of a greenstick fracture in a child's radius"
                className="w-full p-3 border border-gray-200 rounded-xl h-32 text-sm focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                required
              />
              <p className="text-[10px] text-slate-400 mt-2">Be specific about anatomy and pathology.</p>
            </div>

            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Resolution</label>
               <div className="flex gap-2">
                 <button type="button" onClick={() => setSize('1K')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${size === '1K' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-gray-200 text-slate-500'}`}>1K</button>
                 <button type="button" onClick={() => setSize('2K')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${size === '2K' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-gray-200 text-slate-500'}`}>2K</button>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
            <div className="flex gap-2 mb-1 font-bold text-slate-700"><AlertTriangle size={14}/> Disclaimer</div>
            AI generated images are for educational reference only and may not be anatomically perfect.
          </div>
        </div>

        {/* Display */}
        <div className="lg:col-span-2">
          <div className="bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 h-96 flex items-center justify-center overflow-hidden relative group">
            {loading ? (
              <div className="text-center">
                <Loader2 size={48} className="animate-spin text-pink-500 mx-auto mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Dreaming up pixels...</p>
              </div>
            ) : generatedImage ? (
              <>
                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain bg-black" />
                <a 
                  href={generatedImage} 
                  download={`rad-ai-gen-${Date.now()}.png`}
                  className="absolute bottom-4 right-4 bg-white text-slate-800 px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download size={16} /> Save Image
                </a>
              </>
            ) : (
              <div className="text-center text-slate-400">
                <ImageIcon size={64} className="mx-auto mb-4 opacity-30" />
                <p>Result will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageGenerator;
