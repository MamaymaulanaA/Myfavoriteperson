import type { Transition } from 'motion/react';

/**
 * Springs are reserved for things the finger touches — taps, flowers, cards,
 * small objects. Anything cinematic (photos, scenes, crossfades) uses a tween
 * from transitions.ts instead, so the two never blur into one another.
 */

/** Immediate, slightly crisp. Buttons and icon taps. */
export const springTap: Transition = {
  type: 'spring',
  stiffness: 620,
  damping: 26,
  mass: 0.7,
};

/** A little more travel — flowers reacting to a touch. */
export const springBloom: Transition = {
  type: 'spring',
  stiffness: 360,
  damping: 18,
  mass: 0.9,
};

/** Cards, panels and sheets entering. Settles without visible wobble. */
export const springCard: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 28,
  mass: 1,
};

/** Soft, weighty — used by the letter lifting out of the envelope. */
export const springPaper: Transition = {
  type: 'spring',
  stiffness: 130,
  damping: 22,
  mass: 1.2,
};

/** Loose and floaty. Butterflies, drifting ornaments. */
export const springDrift: Transition = {
  type: 'spring',
  stiffness: 40,
  damping: 14,
  mass: 1.4,
};
