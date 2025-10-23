import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class ContactsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, query: PaginationQueryDto): Promise<{
        items: ({
            company: {
                orgId: string;
                name: string;
                id: string;
                createdAt: Date;
                domain: string | null;
            } | null;
        } & {
            orgId: string;
            name: string;
            email: string | null;
            phone: string | null;
            companyId: string | null;
            id: string;
            createdAt: Date;
        })[];
        total: number;
    }>;
    get(orgId: string, id: string): Promise<{
        orgId: string;
        name: string;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        createdAt: Date;
    }>;
    create(data: CreateContactDto): import("@prisma/client").Prisma.Prisma__ContactClient<{
        orgId: string;
        name: string;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(orgId: string, id: string, data: UpdateContactDto): Promise<{
        orgId: string;
        name: string;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        createdAt: Date;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
