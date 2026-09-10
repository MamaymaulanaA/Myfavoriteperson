import type { Transition } from 'motion/react';

/** Shared easing curves. Named after what they feel like, not their numbers. */
export const easeOutSoft = [0.22, 1, 0.36, 1] as const;
export const easeInOutSoft = [0.65, 0, 0.35, 1] as const;
export const easeCinematic = [0.16, 0.84, 0.24, 1] as const;
export const easeGentleIn = [0.55, 0, 1, 0.45] as const;

/** 100–180ms — the answer to a finger. */
export const tTap: Transition = { duration: 0.14, ease: easeOutSoft };

/** 120–220ms — button state changes. */
export const tButton: Transition = { duration: 0.2, ease: easeOutSoft };

/** 200–350ms — small UI: captions, labels, HUD counters. */
export const tUI: Transition = { duration: 0.32, ease: easeOutSoft };

/** 350–500ms — modals and overlays. */
export const tModal: Transition = { duration: 0.44, ease: easeCinematic };

/** 700–1100ms — one scene handing over to the next. */
export const tScene: Transition = { duration: 0.9, ease: easeCinematic };

/** 1000–1400ms — a photograph arriving. Never rushed. */
export const tPhoto: Transition = { duration: 1.25, ease: easeCinematic };

/** The slow drift that runs under a photo while it is being looked at. */
export const tKenBurns: Transition = { duration: 7.5, ease: 'linear' };

/** Long, quiet crossfades between cinema slides. */
export const tDissolve: Transition = { duration: 1.05, ease: easeInOutSoft };

/** The birthday sequence — deliberately the slowest thing in the app. */
export const tReveal: Transition = { duration: 1.5, ease: easeCinematic };

/** Fading the world to black before the final video. */
export const tBlackout: Transition = { duration: 1.1, ease: easeGentleIn };

/**
 * Every transition above, but collapsed to a single quick fade. Used when the
 * viewer has asked their system for reduced motion.
 */
export const tReduced: Transition = { duration: 0.22, ease: 'linear' };
