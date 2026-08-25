'use client';

import { Player } from '@/types';

interface TopPerformersTableProps {
  players: Player[];
  loading: boolean;
  metric: string;
}

const metricLabels: Record<string, string> = {
  goals: 'Goals',
  xg: 'xG',
  assists: 'Assists',
  xa: 'xA',
  goals_p90: 'Goals p90',
  xg_p90: 'xG p90',
  assists_p90: 'Assists p90',
  xa_p90: 'xA p90',
};

const formatValue = (metric: string, value: number): string => {
  if (['xg', 'xa', 'goals_p90', 'xg_p90', 'assists_p90', 'xa_p90'].includes(metric)) {
    return value.toFixed(2);
  }
  return value.toString();
};

export function TopPerformersTable({ players, loading, metric }: TopPerformersTableProps) {
  if (loading) {
    return (
      <div className="table-container">
        <table className="data-table" role="table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Min</th>
              <th>Goals</th>
              <th>xG</th>
              <th>Assists</th>
              <th>xA</th>
              <th>G p90</th>
              <th>xG p90</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="skeleton-row">
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-container" role="region" aria-label={`Top 20 by ${metricLabels[metric] || metric}`}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Min</th>
            <th>Goals</th>
            <th>xG</th>
            <th>Assists</th>
            <th>xA</th>
            <th>G p90</th>
            <th>xG p90</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.player}>
              <td className="player-name">{index + 1}. {player.player}</td>
              <td>{player.minutes_played}</td>
              <td>{player.goals}</td>
              <td>{player.xg.toFixed(2)}</td>
              <td>{player.assists}</td>
              <td>{player.xa.toFixed(2)}</td>
              <td>{player.goals_p90.toFixed(2)}</td>
              <td>{player.xg_p90.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}