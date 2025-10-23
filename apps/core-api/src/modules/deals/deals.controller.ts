import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { JwtGuard } from '../../auth/jwt.guard';
import { Org } from '../../auth/org.decorator';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@ApiTags('deals')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly svc: DealsService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  async list(@Org() orgId: string, @Query() query: PaginationQueryDto) {
    const { items, total } = await this.svc.list(orgId, query);
    return new PaginatedResponseDto(items, total, query.page, query.size);
  }

  @Get(':id')
  get(@Param('id') id: string, @Org() orgId: string) {
    return this.svc.get(orgId, id);
  }

  @Post()
  create(@Body() dto: CreateDealDto, @Org() orgId: string) {
    return this.svc.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDealDto,
    @Org() orgId: string
  ) {
    return this.svc.update(orgId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Org() orgId: string) {
    return this.svc.remove(orgId, id);
  }
}

