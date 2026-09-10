/* ------------------------------------------------------------------
   Procedural cut-paper foliage.

   Every leaf is the same silhouette, cut at a different size and angle
   — which is exactly how a paper diorama is actually made, and why it
   reads as one material rather than a pile of unrelated shapes.
   ------------------------------------------------------------------ */

/** One leaf, drawn from its stem end at the origin, pointing up. */
export const LEAF =
  'M0 0 C 10 -6 17 -20 15 -36 C 13 -47 4 -54 0 -58 C -4 -54 -13 -47 -15 -36 C -17 -20 -10 -6 0 0 Z';

/** A rounder, fuller leaf for the near foreground. */
export const LEAF_BROAD =
  'M0 0 C 16 -4 30 -16 32 -33 C 34 -48 22 -60 0 -66 C -22 -60 -34 -48 -32 -33 C -30 -16 -16 -4 0 0 Z';

/** A long blade, for grasses and the thin stuff between clusters. */
export const BLADE =
  'M0 0 C 5 -14 7 -32 4 -52 C 3 -60 1 -66 0 -70 C -1 -66 -3 -60 -4 -52 C -7 -32 -5 -14 0 0 Z';

/** A graceful fern frond (pakis) with delicate side pinnae. */
export const FERN_FROND =
  'M0 0 C 2 -12 4 -28 2 -46 C 8 -44 14 -40 18 -34 C 14 -30 8 -30 4 -36 C 6 -28 12 -24 16 -18 C 12 -16 6 -18 2 -24 C 3 -14 8 -10 12 -6 C 8 -6 4 -8 1 -12 L 0 0 C -1 -12 -4 -8 -8 -6 C -4 -10 1 -14 0 -24 C -4 -18 -10 -16 -14 -18 C -10 -24 -4 -28 2 -36 C -2 -30 -8 -30 -12 -34 C -8 -40 -2 -44 4 -46 C 2 -28 0 -12 0 0 Z';

/** A wild spicate grass head with delicate seedlets (bulir rumput). */
export const WILD_SPICATE =
  'M0 0 L 0 -22 C 6 -26 9 -33 7 -39 C 3 -35 0 -32 0 -27 C -2 -32 -5 -35 -9 -39 C -11 -33 -8 -26 0 -22 L 0 -44 C 5 -48 7 -54 6 -59 C 2 -56 0 -53 0 -49 C -2 -53 -4 -56 -8 -59 C -9 -54 -7 -48 0 -44 L 0 -68 C 2 -70 0 -75 0 -78 C 0 -75 -2 -70 0 -68 Z';

/** A three-lobed clover / wood-sorrel sprig (daun semanggi). */
export const CLOVER =
  'M0 0 C 0 -14 -12 -18 -18 -25 C -20 -32 -14 -38 -5 -36 C 0 -34 0 -28 0 -26 C 0 -28 0 -34 5 -36 C 14 -38 20 -32 18 -25 C 12 -18 0 -14 0 0 Z';

export function seeded(seed: number) {
  let s = (seed * 16807) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export interface Cut {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  shade: number;
  path: string;
}

export interface ClusterOptions {
  count: number;
  /** Horizontal band the cluster occupies. */
  x0: number;
  x1: number;
  /** Vertical band. */
  y0: number;
  y1: number;
  scale: [number, number];
  /** Leaves fan away from vertical by up to this many degrees. */
  spread: number;
  path?: string;
  /** Bias rotation so a cluster leans as a whole. */
  lean?: number;
}

/**
 * A drift of leaves. Positions are jittered rather than gridded and
 * scale falls off toward the edges of the band, so a cluster has a
 * dense heart and a soft rim.
 */
export function cluster(seed: number, o: ClusterOptions): Cut[] {
  const rand = seeded(seed);
  const out: Cut[] = [];
  const path = o.path ?? LEAF;
  const lean = o.lean ?? 0;

  for (let i = 0; i < o.count; i += 1) {
    const t = i / Math.max(1, o.count - 1);
    // Two jitters averaged gives a soft centre-weighted distribution.
    const jx = (rand() + rand()) / 2;
    const x = o.x0 + (o.x1 - o.x0) * (t * 0.65 + jx * 0.35);
    const y = o.y0 + (o.y1 - o.y0) * rand();
    const edge = Math.abs(0.5 - t) * 2;

    out.push({
      x,
      y,
      rotate: lean + (rand() - 0.5) * o.spread * 2,
      scale: o.scale[0] + (o.scale[1] - o.scale[0]) * rand() * (1 - edge * 0.35),
      shade: rand(),
      path,
    });
  }

  return out;
}

export interface Orb {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  tone: number;
}

/** Out-of-focus points of light. What fills the sky instead of sky. */
export function bokeh(seed: number, w: number, h: number, count: number): Orb[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => {
    const big = rand() > 0.72;
    return {
      cx: rand() * w,
      cy: rand() * h * 0.72,
      r: big ? 34 + rand() * 54 : 10 + rand() * 24,
      opacity: (big ? 0.1 : 0.2) + rand() * 0.2,
      tone: rand(),
    };
  });
}

export interface Lantern {
  x: number;
  y: number;
  scale: number;
  /** Length of the cord it hangs from. */
  cord: number;
  sway: number;
  delay: number;
}

/** Paper lanterns strung through the mid distance — the progress meter. */
export function lanterns(seed: number, count: number, w: number): Lantern[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => ({
    x: (w / (count + 1)) * (i + 1) + (rand() - 0.5) * w * 0.06,
    y: 195 + rand() * 120,
    scale: 0.78 + rand() * 0.42,
    cord: 60 + rand() * 90,
    sway: 1.2 + rand() * 1.6,
    delay: rand() * 4,
  }));
}
