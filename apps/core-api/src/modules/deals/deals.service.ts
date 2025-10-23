import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async list(orgId: string, query: PaginationQueryDto) {
    const { page, size, search } = query;
    const skip = (page - 1) * size;

    const where = {
      orgId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { stage: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: { contact: true, company: true },
      }),
      this.prisma.deal.count({ where }),
    ]);

    return { items, total };
  }

  async get(orgId: string, id: string) {
    const deal = await this.prisma.deal.findFirst({
      where: { id, orgId },
      include: { contact: true, company: true }
    });
    if (!deal) {
      throw new NotFoundException('Deal not found');
    }
    return deal;
  }

  create(orgId: string, dto: CreateDealDto) {
    return this.prisma.deal.create({ data: { ...dto, orgId } });
  }

  async update(orgId: string, id: string, dto: UpdateDealDto) {
    await this.get(orgId, id);
    return this.prisma.deal.update({ where: { id }, data: dto });
  }

  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await this.prisma.deal.delete({ where: { id } });
    return { id, deleted: true };
  }
}

