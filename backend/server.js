const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let playersData = [];

function loadCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'data', 'player_stats_pl_15_16.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        playersData = results.map(row => ({
          player: row.player,
          team: row.team || 'Unknown',
          minutes_played: parseInt(row.minutes_played) || 0,
          goals: parseInt(row.goals) || 0,
          xg: parseFloat(row.xg) || 0,
          assists: parseInt(row.assists) || 0,
          xa: parseFloat(row.xa) || 0,
          goals_p90: parseFloat(row.goals_p90) || 0,
          xg_p90: parseFloat(row.xg_p90) || 0,
          assists_p90: parseFloat(row.assists_p90) || 0,
          xa_p90: parseFloat(row.xa_p90) || 0
        }));
        resolve(playersData);
      })
      .on('error', reject);
  });
}

function filterPlayers(minMinutes) {
  return playersData.filter(p => p.minutes_played >= minMinutes);
}

function getMetrics(filtered) {
  return {
    totalPlayers: filtered.length,
    totalGoals: filtered.reduce((sum, p) => sum + p.goals, 0),
    totalXG: parseFloat(filtered.reduce((sum, p) => sum + p.xg, 0).toFixed(1)),
    avgGoalsP90: parseFloat((filtered.reduce((sum, p) => sum + p.goals_p90, 0) / filtered.length || 0).toFixed(2))
  };
}

function getTopPerformers(filtered, metric, limit = 20) {
  const validMetrics = ['goals', 'xg', 'assists', 'xa', 'goals_p90', 'xg_p90', 'assists_p90', 'xa_p90'];
  if (!validMetrics.includes(metric)) metric = 'goals';
  return [...filtered].sort((a, b) => b[metric] - a[metric]).slice(0, limit);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/players', async (req, res) => {
  if (playersData.length === 0) await loadCSV();
  const minMinutes = parseInt(req.query.min_minutes) || 0;
  const filtered = filterPlayers(minMinutes);
  res.json(filtered);
});

app.get('/api/metrics', async (req, res) => {
  if (playersData.length === 0) await loadCSV();
  const minMinutes = parseInt(req.query.min_minutes) || 0;
  const filtered = filterPlayers(minMinutes);
  res.json(getMetrics(filtered));
});

app.get('/api/top-performers', async (req, res) => {
  if (playersData.length === 0) await loadCSV();
  const minMinutes = parseInt(req.query.min_minutes) || 0;
  const metric = req.query.metric || 'goals';
  const limit = parseInt(req.query.limit) || 20;
  const filtered = filterPlayers(minMinutes);
  res.json(getTopPerformers(filtered, metric, limit));
});

app.get('/api/scatter-data', async (req, res) => {
  if (playersData.length === 0) await loadCSV();
  const minMinutes = parseInt(req.query.min_minutes) || 270;
  const filtered = filterPlayers(minMinutes);
  const scatterData = filtered.map(p => ({
    player: p.player,
    xg: p.xg,
    goals: p.goals,
    minutes_played: p.minutes_played,
    goals_p90: p.goals_p90
  }));
  res.json(scatterData);
});

loadCSV().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to load CSV:', err);
  process.exit(1);
});