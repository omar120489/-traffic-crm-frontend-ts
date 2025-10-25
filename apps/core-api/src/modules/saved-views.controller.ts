import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SavedViewsService } from './saved-views.service';
import { CreateSavedViewDto, UpdateSavedViewDto } from './saved-views.dto';

@Controller('saved-views')
@UseGuards(JwtAuthGuard)
export class SavedViewsController {
  constructor(private readonly savedViewsService: SavedViewsService) {}

  /**
   * GET /api/saved-views
   * List all saved views (personal + default/shared)
   */
  @Get()
  async findAll(@Req() req: any) {
    const { orgId, userId } = req.user;
    return this.savedViewsService.findAll(orgId, userId);
  }

  /**
   * GET /api/saved-views/:id
   * Get a single saved view
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const { orgId, userId } = req.user;
    return this.savedViewsService.findOne(id, orgId, userId);
  }

  /**
   * POST /api/saved-views
   * Create a new saved view
   */
  @Post()
  async create(@Body() dto: CreateSavedViewDto, @Req() req: any) {
    const { orgId, userId } = req.user;
    return this.savedViewsService.create(orgId, userId, dto);
  }

  /**
   * PATCH /api/saved-views/:id
   * Update a saved view
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSavedViewDto,
    @Req() req: any,
  ) {
    const { orgId, userId } = req.user;
    return this.savedViewsService.update(id, orgId, userId, dto);
  }

  /**
   * DELETE /api/saved-views/:id
   * Delete a saved view
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const { orgId, userId } = req.user;
    return this.savedViewsService.remove(id, orgId, userId);
  }
}

