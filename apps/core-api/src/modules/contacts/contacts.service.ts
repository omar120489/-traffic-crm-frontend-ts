import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto } from './dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string) {
    return this.prisma.contact.findMany({
      where: { orgId },
      include: { company: true }
    });
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
    return this.prisma.contact.create({ data });
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

