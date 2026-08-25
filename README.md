# Premier League 2015/16 Analytics Dashboard

A full-stack analytics dashboard for Premier League 2015/16 player statistics.

## Architecture

```
pl-analytics/
├── backend/          # Node.js/Express API
│   ├── server.js     # Main server with REST endpoints
│   ├── data/         # CSV data files
│   └── package.json
└── frontend/         # Next.js/React Dashboard
    ├── src/
    │   ├── app/      # Next.js App Router pages
    │   ├── components/  # React components
    │   ├── hooks/    # Custom React hooks
    │   ├── types/    # TypeScript types
    │   └── globals.css
    └── package.json
```

## Features

- **Metrics Dashboard**: Total players, goals, xG, avg goals p90
- **Top Performers**: Sortable table by any metric (goals, xG, assists, xA, per 90 variants)
- **Scatter Plot**: Interactive xG vs Goals visualization with reference line
- **Full Table**: Complete player listing with all stats
- **Filters**: Minimum minutes played slider
- **Responsive Design**: Works on desktop and mobile

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/players?min_minutes=270` | Filtered player list |
| `GET /api/metrics?min_minutes=270` | Aggregated metrics |
| `GET /api/top-performers?min_minutes=270&metric=goals&limit=20` | Top N players by metric |
| `GET /api/scatter-data?min_minutes=270` | Data for xG vs Goals plot |

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

The frontend proxies API calls to the backend via `/api/backend/*` rewrites.

## Data Source

Sample data based on StatsBomb Open Data for Premier League 2015/16 season. Replace `backend/data/player_stats_pl_15_16.csv` with the full dataset.

## Tech Stack

- **Backend**: Node.js, Express, csv-parser, CORS
- **Frontend**: Next.js 14, React 18, TypeScript, Recharts
- **Styling**: Vanilla CSS with CSS Variables

## License

MIT