import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(entityType: string, entityId: string) {
    return this.prisma.activity.findMany({
      where: { entityType, entityId },
      include: { User: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: string) {
    return this.prisma.activity.findUniqueOrThrow({
      where: { id },
      include: { User: true },
    });
  }

  async create(data: {
    orgId: string;
    type: string;
    entityType: string;
    entityId: string;
    authorId: string;
    subject?: string;
    body?: string;
    dataJson?: any;
    dueAt?: string;
  }) {
    return this.prisma.activity.create({
      data: {
        ...data,
        dueAt: data.dueAt ? new Date(data.dueAt) : null,
      },
      include: { User: true },
    });
  }

  async update(id: string, data: { subject?: string; body?: string; completedAt?: string; dueAt?: string }) {
    return this.prisma.activity.update({
      where: { id },
      data: {
        ...data,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        dueAt: data.dueAt ? new Date(data.dueAt) : undefined,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.activity.delete({ where: { id } });
  }
}

