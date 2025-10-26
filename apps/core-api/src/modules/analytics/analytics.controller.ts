import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { JwtGuard } from '../../auth/jwt.guard';
import { Org } from '../../auth/org.decorator';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto, AnalyticsResponseDto } from './analytics.dto';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(CacheInterceptor)
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get()
  @ApiOkResponse({ type: AnalyticsResponseDto })
  async getAnalytics(
    @Query() query: AnalyticsQueryDto,
    @Org() orgId: string,
    @Req() req: any,
  ): Promise<AnalyticsResponseDto> {
    // Extract user info from JWT (injected by JwtGuard)
    const user = {
      id: req.user?.sub ?? 'dev-user',
      orgId,
      role: req.user?.role ?? 'admin',
    };

    return this.service.fetchAnalytics(user, query);
  }
}
