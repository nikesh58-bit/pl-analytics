'use client';

interface MetricSelectorProps {
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
}

const metrics = [
  { key: 'goals', label: 'Goals' },
  { key: 'xg', label: 'xG' },
  { key: 'assists', label: 'Assists' },
  { key: 'xa', label: 'xA' },
  { key: 'goals_p90', label: 'Goals p90' },
  { key: 'xg_p90', label: 'xG p90' },
  { key: 'assists_p90', label: 'Assists p90' },
  { key: 'xa_p90', label: 'xA p90' },
];

export function MetricSelector({ selectedMetric, onMetricChange }: MetricSelectorProps) {
  return (
    <div className="metric-selector">
      <label htmlFor="metric-select" className="selector-label">Sort by Metric</label>
      <select
        id="metric-select"
        value={selectedMetric}
        onChange={(e) => onMetricChange(e.target.value)}
        className="selector-input"
      >
        {metrics.map(m => (
          <option key={m.key} value={m.key}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}