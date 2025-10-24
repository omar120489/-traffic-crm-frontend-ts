import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';

@ApiTags('activities')
@ApiBearerAuth()
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List activities for an entity' })
  async list(@Query('entityType') entityType: string, @Query('entityId') entityId: string) {
    return this.activities.list(entityType, entityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  async getOne(@Param('id') id: string) {
    return this.activities.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new activity (note, call, email, task, meeting)' })
  async create(
    @Body()
    data: {
      orgId: string;
      type: string;
      entityType: string;
      entityId: string;
      authorId: string;
      subject?: string;
      body?: string;
      dataJson?: any;
      dueAt?: string;
    },
  ) {
    return this.activities.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update activity' })
  async update(
    @Param('id') id: string,
    @Body() data: { subject?: string; body?: string; completedAt?: string; dueAt?: string },
  ) {
    return this.activities.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity' })
  async delete(@Param('id') id: string) {
    return this.activities.delete(id);
  }
}

