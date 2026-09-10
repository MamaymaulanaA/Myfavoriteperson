import { useCallback, useEffect, useRef, useState } from 'react';

export interface Size {
  width: number;
  height: number;
}

/**
 * Measures an element and keeps the measurement fresh across rotation and
 * the mobile URL bar collapsing. Butterfly flight paths and the mini game
 * are laid out in real pixels, so they need a real box.
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSize((prev) =>
      Math.abs(prev.width - rect.width) < 1 && Math.abs(prev.height - rect.height) < 1
        ? prev
        : { width: rect.width, height: rect.height },
    );
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return { ref, size } as const;
}
