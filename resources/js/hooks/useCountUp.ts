import { useEffect, useRef, useState } from 'react';

/**
 * Animate a number from 0 to `end` over `durationMs` (linear).
 */
export function useCountUp(end: number, durationMs = 900, enabled = true): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !Number.isFinite(end)) {
      setValue(end);
      return;
    }

    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) {
        startRef.current = now;
      }
      const start = startRef.current;
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) * (1 - t);
      setValue(end * eased);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [end, durationMs, enabled]);

  return value;
}
