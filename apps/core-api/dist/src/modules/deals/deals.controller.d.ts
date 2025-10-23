import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
export declare class DealsController {
    private readonly svc;
    constructor(svc: DealsService);
    list(orgId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<{
        company: {
            orgId: string;
            name: string;
            id: string;
            createdAt: Date;
            domain: string | null;
        } | null;
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
        title: string;
        companyId: string | null;
        id: string;
        createdAt: Date;
        contactId: string | null;
        ownerId: string | null;
        amountCents: number;
        currency: string;
        stage: string;
        closeDate: Date | null;
    }>>;
    get(id: string, orgId: string): Promise<{
        company: {
            orgId: string;
            name: string;
            id: string;
            createdAt: Date;
            domain: string | null;
        } | null;
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
        title: string;
        companyId: string | null;
        id: string;
        createdAt: Date;
        contactId: string | null;
        ownerId: string | null;
        amountCents: number;
        currency: string;
        stage: string;
        closeDate: Date | null;
    }>;
    create(dto: CreateDealDto, orgId: string): import("@prisma/client").Prisma.Prisma__DealClient<{
        orgId: string;
        title: string;
        companyId: string | null;
        id: string;
        createdAt: Date;
        contactId: string | null;
        ownerId: string | null;
        amountCents: number;
        currency: string;
        stage: string;
        closeDate: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateDealDto, orgId: string): Promise<{
        orgId: string;
        title: string;
        companyId: string | null;
        id: string;
        createdAt: Date;
        contactId: string | null;
        ownerId: string | null;
        amountCents: number;
        currency: string;
        stage: string;
        closeDate: Date | null;
    }>;
    remove(id: string, orgId: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
