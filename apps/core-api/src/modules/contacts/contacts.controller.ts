import { Controller, Get, Param, Body, Post, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dto';
import { JwtGuard } from '../../auth/jwt.guard';
import { Org } from '../../auth/org.decorator';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@ApiTags('contacts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly svc: ContactsService) {}

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
  create(@Body() dto: CreateContactDto, @Org() orgId: string) {
    return this.svc.create({ ...dto, orgId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @Org() orgId: string
  ) {
    return this.svc.update(orgId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Org() orgId: string) {
    return this.svc.remove(orgId, id);
  }
}

