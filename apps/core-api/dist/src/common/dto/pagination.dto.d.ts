export declare class PaginationQueryDto {
    page: number;
    size: number;
    search?: string;
}
export declare class PaginatedResponseDto<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
    constructor(items: T[], total: number, page: number, size: number);
}
