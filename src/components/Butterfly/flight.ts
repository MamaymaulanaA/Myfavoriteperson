/**
 * Flight paths.
 *
 * A butterfly that teleports to random points reads as a bug, not an animal.
 * These paths are a slow drift with a bias in one direction, built from a
 * seeded pseudo-random source so a given butterfly always flies its own
 * route and every route curves rather than jumps.
 */

export interface FlightPath {
  x: number[];
  y: number[];
  rotate: number[];
  /** -1 when the butterfly is heading left, so the sprite can be mirrored. */
  facing: number[];
  duration: number;
}

/** Small deterministic PRNG — same seed, same flight, every render. */
function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function makeFlightPath(
  width: number,
  height: number,
  seed: number,
  options: { steps?: number; margin?: number; band?: [number, number] } = {},
): FlightPath {
  const rand = seeded(seed + 1);
  const steps = options.steps ?? 6;
  const margin = options.margin ?? 48;
  const [top, bottom] = options.band ?? [0.1, 0.7];

  const usableW = Math.max(80, width - margin * 2);
  const minY = height * top;
  const maxY = height * bottom;

  const x: number[] = [];
  const y: number[] = [];
  const rotate: number[] = [];
  const facing: number[] = [];

  // Alternate broadly left and right so the drift covers the stage.
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const sweep = Math.sin(t * Math.PI * 2 + rand() * 0.6);
    const px = margin + usableW * (0.5 + sweep * 0.42 + (rand() - 0.5) * 0.12);
    const py = minY + (maxY - minY) * (0.5 - Math.cos(t * Math.PI * 2.4) * 0.4 + (rand() - 0.5) * 0.2);
    x.push(px);
    y.push(Math.max(minY, Math.min(maxY, py)));
  }

  // Close the loop so the repeat has no seam.
  x[x.length - 1] = x[0];
  y[y.length - 1] = y[0];

  for (let i = 0; i < x.length; i += 1) {
    const next = x[(i + 1) % x.length];
    const heading = next - x[i];
    facing.push(heading >= 0 ? 1 : -1);
    rotate.push(Math.max(-14, Math.min(14, heading * 0.06)));
  }

  return {
    x,
    y,
    rotate,
    facing,
    duration: 20 + rand() * 14,
  };
}
