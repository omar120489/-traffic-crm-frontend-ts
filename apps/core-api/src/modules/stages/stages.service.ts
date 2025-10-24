import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StagesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(pipelineId: string) {
    return this.prisma.stage.findMany({
      where: { pipelineId },
      orderBy: { order: 'asc' },
    });
  }

  async create(data: { orgId: string; pipelineId: string; name: string; order: number; probability?: number }) {
    return this.prisma.stage.create({ data });
  }

  async update(id: string, data: { name?: string; order?: number; probability?: number }) {
    return this.prisma.stage.update({ where: { id }, data });
  }

  async delete(id: string) {
    // NOTE: Stage deletion will fail if deals reference it (FK constraint)
    // Consider implementing cascade or deal reassignment in future
    return this.prisma.stage.delete({ where: { id } });
  }

  async reorder(pipelineId: string, stageIds: string[]) {
    // Batch update stage order
    const updates = stageIds.map((id, index) =>
      this.prisma.stage.update({
        where: { id },
        data: { order: index + 1 },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true, stageIds };
  }
}

