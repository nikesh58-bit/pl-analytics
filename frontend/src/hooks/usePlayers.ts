'use client';

import { useState, useEffect, useCallback } from 'react';
import { Player, Metrics, ScatterPoint } from '@/types';

const API_BASE = '/api/backend';

export function usePlayers(minMinutes: number) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/players?min_minutes=${minMinutes}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch players');
        return res.json();
      })
      .then(data => {
        if (!cancelled) setPlayers(data);
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [minMinutes]);

  return { players, loading, error };
}

export function useMetrics(minMinutes: number) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE}/metrics?min_minutes=${minMinutes}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch metrics');
        return res.json();
      })
      .then(data => {
        if (!cancelled) setMetrics(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [minMinutes]);

  return { metrics, loading };
}

export function useTopPerformers(minMinutes: number, metric: string, limit = 20) {
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE}/top-performers?min_minutes=${minMinutes}&metric=${metric}&limit=${limit}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch top performers');
        return res.json();
      })
      .then(data => {
        if (!cancelled) setTopPlayers(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [minMinutes, metric, limit]);

  return { topPlayers, loading };
}

export function useScatterData(minMinutes: number) {
  const [scatterData, setScatterData] = useState<ScatterPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE}/scatter-data?min_minutes=${minMinutes}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch scatter data');
        return res.json();
      })
      .then(data => {
        if (!cancelled) setScatterData(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [minMinutes]);

  return { scatterData, loading };
}