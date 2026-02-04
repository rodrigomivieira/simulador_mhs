import React from 'react';
import { PhysicsState, SimulationParams, SimulationConfig } from '../types';
import { COLORS, SCALE_PX_PER_METER } from '../constants';
import { VectorArrow } from './VectorArrow';

interface SimulationCanvasProps {
  physics: PhysicsState;
  params: SimulationParams;
  config: SimulationConfig;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ physics, params, config }) => {
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = config.showMCU ? height * 0.65 : height / 2; // Move down if showing MCU
  
  // Position in pixels relative to center
  const posX = physics.x * SCALE_PX_PER_METER;
  const mcuRadius = params.amplitude * SCALE_PX_PER_METER;
  
  // Spring drawing logic
  const springSegments = 12;
  const wallX = 50;
  const springStartX = wallX;
  const springEndX = centerX + posX - 40; // -40 for half block width
  const springLength = springEndX - springStartX;
  const segmentLen = springLength / springSegments;

  let springPath = `M ${springStartX} ${centerY}`;
  for (let i = 1; i <= springSegments; i++) {
    const x = springStartX + i * segmentLen;
    const yOffset = i % 2 === 0 ? 0 : (i % 4 === 1 ? -15 : 15);
    // Flat ends logic could be added, but simple zig-zag is fine
    springPath += ` L ${x - segmentLen/2} ${centerY + yOffset} L ${x} ${centerY}`;
  }

  // MCU Angle
  // x = A * cos(theta) -> theta = acos(x/A), but we track time so theta = omega * t
  // To match visual x direction (right is positive), standard trig circle works.
  const omega = Math.sqrt(params.k / params.mass);
  const theta = omega * physics.t; // radians
  
  // MCU Circle Position (Top area)
  const mcuCenterY = 120;
  const mcuParticleX = centerX + mcuRadius * Math.cos(theta);
  const mcuParticleY = mcuCenterY - mcuRadius * Math.sin(theta); // SVG y is down, math y is up

  return (
    <div className="w-full bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        
        {/* --- MCU VISUALIZATION --- */}
        {config.showMCU && (
          <g>
            <text x={10} y={30} className="text-sm fill-slate-500 font-medium">Referência: Movimento Circular Uniforme</text>
            {/* Main Reference Circle */}
            <circle cx={centerX} cy={mcuCenterY} r={mcuRadius} fill="none" stroke="#cbd5e1" strokeDasharray="4 4" />
            <line x1={centerX} y1={mcuCenterY - mcuRadius - 10} x2={centerX} y2={mcuCenterY + mcuRadius + 10} stroke="#e2e8f0" />
            <line x1={centerX - mcuRadius - 10} y1={mcuCenterY} x2={centerX + mcuRadius + 10} y2={mcuCenterY} stroke="#e2e8f0" />

            {/* Radius Line */}
            <line x1={centerX} y1={mcuCenterY} x2={mcuParticleX} y2={mcuParticleY} stroke={COLORS.mcuGhost} strokeWidth="2" />
            
            {/* Particle */}
            <circle cx={mcuParticleX} cy={mcuParticleY} r={8} fill={COLORS.mcuGhost} />
            
            {/* Projection Line (The "Shadow") */}
            <line 
              x1={mcuParticleX} 
              y1={mcuParticleY} 
              x2={centerX + posX} 
              y2={centerY - 40} // Top of the block
              stroke={COLORS.mcuGhost} 
              strokeWidth="1" 
              strokeDasharray="4 2"
            />
          </g>
        )}

        {/* --- MHS SYSTEM --- */}
        
        {/* Floor/Wall */}
        <line x1={wallX} y1={centerY - 60} x2={wallX} y2={centerY + 60} stroke="#334155" strokeWidth="4" />
        <line x1={wallX} y1={centerY + 41} x2={width - 50} y2={centerY + 41} stroke="#cbd5e1" strokeWidth="2" /> {/* Floor */}
        
        {/* Equilibrium Line */}
        <line x1={centerX} y1={centerY - 50} x2={centerX} y2={centerY + 50} stroke="#94a3b8" strokeDasharray="5 5" />
        <text x={centerX} y={centerY + 70} textAnchor="middle" fill="#64748b" fontSize="12">x = 0 (Equilíbrio)</text>

        {/* Spring */}
        <path d={springPath} stroke={COLORS.spring} strokeWidth="3" fill="none" />

        {/* Mass Block */}
        <rect 
          x={(centerX + posX) - 40} 
          y={centerY - 40} 
          width={80} 
          height={80} 
          fill={COLORS.mass} 
          rx="4"
        />
        <text x={centerX + posX} y={centerY + 5} fill="white" textAnchor="middle" fontWeight="bold">M</text>

        {/* --- VECTORS --- */}
        {config.showVectors && (
          <g>
            {/* Velocity (Green) */}
            <VectorArrow 
              x={centerX + posX} 
              y={centerY} 
              length={physics.v * 30} // Scale factor for visibility
              color={COLORS.velocity} 
              label="v"
              verticalOffset={-50}
            />

            {/* Acceleration (Red) */}
            <VectorArrow 
              x={centerX + posX} 
              y={centerY} 
              length={physics.a * 10} // Scale factor
              color={COLORS.acceleration} 
              label="a"
              verticalOffset={-70}
            />

            {/* Elastic Force (Orange) */}
            {/* Usually F and a are same direction. Let's offset slightly or just show one if cluttered, 
                but request asked for both. We put F below the mass. */}
            <VectorArrow 
              x={centerX + posX} 
              y={centerY} 
              length={physics.f * 2} // Force can be large, smaller scale
              color={COLORS.force} 
              label="Fel"
              verticalOffset={60}
            />
          </g>
        )}

        {/* Ruler/Scale */}
        <g transform={`translate(0, ${height - 40})`}>
             <line x1={centerX - 300} y1={0} x2={centerX + 300} y2={0} stroke="#64748b" />
             {[-3, -2, -1, 0, 1, 2, 3].map(val => (
               <g key={val} transform={`translate(${centerX + val * SCALE_PX_PER_METER}, 0)`}>
                 <line y1={-5} y2={5} stroke="#64748b" />
                 <text y={20} textAnchor="middle" fontSize="10" fill="#64748b">{val}m</text>
               </g>
             ))}

             {/* Dynamic Position Indicator */}
             <g transform={`translate(${centerX + posX}, 0)`}>
               {/* Marker Triangle */}
               <path d="M -6 -15 L 6 -15 L 0 0 Z" fill={COLORS.position} /> 
               {/* Label */}
               <text y="-20" textAnchor="middle" fontSize="12" fontWeight="bold" fill={COLORS.position}>
                 {physics.x.toFixed(2)}m
               </text>
             </g>
        </g>

      </svg>
    </div>
  );
};