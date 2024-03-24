import { useEffect, useRef } from 'react';

export function usePrevious(value: number) {
  const ref = useRef<number | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
