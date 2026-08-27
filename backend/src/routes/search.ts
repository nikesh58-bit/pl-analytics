import { Router } from 'express';
import { searchAll, searchTeams, searchPlayers } from '../lib/meilisearch';
import { cacheMiddleware } from '../middleware/cache';
import { optionalApiKey, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(optionalApiKey);

router.get('/', cacheMiddleware(300, 'search'), async (req: AuthenticatedRequest, res) => {
  try { const { q, limit = 5 } = req.query; if (!q || (q as string).length < 2) return res.json({ teams: { hits: [] }, players: { hits: [] }, competitions: { hits: [] } }); const results = await searchAll(q as string, parseInt(limit as string)); res.json(results); } catch (error) { console.error('Search error:', error); res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Search failed' }); }
});

router.get('/teams', cacheMiddleware(300, 'search'), async (req: AuthenticatedRequest, res) => {
  try { const { q, limit = 10, country } = req.query; if (!q || (q as string).length < 2) return res.json({ hits: [] }); const filter = country ? `country = "${country}"` : undefined; const results = await searchTeams(q as string, { limit: parseInt(limit as string), filter }); res.json(results); } catch (error) { console.error('Team search error:', error); res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Team search failed' }); }
});

router.get('/players', cacheMiddleware(300, 'search'), async (req: AuthenticatedRequest, res) => {
  try { const { q, limit = 10, teamId, position } = req.query; if (!q || (q as string).length < 2) return res.json({ hits: [] }); const filters: string[] = []; if (teamId) filters.push(`teamId = "${teamId}"`); if (position) filters.push(`position = "${position}"`); const filter = filters.length > 0 ? filters.join(' AND ') : undefined; const results = await searchPlayers(q as string, { limit: parseInt(limit as string), filter }); res.json(results); } catch (error) { console.error('Player search error:', error); res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Player search failed' }); }
});

export default router;