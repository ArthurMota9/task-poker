'use client';

import { useEffect, useState } from 'react';

export function useTimer(startTimestamp: number | null) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTimestamp) return;

    const update = () => setElapsed(Math.floor((Date.now() - startTimestamp) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTimestamp]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const formatted = [
    hours > 0 ? String(hours).padStart(2, '0') : null,
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ]
    .filter(Boolean)
    .join(':');

  return { elapsed, formatted };
}
