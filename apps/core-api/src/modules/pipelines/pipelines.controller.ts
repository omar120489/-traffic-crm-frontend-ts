import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PipelinesService } from './pipelines.service';

@ApiTags('pipelines')
@ApiBearerAuth()
@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelines: PipelinesService) {}

  @Get()
  @ApiOperation({ summary: 'List all pipelines for org' })
  async list(@Query('orgId') orgId: string) {
    return this.pipelines.list(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pipeline by ID' })
  async getOne(@Param('id') id: string) {
    return this.pipelines.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new pipeline' })
  async create(@Body() data: { orgId: string; name: string; isDefault?: boolean }) {
    return this.pipelines.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pipeline' })
  async update(@Param('id') id: string, @Body() data: { name?: string; isDefault?: boolean }) {
    return this.pipelines.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pipeline' })
  async delete(@Param('id') id: string) {
    return this.pipelines.delete(id);
  }
}

