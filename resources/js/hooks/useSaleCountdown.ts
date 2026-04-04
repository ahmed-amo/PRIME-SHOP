import { useEffect, useState } from 'react';

/**
 * Human-readable countdown until `isoDate` (ISO 8601), updated every minute.
 */
export function useSaleCountdown(isoDate: string | null | undefined): string | null {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!isoDate) {
      setLabel(null);
      return;
    }

    const end = new Date(isoDate).getTime();
    if (Number.isNaN(end)) {
      setLabel(null);
      return;
    }

    const tick = () => {
      const now = Date.now();
      if (now >= end) {
        setLabel(null);
        return;
      }
      const sec = Math.floor((end - now) / 1000);
      const days = Math.floor(sec / 86400);
      const hours = Math.floor((sec % 86400) / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      if (days > 0) {
        setLabel(`${days} day${days === 1 ? '' : 's'} ${hours} hr${hours === 1 ? '' : 's'} left`);
      } else if (hours > 0) {
        setLabel(`${hours} hr${hours === 1 ? '' : 's'} ${mins} min left`);
      } else {
        setLabel(`${mins} min left`);
      }
    };

    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [isoDate]);

  return label;
}
