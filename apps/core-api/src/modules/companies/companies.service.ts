import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async list(orgId: string, query: PaginationQueryDto) {
    const { page, size, search } = query;
    const skip = (page - 1) * size;

    const where = {
      orgId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { domain: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    return { items, total };
  }

  async get(orgId: string, id: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, orgId }
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  create(orgId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({ data: { ...dto, orgId } });
  }

  async update(orgId: string, id: string, dto: UpdateCompanyDto) {
    await this.get(orgId, id);
    return this.prisma.company.update({ where: { id }, data: dto });
  }

  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await this.prisma.company.delete({ where: { id } });
    return { id, deleted: true };
  }
}

