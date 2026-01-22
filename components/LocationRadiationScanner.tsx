import React, { useState, useRef, useEffect } from 'react';
import { 
  Navigation, Signal, Radar, Crosshair, MapPin as MapPinIcon, 
  Globe, Activity, Zap, ExternalLink, AlertTriangle, XCircle, Bot, Loader2,
  Navigation2, Satellite, Map as MapIcon, Search, Building2, Hospital, Wifi, Smartphone, Home,
  Info, MonitorSmartphone, Radio, ShieldCheck, HeartPulse
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
    setLoadingStep('Securing Geodetic Lock...');
    setReport(null);
    setLinks([]);
    setPlaceName(null);

    if (!navigator.geolocation) {
      alert("GPS Access is required to verify local radiation hubs.");
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
        console.warn("GPS Signal Weak. Reverting to Trichy Samayapuram Baseline.", err);
        const defaultCoords = { lat: 10.8505, lng: 78.7047 };
        setLocation(defaultCoords);
        processMapping(defaultCoords.lat, defaultCoords.lng);
      },
      { timeout: 15000, enableHighAccuracy: true }
    );
  };

  const processMapping = async (lat: number, lng: number) => {
    setLoadingStep('Grounding Clinical Hub Data...');
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
              title: chunk.maps.title || "Clinical Facility" 
            });
            if (!detectedPlace && chunk.maps.title) detectedPlace = chunk.maps.title;
          } else if (chunk.web) {
            extractedLinks.push({ 
              uri: chunk.web.uri, 
              title: chunk.web.title || "Physics Resource" 
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
        setPlaceName("Identified Diagnostic Zone");
      }

      const upper = result.text.toUpperCase();
      if (upper.includes('HIGH') || upper.includes('NUCLEAR')) setRisk('HIGH');
      else if (upper.includes('MODERATE')) setRisk('MODERATE');
      else setRisk('LOW');

    } catch (error: any) {
      setReport(`Spatial bridge failure. The area profile is currently inaccessible.`);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-12 animate-fade-in font-sans">
      {/* SCANNER CONTROL CENTER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12 md:mb-20">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="p-6 bg-rad-600 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(14,165,233,0.3)] border-4 border-white shrink-0">
              <Radar size={40} className={loading ? 'animate-spin' : ''} />
            </div>
            {loading && <div className="absolute inset-0 border-4 border-rad-500 rounded-[2.5rem] animate-ping opacity-20"></div>}
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Mapping Hub</h2>
            <p className="text-slate-500 font-bold text-xs md:text-base mt-2 flex items-center gap-2">
              <Signal size={18} className="text-rad-500" /> Grounded Local Awareness Engine
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          {!loading ? (
            <button 
              onClick={startScan} 
              className="w-full md:w-auto px-14 py-7 bg-rad-600 text-white rounded-[2.5rem] font-black text-sm uppercase flex items-center justify-center gap-4 hover:bg-rad-700 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Navigation2 size={24} /> Initialize Spatial Scan
            </button>
          ) : (
            <button 
              onClick={() => { abortRef.current = true; setLoading(false); }} 
              className="w-full md:w-auto px-14 py-7 bg-red-600 text-white rounded-[2.5rem] font-black text-sm uppercase flex items-center justify-center gap-4 shadow-2xl active:scale-95"
            >
              <XCircle size={24} /> Terminate Process
            </button>
          )}
        </div>
      </div>

      {/* REGISTRY HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
         <div className="bg-white p-8 rounded-[3rem] shadow-xl flex items-center gap-6 border border-slate-100">
            <div className="p-4 bg-rad-50 text-rad-600 rounded-2xl shrink-0"><MapPinIcon size={32}/></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Sector</p>
              <p className="font-black text-lg md:text-xl text-slate-900 truncate">{placeName || (loading ? 'Scanning...' : 'Idle')}</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[3rem] shadow-xl flex items-center gap-6 border border-slate-100">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shrink-0"><Satellite size={32}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Geodetic Link</p>
              <p className="font-mono text-sm text-blue-700 font-bold">{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Awaiting Signal...'}</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[3rem] shadow-xl flex items-center gap-6 border border-slate-100">
            <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl shrink-0"><ShieldCheck size={32}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Radiation Profile</p>
              <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${risk === 'LOW' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'}`}></div>
                 <p className="font-black text-lg uppercase tracking-widest text-slate-900">{risk} EXPOSURE</p>
              </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* MAIN REPORT AREA */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-2xl border border-slate-100 min-h-[700px] relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-24">
                <div className="relative mb-12">
                   <Loader2 size={120} className="text-rad-600 animate-spin opacity-20" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Globe size={48} className="text-rad-500 animate-pulse" />
                   </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tight">{loadingStep}</h3>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.5em] animate-pulse">Syncing with Google Maps Grounding</p>
              </div>
            ) : report ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-6 mb-16 pb-12 border-b border-slate-100">
                   <div className="p-7 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl">
                      <Globe size={40} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase">Grounded Locality Analysis</h3>
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">Registry Protocol v7.2-Final</p>
                   </div>
                </div>
                
                <div className="space-y-16">
                  {report.split('###').filter(Boolean).map((section, idx) => (
                    <div key={idx} className="bg-slate-50/50 p-12 md:p-16 rounded-[3.5rem] border border-slate-100 relative group hover:bg-white hover:shadow-[0_32px_64px_rgba(0,0,0,0.04)] transition-all duration-700">
                      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-xl font-medium">
                        {section.split('\n').map((line, lineIdx) => {
                          if (lineIdx === 0 && line.trim()) return (
                            <h4 key={lineIdx} className="text-2xl md:text-3xl font-black text-slate-900 mb-10 uppercase tracking-tighter flex items-center gap-5">
                              <div className="w-12 h-12 bg-rad-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Building2 size={24} /></div>
                              {line.replace(/#/g, '').trim()}
                            </h4>
                          );
                          return <p key={lineIdx} className="mb-6 last:mb-0" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-black">$1</strong>') }} />;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-24 opacity-40 text-center">
                <div className="p-16 bg-slate-50 rounded-full mb-12 shadow-inner">
                   <Satellite size={160} className="text-slate-300" />
                </div>
                <div className="max-w-md">
                   <h3 className="text-5xl font-black uppercase tracking-tighter text-slate-300">Hub Scanner Ready</h3>
                   <p className="text-base font-bold text-slate-400 mt-6 uppercase tracking-widest leading-relaxed">Deploy scanner to identify verified clinical hubs and analyze daily WiFi/EMF exposure levels in your sector.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR: VERIFIED HUB REGISTRY */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rad-600 opacity-10 blur-[60px]"></div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 mb-10 flex items-center gap-4">
              <Hospital size={18} className="text-rad-400" /> Verified Clinical Hubs
            </h3>
            
            <div className="space-y-4">
              {links.length > 0 ? links.map((link, i) => (
                <a 
                  key={i} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-8 bg-white/5 rounded-3xl text-[11px] font-black uppercase tracking-widest text-rad-300 hover:bg-rad-600 hover:text-white transition-all border border-white/5 group shadow-lg"
                >
                  <div className="flex items-center gap-4 truncate">
                    <HeartPulse size={18} className="shrink-0 text-rad-500 group-hover:text-white" />
                    <span className="truncate pr-4">{link.title}</span> 
                  </div>
                  <ExternalLink size={20} className="shrink-0 opacity-40 group-hover:opacity-100" />
                </a>
              )) : (
                <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-[3rem] opacity-20">
                  <p className="text-[10px] font-black uppercase text-slate-600">Scan Required to Fetch Registry</p>
                </div>
              )}
            </div>
            
            <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/5">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center leading-relaxed">
                 Data grounded via Google Maps API. Facility verification status is provided by Dr. Rad AI.
               </p>
            </div>
          </div>

          {/* EDUCATIONAL LEGEND */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-12 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rad-400 to-rad-600"></div>
             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
               <Info size={16} className="text-rad-500" /> Awareness Protocol
             </h4>
             
             <div className="space-y-10">
                <div className="flex gap-8 group">
                   <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <Wifi size={32}/>
                   </div>
                   <div>
                      <p className="text-sm font-black uppercase text-slate-900 mb-1">WiFi & Homes</p>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase">Non-ionizing waves. Perfectly safe for domestic use and shop environments.</p>
                   </div>
                </div>
                <div className="flex gap-8 group">
                   <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      <MonitorSmartphone size={32}/>
                   </div>
                   <div>
                      <p className="text-sm font-black uppercase text-slate-900 mb-1">Mobiles & Shops</p>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase">RF frequencies. No DNA-damaging potential. Safe for public commerce.</p>
                   </div>
                </div>
                <div className="flex gap-8 group">
                   <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 shrink-0 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                      <Hospital size={32}/>
                   </div>
                   <div>
                      <p className="text-sm font-black uppercase text-slate-900 mb-1">Clinical Zones</p>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase">Ionizing energy used for diagnostics. Highly regulated and shielded for safety.</p>
                   </div>
                </div>
             </div>

             <div className="pt-10 border-t border-slate-100">
                <div className="bg-rad-50 p-8 rounded-3xl border border-rad-100">
                   <p className="text-[11px] font-black text-rad-800 uppercase leading-relaxed text-center italic">
                     "Education is the best shielding against radiation anxiety."
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationRadiationScanner;