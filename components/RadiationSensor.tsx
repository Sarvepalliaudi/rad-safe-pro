
import React, { useState, useRef, useEffect } from 'react';
import { Camera, ShieldAlert, Activity, Info, Zap, AlertTriangle, Smartphone, Maximize2, User, Eye, Radio, Gauge, BookOpen, Settings, StopCircle, RefreshCw, BarChart3, Crosshair, Target, ScanEye } from 'lucide-react';

interface ZoneData {
  id: string;
  x: number;
  y: number;
  intensity: number;
  dose: number;
}

const RadiationSensor: React.FC = () => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showRawFeed, setShowRawFeed] = useState(false);
  
  // Sensor Data
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [reading, setReading] = useState(0.01);
  const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });
  const [status, setStatus] = useState('Standby');
  const [history, setHistory] = useState<number[]>(new Array(30).fill(0));
  const [strikesCount, setStrikesCount] = useState(0);
  const [hotspots, setHotspots] = useState<ZoneData[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawSignalRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    setIsSupported(supported);

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.acceleration) {
        setMotion({
          x: event.acceleration.x || 0,
          y: event.acceleration.y || 0,
          z: event.acceleration.z || 0
        });
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const startAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsActive(true);
        setStatus('Scanning');
        processFrame();
      }
    } catch (err) {
      alert("Hardware access denied. Please ensure Camera and Motion permissions are granted.");
      setIsActive(false);
    }
  };

  const stopAnalysis = () => {
    setIsActive(false);
    setIsARMode(false);
    setStatus('Offline');
    setHotspots([]);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    cancelAnimationFrame(animationRef.current);
  };

  const processFrame = () => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    const rawCtx = rawSignalRef.current?.getContext('2d');
    
    if (ctx && videoRef.current.readyState === 4) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      
      // 1. Draw Live Video Feed as the Base Layer
      ctx.globalAlpha = 1.0;
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      
      // 2. Spatial Mapping Initialization (5x5 Grid)
      const gridCols = 5;
      const gridRows = 5;
      const cellW = width / gridCols;
      const cellH = height / gridRows;
      const localHotspots: ZoneData[] = [];

      // 3. Analyze Noise & Spatial Intensity
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      let totalNoise = 0;
      let frameStrikes = 0;

      // Divide and Conquer Analysis
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          let cellStrikes = 0;
          
          // Sample pixels within this specific grid cell
          for (let sy = 0; sy < cellH; sy += 20) {
            for (let sx = 0; sx < cellW; sx += 20) {
              const pxX = Math.floor(col * cellW + sx);
              const pxY = Math.floor(row * cellH + sy);
              const i = (pxY * width + pxX) * 4;
              
              const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
              if (brightness > 240) cellStrikes++; 
              totalNoise += brightness;
            }
          }

          if (cellStrikes > 2) {
            localHotspots.push({
              id: `${row}-${col}`,
              x: col * cellW + cellW / 2,
              y: row * cellH + cellH / 2,
              intensity: cellStrikes,
              dose: (cellStrikes * 0.002) + 0.01
            });
          }
          frameStrikes += cellStrikes;
        }
      }

      setNoiseLevel(totalNoise / (data.length / 4));
      setStrikesCount(prev => prev + frameStrikes);
      
      const pseudoDose = (frameStrikes * 0.0008) + 0.01;
      setReading(prev => Number((prev * 0.9 + pseudoDose * 0.1).toFixed(4)));
      setHistory(prev => [...prev.slice(1), pseudoDose * 1200]);
      setHotspots(localHotspots);

      // --- ADVANCED AR OVERLAY ---
      if (isARMode) {
        // A. Draw Grid Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for(let i=1; i<gridCols; i++) {
          ctx.beginPath(); ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, height); ctx.stroke();
        }
        for(let j=1; j<gridRows; j++) {
          ctx.beginPath(); ctx.moveTo(0, j * cellH); ctx.lineTo(width, j * cellH); ctx.stroke();
        }

        // B. Draw Spatial Hotspots
        localHotspots.forEach(spot => {
          const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
          const radius = spot.intensity * 5 * pulse;
          
          const grad = ctx.createRadialGradient(spot.x, spot.y, 5, spot.x, spot.y, radius + 40);
          grad.addColorStop(0, `rgba(239, 68, 68, 0.6)`);
          grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(spot.x, spot.y, radius + 40, 0, Math.PI * 2);
          ctx.fill();

          // C. Hotspot Data Tag
          ctx.fillStyle = 'white';
          ctx.shadowColor = 'black';
          ctx.shadowBlur = 4;
          ctx.font = 'bold 12px monospace';
          ctx.fillText(`${spot.dose.toFixed(3)} μSv/h`, spot.x - 30, spot.y - (radius + 15));
          ctx.shadowBlur = 0;
        });

        // D. Scanning Line
        const scanY = (Date.now() % 3000) / 3000 * height;
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#0ea5e9';
        ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(width, scanY); ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      // Raw Signal Mini-Map
      if (rawCtx) {
        rawCtx.fillStyle = '#0f172a';
        rawCtx.fillRect(0, 0, 150, 80);
        localHotspots.forEach(spot => {
          rawCtx.fillStyle = '#ef4444';
          rawCtx.fillRect((spot.x / width) * 150, (spot.y / height) * 80, 4, 4);
        });
      }
    }
    animationRef.current = requestAnimationFrame(processFrame);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Header with Safety Focus */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-rad-600 text-white rounded-[2rem] shadow-2xl border-4 border-white">
            <ScanEye size={36} className={isActive ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">SPATIAL SENSORY LAB</h2>
            <p className="text-slate-500 font-bold flex items-center gap-2">
              <Crosshair size={16} /> Precision Body-Part Mapping
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isActive ? (
            <button 
              onClick={startAnalysis}
              className="px-8 py-4 bg-rad-600 text-white rounded-2xl font-black text-sm uppercase flex items-center gap-3 hover:bg-rad-700 shadow-xl shadow-rad-200 transition-all hover:-translate-y-1"
            >
              <Camera size={20} /> Open Camera & Start Scan
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsARMode(!isARMode)}
                className={`px-6 py-4 rounded-2xl font-black text-sm uppercase flex items-center gap-2 transition-all shadow-lg ${isARMode ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                <Target size={18} /> {isARMode ? 'Exit Heatmap' : 'Show Spatial Map'}
              </button>
              <button 
                onClick={stopAnalysis}
                className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase flex items-center gap-2 hover:bg-red-700 shadow-xl shadow-red-200 transition-all"
              >
                <StopCircle size={20} /> Stop Scanning
              </button>
            </>
          )}
        </div>
      </div>

      {/* Manual & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
         <div className="lg:col-span-3 bg-slate-900 rounded-3xl p-6 text-white border border-slate-700 flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
               <Info size={32} />
            </div>
            <div>
               <h4 className="font-bold text-lg mb-1">Spatial Mapping Technology</h4>
               <p className="text-sm text-slate-400 leading-relaxed">
                 The scanner divides your view into 25 zones. It measures <strong>Ionizing Silicon Flux</strong> in each zone. Point at specific body parts (e.g., Chest vs Pelvis) to see simulated scatter distribution based on CMOS noise.
               </p>
            </div>
         </div>
         <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase mb-2">
               <AlertTriangle size={16} /> Critical Warning
            </div>
            <p className="text-[10px] text-red-800 font-bold leading-tight">
               MOBILE SENSORS ARE NOT CALIBRATED. THIS IS AN EDUCATIONAL SIMULATION OF RADIATION FIELD DYNAMICS.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Scanner Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative bg-black rounded-[3.5rem] overflow-hidden shadow-2xl aspect-video border-[12px] border-slate-900">
             {!isActive ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-900 text-center p-12">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Camera size={48} className="text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">CAMERA OFFLINE</h3>
                  <p className="text-sm max-w-xs opacity-50">Click "Open Camera" to initialize live body-part tracking and dosimetry.</p>
               </div>
             ) : (
               <>
                 <video ref={videoRef} className="hidden" playsInline />
                 <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full object-cover" />
                 
                 {/* Visual HUD Framing */}
                 <div className="absolute inset-10 border border-white/5 pointer-events-none rounded-[2rem]">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-rad-500"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-rad-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-rad-500"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-rad-500"></div>
                 </div>

                 {/* Top Status Bar */}
                 <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white">
                       <p className="text-[10px] font-black text-rad-400 uppercase mb-1">Live Global Dose</p>
                       <p className="text-3xl font-mono font-black">{reading.toFixed(3)} <span className="text-xs text-slate-400">μSv/h</span></p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                       <div className="px-3 py-1 bg-green-500 text-black text-[10px] font-black rounded-lg uppercase">Feed: Live 60fps</div>
                       <div className="px-3 py-1 bg-slate-800 text-white text-[10px] font-black rounded-lg uppercase">ID: RAD-SENSOR-01</div>
                    </div>
                 </div>
               </>
             )}
          </div>

          {/* Education Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="w-14 h-14 bg-rad-100 text-rad-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">Hotspot Tracking</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  The scanner identifies "Hotspots" where the camera's CMOS sensor is experiencing the most noise. In a real clinic, this would correspond to areas of high <strong>secondary scatter radiation</strong>.
                </p>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <Activity size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">Accuracy Check</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  To improve accuracy, keep the device stable. Use the <strong>"Show Spatial Map"</strong> mode to see the 5x5 analysis grid and verify reading distribution across body parts.
                </p>
             </div>
          </div>
        </div>

        {/* Diagnostic Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-slate-800">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Real-time Telemetry</h3>
                <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`}></div>
             </div>

             <div className="space-y-8">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Global Strike Flux</p>
                   <div className="flex items-end gap-1.5 h-24">
                      {history.map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-rad-500/40 hover:bg-rad-500/70 rounded-t-lg transition-all duration-300" 
                          style={{ height: `${Math.min(100, h * 0.8 + 5)}%` }}
                        ></div>
                      ))}
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-800 space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Detection Zones:</span>
                      <span className="font-mono text-rad-400 font-bold text-lg">25 Active</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Hotspots Detected:</span>
                      <span className="font-mono text-orange-400 font-bold text-lg">{hotspots.length}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Mean Exposure:</span>
                      <span className="font-mono text-white font-bold text-lg">{(reading * 0.8).toFixed(3)} μSv/h</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <BarChart3 size={120} />
             </div>
             <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <BarChart3 size={24} className="text-slate-400" /> SENSORY LOG
             </h3>
             <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Strikes</p>
                   <p className="text-2xl font-mono font-black text-slate-800">{strikesCount.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Raw Signal View</p>
                   <canvas ref={rawSignalRef} width={150} height={80} className="w-full h-20 bg-black rounded-lg mt-2" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiationSensor;
