'use client';

import { useEffect, useState } from 'react';

export function NumberTicker({ value, duration = 600, className }: { value: number; duration?: number; className?: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = performance.now();
    const from = display;
    const diff = value - from;
    if (Math.abs(diff) < 0.005) return;

    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + diff * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span className={className} data-balance>{display.toFixed(2)}</span>;
}
