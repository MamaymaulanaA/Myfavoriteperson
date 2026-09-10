import { createContext } from 'react';

export interface AudioContextValue {
  /** True once the first user gesture has unlocked playback. */
  unlocked: boolean;
  enabled: boolean;
  /** False when no audio file was found at the configured path. */
  available: boolean;
  toggle: () => void;
  /** Call from the first tap. Starts the ambient loop with a fade-in. */
  start: () => void;
  /** Duck the ambient bed for a moment (used under the birthday reveal). */
  setIntensity: (level: 'quiet' | 'normal') => void;
}

export const AudioCtx = createContext<AudioContextValue | null>(null);
