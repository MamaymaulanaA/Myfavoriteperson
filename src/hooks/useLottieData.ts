import { useEffect, useState } from 'react';
import { getCachedLottie, loadLottie } from '../lib/lottie';
import type { LottieData, LottieKey } from '../lib/lottie';

/**
 * Fetches (and re-tints) an animation the first time it is asked for, then
 * serves every later request from memory. Returns `null` while loading and
 * also if the file could not be read — callers render nothing in both cases,
 * so a failed decoration is invisible rather than fatal.
 */
export function useLottieData(key: LottieKey, enabled = true): LottieData | null {
  const [data, setData] = useState<LottieData | null>(() => getCachedLottie(key) ?? null);

  useEffect(() => {
    if (!enabled) return;
    const cached = getCachedLottie(key);
    if (cached) {
      setData(cached);
      return;
    }

    let active = true;
    void loadLottie(key).then((result) => {
      if (active) setData(result);
    });

    return () => {
      active = false;
    };
  }, [key, enabled]);

  return data;
}
