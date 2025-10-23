import { Controller, Get, Param, Query, Body, Post, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dto';

@ApiTags('contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
  constructor(private readonly svc: ContactsService) {}

  @Get()
  list(@Query('orgId') orgId: string) {
    // Later: read orgId from JWT claims; query param for now
    return this.svc.list(orgId);
  }

  @Get(':id')
  get(@Param('id') id: string, @Query('orgId') orgId: string) {
    return this.svc.get(orgId, id);
  }

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('orgId') orgId: string,
    @Body() dto: UpdateContactDto
  ) {
    return this.svc.update(orgId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('orgId') orgId: string) {
    return this.svc.remove(orgId, id);
  }
}

