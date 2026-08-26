'use client';

import { useState, useEffect } from 'react';
import { MetricsCards } from '@/components/MetricsCards';
import { TopPerformersTable } from '@/components/TopPerformersTable';
import { ScatterPlot } from '@/components/ScatterPlot';
import { FullTable } from '@/components/FullTable';
import { FilterSidebar } from '@/components/FilterSidebar';
import { MetricSelector } from '@/components/MetricSelector';
import { Tabs, Tab } from '@/components/Tabs';
import { usePlayers, useMetrics, useTopPerformers, useScatterData } from '@/hooks/usePlayers';
import { Player } from '@/types';

const METRICS = [
  { key: 'goals', label: 'Goals' },
  { key: 'xg', label: 'xG' },
  { key: 'assists', label: 'Assists' },
  { key: 'xa', label: 'xA' },
  { key: 'goals_p90', label: 'Goals p90' },
  { key: 'xg_p90', label: 'xG p90' },
  { key: 'assists_p90', label: 'Assists p90' },
  { key: 'xa_p90', label: 'xA p90' },
];

export default function HomePage() {
  const [minMinutes, setMinMinutes] = useState(270);
  const [selectedMetric, setSelectedMetric] = useState('goals');
  const [maxMinutes, setMaxMinutes] = useState(3060);

  const { players, loading: playersLoading } = usePlayers(minMinutes);
  const { metrics, loading: metricsLoading } = useMetrics(minMinutes);
  const { topPlayers, loading: topLoading } = useTopPerformers(minMinutes, selectedMetric);
  const { scatterData, loading: scatterLoading } = useScatterData(minMinutes);

  useEffect(() => {
    if (players.length > 0) {
      const max = Math.max(...players.map(p => p.minutes_played));
      setMaxMinutes(max);
    }
  }, [players]);

  const tabs: Tab[] = [
    {
      id: 'top-performers',
      label: '📊 Top Performers',
      children: (
        <>
          <div className="section-header">
            <h2>Top 20 by Selected Metric</h2>
            <MetricSelector
              selectedMetric={selectedMetric}
              onMetricChange={setSelectedMetric}
            />
          </div>
          <TopPerformersTable players={topPlayers} loading={topLoading} metric={selectedMetric} />
        </>
      ),
    },
    {
      id: 'scatter',
      label: '📈 xG vs Goals',
      children: (
        <>
          <div className="section-header">
            <h2>Goals vs xG (Min {minMinutes} mins)</h2>
          </div>
          <ScatterPlot data={scatterData} loading={scatterLoading} />
        </>
      ),
    },
    {
      id: 'full-table',
      label: '📋 Full Table',
      children: (
        <>
          <div className="section-header">
            <h2>All Players (Filtered)</h2>
          </div>
          <FullTable players={players} loading={playersLoading} />
        </>
      ),
    },
  ];

  return (
    <div className="app-layout">
      <header className="header">
        <div className="header-content">
          <h1>⚽ Premier League 2015/16 - Player Analytics</h1>
          <p className="caption">Data: StatsBomb Open Data | Built with Next.js & Recharts</p>
        </div>
      </header>

      <aside className="filter-sidebar">
        <FilterSidebar
          minMinutes={minMinutes}
          onMinMinutesChange={setMinMinutes}
          maxMinutes={maxMinutes}
        />
      </aside>

      <main className="main-content">
        <MetricsCards metrics={metrics} loading={metricsLoading} />

        <Tabs tabs={tabs} defaultTab="top-performers" />
      </main>

      <footer className="footer">
        <p>Per 90 metrics only for players with {'>'} 0 minutes.</p>
      </footer>
    </div>
  );
}