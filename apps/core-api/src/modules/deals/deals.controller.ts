import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { JwtGuard } from '../../auth/jwt.guard';
import { Org } from '../../auth/org.decorator';

@ApiTags('deals')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly svc: DealsService) {}

  @Get()
  list(@Org() orgId: string) {
    return this.svc.list(orgId);
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

