import { useEffect, useState, useCallback } from 'react';
import { usePagination, type UsePaginationOptions } from './usePagination';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface UsePaginatedQueryOptions<T> extends UsePaginationOptions {
  /** Async function to fetch data */
  fetcher: (query: {
    page: number;
    size: number;
    search?: string;
  }) => Promise<PaginatedResponse<T>>;
  /** Enable auto-fetch on mount and query changes */
  enabled?: boolean;
}

export interface UsePaginatedQueryResult<T> {
  data: PaginatedResponse<T>;
  loading: boolean;
  error: Error | null;
  page: number;
  size: number;
  search: string;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSearch: (search: string) => void;
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Combined hook for pagination + data fetching
 *
 * @example
 * ```tsx
 * const { data, loading, error, page, size, search, setPage, setSize, setSearch, refetch } =
 *   usePaginatedQuery({
 *     fetcher: (query) => listContacts(query),
 *     page: 1,
 *     size: 10,
 *   });
 * ```
 */
export function usePaginatedQuery<T>({
  fetcher,
  enabled = true,
  ...paginationOptions
}: UsePaginatedQueryOptions<T>): UsePaginatedQueryResult<T> {
  const pagination = usePagination(paginationOptions);
  const { query } = pagination;

  const [data, setData] = useState<PaginatedResponse<T>>({
    items: [],
    total: 0,
    page: 1,
    size: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const result = await fetcher(query);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  }, [fetcher, query, enabled]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    error,
    ...pagination,
    refetch: fetch
  };
}
