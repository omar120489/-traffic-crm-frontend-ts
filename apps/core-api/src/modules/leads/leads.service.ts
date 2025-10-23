import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async list(orgId: string, query: PaginationQueryDto) {
    const { page, size, search } = query;
    const skip = (page - 1) * size;

    const where = {
      orgId,
      ...(search && {
        OR: [
          { source: { contains: search, mode: 'insensitive' as const } },
          { status: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: { contact: true },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { items, total };
  }

  async get(orgId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, orgId },
      include: { contact: true }
    });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return lead;
  }

  create(orgId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({ data: { ...dto, orgId } });
  }

  async update(orgId: string, id: string, dto: UpdateLeadDto) {
    await this.get(orgId, id);
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await this.prisma.lead.delete({ where: { id } });
    return { id, deleted: true };
  }
}

