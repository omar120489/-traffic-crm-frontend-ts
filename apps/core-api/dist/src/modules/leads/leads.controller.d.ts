import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
export declare class LeadsController {
    private readonly svc;
    constructor(svc: LeadsService);
    list(orgId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<{
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
    }>>;
    get(id: string, orgId: string): Promise<{
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
    create(dto: CreateLeadDto, orgId: string): import("@prisma/client").Prisma.Prisma__LeadClient<{
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
    update(id: string, dto: UpdateLeadDto, orgId: string): Promise<{
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
    remove(id: string, orgId: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
