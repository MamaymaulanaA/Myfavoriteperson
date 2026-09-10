import { createContext } from 'react';
import type { Scene } from './scenes';
import type { MemoryReward } from '../data/memories';

export interface GameState {
  scene: Scene;
  /** Flowers that have been tapped open. */
  discoveredFlowers: string[];
  /** Memories that have been read all the way through. */
  discoveredMemories: string[];
  /** The memory currently on screen, if any. */
  activeMemoryId: string | null;
  butterfliesCaught: number;
  /** Cahaya yang sudah dikumpulkan. Genap 20 kalau semuanya ketemu. */
  cahaya: number;
  unlockedSecrets: string[];
  musicEnabled: boolean;
  cinemaCompleted: boolean;
  minigameCompleted: boolean;
  gardenTransformed: boolean;
  letterOpened: boolean;
  finalVideoCompleted: boolean;
  /** A one-shot animated reward waiting to play. */
  pendingReward: MemoryReward;
}

export const initialGameState: GameState = {
  scene: 'opening',
  discoveredFlowers: [],
  discoveredMemories: [],
  activeMemoryId: null,
  butterfliesCaught: 0,
  cahaya: 0,
  unlockedSecrets: [],
  musicEnabled: true,
  cinemaCompleted: false,
  minigameCompleted: false,
  gardenTransformed: false,
  letterOpened: false,
  finalVideoCompleted: false,
  pendingReward: null,
};

export interface GameActions {
  goTo: (scene: Scene) => void;
  discoverFlower: (flowerId: string, memoryId: string) => void;
  closeMemory: () => void;
  catchButterfly: () => void;
  /** Menambah cahaya ke langit. */
  addCahaya: (n: number) => void;
  unlockSecret: (id: string, reward: MemoryReward) => void;
  /** Queues a one-shot animated reward without recording a new secret. */
  showReward: (reward: MemoryReward) => void;
  clearReward: () => void;
  setMusicEnabled: (enabled: boolean) => void;
  completeCinema: () => void;
  completeMinigame: () => void;
  markGardenTransformed: () => void;
  openLetter: () => void;
  completeFinalVideo: () => void;
  reset: () => void;
}

export interface GameContextValue extends GameActions {
  state: GameState;
}

export const GameContext = createContext<GameContextValue | null>(null);
