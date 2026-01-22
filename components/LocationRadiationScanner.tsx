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

      // Robust extraction of details from Grounding Chunks
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

      // Parse place name from text using regex as a primary method
      const placeMatch = result.text.match(/LOCALITY IDENTIFIED:\s*(.*)/i);
      if (placeMatch && placeMatch[1]) {
        setPlaceName(placeMatch[1].split('\n')[0].trim());
      } else if (detectedPlace) {
        setPlaceName(detectedPlace);
      } else {
        setPlaceName("Detected Regional Locality");
      }

      // Determine Environmental Risk based on content
      const upper = result.text.toUpperCase();
      if (upper.includes('HIGH') || upper.includes('CONCENTRATED')) setRisk('HIGH');
      else if (upper.includes('MODERATE')) setRisk('MODERATE');
      else setRisk('LOW');

    } catch (error: any) {
      setReport(`Spatial error: ${error.message || 'System handshake failed'}. Try moving to an area with better GPS or clear sky view.`);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in px-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-rad-600 text-white rounded-[2.5rem] shadow-2xl border-4 border-white transform hover:rotate-3 transition-transform">
            <Radar size={36} className={loading ? 'animate-spin' : ''} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Spatial Grounding</h2>
            <p className="text-slate-500 font-bold text-sm mt-2 flex items-center gap-2">
              <Signal size={16} className="text-rad-500" /> Mapping Nearby Clinical Radiation Sources
            </p>
          </div>
        </div>

        {!loading ? (
          <button 
            onClick={startScan} 
            className="px-10 py-5 bg-rad-600 text-white rounded-2xl font-black text-sm uppercase flex items-center gap-3 hover:bg-rad-700 shadow-2xl transition-all border-b-4 border-rad-900 active:translate-y-1"
          >
            <Navigation2 size={20} /> Deploy Location Scan
          </button>
        ) : (
          <button 
            onClick={() => { abortRef.current = true; setLoading(false); }} 
            className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase flex items-center gap-3 shadow-xl active:scale-95"
          >
            <XCircle size={20} /> Cancel Scan
          </button>
        )}
      </div>

      {/* LOCATION HUD (GPS DATA) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl flex items-center gap-5 border border-slate-800 transition-all hover:border-rad-400 group overflow-hidden">
            <div className="p-4 bg-rad-500/20 text-rad-400 rounded-2xl group-hover:scale-110 transition-transform"><MapPinIcon size={24}/></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Identified Place</p>
              <p className="font-black text-lg truncate text-rad-100">{placeName || (loading ? 'Scanning Maps...' : 'Waiting for GPS')}</p>
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl flex items-center gap-5 border border-slate-800 transition-all hover:border-teal-400 group">
            <div className="p-4 bg-teal-500/20 text-teal-400 rounded-2xl group-hover:scale-110 transition-transform"><Crosshair size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Latitude</p>
              <p className="font-mono text-lg text-teal-100">{location ? `${location.lat.toFixed(6)}° N` : '0.000000°'}</p>
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl flex items-center gap-5 border border-slate-800 transition-all hover:border-blue-400 group">
            <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform"><Globe size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Longitude</p>
              <p className="font-mono text-lg text-blue-100">{location ? `${location.lng.toFixed(6)}° E` : '0.000000°'}</p>
            </div>
         </div>
      </div>

      {/* ANALYSIS REPORT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-slate-100 min-h-[500px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rad-50/50 rounded-full blur-[100px] -mr-40 -mt-40"></div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 relative z-10">
                <div className="relative mb-12">
                  <Activity size={72} className="text-rad-600 animate-pulse" />
                  <div className="absolute inset-0 border-[6px] border-rad-100 border-t-rad-600 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-3xl font-black text-rad-900 mb-2 uppercase tracking-tight">{loadingStep}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] animate-pulse">Requesting Google Maps Grounding</p>
              </div>
            ) : report ? (
              <div className="animate-fade-in relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-10 border-b border-slate-100 gap-6">
                  <div className="flex items-center gap-5">
                    <div className={`p-5 rounded-[1.8rem] text-white shadow-2xl ${risk === 'HIGH' ? 'bg-red-500' : risk === 'MODERATE' ? 'bg-orange-500' : 'bg-green-500'}`}>
                      <Zap size={28} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Physics Profile</h3>
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">Directly Grounded Analysis</p>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full ${risk === 'LOW' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                     <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Environmental Risk: {risk}</span>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {report.split('###').filter(Boolean).map((section, idx) => (
                    <div key={idx} className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 hover:bg-white transition-all group">
                      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm font-medium">
                        {section.split('\n').map((line, lineIdx) => {
                          if (lineIdx === 0 && line.trim()) return (
                            <h4 key={lineIdx} className="text-xl font-black text-rad-700 mb-6 uppercase tracking-tighter flex items-center gap-2">
                              {line.toLowerCase().includes('locality') ? <MapIcon size={18}/> : line.toLowerCase().includes('facilities') ? <Hospital size={18}/> : <Building2 size={18}/>}
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
              <div className="flex flex-col items-center justify-center h-full py-20 opacity-30 text-center">
                <Satellite size={140} className="text-slate-300" />
                <div className="mt-10">
                   <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-400">Scanner Ready</h3>
                   <p className="text-sm font-black text-slate-400 mt-3 uppercase tracking-widest">Link with Google Maps to find radiation places near you.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR: SOURCES & CLINICAL SITES */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-slate-800">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-2">
              <Hospital size={14} className="text-rad-400" /> Nearby Radiology Sites
            </h3>
            
            <div className="space-y-4">
              {links.length > 0 ? links.map((link, i) => (
                <a 
                  key={i} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-6 bg-white/5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest text-rad-300 hover:bg-white/10 border border-white/5 transition-all group"
                >
                  <span className="truncate pr-4">{link.title}</span> 
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )) : (
                <div className="py-16 text-center border-4 border-dashed border-slate-800 rounded-[2.5rem] opacity-40">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Scan to map facilities</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-50 p-10 rounded-[3rem] border-2 border-red-100 shadow-xl">
            <div className="flex items-center gap-3 text-red-600 font-black text-xs uppercase mb-8">
               <AlertTriangle size={24} /> Grounding Engine
            </div>
            <div className="space-y-6 text-[11px] font-bold text-red-900 leading-relaxed uppercase">
              <div className="p-4 bg-white/60 rounded-2xl">
                <p className="mb-1 text-red-700">1. Verified Mapping</p>
                <p className="opacity-60">Uses Google Maps to cross-reference actual medical sites in your vicinity.</p>
              </div>
              <div className="p-4 bg-white/60 rounded-2xl">
                <p className="mb-1 text-red-700">2. Physics Baseline</p>
                <p className="opacity-60">Calculates background ionizing radiation (Cosmic/Terrestrial) for your coordinates.</p>
              </div>
            </div>
          </div>

          <button className="w-full p-10 bg-rad-50 border border-rad-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 hover:bg-white transition-all group shadow-2xl shadow-rad-100/50">
             <div className="p-5 bg-white rounded-2xl text-rad-600 shadow-xl group-hover:scale-110 transition-transform">
               <Bot size={32} />
             </div>
             <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-rad-700 block">Query Dr. Rad</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-rad-400 mt-1">Deep Locality Context</span>
             </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationRadiationScanner;