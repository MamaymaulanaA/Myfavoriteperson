import { useContext } from 'react';
import { AudioCtx } from '../app/audioContext';
import type { AudioContextValue } from '../app/audioContext';

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error('useAudio must be used inside <AudioManager>');
  }
  return ctx;
}
