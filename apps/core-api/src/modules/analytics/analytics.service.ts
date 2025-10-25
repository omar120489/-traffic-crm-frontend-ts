import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsQueryDto, AnalyticsResponseDto, ActivityType } from './analytics.dto';

type Role = 'admin' | 'manager' | 'user' | 'viewer';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchAnalytics(
    user: { id: string; orgId: string; role: Role },
    q: AnalyticsQueryDto,
  ): Promise<AnalyticsResponseDto> {
    // Resolve date range (default: last 30 days inclusive)
    const end = q.to ? this.parseDate(q.to) : this.startOfDay(new Date());
    const start = q.from ? this.parseDate(q.from) : this.addDays(end, -29);

    // Build query filters
    const where = this.buildWhereClause(user, q, start, end);
    if (!where) {
      return this.emptyResponse(start, end);
    }

    // Fetch raw activities
    const acts = await this.prisma.activity.findMany({
      where,
      select: {
        id: true,
        type: true,
        createdAt: true,
        authorId: true,
        completedAt: true,
        dueAt: true,
      },
    });

    // Calculate KPIs
    const kpis = this.calculateKpis(acts, start, end);

    // Calculate by-day aggregation
    const byDay = this.calculateByDay(acts, start, end);

    // Calculate activity mix
    const mix = this.calculateMix(acts);

    // Calculate top contributors
    const topContributors = await this.calculateTopContributors(acts);

    return { kpis, byDay, mix, topContributors };
  }

  private buildWhereClause(
    user: { id: string; orgId: string; role: Role },
    q: AnalyticsQueryDto,
    start: Date,
    end: Date,
  ): Record<string, unknown> | null {
    const where: any = {
      orgId: user.orgId,
      createdAt: {
        gte: start,
        lte: this.addDays(end, 1), // end is inclusive
      },
    };

    if (q.types?.length) {
      where.type = { in: q.types };
    }

    // Role scoping
    if (user.role === 'user' || user.role === 'viewer') {
      where.authorId = user.id;
    }

    if (q.users?.length) {
      if (where.authorId) {
        // If already scoped to user's own activities, only include if they're in the filter
        if (!q.users.includes(user.id)) {
          return null;
        }
      } else {
        where.authorId = { in: q.users };
      }
    }

    return where;
  }

  private calculateKpis(acts: any[], start: Date, end: Date) {
    const totalActivities = acts.length;
    const uniqueUsers = new Set(acts.map(a => a.authorId)).size;
    const days = Math.max(1, this.differenceInDays(this.addDays(end, 1), start));
    const avgDaily = totalActivities / days;

    const medianTtfMs = this.calculateMedianTtf(acts);

    return {
      totalActivities,
      activeUsers: uniqueUsers,
      avgDailyActivities: Number(avgDaily.toFixed(1)),
      medianTimeToFirstResponseMs: Math.round(medianTtfMs),
    };
  }

  private calculateMedianTtf(acts: any[]): number {
    const ttfMs = acts
      .filter(a => a.completedAt && a.createdAt)
      .map(a => a.completedAt!.getTime() - a.createdAt.getTime())
      .sort((a, b) => a - b);

    if (ttfMs.length === 0) return 0;
    
    const mid = Math.floor(ttfMs.length / 2);
    return ttfMs.length % 2 === 1
      ? ttfMs[mid]
      : (ttfMs[mid - 1] + ttfMs[mid]) / 2;
  }

  private calculateByDay(acts: any[], start: Date, end: Date) {
    const byDayMap = new Map<string, number>();
    for (let d = start; d <= end; d = this.addDays(d, 1)) {
      byDayMap.set(this.formatDate(d), 0);
    }
    for (const a of acts) {
      const key = this.formatDate(a.createdAt);
      if (byDayMap.has(key)) {
        byDayMap.set(key, (byDayMap.get(key) ?? 0) + 1);
      }
    }
    return Array.from(byDayMap.entries()).map(([date, count]) => ({ date, count }));
  }

  private calculateMix(acts: any[]) {
    const allowedTypes: ActivityType[] = ['call', 'email', 'meeting', 'note', 'task'];
    const mixCounts: Record<ActivityType, number> = {
      call: 0,
      email: 0,
      meeting: 0,
      note: 0,
      task: 0,
    };
    
    for (const a of acts) {
      if (allowedTypes.includes(a.type as ActivityType)) {
        mixCounts[a.type as ActivityType] += 1;
      }
    }
    
    const totalActivities = acts.length;
    return allowedTypes.map(t => ({
      type: t,
      count: mixCounts[t],
      percent: totalActivities ? (mixCounts[t] / totalActivities) * 100 : 0,
    }));
  }

  private async calculateTopContributors(acts: any[]) {
    const countsByUser = new Map<string, number>();
    for (const a of acts) {
      countsByUser.set(a.authorId, (countsByUser.get(a.authorId) ?? 0) + 1);
    }
    
    const top10 = [...countsByUser.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (top10.length === 0) return [];

    const users = await this.prisma.user.findMany({
      where: { id: { in: top10.map(([id]) => id) } },
      select: { id: true, name: true, email: true },
    });

    const byId = new Map(users.map(u => [u.id, u]));
    return top10.map(([id, count]) => ({
      userId: id,
      name: byId.get(id)?.name ?? 'Unknown',
      avatarUrl: undefined,
      count,
    }));
  }

  private emptyResponse(start: Date, end: Date): AnalyticsResponseDto {
    const byDay: { date: string; count: number }[] = [];
    for (let d = start; d <= end; d = this.addDays(d, 1)) {
      byDay.push({ date: this.formatDate(d), count: 0 });
    }
    return {
      kpis: {
        totalActivities: 0,
        activeUsers: 0,
        avgDailyActivities: 0,
        medianTimeToFirstResponseMs: 0,
      },
      byDay,
      mix: [
        { type: 'call', count: 0, percent: 0 },
        { type: 'email', count: 0, percent: 0 },
        { type: 'meeting', count: 0, percent: 0 },
        { type: 'note', count: 0, percent: 0 },
        { type: 'task', count: 0, percent: 0 },
      ],
      topContributors: [],
    };
  }

  // Date utilities (avoiding date-fns dependency in backend)
  private parseDate(dateStr: string): Date {
    return new Date(dateStr + 'T00:00:00.000Z');
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  }

  private differenceInDays(date1: Date, date2: Date): number {
    const ms = date1.getTime() - date2.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
