import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    list(orgId: string): import("@prisma/client").Prisma.PrismaPromise<{
        orgId: string;
        name: string;
        id: string;
        createdAt: Date;
        domain: string | null;
    }[]>;
    get(orgId: string, id: string): Promise<{
        orgId: string;
        name: string;
        id: string;
        createdAt: Date;
        domain: string | null;
    }>;
    create(orgId: string, dto: CreateCompanyDto): import("@prisma/client").Prisma.Prisma__CompanyClient<{
        orgId: string;
        name: string;
        id: string;
        createdAt: Date;
        domain: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(orgId: string, id: string, dto: UpdateCompanyDto): Promise<{
        orgId: string;
        name: string;
        id: string;
        createdAt: Date;
        domain: string | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
