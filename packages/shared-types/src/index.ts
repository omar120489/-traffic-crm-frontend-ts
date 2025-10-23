export type EntityId = string;
export type Paginated<T> = { data: T[]; total: number; page: number; pageSize: number; };
