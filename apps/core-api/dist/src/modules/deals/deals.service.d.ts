import { PrismaService } from '../../prisma/prisma.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class DealsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, query: PaginationQueryDto): Promise<{
        items: {
            orgId: string;
            title: string;
            companyId: string | null;
            id: string;
            ownerId: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            contactId: string | null;
            amountCents: number | null;
            currency: string;
            closeDate: Date | null;
            stageId: string;
            lostReason: string | null;
        }[];
        total: number;
    }>;
    get(orgId: string, id: string): Promise<{
        orgId: string;
        title: string;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        contactId: string | null;
        amountCents: number | null;
        currency: string;
        closeDate: Date | null;
        stageId: string;
        lostReason: string | null;
    }>;
    create(orgId: string, dto: CreateDealDto): import("@prisma/client").Prisma.Prisma__DealClient<{
        orgId: string;
        title: string;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        contactId: string | null;
        amountCents: number | null;
        currency: string;
        closeDate: Date | null;
        stageId: string;
        lostReason: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(orgId: string, id: string, dto: UpdateDealDto): Promise<{
        orgId: string;
        title: string;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        contactId: string | null;
        amountCents: number | null;
        currency: string;
        closeDate: Date | null;
        stageId: string;
        lostReason: string | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
