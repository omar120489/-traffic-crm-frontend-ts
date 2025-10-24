import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
export declare class DealsController {
    private readonly svc;
    constructor(svc: DealsService);
    list(orgId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<{
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
    }>>;
    get(id: string, orgId: string): Promise<{
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
    create(dto: CreateDealDto, orgId: string): import("@prisma/client").Prisma.Prisma__DealClient<{
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
    update(id: string, dto: UpdateDealDto, orgId: string): Promise<{
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
    remove(id: string, orgId: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
