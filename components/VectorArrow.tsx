import React from 'react';

interface VectorArrowProps {
  x: number;
  y: number;
  length: number; // Length in pixels
  color: string;
  label: string;
  verticalOffset?: number;
}

export const VectorArrow: React.FC<VectorArrowProps> = ({ 
  x, 
  y, 
  length, 
  color, 
  label, 
  verticalOffset = 0 
}) => {
  if (Math.abs(length) < 5) return null; // Don't draw tiny vectors

  const arrowSize = 6;
  // If length is negative, the arrow points left
  const endX = x + length;
  
  // Direction for arrowhead calculation
  const dir = length > 0 ? 1 : -1;

  return (
    <g transform={`translate(0, ${verticalOffset})`}>
      {/* Main Line */}
      <line 
        x1={x} 
        y1={y} 
        x2={endX} 
        y2={y} 
        stroke={color} 
        strokeWidth="3" 
        markerEnd={`url(#arrowhead-${color})`}
      />
      
      {/* Arrowhead manual drawing if markers get tricky with scaling, 
          but here we use simple lines for robustness */}
      <path 
        d={`M ${endX} ${y} L ${endX - (arrowSize * dir)} ${y - arrowSize} L ${endX - (arrowSize * dir)} ${y + arrowSize} Z`} 
        fill={color} 
      />

      {/* Label */}
      <text 
        x={x + length / 2} 
        y={y - 8} 
        fill={color} 
        fontSize="12" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
};
