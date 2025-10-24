import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(orgId: string, query: PaginationQueryDto) {
    const { page, size, search } = query;
    const skip = (page - 1) * size;

    const where = {
      orgId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: { Company: true },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return { items, total };
  }

  async get(orgId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, orgId }
    });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  create(data: CreateContactDto) {
    return this.prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        title: data.title,
        source: data.source,
        Org: { connect: { id: data.orgId } },
        ...(data.companyId ? { Company: { connect: { id: data.companyId } } } : {}),
        ...(data.ownerId ? { User: { connect: { id: data.ownerId } } } : {}),
      },
    });
  }

  async update(orgId: string, id: string, data: UpdateContactDto) {
    await this.get(orgId, id);
    return this.prisma.contact.update({
      where: { id },
      data
    });
  }

  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await this.prisma.contact.delete({ where: { id } });
    return { id, deleted: true };
  }
}

