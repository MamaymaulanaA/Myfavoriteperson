import { useCallback, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { GameContext, initialGameState } from './gameContext';
import type { GameContextValue, GameState } from './gameContext';
import { sceneOrder } from './scenes';
import type { Scene } from './scenes';
import { gardenFlowers, memories } from '../data/memories';
import type { MemoryReward } from '../data/memories';
import { CAHAYA_TOTAL, cahaya as jatah, game } from '../data/game';

type Action =
  | { type: 'goTo'; scene: Scene }
  | { type: 'discoverFlower'; flowerId: string; memoryId: string }
  | { type: 'closeMemory' }
  | { type: 'catchButterfly' }
  | { type: 'addCahaya'; n: number }
  | { type: 'unlockSecret'; id: string; reward: MemoryReward }
  | { type: 'showReward'; reward: MemoryReward }
  | { type: 'clearReward' }
  | { type: 'setMusic'; enabled: boolean }
  | { type: 'completeCinema' }
  | { type: 'completeMinigame' }
  | { type: 'markGardenTransformed' }
  | { type: 'openLetter' }
  | { type: 'completeFinalVideo' }
  | { type: 'reset' };

const withoutDuplicates = (list: string[], value: string) =>
  list.includes(value) ? list : [...list, value];

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'goTo':
      return { ...state, scene: action.scene };

    case 'discoverFlower':
      return {
        ...state,
        scene: 'memory',
        activeMemoryId: action.memoryId,
        discoveredFlowers: withoutDuplicates(state.discoveredFlowers, action.flowerId),
      };

    case 'closeMemory': {
      if (!state.activeMemoryId) return state;
      return {
        ...state,
        scene: 'garden',
        activeMemoryId: null,
        discoveredMemories: withoutDuplicates(state.discoveredMemories, state.activeMemoryId),
      };
    }

    case 'catchButterfly':
      return {
        ...state,
        butterfliesCaught: Math.min(state.butterfliesCaught + 1, game.targetKupu),
      };

    case 'addCahaya':
      return { ...state, cahaya: Math.min(CAHAYA_TOTAL, state.cahaya + action.n) };

    case 'unlockSecret':
      if (state.unlockedSecrets.includes(action.id)) return state;
      return {
        ...state,
        unlockedSecrets: [...state.unlockedSecrets, action.id],
        pendingReward: action.reward,
      };

    case 'showReward':
      return { ...state, pendingReward: action.reward };

    case 'clearReward':
      return state.pendingReward === null ? state : { ...state, pendingReward: null };

    case 'setMusic':
      return { ...state, musicEnabled: action.enabled };

    case 'completeCinema':
      return { ...state, cinemaCompleted: true };

    case 'completeMinigame':
      return { ...state, minigameCompleted: true };

    case 'markGardenTransformed':
      return { ...state, gardenTransformed: true };

    case 'openLetter':
      return { ...state, letterOpened: true };

    case 'completeFinalVideo':
      return { ...state, finalVideoCompleted: true };

    case 'reset':
      // Music preference survives a replay; nothing else does.
      return { ...initialGameState, musicEnabled: state.musicEnabled, scene: 'opening' };

    default:
      return state;
  }
}

/**
 * Development convenience: `?scene=letter` opens straight onto a scene with
 * enough progress faked in for it to look right. Handy while you are writing
 * the letter or checking the ending, and stripped from production builds —
 * there is no router here and no way to link past the story.
 */
function devStartState(): GameState {
  if (!import.meta.env.DEV || typeof window === 'undefined') return initialGameState;

  const requested = new URLSearchParams(window.location.search).get('scene');
  if (!requested || !sceneOrder.includes(requested as Scene)) return initialGameState;

  const scene = requested as Scene;
  const reached = sceneOrder.indexOf(scene);
  const past = (name: Scene) => reached > sceneOrder.indexOf(name);

  return {
    ...initialGameState,
    scene,
    discoveredFlowers: past('garden') ? gardenFlowers.map((f) => f.id) : [],
    discoveredMemories: past('garden') ? memories.map((m) => m.id) : [],
    unlockedSecrets: past('garden') ? ['secret-moth'] : [],
    butterfliesCaught: past('minigame') ? game.targetKupu : 0,
    cahaya: past('minigame')
      ? CAHAYA_TOTAL
      : past('garden')
        ? gardenFlowers.length * jatah.perBunga + jatah.rahasia
        : 0,
    cinemaCompleted: past('cinema'),
    minigameCompleted: past('minigame'),
    gardenTransformed: past('minigame'),
    letterOpened: past('letter'),
    finalVideoCompleted: past('final-video'),
  };
}

export function GameProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, devStartState);

  const goTo = useCallback((scene: Scene) => dispatch({ type: 'goTo', scene }), []);

  const discoverFlower = useCallback(
    (flowerId: string, memoryId: string) => dispatch({ type: 'discoverFlower', flowerId, memoryId }),
    [],
  );

  const closeMemory = useCallback(() => dispatch({ type: 'closeMemory' }), []);
  const catchButterfly = useCallback(() => dispatch({ type: 'catchButterfly' }), []);
  const addCahaya = useCallback((n: number) => dispatch({ type: 'addCahaya', n }), []);

  const unlockSecret = useCallback(
    (id: string, reward: MemoryReward) => dispatch({ type: 'unlockSecret', id, reward }),
    [],
  );

  const showReward = useCallback(
    (reward: MemoryReward) => dispatch({ type: 'showReward', reward }),
    [],
  );

  const clearReward = useCallback(() => dispatch({ type: 'clearReward' }), []);

  const setMusicEnabled = useCallback(
    (enabled: boolean) => dispatch({ type: 'setMusic', enabled }),
    [],
  );

  const completeCinema = useCallback(() => dispatch({ type: 'completeCinema' }), []);
  const completeMinigame = useCallback(() => dispatch({ type: 'completeMinigame' }), []);
  const markGardenTransformed = useCallback(() => dispatch({ type: 'markGardenTransformed' }), []);
  const openLetter = useCallback(() => dispatch({ type: 'openLetter' }), []);
  const completeFinalVideo = useCallback(() => dispatch({ type: 'completeFinalVideo' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      goTo,
      discoverFlower,
      closeMemory,
      catchButterfly,
      addCahaya,
      unlockSecret,
      showReward,
      clearReward,
      setMusicEnabled,
      completeCinema,
      completeMinigame,
      markGardenTransformed,
      openLetter,
      completeFinalVideo,
      reset,
    }),
    [
      state,
      goTo,
      discoverFlower,
      closeMemory,
      catchButterfly,
      addCahaya,
      unlockSecret,
      showReward,
      clearReward,
      setMusicEnabled,
      completeCinema,
      completeMinigame,
      markGardenTransformed,
      openLetter,
      completeFinalVideo,
      reset,
    ],
  );

  return <GameContext value={value}>{children}</GameContext>;
}
