'use client';

import { Metrics } from '@/types';

interface MetricsCardsProps {
  metrics: Metrics | null;
  loading: boolean;
}

export function MetricsCards({ metrics, loading }: MetricsCardsProps) {
  const cards = [
    { label: 'Players', value: metrics?.totalPlayers ?? 0, format: (v: number) => v.toString() },
    { label: 'Total Goals', value: metrics?.totalGoals ?? 0, format: (v: number) => v.toString() },
    { label: 'Total xG', value: metrics?.totalXG ?? 0, format: (v: number) => v.toFixed(1) },
    { label: 'Avg Goals p90', value: metrics?.avgGoalsP90 ?? 0, format: (v: number) => v.toFixed(2) },
  ];

  if (loading) {
    return (
      <div className="metrics-grid">
        {cards.map((_, i) => (
          <div key={i} className="metric-card skeleton">
            <div className="metric-label skeleton-text"></div>
            <div className="metric-value skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="metrics-grid" role="region" aria-label="Key metrics">
      {cards.map((card, i) => (
        <div key={i} className="metric-card">
          <div className="metric-label">{card.label}</div>
          <div className="metric-value">{card.format(card.value)}</div>
        </div>
      ))}
    </div>
  );
}