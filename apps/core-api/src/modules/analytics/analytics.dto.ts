import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task';

export class AnalyticsQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string; // inclusive UTC ISO (frontend uses "from")

  @IsOptional()
  @IsDateString()
  to?: string;   // inclusive UTC ISO (frontend uses "to")

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v: string) => v.trim()).filter(Boolean);
    }
    return Array.isArray(value) ? value : [];
  })
  @IsArray()
  users?: string[]; // filter by assignee/creator/etc

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v: string) => v.trim()).filter(Boolean);
    }
    return Array.isArray(value) ? value : [];
  })
  @IsArray()
  @IsEnum(['call', 'email', 'meeting', 'note', 'task'], { each: true })
  types?: ActivityType[];

  @IsOptional()
  @IsString()
  tz?: string; // for future server-side TZ bucketing if desired
}

export type ByDayPoint = { date: string; count: number };
export type MixSlice = { type: ActivityType; count: number; percent: number };
export type Contributor = { userId: string; name: string; avatarUrl?: string; count: number };

export class AnalyticsResponseDto {
  kpis!: {
    totalActivities: number;
    activeUsers: number;
    avgDailyActivities: number;
    medianTimeToFirstResponseMs: number;
  };

  byDay!: ByDayPoint[];
  mix!: MixSlice[];
  topContributors!: Contributor[];
}

