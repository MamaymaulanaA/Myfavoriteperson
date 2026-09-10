import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';

export interface MotionProfile {
  /** The viewer asked their system for less movement. */
  reduced: boolean;
  /** Multiplier applied to every particle budget. */
  particleScale: number;
  /** 0 disables parallax entirely. */
  parallax: number;
  /** Slow drifts over photographs. */
  kenBurns: boolean;
  /** Ambient sway on flowers, leaves and butterflies. */
  ambient: boolean;
}

/**
 * One place that decides how much movement this device gets. Scenes read the
 * profile instead of calling useReducedMotion themselves, so "reduced" means
 * the same thing everywhere: the story still plays, it simply stops drifting.
 */
export function useMotionProfile(): MotionProfile {
  const reduced = useReducedMotion() ?? false;

  return useMemo(
    () => ({
      reduced,
      particleScale: reduced ? 0.2 : 1,
      parallax: reduced ? 0 : 1,
      kenBurns: !reduced,
      ambient: !reduced,
    }),
    [reduced],
  );
}
