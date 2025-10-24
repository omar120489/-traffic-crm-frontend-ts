import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
export declare class ContactsController {
    private readonly svc;
    constructor(svc: ContactsService);
    list(orgId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<{
        orgId: string;
        name: string;
        title: string | null;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        source: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    get(id: string, orgId: string): Promise<{
        orgId: string;
        name: string;
        title: string | null;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        source: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateContactDto, orgId: string): import("@prisma/client").Prisma.Prisma__ContactClient<{
        orgId: string;
        name: string;
        title: string | null;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        source: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateContactDto, orgId: string): Promise<{
        orgId: string;
        name: string;
        title: string | null;
        email: string | null;
        phone: string | null;
        companyId: string | null;
        id: string;
        ownerId: string | null;
        source: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, orgId: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
