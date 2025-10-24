import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, query: PaginationQueryDto): Promise<{
        items: {
            orgId: string;
            id: string;
            ownerId: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            contactId: string;
            score: number | null;
            sourceId: string | null;
            notes: string | null;
        }[];
        total: number;
    }>;
    get(orgId: string, id: string): Promise<{
        orgId: string;
        id: string;
        ownerId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        contactId: string;
        score: number | null;
        sourceId: string | null;
        notes: string | null;
    }>;
    create(orgId: string, dto: CreateLeadDto): import("@prisma/client").Prisma.Prisma__LeadClient<{
        orgId: string;
        id: string;
        ownerId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        contactId: string;
        score: number | null;
        sourceId: string | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(orgId: string, id: string, dto: UpdateLeadDto): Promise<{
        orgId: string;
        id: string;
        ownerId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        contactId: string;
        score: number | null;
        sourceId: string | null;
        notes: string | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
