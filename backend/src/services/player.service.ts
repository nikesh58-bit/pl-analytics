import { prisma } from '../lib/prisma';
import { cacheKey, getCached, setCached } from '../lib/redis';
import { PaginatedResponse, FilterParams } from '@pl-analytics/shared';

export class PlayerService {
  static async getAll(params: FilterParams = {}): Promise<PaginatedResponse<any>> {
    const key = cacheKey('players', 'list', JSON.stringify(params));
    const cached = await getCached<PaginatedResponse<any>>(key);
    if (cached) return cached;

    const { teamId, competitionId, seasonId, position, nationality, minMinutes = 0, search, limit = 20, offset = 0, sortBy = 'goals', sortOrder = 'desc' } = params;

    const where: any = {};
    if (teamId) where.currentTeamId = teamId;
    if (nationality) where.nationality = nationality;
    if (position) where.position = position;
    if (search) where.OR = [{ displayName: { contains: search, mode: 'insensitive' } }, { firstName: { contains: search, mode: 'insensitive' } }, { lastName: { contains: search, mode: 'insensitive' } }];
    if (seasonId || competitionId || minMinutes > 0) {
      where.seasonStats = { some: { ...(seasonId ? { seasonId } : {}), ...(competitionId ? { competitionId } : {}), ...(minMinutes > 0 ? { minutesPlayed: { gte: minMinutes } } : {}) } };
    }

    const orderBy: any = {};
    if (seasonId || competitionId) orderBy.seasonStats = { _count: sortOrder };
    else orderBy[sortBy] = sortOrder;

    const [data, total] = await Promise.all([
      prisma.player.findMany({ where, take: limit, skip: offset, orderBy, include: { currentTeam: { select: { id: true, name: true, shortName: true, crestUrl: true } }, seasonStats: { where: { ...(seasonId ? { seasonId } : {}), ...(competitionId ? { competitionId } : {}) }, include: { season: true, competition: true, team: true } } } }),
      prisma.player.count({ where }),
    ]);

    const result = { data, total, page: Math.floor(offset / limit) + 1, pageSize: limit, totalPages: Math.ceil(total / limit) };
    await setCached(key, result, 300);
    return result;
  }

  static async getById(id: string) {
    const key = cacheKey('players', 'detail', id);
    const cached = await getCached(key);
    if (cached) return cached;

    const player = await prisma.player.findUnique({
      where: { id },
      include: { currentTeam: true, seasonStats: { include: { season: true, competition: true, team: true }, orderBy: { season: { startDate: 'desc' } } } },
    });

    if (player) await setCached(key, player, 300);
    return player;
  }

  static async getSeasonStats(playerId: string, seasonId: string, competitionId?: string) {
    const key = cacheKey('players', 'season-stats', playerId, seasonId, competitionId || 'all');
    const cached = await getCached(key);
    if (cached) return cached;

    const where: any = { playerId, seasonId };
    if (competitionId) where.competitionId = competitionId;
    const stats = await prisma.playerSeasonStats.findFirst({ where, include: { team: true, season: true, competition: true } });
    if (stats) await setCached(key, stats, 600);
    return stats;
  }

  static async getCareerStats(playerId: string) {
    const key = cacheKey('players', 'career', playerId);
    const cached = await getCached(key);
    if (cached) return cached;

    const stats = await prisma.playerSeasonStats.findMany({ where: { playerId }, include: { season: true, competition: true, team: true }, orderBy: { season: { startDate: 'desc' } } });
    const career = stats.reduce((acc, s) => ({ appearances: acc.appearances + s.appearances, minutesPlayed: acc.minutesPlayed + s.minutesPlayed, goals: acc.goals + s.goals, assists: acc.assists + s.assists, xG: acc.xG + s.xG, xA: acc.xA + s.xA, shots: acc.shots + s.shots, shotsOnTarget: acc.shotsOnTarget + s.shotsOnTarget }), { appearances: 0, minutesPlayed: 0, goals: 0, assists: 0, xG: 0, xA: 0, shots: 0, shotsOnTarget: 0 });
    await setCached(key, { career, bySeason: stats }, 600);
    return { career, bySeason: stats };
  }

  static async comparePlayers(playerIds: string[], seasonId?: string, competitionId?: string) {
    const key = cacheKey('players', 'compare', playerIds.sort().join(','), seasonId || 'all', competitionId || 'all');
    const cached = await getCached(key);
    if (cached) return cached;

    const where: any = { playerId: { in: playerIds } };
    if (seasonId) where.seasonId = seasonId;
    if (competitionId) where.competitionId = competitionId;
    const stats = await prisma.playerSeasonStats.findMany({ where, include: { player: true, team: true } });
    await setCached(key, stats, 600);
    return stats;
  }

  static async getTopPerformers(metric: string, params: FilterParams = {}) {
    const key = cacheKey('players', 'top', metric, JSON.stringify(params));
    const cached = await getCached(key);
    if (cached) return cached;

    const validMetrics = ['goals', 'assists', 'xG', 'xA', 'goals_p90', 'xg_p90', 'assists_p90', 'xa_p90'];
    if (!validMetrics.includes(metric)) metric = 'goals';

    const { seasonId, competitionId, teamId, minMinutes = 270, limit = 20 } = params;
    const per90Metrics = ['goals_p90', 'xg_p90', 'assists_p90', 'xa_p90'];
    const isPer90 = per90Metrics.includes(metric);

    if (isPer90) {
      const field = metric.replace('_p90', '');
      // For per-90, we'd need raw SQL - returning empty for now
      return [];
    } else {
      const orderField = metric === 'xG' ? 'xG' : metric === 'xA' ? 'xA' : metric;
      const stats = await prisma.playerSeasonStats.findMany({
        where: { minutesPlayed: { gte: minMinutes }, ...(seasonId ? { seasonId } : {}), ...(competitionId ? { competitionId } : {}), ...(teamId ? { teamId } : {}) },
        orderBy: { [orderField]: 'desc' }, take: limit, include: { player: true, team: true },
      });
      await setCached(key, stats, 300);
      return stats;
    }
  }
}