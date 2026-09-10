/* ------------------------------------------------------------------
   Lottie registry, loader and palette correction.

   All nine animations live in /public/lottie and are fetched on demand —
   none of them is bundled, because together they are ~1.5 MB and the
   opening scene only needs one of them.

   Several of the source files were authored in loud pinks and pure red
   (#FF0100, #FF2680, #F84575). Those are re-tinted at load time toward the
   Muted Rose / Champagne palette so the imported art belongs to the same
   world as everything drawn in CSS. Character animations (cat, teddy,
   bunnies, couple) are deliberately left untouched — recolouring a drawn
   character wrecks it.
   ------------------------------------------------------------------ */

export type LottieData = Record<string, unknown>;

export type TintMode = 'none' | 'rose' | 'roseOnly' | 'roseInk';

export type LottieKey =
  | 'heartsStream'
  | 'catLove'
  | 'paperPlaneHeart'
  | 'couple'
  | 'butterfly'
  | 'envelope'
  | 'heartsFeedback'
  | 'bunnies'
  | 'teddyBear';

export interface LottieMeta {
  /** Public path. Never import these through the bundler. */
  path: string;
  /** Native canvas size — used to reserve space and avoid layout shift. */
  width: number;
  height: number;
  /** Frames per second and total frames, from the audit of each file. */
  fps: number;
  frames: number;
  /** Whether looping this asset reads well, or it should play once. */
  loops: boolean;
  tint: TintMode;
  /** Roughly how heavy the file is, so callers can prioritise. */
  weightKb: number;
}

export const lottieAssets: Record<LottieKey, LottieMeta> = {
  heartsStream: {
    path: '/lottie/stream-of-hearts.json',
    width: 375,
    height: 800,
    fps: 60,
    frames: 339,
    loops: true,
    tint: 'rose',
    weightKb: 13,
  },
  catLove: {
    path: '/lottie/cat-love.json',
    width: 500,
    height: 500,
    fps: 30,
    frames: 180,
    loops: false,
    tint: 'roseOnly',
    weightKb: 148,
  },
  paperPlaneHeart: {
    path: '/lottie/paper-plane-heart.json',
    width: 1168,
    height: 1161,
    fps: 59.94,
    frames: 120,
    loops: true,
    tint: 'rose',
    weightKb: 22,
  },
  couple: {
    path: '/lottie/couple.json',
    width: 1920,
    height: 1080,
    fps: 50,
    frames: 70,
    loops: true,
    tint: 'none',
    weightKb: 185,
  },
  butterfly: {
    path: '/lottie/butterfly.json',
    width: 1080,
    height: 1080,
    fps: 29.97,
    frames: 150,
    loops: true,
    tint: 'roseInk',
    weightKb: 87,
  },
  envelope: {
    path: '/lottie/open-envelope.json',
    width: 1000,
    height: 1000,
    fps: 30,
    frames: 240,
    loops: false,
    tint: 'rose',
    weightKb: 30,
  },
  heartsFeedback: {
    path: '/lottie/hearts-feedback.json',
    width: 390,
    height: 844,
    fps: 30,
    frames: 180,
    loops: false,
    tint: 'rose',
    weightKb: 33,
  },
  bunnies: {
    path: '/lottie/bunnies.json',
    width: 512,
    height: 512,
    fps: 30,
    frames: 60,
    loops: true,
    tint: 'none',
    weightKb: 959,
  },
  teddyBear: {
    path: '/lottie/teddy-bear.json',
    width: 1080,
    height: 1080,
    fps: 29.97,
    frames: 90,
    loops: true,
    tint: 'roseOnly',
    weightKb: 37,
  },
};

/* ------------------------------------------------------------------
   Named frame ranges
   ------------------------------------------------------------------ */

/**
 * The envelope timeline, read off the source file:
 *   34–50   flap swings open
 *   47–77   the letter rises out
 *   77–165  letter held up (readable)
 *   165–206 letter drops back and the flap closes
 * We only ever play the first half, then hold on the open pose.
 */
export const ENVELOPE_OPEN_SEGMENT: [number, number] = [0, 120];

/* ------------------------------------------------------------------
   Colour maths
   ------------------------------------------------------------------ */

type Rgb = [number, number, number];

function rgbToHsl([r, g, b]: Rgb): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hueToRgb(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hn = h / 360;
  return [hueToRgb(p, q, hn + 1 / 3), hueToRgb(p, q, hn), hueToRgb(p, q, hn - 1 / 3)];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Pulls saturated reds/pinks onto Muted Rose and saturated oranges/yellows
 * onto Champagne, preserving each colour's relative lightness so the original
 * shading and depth survive.
 */
function tintRose(rgb: Rgb): Rgb {
  const [h, s, l] = rgbToHsl(rgb);
  // Reds, magentas and hot pinks.
  if (s > 0.26 && (h >= 318 || h <= 24)) {
    return hslToRgb(351, clamp(s * 0.44, 0.16, 0.44), clamp(0.3 + l * 0.56, 0.42, 0.88));
  }
  // Oranges and golds — the envelope's gradient stops.
  if (s > 0.28 && h > 24 && h <= 62) {
    return hslToRgb(38, clamp(s * 0.5, 0.18, 0.44), clamp(0.34 + l * 0.5, 0.5, 0.87));
  }
  return rgb;
}

/**
 * Only the red/pink band moves. Everything else — orange fur, cream stuffing,
 * skin — is left exactly as drawn. This is what a character animation gets
 * when the single thing fighting the palette is a bright red heart.
 */
function tintRoseOnly(rgb: Rgb): Rgb {
  const [h, s, l] = rgbToHsl(rgb);
  if (s > 0.3 && (h >= 320 || h <= 14)) {
    return hslToRgb(351, clamp(s * 0.46, 0.2, 0.46), clamp(0.32 + l * 0.54, 0.44, 0.86));
  }
  return rgb;
}

/**
 * `rose`, plus: pure whites warm to ivory and near-blacks soften to Soft Ink.
 * Used for the butterfly, which is otherwise stark white-on-black and reads
 * as a sticker pasted over the garden.
 */
function tintRoseInk(rgb: Rgb): Rgb {
  const [, s, l] = rgbToHsl(rgb);
  if (l > 0.92 && s < 0.14) return [1, 0.976, 0.957]; // → warm ivory
  if (l < 0.2 && s < 0.5) return [0.259, 0.212, 0.2]; // → soft ink
  return tintRose([...rgb] as Rgb);
}

const tinters: Record<TintMode, ((rgb: Rgb) => Rgb) | null> = {
  none: null,
  rose: tintRose,
  roseOnly: tintRoseOnly,
  roseInk: tintRoseInk,
};

/* ------------------------------------------------------------------
   Walking the animation tree
   ------------------------------------------------------------------ */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isNumberArray(v: unknown): v is number[] {
  return Array.isArray(v) && v.every((n) => typeof n === 'number');
}

/** Rewrites a solid-colour property, static or keyframed. */
function mapSolidColor(prop: unknown, fn: (rgb: Rgb) => Rgb): void {
  if (!isRecord(prop)) return;
  const k = prop.k;
  if (prop.a === 0 && isNumberArray(k) && k.length >= 3) {
    const [r, g, b] = fn([k[0], k[1], k[2]]);
    k[0] = r;
    k[1] = g;
    k[2] = b;
    return;
  }
  if (prop.a === 1 && Array.isArray(k)) {
    for (const frame of k) {
      if (isRecord(frame) && isNumberArray(frame.s) && frame.s.length >= 3) {
        const [r, g, b] = fn([frame.s[0], frame.s[1], frame.s[2]]);
        frame.s[0] = r;
        frame.s[1] = g;
        frame.s[2] = b;
      }
    }
  }
}

/** Gradient stops are a flat [pos, r, g, b, pos, r, g, b, …] run. */
function mapGradientStops(stops: number[], count: number, fn: (rgb: Rgb) => Rgb): void {
  const colorStopLength = count * 4;
  for (let i = 0; i + 3 < Math.min(colorStopLength, stops.length); i += 4) {
    const [r, g, b] = fn([stops[i + 1], stops[i + 2], stops[i + 3]]);
    stops[i + 1] = r;
    stops[i + 2] = g;
    stops[i + 3] = b;
  }
}

function mapGradient(gradient: unknown, fn: (rgb: Rgb) => Rgb): void {
  if (!isRecord(gradient)) return;
  const count = typeof gradient.p === 'number' ? gradient.p : 0;
  const k = gradient.k;
  if (!isRecord(k)) return;
  if (k.a === 0 && isNumberArray(k.k)) {
    mapGradientStops(k.k, count, fn);
    return;
  }
  if (k.a === 1 && Array.isArray(k.k)) {
    for (const frame of k.k) {
      if (isRecord(frame) && isNumberArray(frame.s)) mapGradientStops(frame.s, count, fn);
    }
  }
}

function walk(node: unknown, fn: (rgb: Rgb) => Rgb): void {
  if (Array.isArray(node)) {
    for (const child of node) walk(child, fn);
    return;
  }
  if (!isRecord(node)) return;

  const type = node.ty;
  if ((type === 'fl' || type === 'st') && node.c) mapSolidColor(node.c, fn);
  if ((type === 'gf' || type === 'gs') && node.g) mapGradient(node.g, fn);

  for (const key of Object.keys(node)) {
    // `ks` transforms and `ef` effects hold no shape colour worth touching,
    // but they are cheap to skip and keep the walk shallow.
    if (key === 'ef') continue;
    walk(node[key], fn);
  }
}

/** Returns a re-tinted deep copy. The cached original is never mutated. */
export function retint(data: LottieData, mode: TintMode): LottieData {
  const fn = tinters[mode];
  if (!fn) return data;
  const copy = structuredClone(data);
  walk(copy, fn);
  return copy;
}

/* ------------------------------------------------------------------
   Loading
   ------------------------------------------------------------------ */

const cache = new Map<LottieKey, LottieData>();
const inFlight = new Map<LottieKey, Promise<LottieData | null>>();

export function getCachedLottie(key: LottieKey): LottieData | undefined {
  return cache.get(key);
}

/**
 * Fetches an animation once, tints it once, and hands the same object to
 * every later caller. Failures resolve to `null` rather than throwing — a
 * missing decoration must never take the experience down.
 */
export function loadLottie(key: LottieKey): Promise<LottieData | null> {
  const cached = cache.get(key);
  if (cached) return Promise.resolve(cached);

  const pending = inFlight.get(key);
  if (pending) return pending;

  const meta = lottieAssets[key];
  const request: Promise<LottieData | null> = fetch(meta.path)
    .then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${meta.path}`);
      return res.json() as Promise<LottieData>;
    })
    .then((json) => {
      const tinted = retint(json, meta.tint);
      cache.set(key, tinted);
      return tinted;
    })
    .catch((error: unknown) => {
      if (import.meta.env.DEV) {
        console.warn(`[lottie] could not load "${key}"`, error);
      }
      return null;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, request);
  return request;
}

/** Warms the cache without blocking. Used by the preload strategy. */
export function prefetchLottie(...keys: LottieKey[]): void {
  for (const key of keys) void loadLottie(key);
}
