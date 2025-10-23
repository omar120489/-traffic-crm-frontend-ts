import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';
export declare class LeadsController {
    private readonly svc;
    constructor(svc: LeadsService);
    list(orgId: string): import("@prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    get(id: string, orgId: string): Promise<{
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
    create(dto: CreateLeadDto, orgId: string): import("@prisma/client").Prisma.Prisma__LeadClient<{
        orgId: string;
        id: string;
        createdAt: Date;
        contactId: string | null;
        source: string | null;
        status: string;
        score: number;
        ownerId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateLeadDto, orgId: string): Promise<{
        orgId: string;
        id: string;
        createdAt: Date;
        contactId: string | null;
        source: string | null;
        status: string;
        score: number;
        ownerId: string | null;
    }>;
    remove(id: string, orgId: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
