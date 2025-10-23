import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';
import { JwtGuard } from '../../auth/jwt.guard';
import { Org } from '../../auth/org.decorator';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly svc: LeadsService) {}

  @Get()
  list(@Org() orgId: string) {
    return this.svc.list(orgId);
  }

  @Get(':id')
  get(@Param('id') id: string, @Org() orgId: string) {
    return this.svc.get(orgId, id);
  }

  @Post()
  create(@Body() dto: CreateLeadDto, @Org() orgId: string) {
    return this.svc.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
    @Org() orgId: string
  ) {
    return this.svc.update(orgId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Org() orgId: string) {
    return this.svc.remove(orgId, id);
  }
}

