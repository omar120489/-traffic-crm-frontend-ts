import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * useDebounced
 * Returns a debounced value that updates after `delay` ms of inactivity.
 */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);
  const latest = useRef(value);
  latest.current = value;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(latest.current), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

/**
 * useDebouncedCallback
 * Stable callback that runs after `delay` ms since the last call.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  cb: (...args: Args) => void,
  delay = 300
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callback = useRef(cb);
  callback.current = cb;

  return useMemo(() => {
    return (...args: Args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => callback.current(...args), delay);
    };
  }, [delay]);
}
