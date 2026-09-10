/* ------------------------------------------------------------------
   The light journey.

   The world travels from dusk, through gold, into night and out at first
   light. Light is also the progress meter: every memory found warms the
   garden a step, so the change is earned across the whole act rather
   than scripted into one moment at the end.

   Sky and foliage carry separate weights on purpose. The sky is *painted*
   — its gradient sits at full strength over the paper, or the twilight
   never gets saturated and the scene reads as grey haze. The foliage is
   *multiplied* down toward silhouette. Two opposite operations; running
   one pass over both was the mistake that made the first pass look foggy.
   ------------------------------------------------------------------ */

export type Mood = 'dusk' | 'golden' | 'night' | 'gala' | 'dawn';

export interface LightMix {
  /** Foliage multiply weights. */
  shadeCool: number;
  shadeNight: number;
  /** Warm bounce back into the leaves, soft-light. */
  shadeWarm: number;
  /** Sky layers, stacked over an always-on dusk base. */
  skyNight: number;
  skyGold: number;
  /** The sun or moon bloom in the upper field. */
  glow: number;
  vignette: number;
}

const STOPS: Record<Mood, LightMix> = {
  // Unlit: deep blue twilight, foliage almost in silhouette. The only warm
  // things are the embers inside the closed flowers, which is what makes
  // opening one feel like it gives something back.
  dusk: {
    shadeCool: 0.82,
    shadeNight: 0.44,
    shadeWarm: 0.06,
    skyNight: 0.38,
    skyGold: 0.05,
    glow: 0.55,
    vignette: 0.66,
  },
  golden: {
    shadeCool: 0,
    shadeNight: 0,
    shadeWarm: 0.72,
    skyNight: 0,
    skyGold: 1,
    glow: 1,
    vignette: 0.32,
  },
  night: {
    shadeCool: 0.22,
    shadeNight: 0.86,
    shadeWarm: 0.34,
    skyNight: 0.95,
    skyGold: 0.16,
    glow: 0.92,
    vignette: 0.72,
  },
  // The climax. Still night, but every lantern is lit and the warmth is
  // allowed back into the leaves — this is the one scene that should feel
  // generous rather than quiet.
  gala: {
    shadeCool: 0.14,
    shadeNight: 0.56,
    shadeWarm: 0.6,
    skyNight: 0.8,
    skyGold: 0.26,
    glow: 1,
    vignette: 0.46,
  },
  dawn: {
    shadeCool: 0.3,
    shadeNight: 0.28,
    shadeWarm: 0.58,
    skyNight: 0.22,
    skyGold: 0.62,
    glow: 0.82,
    vignette: 0.42,
  },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Blends between two moods. During exploration `progress` walks the
 * garden from dusk to gold, one memory at a time.
 */
export function mixLight(mood: Mood, progress = 0): LightMix {
  if (mood !== 'dusk') return STOPS[mood];

  const t = Math.max(0, Math.min(1, progress));
  const a = STOPS.dusk;
  const b = STOPS.golden;
  return {
    shadeCool: lerp(a.shadeCool, b.shadeCool, t),
    shadeNight: lerp(a.shadeNight, b.shadeNight, t),
    shadeWarm: lerp(a.shadeWarm, b.shadeWarm, t),
    skyNight: lerp(a.skyNight, b.skyNight, t),
    skyGold: lerp(a.skyGold, b.skyGold, t),
    glow: lerp(a.glow, b.glow, t),
    vignette: lerp(a.vignette, b.vignette, t),
  };
}
