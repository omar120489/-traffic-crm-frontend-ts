import { useMemo, useState } from 'react';

export interface PaginationState {
  page: number;
  size: number;
  search: string;
}

export interface UsePaginationOptions {
  page?: number;
  size?: number;
  search?: string;
}

export interface UsePaginationResult {
  page: number;
  size: number;
  search: string;
  query: { page: number; size: number; search?: string };
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSearch: (search: string) => void;
  reset: () => void;
}

/**
 * Hook for managing pagination state and query parameters
 *
 * @example
 * ```tsx
 * const { query, page, size, search, setPage, setSize, setSearch } = usePagination({ page: 1, size: 10 });
 *
 * useEffect(() => {
 *   listContacts(query).then(setData);
 * }, [query]);
 * ```
 */
export function usePagination(initial: UsePaginationOptions = {}): UsePaginationResult {
  const defaultState = { page: 1, size: 10, search: '' };
  const initialState = { ...defaultState, ...initial };

  const [page, setPage] = useState(initialState.page);
  const [size, setSize] = useState(initialState.size);
  const [search, setSearch] = useState(initialState.search);

  // Memoized query object for SDK calls
  const query = useMemo(
    () => ({
      page,
      size,
      ...(search ? { search } : {})
    }),
    [page, size, search]
  );

  const reset = () => {
    setPage(defaultState.page);
    setSize(defaultState.size);
    setSearch(defaultState.search);
  };

  return {
    page,
    size,
    search,
    query,
    setPage,
    setSize,
    setSearch,
    reset
  };
}
