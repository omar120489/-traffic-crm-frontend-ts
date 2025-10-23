import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDealDto, UpdateDealDto } from './dto';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string) {
    return this.prisma.deal.findMany({
      where: { orgId },
      include: { contact: true, company: true }
    });
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

