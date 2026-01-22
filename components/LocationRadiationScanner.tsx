import React, { useState, useRef, useEffect } from 'react';
import { 
  Navigation, Signal, Radar, Crosshair, MapPin as MapPinIcon, 
  Globe, Activity, Zap, ExternalLink, AlertTriangle, XCircle, Bot, Loader2,
  Navigation2, Satellite, Map as MapIcon, Search, Building2, Hospital
} from 'lucide-react';
import { getGeographicRadiationProfile } from '../services/geminiService';

const LocationRadiationScanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [links, setLinks] = useState<{ uri: string; title: string }[]>([]);
  const [risk, setRisk] = useState<'LOW' | 'MODERATE' | 'HIGH'>('LOW');
  
  const abortRef = useRef<boolean>(false);

  const startScan = () => {
    abortRef.current = false;
    setLoading(true);
    setLoadingStep('Locking Satellite Link...');
    setReport(null);
    setLinks([]);
    setPlaceName(null);

    if (!navigator.geolocation) {
      alert("Geolocation unavailable.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        processMapping(coords.lat, coords.lng);
      },
      (err) => {
        console.warn("GPS Access Denied. Using regional baseline (DSU Trichy).", err);
        const defaultCoords = { lat: 10.8505, lng: 78.7047 };
        setLocation(defaultCoords);
        processMapping(defaultCoords.lat, defaultCoords.lng);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const processMapping = async (lat: number, lng: number) => {
    setLoadingStep('Grounding Local Facilities...');
    try {
      const result = await getGeographicRadiationProfile(lat, lng);
      if (abortRef.current) return;

      setReport(result.text);

      const extractedLinks: { uri: string; title: string }[] = [];
      let detectedPlace: string | null = null;

      if (result.grounding && result.grounding.length > 0) {
        result.grounding.forEach((chunk: any) => {
          if (chunk.maps) {
            extractedLinks.push({ 
              uri: chunk.maps.uri, 
              title: chunk.maps.title || "Nearby Clinical Site" 
            });
            if (!detectedPlace && chunk.maps.title) detectedPlace = chunk.maps.title;
          } else if (chunk.web) {
            extractedLinks.push({ 
              uri: chunk.web.uri, 
              title: chunk.web.title || "Safety Resource" 
            });
          }
        });
      }
      
      setLinks(extractedLinks);

      const placeMatch = result.text.match(/LOCALITY IDENTIFIED:\s*(.*)/i);
      if (placeMatch && placeMatch[1]) {
        setPlaceName(placeMatch[1].split('\n')[0].trim());
      } else if (detectedPlace) {
        setPlaceName(detectedPlace);
      } else {
        setPlaceName("Detected Locality");
      }

      const upper = result.text.toUpperCase();
      if (upper.includes('HIGH') || upper.includes('CONCENTRATED')) setRisk('HIGH');
      else if (upper.includes('MODERATE')) setRisk('MODERATE');
      else setRisk('LOW');

    } catch (error: any) {
      setReport(`Spatial error: ${error.message || 'System handshake failed'}.`);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 md:mb-12">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="p-4 md:p-5 bg-rad-600 text-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border-2 md:border-4 border-white shrink-0">
            <Radar size={28} className={loading ? 'animate-spin' : ''} />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Spatial Grounding</h2>
            <p className="text-slate-500 font-bold text-[10px] md:text-sm mt-1 flex items-center gap-2">
              <Signal size={14} className="text-rad-500" /> Mapping Regional Radiation Hubs
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          {!loading ? (
            <button 
              onClick={startScan} 
              className="w-full md:w-auto px-6 md:px-10 py-4 md:py-5 bg-rad-600 text-white rounded-2xl font-black text-[10px] md:text-sm uppercase flex items-center justify-center gap-3 hover:bg-rad-700 shadow-xl transition-all active:translate-y-1"
            >
              <Navigation2 size={18} /> Deploy Scan
            </button>
          ) : (
            <button 
              onClick={() => { abortRef.current = true; setLoading(false); }} 
              className="w-full md:w-auto px-6 md:px-10 py-4 md:py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] md:text-sm uppercase flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              <XCircle size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* LOCATION HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
         <div className="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-xl flex items-center gap-4 md:gap-5 border border-slate-800">
            <div className="p-3 bg-rad-500/20 text-rad-400 rounded-xl shrink-0"><MapPinIcon size={20}/></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Identified Place</p>
              <p className="font-black text-sm md:text-lg truncate text-rad-100">{placeName || (loading ? 'Scanning...' : 'Waiting')}</p>
            </div>
         </div>
         <div className="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-xl flex items-center gap-4 md:gap-5 border border-slate-800">
            <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl shrink-0"><Crosshair size={20}/></div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Latitude</p>
              <p className="font-mono text-sm md:text-lg text-teal-100">{location ? `${location.lat.toFixed(4)}° N` : '0.0000°'}</p>
            </div>
         </div>
         <div className="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-xl flex items-center gap-4 md:gap-5 border border-slate-800">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl shrink-0"><Globe size={20}/></div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Longitude</p>
              <p className="font-mono text-sm md:text-lg text-blue-100">{location ? `${location.lng.toFixed(4)}° E` : '0.0000°'}</p>
            </div>
         </div>
      </div>

      {/* ANALYSIS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-14 shadow-2xl border border-slate-100 min-h-[400px] md:min-h-[500px] relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 md:py-20">
                <Activity size={60} className="text-rad-600 animate-pulse mb-8" />
                <h3 className="text-xl md:text-3xl font-black text-rad-900 mb-2 uppercase tracking-tight">{loadingStep}</h3>
                <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] animate-pulse">Requesting Grounding Data</p>
              </div>
            ) : report ? (
              <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-8 border-b border-slate-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl text-white shadow-lg ${risk === 'HIGH' ? 'bg-red-500' : risk === 'MODERATE' ? 'bg-orange-500' : 'bg-green-500'}`}>
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase">Physics Profile</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Live Grounded Analysis</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                     <div className={`w-2.5 h-2.5 rounded-full ${risk === 'LOW' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Env. Risk: {risk}</span>
                  </div>
                </div>
                
                <div className="space-y-6 md:space-y-8">
                  {report.split('###').filter(Boolean).map((section, idx) => (
                    <div key={idx} className="bg-slate-50/50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-slate-100">
                      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[13px] md:text-sm font-medium">
                        {section.split('\n').map((line, lineIdx) => {
                          if (lineIdx === 0 && line.trim()) return (
                            <h4 key={lineIdx} className="text-sm md:text-xl font-black text-rad-700 mb-4 md:mb-6 uppercase tracking-tighter flex items-center gap-2">
                              <Building2 size={16} className="md:w-5 md:h-5" />
                              {line.replace(/#/g, '').trim()}
                            </h4>
                          );
                          return <p key={lineIdx} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>') }} />;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 opacity-30 text-center">
                <Satellite size={100} className="text-slate-300 md:w-[140px] md:h-[140px]" />
                <div className="mt-8">
                   <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-slate-400">Scanner Ready</h3>
                   <p className="text-[10px] md:text-sm font-black text-slate-400 mt-2 uppercase tracking-widest">Deploy scan to find nearby clinical hubs.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl">
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 md:mb-8 flex items-center gap-2">
              <Hospital size={14} className="text-rad-400" /> Clinical Grounding
            </h3>
            
            <div className="space-y-3">
              {links.length > 0 ? links.map((link, i) => (
                <a 
                  key={i} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 md:p-6 bg-white/5 rounded-[1.2rem] md:rounded-[1.8rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest text-rad-300 hover:bg-white/10 transition-all border border-white/5 group"
                >
                  <span className="truncate pr-4">{link.title}</span> 
                  <ExternalLink size={14} className="shrink-0" />
                </a>
              )) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl opacity-30">
                  <p className="text-[9px] font-black uppercase text-slate-600">No Data Links</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-50 p-6 md:p-8 rounded-[2rem] border-2 border-red-100 shadow-sm">
             <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase mb-4">
                <AlertTriangle size={16} /> Logic Engine
             </div>
             <p className="text-[11px] font-bold text-red-900 leading-relaxed uppercase opacity-80">
                Maps grounding allows RAD SAFE PRO to cross-reference actual medical clinical sites with regional radiation background estimates.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationRadiationScanner;