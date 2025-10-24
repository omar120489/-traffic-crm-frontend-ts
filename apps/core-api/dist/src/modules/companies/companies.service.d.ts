import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, query: PaginationQueryDto): Promise<{
        items: {
            orgId: string;
            name: string;
            phone: string | null;
            size: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            domain: string | null;
            industry: string | null;
            website: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
        }[];
        total: number;
    }>;
    get(orgId: string, id: string): Promise<{
        orgId: string;
        name: string;
        phone: string | null;
        size: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        domain: string | null;
        industry: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
    }>;
    create(orgId: string, dto: CreateCompanyDto): import("@prisma/client").Prisma.Prisma__CompanyClient<{
        orgId: string;
        name: string;
        phone: string | null;
        size: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        domain: string | null;
        industry: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(orgId: string, id: string, dto: UpdateCompanyDto): Promise<{
        orgId: string;
        name: string;
        phone: string | null;
        size: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        domain: string | null;
        industry: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
