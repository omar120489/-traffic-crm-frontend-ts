import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StagesService } from './stages.service';

@ApiTags('stages')
@ApiBearerAuth()
@Controller('stages')
export class StagesController {
  constructor(private readonly stages: StagesService) {}

  @Get()
  @ApiOperation({ summary: 'List stages for a pipeline' })
  async list(@Query('pipelineId') pipelineId: string) {
    return this.stages.list(pipelineId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new stage' })
  async create(
    @Body() data: { orgId: string; pipelineId: string; name: string; order: number; probability?: number },
  ) {
    return this.stages.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update stage' })
  async update(@Param('id') id: string, @Body() data: { name?: string; order?: number; probability?: number }) {
    return this.stages.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete stage' })
  async delete(@Param('id') id: string) {
    return this.stages.delete(id);
  }

  @Put('reorder')
  @ApiOperation({ summary: 'Reorder stages in a pipeline' })
  async reorder(@Body() data: { pipelineId: string; stageIds: string[] }) {
    return this.stages.reorder(data.pipelineId, data.stageIds);
  }
}

