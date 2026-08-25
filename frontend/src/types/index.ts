export interface Player {
  player: string;
  team: string;
  minutes_played: number;
  goals: number;
  xg: number;
  assists: number;
  xa: number;
  goals_p90: number;
  xg_p90: number;
  assists_p90: number;
  xa_p90: number;
}

export interface Metrics {
  totalPlayers: number;
  totalGoals: number;
  totalXG: number;
  avgGoalsP90: number;
}

export type MetricKey = 'goals' | 'xg' | 'assists' | 'xa' | 'goals_p90' | 'xg_p90' | 'assists_p90' | 'xa_p90';

export interface ScatterPoint {
  player: string;
  xg: number;
  goals: number;
  minutes_played: number;
  goals_p90: number;
}