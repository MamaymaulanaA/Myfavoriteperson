export type Scene =
  | 'opening'
  | 'garden'
  | 'memory'
  | 'cinema'
  | 'minigame'
  | 'birthday'
  | 'letter'
  | 'final-video'
  | 'ending';

/**
 * The order the scenes are meant to be met in. Used by the preloader to
 * decide what to warm next, and by nothing else — movement between scenes
 * is always explicit, never "next()".
 */
export const sceneOrder: Scene[] = [
  'opening',
  'garden',
  'memory',
  'cinema',
  'minigame',
  'birthday',
  'letter',
  'final-video',
  'ending',
];

/** Scenes that sit on a dark ground and need light type. */
export const darkScenes: ReadonlySet<Scene> = new Set<Scene>(['final-video', 'ending']);

/** The memory overlay is drawn on top of a still-live garden. */
export const gardenBackedScenes: ReadonlySet<Scene> = new Set<Scene>(['garden', 'memory']);
