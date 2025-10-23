export declare class CreateDealDto {
    title: string;
    amountCents?: number;
    currency?: string;
    stage?: string;
    ownerId?: string;
    contactId?: string;
    companyId?: string;
    closeDate?: Date;
}
export declare class UpdateDealDto {
    title?: string;
    amountCents?: number;
    currency?: string;
    stage?: string;
    ownerId?: string;
    contactId?: string;
    companyId?: string;
    closeDate?: Date;
}
