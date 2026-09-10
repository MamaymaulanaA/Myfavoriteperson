import type { FlowerSpecies } from '../../data/memories';

/* ------------------------------------------------------------------
   Botanical papercraft definitions.
   Each flower species is uniquely crafted with its own distinct
   petal geometry, leaf morphology, center details, and rich harmonious
   color palette.
   ------------------------------------------------------------------ */

export interface SpeciesConfig {
  name: FlowerSpecies;
  outer: number;
  inner: number;
  wide: number;
  long: number;
  innerScale: number;
  core: number;
  headY: number;
  budW: number;
  budH: number;
  /** Petal path for the species */
  petal: string;
  /** Inner petal path (or variation) */
  innerPetal?: string;
  /** Crease line path */
  crease: string;
  /** Leaf path style */
  leafType: 'poppy' | 'tulip' | 'daisy' | 'rose' | 'bell';
  /** Calyx / sepal style */
  sepalType: 'poppy' | 'tulip' | 'daisy' | 'rose' | 'bell';
  /** Core decoration type */
  coreStyle: 'poppy' | 'tulip' | 'daisy' | 'rose' | 'bell';
  /** Characteristic stem curvature factor (-1 to 1) */
  stemCurve: number;
}

// 1. Poppy Petal - Broad, crimped, silken with gentle scalloped rim
export const POPPY_PETAL =
  'M0 0 C 18 -10 32 -26 28 -48 C 26 -62 16 -70 8 -72 C 3 -73 0 -70 -2 -72 C -10 -70 -22 -62 -26 -48 C -30 -26 -16 -10 0 0 Z';
export const POPPY_CREASE = 'M0 -6 C 3 -26 2 -48 0 -66 M -8 -22 C -6 -38 -12 -54 -14 -60 M 8 -22 C 6 -38 12 -54 14 -60';

// 2. Tulip Petal - Elegant upright cup petal with smooth sculptural lines
export const TULIP_PETAL =
  'M0 0 C 15 -14 24 -34 22 -56 C 20 -70 10 -80 0 -84 C -10 -80 -20 -70 -22 -56 C -24 -34 -15 -14 0 0 Z';
export const TULIP_CREASE = 'M0 -6 C 1 -28 1 -56 0 -78';

// 3. Daisy Petal - Slender ray floret with delicate notched apex
export const DAISY_PETAL =
  'M0 0 C 7 -10 11 -28 10 -52 C 9 -66 6 -74 2 -77 C 1 -78 0 -76 -1 -78 C -5 -74 -8 -66 -9 -52 C -10 -28 -6 -10 0 0 Z';
export const DAISY_CREASE = 'M0 -8 L 0 -70';

// 4. Rose Petal - Lush, rounded petal with curled soft edge fold
export const ROSE_PETAL =
  'M0 0 C 16 -6 28 -20 28 -38 C 28 -52 18 -64 4 -66 C -2 -67 -6 -67 -10 -64 C -22 -58 -28 -44 -26 -32 C -24 -16 -14 -6 0 0 Z';
export const ROSE_CREASE = 'M0 -6 C 4 -22 6 -42 0 -60 M -6 -18 C -12 -32 -16 -46 -12 -54 M 6 -18 C 12 -32 16 -46 12 -54';

// 5. Bell Petal - Fluted flared campanula bell petal
export const BELL_PETAL =
  'M0 0 C 13 -12 25 -28 26 -46 C 27 -58 20 -66 10 -70 C 2 -72 -4 -70 -10 -64 C -18 -54 -20 -40 -16 -26 C -12 -12 -6 -4 0 0 Z';
export const BELL_CREASE = 'M0 -6 C 2 -24 3 -46 2 -64';

export const SPECIES: Record<FlowerSpecies, SpeciesConfig> = {
  poppy: {
    name: 'poppy',
    outer: 6,
    inner: 5,
    wide: 1.25,
    long: 0.88,
    innerScale: 0.62,
    core: 13,
    headY: 80,
    budW: 17,
    budH: 26,
    petal: POPPY_PETAL,
    crease: POPPY_CREASE,
    leafType: 'poppy',
    sepalType: 'poppy',
    coreStyle: 'poppy',
    stemCurve: -0.3,
  },
  tulip: {
    name: 'tulip',
    outer: 6,
    inner: 3,
    wide: 0.78,
    long: 1.12,
    innerScale: 0.55,
    core: 8,
    headY: 74,
    budW: 14,
    budH: 32,
    petal: TULIP_PETAL,
    crease: TULIP_CREASE,
    leafType: 'tulip',
    sepalType: 'tulip',
    coreStyle: 'tulip',
    stemCurve: 0.2,
  },
  daisy: {
    name: 'daisy',
    outer: 18,
    inner: 12,
    wide: 0.38,
    long: 1.05,
    innerScale: 0.65,
    core: 16,
    headY: 86,
    budW: 14,
    budH: 22,
    petal: DAISY_PETAL,
    crease: DAISY_CREASE,
    leafType: 'daisy',
    sepalType: 'daisy',
    coreStyle: 'daisy',
    stemCurve: 0.1,
  },
  rose: {
    name: 'rose',
    outer: 9,
    inner: 7,
    wide: 0.88,
    long: 0.9,
    innerScale: 0.6,
    core: 11,
    headY: 80,
    budW: 16,
    budH: 27,
    petal: ROSE_PETAL,
    crease: ROSE_CREASE,
    leafType: 'rose',
    sepalType: 'rose',
    coreStyle: 'rose',
    stemCurve: -0.15,
  },
  bell: {
    name: 'bell',
    outer: 5,
    inner: 4,
    wide: 1.05,
    long: 0.78,
    innerScale: 0.52,
    core: 9,
    headY: 88,
    budW: 15,
    budH: 24,
    petal: BELL_PETAL,
    crease: BELL_CREASE,
    leafType: 'bell',
    sepalType: 'bell',
    coreStyle: 'bell',
    stemCurve: 0.45,
  },
};

// Legacy exports for backwards compatibility
export const PETAL = POPPY_PETAL;
export const CREASE = POPPY_CREASE;
export type Species = SpeciesConfig;

/* ------------------------------------------------------------------
   Colour Palettes: Tailored botanical harmony per species.
   ------------------------------------------------------------------ */

type Rgb = [number, number, number];

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

const css = ([r, g, b]: Rgb, a = 1) => (a === 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${a})`);

export interface Palette {
  tip: string;
  base: string;
  innerTip: string;
  innerBase: string;
  crease: string;
  core: string;
  coreRim: string;
  coreAccent?: string;
  ember: string;
  glow: string;
  stemLight: string;
  stemDark: string;
  leafLight: string;
  leafDark: string;
}

// Botanical master colors
const POPPY_BASE_DEEP: Rgb = [205, 58, 48];     // Vivid crimson poppy
const POPPY_BASE_LIGHT: Rgb = [238, 108, 92];   // Warm coral poppy
const POPPY_TIP: Rgb = [255, 235, 225];

const TULIP_BASE_DEEP: Rgb = [224, 88, 108];    // Apricot-rose tulip
const TULIP_BASE_LIGHT: Rgb = [248, 154, 134];  // Peachy tulip
const TULIP_TIP: Rgb = [255, 246, 236];

const DAISY_BASE_DEEP: Rgb = [236, 222, 210];   // Warm ivory chamomile
const DAISY_BASE_LIGHT: Rgb = [252, 248, 242];  // Crisp white paper
const DAISY_TIP: Rgb = [255, 255, 255];

const ROSE_BASE_DEEP: Rgb = [184, 52, 78];      // Velvety English rose
const ROSE_BASE_LIGHT: Rgb = [228, 118, 138];   // Romantic blush rose
const ROSE_TIP: Rgb = [255, 238, 242];

const BELL_BASE_DEEP: Rgb = [108, 96, 172];     // Deep twilight bluebell
const BELL_BASE_LIGHT: Rgb = [156, 144, 214];   // Soft lilac bell
const BELL_TIP: Rgb = [246, 242, 255];

export function speciesPalette(species: FlowerSpecies, hue: number): Palette {
  const t = Math.max(0, Math.min(1, hue));

  let baseRgb: Rgb;
  let tipRgb: Rgb;
  let creaseRgb: Rgb;
  let coreColor: string;
  let coreRimColor: string;
  let coreAccentColor = '#FFE8A3';
  let emberColor = '#FFD588';
  let glowColor = '#FFC377';

  switch (species) {
    case 'poppy': {
      baseRgb = mix(POPPY_BASE_DEEP, POPPY_BASE_LIGHT, t);
      tipRgb = mix(baseRgb, POPPY_TIP, 0.45);
      creaseRgb = mix(baseRgb, [95, 18, 14], 0.45);
      coreColor = '#2F1E28'; // Dark velvety poppy seed pod
      coreRimColor = '#C8963E'; // Ring of golden anthers
      coreAccentColor = '#FAD968';
      emberColor = '#FFAB70';
      glowColor = '#FFA25B';
      break;
    }
    case 'tulip': {
      baseRgb = mix(TULIP_BASE_DEEP, TULIP_BASE_LIGHT, t);
      tipRgb = mix(baseRgb, TULIP_TIP, 0.52);
      creaseRgb = mix(baseRgb, [130, 32, 50], 0.38);
      coreColor = '#FFE18E'; // Golden stigma
      coreRimColor = '#7A543E'; // Velvet anthers
      coreAccentColor = '#FFF5CF';
      emberColor = '#FFD090';
      glowColor = '#FFC87E';
      break;
    }
    case 'daisy': {
      baseRgb = mix(DAISY_BASE_DEEP, DAISY_BASE_LIGHT, t);
      tipRgb = mix(baseRgb, DAISY_TIP, 0.7);
      creaseRgb = mix(baseRgb, [168, 142, 126], 0.35);
      coreColor = '#F2A31B'; // Rich sunny golden button floret
      coreRimColor = '#C2740A';
      coreAccentColor = '#FFEB9C';
      emberColor = '#FFE082';
      glowColor = '#FFD768';
      break;
    }
    case 'rose': {
      baseRgb = mix(ROSE_BASE_DEEP, ROSE_BASE_LIGHT, t);
      tipRgb = mix(baseRgb, ROSE_TIP, 0.55);
      creaseRgb = mix(baseRgb, [100, 20, 38], 0.42);
      coreColor = '#DB5875'; // Spiral inner bud center
      coreRimColor = '#94223A';
      coreAccentColor = '#FFF0F4';
      emberColor = '#FFC29B';
      glowColor = '#FFAE82';
      break;
    }
    case 'bell': {
      baseRgb = mix(BELL_BASE_DEEP, BELL_BASE_LIGHT, t);
      tipRgb = mix(baseRgb, BELL_TIP, 0.58);
      creaseRgb = mix(baseRgb, [58, 48, 110], 0.45);
      coreColor = '#FFE59E'; // Dangling golden bell pistil
      coreRimColor = '#7D70BF';
      coreAccentColor = '#FFF6D8';
      emberColor = '#DEC8FF';
      glowColor = '#C6B2FF';
      break;
    }
  }

  return {
    tip: css(tipRgb),
    base: css(baseRgb),
    innerTip: css(mix(baseRgb, tipRgb, 0.75)),
    innerBase: css(mix(baseRgb, tipRgb, 0.3)),
    crease: css(creaseRgb, 0.36),
    core: coreColor,
    coreRim: coreRimColor,
    coreAccent: coreAccentColor,
    ember: emberColor,
    glow: glowColor,
    stemLight: '#8CA078',
    stemDark: '#546648',
    leafLight: '#9DB28E',
    leafDark: '#677C57',
  };
}

/** Backwards-compatible palette accessor */
export function palette(hue: number): Palette {
  return speciesPalette('rose', hue);
}

