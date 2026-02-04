import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PhysicsState } from '../types';
import { COLORS } from '../constants';

interface DataChartsProps {
  data: PhysicsState[];
}

export const DataCharts: React.FC<DataChartsProps> = ({ data }) => {
  // We'll show a subset of data or two different charts. 
  // Let's create a composite chart showing normalized values or just separate them.
  // Given screen space, a tabbed view or a grid is good. Let's do a grid of 2 small charts.

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Position Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Posição x Tempo</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis 
                dataKey="t" 
                type="number" 
                domain={['auto', 'auto']} 
                tickFormatter={(val) => val.toFixed(1)} 
                label={{ value: 't (s)', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis label={{ value: 'x (m)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                labelFormatter={(label) => `Tempo: ${Number(label).toFixed(2)}s`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="x" 
                stroke={COLORS.position} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false} // Performance
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Velocity and Acceleration Chart (Dual Axis might be complex, let's just plot Velocity for clarity, or both normalized) */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Cinemática x Tempo</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis 
                dataKey="t" 
                type="number" 
                domain={['auto', 'auto']} 
                tickFormatter={(val) => val.toFixed(1)} 
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => `Tempo: ${Number(label).toFixed(2)}s`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Legend />
              <Line 
                name="Velocidade (v)"
                type="monotone" 
                dataKey="v" 
                stroke={COLORS.velocity} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
              />
              <Line 
                name="Aceleração (a)"
                type="monotone" 
                dataKey="a" 
                stroke={COLORS.acceleration} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
