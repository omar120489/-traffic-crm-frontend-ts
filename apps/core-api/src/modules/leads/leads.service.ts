import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

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
        include: { Contact: true },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { items, total };
  }

  async get(orgId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, orgId },
      include: { Contact: true }
    });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return lead;
  }

  create(orgId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        status: dto.status ?? 'new',
        score: dto.score ?? 0,
        notes: dto.notes,
        Org: { connect: { id: orgId } },
        ...(dto.contactId ? { Contact: { connect: { id: dto.contactId } } } : {}),
        ...(dto.sourceId ? { LeadSource: { connect: { id: dto.sourceId } } } : {}),
        ...(dto.ownerId ? { User: { connect: { id: dto.ownerId } } } : {}),
      },
    });
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

