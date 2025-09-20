// src/features/workplans/hooks/useDebounce.ts
import { useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay = 400, onDebounced?: (v: T) => void) {
  const t = useRef<number | null>(null);

  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => {
      onDebounced?.(value);
    }, delay) as unknown as number;

    return () => {
      if (t.current) window.clearTimeout(t.current);
    };
  }, [value, delay, onDebounced]);
}
