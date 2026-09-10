import { useContext } from 'react';
import { GameContext } from '../app/gameContext';
import type { GameContextValue } from '../app/gameContext';

export function useGameProgress(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGameProgress must be used inside <GameProgressProvider>');
  }
  return ctx;
}
