import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';

@ApiTags('tags')
@ApiBearerAuth()
@Controller('tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'List all tags for org' })
  async list(@Query('orgId') orgId: string) {
    return this.tags.list(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  async create(@Body() data: { orgId: string; name: string; color?: string }) {
    return this.tags.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tag' })
  async update(@Param('id') id: string, @Body() data: { name?: string; color?: string }) {
    return this.tags.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tag' })
  async delete(@Param('id') id: string) {
    return this.tags.delete(id);
  }

  // Tag assignments
  @Post('assign')
  @ApiOperation({ summary: 'Assign tag to entity' })
  async assign(@Body() data: { orgId: string; tagId: string; entityType: string; entityId: string }) {
    return this.tags.assign(data);
  }

  @Delete('assign/:id')
  @ApiOperation({ summary: 'Remove tag assignment' })
  async unassign(@Param('id') assignmentId: string) {
    return this.tags.unassign(assignmentId);
  }

  @Get('entity')
  @ApiOperation({ summary: 'Get tags for a specific entity' })
  async getEntityTags(@Query('entityType') entityType: string, @Query('entityId') entityId: string) {
    return this.tags.getEntityTags(entityType, entityId);
  }
}

