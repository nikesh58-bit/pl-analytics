'use client';

import { Player } from '@/types';

interface FullTableProps {
  players: Player[];
  loading: boolean;
}

export function FullTable({ players, loading }: FullTableProps) {
  if (loading) {
    return (
      <div className="table-container">
        <table className="data-table" role="table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Team</th>
              <th>Min</th>
              <th>Goals</th>
              <th>xG</th>
              <th>Assists</th>
              <th>xA</th>
              <th>G p90</th>
              <th>xG p90</th>
              <th>A p90</th>
              <th>xA p90</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="skeleton-row">
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
                <td><div className="skeleton-text short"></div></td>
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

  const sortedPlayers = [...players].sort((a, b) => b.minutes_played - a.minutes_played);

  return (
    <div className="table-container" role="region" aria-label="All players table">
      <table className="data-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Team</th>
            <th>Min</th>
            <th>Goals</th>
            <th>xG</th>
            <th>Assists</th>
            <th>xA</th>
            <th>G p90</th>
            <th>xG p90</th>
            <th>A p90</th>
            <th>xA p90</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.player}>
              <td className="player-name">{index + 1}. {player.player}</td>
              <td>{player.team}</td>
              <td>{player.minutes_played}</td>
              <td>{player.goals}</td>
              <td>{player.xg.toFixed(2)}</td>
              <td>{player.assists}</td>
              <td>{player.xa.toFixed(2)}</td>
              <td>{player.goals_p90.toFixed(2)}</td>
              <td>{player.xg_p90.toFixed(2)}</td>
              <td>{player.assists_p90.toFixed(2)}</td>
              <td>{player.xa_p90.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-caption">Showing {players.length} players | Per 90 metrics only for players with > 0 minutes.</p>
    </div>
  );
}