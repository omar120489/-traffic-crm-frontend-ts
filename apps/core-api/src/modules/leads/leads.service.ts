import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string) {
    return this.prisma.lead.findMany({
      where: { orgId },
      include: { contact: true }
    });
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

