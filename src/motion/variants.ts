import type { Variants } from 'motion/react';
import {
  tModal,
  tPhoto,
  tReveal,
  tScene,
  tUI,
  tDissolve,
  easeCinematic,
  easeOutSoft,
} from './transitions';
import { springCard, springPaper, springTap } from './springs';

/* ------------------------------------------------------------------
   Scenes
   ------------------------------------------------------------------ */

/** One scene leaves as the next arrives. A breath of scale, never a slide. */
export const sceneVariants: Variants = {
  initial: { opacity: 0, scale: 1.014 },
  enter: { opacity: 1, scale: 1, transition: tScene },
  exit: { opacity: 0, scale: 0.994, transition: { ...tScene, duration: 0.7 } },
};

/** For scenes that arrive out of darkness (final video, ending). */
export const sceneDarkVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 1.1, ease: easeCinematic } },
  exit: { opacity: 0, transition: { duration: 0.8, ease: easeCinematic } },
};

/* ------------------------------------------------------------------
   Staggered content — the workhorse for every text block
   ------------------------------------------------------------------ */

/** Parent: hands its children a rhythm. `delayChildren` is set per usage. */
export const staggerParent: Variants = {
  initial: {},
  enter: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

/** Child: rises a few pixels into place. */
export const riseChild: Variants = {
  initial: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: tUI },
  exit: { opacity: 0, y: -6, transition: { duration: 0.24, ease: easeOutSoft } },
};

/** Child variant with more travel, for headline-weight items. */
export const riseChildLarge: Variants = {
  initial: { opacity: 0, y: 26, filter: 'blur(6px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: easeCinematic },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: easeOutSoft } },
};

/* ------------------------------------------------------------------
   Buttons and small objects
   ------------------------------------------------------------------ */

export const buttonTapVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.015, transition: springTap },
  tap: { scale: 0.955, transition: springTap },
};

/* ------------------------------------------------------------------
   Flowers
   ------------------------------------------------------------------ */

/**
 * Idle sway is applied per-flower with a randomised delay so the bed never
 * pulses in unison. `press` is the squash-and-bloom answer to a tap.
 */
export const flowerVariants: Variants = {
  idle: { scale: 1, rotate: 0 },
  press: {
    scale: [1, 0.93, 1.08, 1],
    rotate: [0, -3.5, 2.5, 0],
    transition: { duration: 0.62, ease: easeOutSoft, times: [0, 0.18, 0.52, 1] },
  },
  bloomed: { scale: 1.04, transition: { duration: 0.6, ease: easeOutSoft } },
};

/* ------------------------------------------------------------------
   Memory overlay
   ------------------------------------------------------------------ */

export const memoryModalVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.5, ease: easeCinematic } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: easeCinematic, delay: 0.14 } },
};

/** The photograph itself: out of a blur, into focus. 1.1–1.4s. */
export const photoRevealVariants: Variants = {
  initial: { opacity: 0, scale: 1.06, filter: 'blur(12px)' },
  enter: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: tPhoto,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    filter: 'blur(8px)',
    transition: { duration: 0.62, ease: easeCinematic },
  },
};

/** Kept separate so a scene can exit a photo without owning its entry. */
export const photoExitVariants: Variants = {
  enter: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    filter: 'blur(8px)',
    transition: { duration: 0.62, ease: easeCinematic },
  },
};

/* ------------------------------------------------------------------
   Cinema
   ------------------------------------------------------------------ */

/**
 * Four different arrivals so a run of slides never feels like a carousel.
 * Chosen per-item in data/cinema.ts.
 */
export const cinematicVariants: Record<string, Variants> = {
  dreamFade: {
    initial: { opacity: 0, scale: 1.04, filter: 'blur(14px)' },
    enter: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: tPhoto },
    exit: { opacity: 0, filter: 'blur(10px)', transition: tDissolve },
  },
  slowPan: {
    initial: { opacity: 0, scale: 1.12, x: '-2.5%' },
    enter: {
      opacity: 1,
      scale: 1.06,
      x: '2.5%',
      transition: { opacity: tDissolve, scale: { duration: 9, ease: 'linear' }, x: { duration: 9, ease: 'linear' } },
    },
    exit: { opacity: 0, transition: tDissolve },
  },
  slightZoom: {
    initial: { opacity: 0, scale: 1 },
    enter: {
      opacity: 1,
      scale: 1.07,
      transition: { opacity: tDissolve, scale: { duration: 9, ease: 'linear' } },
    },
    exit: { opacity: 0, scale: 1.09, transition: tDissolve },
  },
  crossDissolve: {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: tDissolve },
    exit: { opacity: 0, transition: tDissolve },
  },
};

export type CinematicEffect = keyof typeof cinematicVariants;

/* ------------------------------------------------------------------
   Letter
   ------------------------------------------------------------------ */

/** The sheet of paper rising out of the envelope. */
export const letterVariants: Variants = {
  initial: { opacity: 0, y: 64, scale: 0.94, rotate: -1.2 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: springPaper,
  },
  exit: { opacity: 0, y: 26, scale: 0.97, transition: { duration: 0.5, ease: easeCinematic } },
};

/** Paragraphs settle one after another — never a per-character typewriter. */
export const letterBodyVariants: Variants = {
  initial: {},
  enter: { transition: { staggerChildren: 0.4, delayChildren: 0.5 } },
};

export const letterParagraphVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeCinematic } },
};

/* ------------------------------------------------------------------
   Birthday / ending
   ------------------------------------------------------------------ */

export const finalRevealVariants: Variants = {
  initial: { opacity: 0, y: 34, scale: 0.97, filter: 'blur(10px)' },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: tReveal,
  },
  exit: { opacity: 0, y: -14, transition: { duration: 0.5, ease: easeCinematic } },
};

/* ------------------------------------------------------------------
   Overlays shared by several scenes
   ------------------------------------------------------------------ */

export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: tModal },
  exit: { opacity: 0, transition: { duration: 0.3, ease: easeOutSoft } },
};

export const sheetVariants: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.97 },
  enter: { opacity: 1, y: 0, scale: 1, transition: springCard },
  exit: { opacity: 0, y: 22, scale: 0.98, transition: { duration: 0.3, ease: easeOutSoft } },
};

/** A tiny reward chip — "Unlocked something cute". */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.94 },
  enter: { opacity: 1, y: 0, scale: 1, transition: springCard },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.34, ease: easeOutSoft } },
};
