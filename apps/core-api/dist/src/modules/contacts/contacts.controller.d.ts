import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
export declare class ContactsController {
    private readonly svc;
    constructor(svc: ContactsService);
    list(orgId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<{
        company: {
            orgId: string;
            name: string;
            id: string;
            createdAt: Date;
            domain: string | null;
        } | null;
    } & {
        orgId: string;
        name: string;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        createdAt: Date;
    }>>;
    get(id: string, orgId: string): Promise<{
        orgId: string;
        name: string;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        createdAt: Date;
    }>;
    create(dto: CreateContactDto, orgId: string): import("@prisma/client").Prisma.Prisma__ContactClient<{
        orgId: string;
        name: string;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateContactDto, orgId: string): Promise<{
        orgId: string;
        name: string;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        createdAt: Date;
    }>;
    remove(id: string, orgId: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
