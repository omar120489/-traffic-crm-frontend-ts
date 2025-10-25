import { useEffect, useMemo, useRef } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
): T {
  const ref = useRef(fn);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  const debounced = useMemo(() => {
    const d = (...args: any[]) => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        ref.current(...args);
      }, delay);
    };
    // preserve arity & typing
    return d as T;
  }, [delay]);

  return debounced;
}

