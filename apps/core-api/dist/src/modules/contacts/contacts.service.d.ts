import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class ContactsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, query: PaginationQueryDto): Promise<{
        items: {
            orgId: string;
            name: string;
            title: string | null;
            email: string | null;
            phone: string | null;
            companyId: string | null;
            id: string;
            ownerId: string | null;
            source: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    get(orgId: string, id: string): Promise<{
        orgId: string;
        name: string;
        title: string | null;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        source: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: CreateContactDto): import("@prisma/client").Prisma.Prisma__ContactClient<{
        orgId: string;
        name: string;
        title: string | null;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        source: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(orgId: string, id: string, data: UpdateContactDto): Promise<{
        orgId: string;
        name: string;
        title: string | null;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        source: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
