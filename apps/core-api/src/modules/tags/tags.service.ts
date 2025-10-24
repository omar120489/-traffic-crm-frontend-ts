import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(orgId: string) {
    return this.prisma.tag.findMany({
      where: { orgId },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { orgId: string; name: string; color?: string }) {
    return this.prisma.tag.create({ data });
  }

  async update(id: string, data: { name?: string; color?: string }) {
    return this.prisma.tag.update({ where: { id }, data });
  }

  async delete(id: string) {
    // Delete tag and all assignments
    await this.prisma.tagAssignment.deleteMany({ where: { tagId: id } });
    return this.prisma.tag.delete({ where: { id } });
  }

  async assign(data: { orgId: string; tagId: string; entityType: string; entityId: string }) {
    return this.prisma.tagAssignment.create({
      data: {
        Org: { connect: { id: data.orgId } },
        Tag: { connect: { id: data.tagId } },
        entityType: data.entityType,
        entityId: data.entityId,
      },
    });
  }

  async unassign(assignmentId: string) {
    return this.prisma.tagAssignment.delete({ where: { id: assignmentId } });
  }

  async getEntityTags(entityType: string, entityId: string) {
    const assignments = await this.prisma.tagAssignment.findMany({
      where: { entityType, entityId },
      include: { Tag: true },
    });
    return assignments.map((a) => a.Tag);
  }
}

