import React from 'react';
import { SimulationParams, SimulationConfig } from '../types';
import { Play, Pause, RotateCcw, Eye, EyeOff, Activity, SkipForward } from 'lucide-react';

interface ControlPanelProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  isPlaying: boolean;
  togglePlay: () => void;
  reset: () => void;
  step: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  setParams,
  config,
  setConfig,
  isPlaying,
  togglePlay,
  reset,
  step,
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof SimulationParams) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(e.target.value) }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Controles do Laboratório
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={togglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            {isPlaying ? <><Pause size={18} /> Pausar</> : <><Play size={18} /> Iniciar</>}
          </button>
          
          <button 
            onClick={step}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium border border-indigo-200"
            title="Avançar 1 passo (0.05s)"
          >
            <SkipForward size={18} /> Passo
          </button>

          <button 
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            <RotateCcw size={18} /> Reiniciar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sliders */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600 flex justify-between">
            Massa (m)
            <span className="text-indigo-600">{params.mass.toFixed(1)} kg</span>
          </label>
          <input 
            type="range" min="0.5" max="10" step="0.1"
            value={params.mass}
            onChange={(e) => handleChange(e, 'mass')}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600 flex justify-between">
            Constante Elástica (k)
            <span className="text-indigo-600">{params.k.toFixed(0)} N/m</span>
          </label>
          <input 
            type="range" min="10" max="200" step="5"
            value={params.k}
            onChange={(e) => handleChange(e, 'k')}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600 flex justify-between">
            Amplitude (A)
            <span className="text-indigo-600">{params.amplitude.toFixed(2)} m</span>
          </label>
          <input 
            type="range" min="0.5" max="3.0" step="0.1"
            value={params.amplitude}
            onChange={(e) => handleChange(e, 'amplitude')}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
          <input 
            type="checkbox" 
            checked={config.showVectors} 
            onChange={e => setConfig(prev => ({...prev, showVectors: e.target.checked}))}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-slate-700 font-medium">Mostrar Vetores</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
          <input 
            type="checkbox" 
            checked={config.showMCU} 
            onChange={e => setConfig(prev => ({...prev, showMCU: e.target.checked}))}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-slate-700 font-medium flex items-center gap-1">
            Ver Sombra MCU
            {config.showMCU ? <Eye size={14} /> : <EyeOff size={14} />}
          </span>
        </label>
      </div>
    </div>
  );
};