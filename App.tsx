import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { DataCharts } from './components/DataCharts';
import { SimulationParams, PhysicsState, SimulationConfig } from './types';
import { INITIAL_PARAMS } from './constants';
import { BookOpen, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [params, setParams] = useState<SimulationParams>({
    ...INITIAL_PARAMS,
    phi: 0,
  });

  const [config, setConfig] = useState<SimulationConfig>({
    showVectors: true,
    showMCU: false,
    showEnergy: false,
    playbackSpeed: 1.0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Real-time data buffer for charts (keep last 5 seconds approx)
  const [history, setHistory] = useState<PhysicsState[]>([]);

  // Refs for animation loop
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  // --- Physics Logic ---
  const calculatePhysics = useCallback((t: number): PhysicsState => {
    const { mass, k, amplitude, phi } = params;
    const omega = Math.sqrt(k / mass); // Angular frequency

    // MHS Equations
    const x = amplitude * Math.cos(omega * t + phi);
    const v = -omega * amplitude * Math.sin(omega * t + phi);
    const a = -(omega * omega) * x; // a = -w^2 * x
    const f = -k * x; // Hooke's Law

    return { t, x, v, a, f };
  }, [params]);

  // Current Instant State
  const currentState = calculatePhysics(currentTime);

  // --- Animation Loop ---
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000; // ms to seconds
      
      // Update Physics Time
      setCurrentTime(prevTime => {
        const newTime = prevTime + deltaTime * config.playbackSpeed;
        
        // Update History (throttle slightly for performance, e.g., every 5th frame, but React batching handles a lot)
        // Here we just add every frame but limit array size in the setter
        const newState = calculatePhysics(newTime);
        
        setHistory(prevHistory => {
          const newHistory = [...prevHistory, newState];
          // Keep roughly last 100 points or 5 seconds of data to avoid memory explosion
          if (newHistory.length > 200) {
            return newHistory.slice(newHistory.length - 200);
          }
          return newHistory;
        });

        return newTime;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      previousTimeRef.current = undefined;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, calculatePhysics]); // Dependencies update loop if physics params change

  // --- Handlers ---
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setHistory([]);
  };

  const handleStep = () => {
    setIsPlaying(false); // Pause if playing
    const dt = 0.05; // Step size in seconds
    
    setCurrentTime(prevTime => {
      const newTime = prevTime + dt;
      const newState = calculatePhysics(newTime);
      
      setHistory(prevHistory => {
        const newHistory = [...prevHistory, newState];
        if (newHistory.length > 200) {
          return newHistory.slice(newHistory.length - 200);
        }
        return newHistory;
      });
      return newTime;
    });
  };

  const omega = Math.sqrt(params.k / params.mass);
  const period = 2 * Math.PI * Math.sqrt(params.mass / params.k);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Simulador MHS</h1>
            <p className="text-sm text-slate-500 font-medium">Auxiliar do Prof. Rodrigo</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* Intro / Context */}
        <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg flex gap-4 items-start">
          <BookOpen className="w-6 h-6 flex-shrink-0 mt-1 opacity-80" />
          <div>
            <h2 className="text-lg font-bold mb-1">Olá, estudante!</h2>
            <p className="opacity-90 leading-relaxed">
              Vamos analisar a dinâmica do Sistema Massa-Mola? Aqui você pode observar como a 
              <strong> Força Elástica</strong> restaura a posição do bloco, gerando aceleração e velocidade variáveis.
              Experimente ativar a "Sombra MCU" para ver a profunda conexão geométrica entre o movimento circular e o harmônico!
            </p>
          </div>
        </div>

        {/* Top Section: Simulation & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SimulationCanvas 
              physics={currentState} 
              params={params} 
              config={config} 
            />
          </div>
          <div className="lg:col-span-1">
             <ControlPanel 
               params={params} 
               setParams={setParams} 
               config={config} 
               setConfig={setConfig}
               isPlaying={isPlaying}
               togglePlay={() => setIsPlaying(!isPlaying)}
               reset={handleReset}
               step={handleStep}
             />
             
             {/* Physics Stats Card */}
             <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4">Dados em Tempo Real</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <p className="text-slate-500">Período (T)</p>
                     <p className="font-mono font-bold text-lg">{period.toFixed(2)} s</p>
                   </div>
                   <div>
                     <p className="text-slate-500">Pulsação (ω)</p>
                     <p className="font-mono font-bold text-lg">{omega.toFixed(2)} rad/s</p>
                   </div>
                   <div>
                     <p className="text-slate-500">Posição (x)</p>
                     <p className="font-mono font-bold text-indigo-600">{currentState.x.toFixed(2)} m</p>
                   </div>
                   <div>
                     <p className="text-slate-500">Velocidade (v)</p>
                     <p className="font-mono font-bold text-emerald-600">{currentState.v.toFixed(2)} m/s</p>
                   </div>
                   <div className="col-span-2">
                     <p className="text-slate-500">Força Restauradora (Fel)</p>
                     <p className="font-mono font-bold text-orange-500">{currentState.f.toFixed(2)} N</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Section: Charts */}
        <DataCharts data={history} />
        
      </main>
    </div>
  );
};

export default App;