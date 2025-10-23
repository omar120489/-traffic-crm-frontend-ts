import { PrismaService } from '../../prisma/prisma.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class DealsService {
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
        })[];
        total: number;
    }>;
    get(orgId: string, id: string): Promise<{
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
    create(orgId: string, dto: CreateDealDto): import("@prisma/client").Prisma.Prisma__DealClient<{
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
    update(orgId: string, id: string, dto: UpdateDealDto): Promise<{
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
    remove(orgId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
