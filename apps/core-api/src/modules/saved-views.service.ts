import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSavedViewDto, UpdateSavedViewDto } from './saved-views.dto';

@Injectable()
export class SavedViewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List all saved views for a user (personal + default/shared)
   */
  async findAll(orgId: string, userId: string) {
    const [personalViews, defaultViews] = await Promise.all([
      // User's personal views
      this.prisma.savedView.findMany({
        where: { orgId, userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          User: { select: { id: true, name: true, email: true } },
        },
      }),
      // Default/shared views (created by admins)
      this.prisma.savedView.findMany({
        where: {
          orgId,
          OR: [{ isDefault: true }, { isShared: true }],
        },
        orderBy: { name: 'asc' },
        include: {
          User: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return {
      personal: personalViews,
      default: defaultViews,
    };
  }

  /**
   * Get a single saved view by ID
   */
  async findOne(id: string, orgId: string, userId: string) {
    const view = await this.prisma.savedView.findFirst({
      where: { id, orgId },
      include: {
        User: { select: { id: true, name: true, email: true } },
      },
    });

    if (!view) {
      throw new NotFoundException(`Saved view ${id} not found`);
    }

    // Check access: owner, or default/shared
    if (view.userId !== userId && !view.isDefault && !view.isShared) {
      throw new ForbiddenException('You do not have access to this view');
    }

    return view;
  }

  /**
   * Create a new saved view
   */
  async create(orgId: string, userId: string, dto: CreateSavedViewDto) {
    // Check if name already exists for this user
    const existing = await this.prisma.savedView.findUnique({
      where: {
        orgId_userId_name: {
          orgId,
          userId,
          name: dto.name,
        },
      },
    });

    if (existing) {
      throw new ForbiddenException(`A view named "${dto.name}" already exists`);
    }

    return this.prisma.savedView.create({
      data: {
        orgId,
        userId,
        name: dto.name,
        filters: dto.filters as Prisma.InputJsonValue,
        isDefault: dto.isDefault ?? false,
        isShared: dto.isShared ?? false,
      },
      include: {
        User: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Update a saved view
   */
  async update(id: string, orgId: string, userId: string, dto: UpdateSavedViewDto) {
    const view = await this.prisma.savedView.findFirst({
      where: { id, orgId },
    });

    if (!view) {
      throw new NotFoundException(`Saved view ${id} not found`);
    }

    // Only owner can update (unless admin)
    if (view.userId !== userId) {
      throw new ForbiddenException('You can only update your own views');
    }

    // If renaming, check for conflicts
    if (dto.name && dto.name !== view.name) {
      const existing = await this.prisma.savedView.findUnique({
        where: {
          orgId_userId_name: {
            orgId,
            userId,
            name: dto.name,
          },
        },
      });

      if (existing) {
        throw new ForbiddenException(`A view named "${dto.name}" already exists`);
      }
    }

    return this.prisma.savedView.update({
      where: { id },
      data: {
        name: dto.name,
        ...(dto.filters !== undefined
          ? { filters: dto.filters as Prisma.InputJsonValue }
          : {}),
        isDefault: dto.isDefault,
        isShared: dto.isShared,
      },
      include: {
        User: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Delete a saved view
   */
  async remove(id: string, orgId: string, userId: string) {
    const view = await this.prisma.savedView.findFirst({
      where: { id, orgId },
    });

    if (!view) {
      throw new NotFoundException(`Saved view ${id} not found`);
    }

    // Only owner can delete (unless admin)
    if (view.userId !== userId) {
      throw new ForbiddenException('You can only delete your own views');
    }

    await this.prisma.savedView.delete({
      where: { id },
    });

    return { success: true };
  }
}
