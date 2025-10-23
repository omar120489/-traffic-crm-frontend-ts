import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, query: PaginationQueryDto): Promise<{
        items: ({
            contact: {
                orgId: string;
                name: string;
                email: string | null;
                phone: string | null;
                companyId: string | null;
                id: string;
                createdAt: Date;
            } | null;
        } & {
            orgId: string;
            id: string;
            createdAt: Date;
            contactId: string | null;
            source: string | null;
            status: string;
            score: number;
            ownerId: string | null;
        })[];
        total: number;
    }>;
    get(orgId: string, id: string): Promise<{
        contact: {
            orgId: string;
            name: string;
            email: string | null;
            phone: string | null;
            companyId: string | null;
            id: string;
            createdAt: Date;
        } | null;
    } & {
        orgId: string;
        id: string;
        createdAt: Date;
        contactId: string | null;
        source: string | null;
        status: string;
        score: number;
        ownerId: string | null;
    }>;
    create(orgId: string, dto: CreateLeadDto): import("@prisma/client").Prisma.Prisma__LeadClient<{
        orgId: string;
        id: string;
        createdAt: Date;
        contactId: string | null;
        source: string | null;
        status: string;
        score: number;
        ownerId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(orgId: string, id: string, dto: UpdateLeadDto): Promise<{
        orgId: string;
        id: string;
        createdAt: Date;
        contactId: string | null;
        source: string | null;
        status: string;
        score: number;
        ownerId: string | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
