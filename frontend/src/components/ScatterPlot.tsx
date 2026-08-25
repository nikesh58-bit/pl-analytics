'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';
import { ScatterPoint } from '@/types';

interface ScatterPlotProps {
  data: ScatterPoint[];
  loading: boolean;
}

export function ScatterPlot({ data, loading }: ScatterPlotProps) {
  if (loading || data.length === 0) {
    return (
      <div className="chart-container skeleton">
        <div className="skeleton-text"></div>
      </div>
    );
  }

  const maxXG = Math.max(...data.map(d => d.xg), 1);
  const maxGoals = Math.max(...data.map(d => d.goals), 1);
  const maxVal = Math.max(maxXG, maxGoals);

  const referenceLine = Array.from({ length: 100 }, (_, i) => ({
    x: (i / 99) * maxVal,
    y: (i / 99) * maxVal,
  }));

  return (
    <div className="chart-container" role="img" aria-label="Goals vs xG scatter plot">
      <ResponsiveContainer width="100%" height={450}>
        <ScatterChart
          margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="xg"
            name="Expected Goals (xG)"
            unit="xG"
            tickFormatter={val => val.toFixed(1)}
            domain={[0, maxVal * 1.1]}
          />
          <YAxis
            name="Actual Goals"
            unit="Goals"
            tickFormatter={val => val.toFixed(0)}
            domain={[0, maxVal * 1.1]}
          />
          <Tooltip
            formatter={(value: number, name: string) => [name === 'xg' ? value.toFixed(2) : value, name]}
            labelFormatter={(_, payload) => payload[0]?.payload?.player || ''}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
          />
          <Legend />
          <Line
            type="monotone"
            data={referenceLine}
            stroke="red"
            strokeDasharray="5 5"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
            name="xG = Goals"
          />
          <Scatter
            name="Players"
            data={data}
            fill="#3b82f6"
            stroke="#2563eb"
            customShape={({ cx, cy, size }) => (
              <circle
                cx={cx}
                cy={cy}
                r={Math.max(4, Math.min(12, size / 3))}
                fill="#3b82f6"
                opacity={0.7}
                stroke="#2563eb"
                strokeWidth={1.5}
              />
            )}
          >
            {data.map((point, index) => (
              <Scatter
                key={index}
                name={point.player}
                data={[{ x: point.xg, y: point.goals, value: point.minutes_played }]}
                fill="none"
                stroke="transparent"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
          Players (size = minutes played)
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'red', height: '2px', borderRadius: '1px' }}></span>
          xG = Goals line
        </span>
      </div>
    </div>
  );
}