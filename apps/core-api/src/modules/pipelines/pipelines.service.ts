import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PipelinesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(orgId: string) {
    return this.prisma.pipeline.findMany({
      where: { orgId },
      include: { Stage: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: string) {
    return this.prisma.pipeline.findUniqueOrThrow({
      where: { id },
      include: { Stage: { orderBy: { order: 'asc' } } },
    });
  }

  async create(data: { orgId: string; name: string; isDefault?: boolean }) {
    return this.prisma.pipeline.create({ data });
  }

  async update(id: string, data: { name?: string; isDefault?: boolean }) {
    return this.prisma.pipeline.update({ where: { id }, data });
  }

  async delete(id: string) {
    // NOTE: Pipeline deletion will fail if stages/deals reference it (FK constraint)
    // Consider implementing cascade or stage/deal reassignment in future
    return this.prisma.pipeline.delete({ where: { id } });
  }
}

