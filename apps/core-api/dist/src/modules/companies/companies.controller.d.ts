import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
export declare class CompaniesController {
    private readonly svc;
    constructor(svc: CompaniesService);
    list(orgId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<{
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
    }>>;
    get(id: string, orgId: string): Promise<{
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
    create(dto: CreateCompanyDto, orgId: string): import("@prisma/client").Prisma.Prisma__CompanyClient<{
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
    update(id: string, dto: UpdateCompanyDto, orgId: string): Promise<{
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
    remove(id: string, orgId: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
