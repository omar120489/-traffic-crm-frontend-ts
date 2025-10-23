/**
 * Core Filters - URL Query Management
 *
 * TODO: Implement URL search params synchronization
 * Manages filter state in URL for bookmarkable, shareable filtered views
 *
 * @example
 * const { query, setQuery, updateQuery } = useUrlQuery({
 *   page: 1,
 *   pageSize: 25,
 *   search: ''
 * });
 */

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlQuery<T extends Record<string, unknown>>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params into query object
  const query = useMemo(() => {
    const params: Record<string, unknown> = { ...defaults };

    searchParams.forEach((value, key) => {
      // Try to parse as JSON for arrays/objects, fallback to string
      try {
        params[key] = JSON.parse(value);
      } catch {
        params[key] = value;
      }
    });

    return params as T;
  }, [searchParams, defaults]);

  // Update URL params
  const setQuery = useCallback(
    (newQuery: Partial<T>) => {
      const params = new URLSearchParams();

      Object.entries({ ...query, ...newQuery }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      });

      setSearchParams(params, { replace: true });
    },
    [query, setSearchParams]
  );

  // Update specific query param
  const updateQuery = useCallback(
    (key: keyof T, value: unknown) => {
      setQuery({ [key]: value } as Partial<T>);
    },
    [setQuery]
  );

  return {
    query,
    setQuery,
    updateQuery,
  };
}
