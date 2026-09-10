import { AnimatePresence } from 'motion/react';
import { OpeningScene } from '../scenes/OpeningScene';
import { GardenScene } from '../scenes/GardenScene';
import { CinemaScene } from '../scenes/CinemaScene';
import { MiniGameScene } from '../scenes/MiniGameScene';
import { BirthdayScene } from '../scenes/BirthdayScene';
import { LetterScene } from '../scenes/LetterScene';
import { FinalVideoScene } from '../scenes/FinalVideoScene';
import { EndingScene } from '../scenes/EndingScene';
import { gardenBackedScenes } from './scenes';
import type { Scene } from './scenes';
import { useGameProgress } from '../hooks/useGameProgress';
import { useMediaPreloader } from '../hooks/useMediaPreloader';

/**
 * One scene at a time.
 *
 * There is no router here on purpose: the browser's back button has no
 * sensible meaning inside a story, and a URL that could drop someone into
 * the ending would spoil it. Movement is always an explicit goTo().
 *
 * The memory overlay is not given its own key — it is drawn on top of a
 * garden that must stay mounted and alive underneath it, so both scenes
 * share the key "garden" and AnimatePresence leaves the garden alone.
 *
 * Babaknya bersilang, nggak bergantian.
 *
 * Dulu di sini ada mode="wait": babak lama dilepas dulu sampai habis,
 * baru babak baru dipasang. Diukur di build produksi, hasilnya layar
 * benar-benar kosong selama 522 milidetik tiap ganti babak, 72 frame
 * gelap rata tanpa apa-apa. Dan sebagian besar itu penantian sia-sia:
 * babak lama sudah nggak kelihatan di 400 ms (opacity 0,08), tapi
 * animasinya baru dianggap selesai di 900 ms, dan selama 500 ms itu
 * nggak ada yang dipasang.
 *
 * Tanpa mode="wait" keduanya hidup bareng sebentar dan benar-benar
 * bersilang. Ongkosnya satu babak ekstra di memori selama kira-kira
 * satu detik; yang didapat, nggak ada lagi lubang gelap di tengah.
 */
export function SceneManager() {
  const { state } = useGameProgress();
  const scene = state.scene;

  useMediaPreloader(scene);

  const presenceKey: Scene | 'garden' = gardenBackedScenes.has(scene) ? 'garden' : scene;

  return (
    <AnimatePresence initial={false}>
      {renderScene(scene, presenceKey)}
    </AnimatePresence>
  );
}

function renderScene(scene: Scene, key: string) {
  switch (scene) {
    case 'opening':
      return <OpeningKeyed key={key} />;
    case 'garden':
    case 'memory':
      return <GardenScene key={key} />;
    case 'cinema':
      return <CinemaScene key={key} />;
    case 'minigame':
      return <MiniGameScene key={key} />;
    case 'birthday':
      return <BirthdayScene key={key} />;
    case 'letter':
      return <LetterScene key={key} />;
    case 'final-video':
      return <FinalVideoScene key={key} />;
    case 'ending':
      return <EndingScene key={key} />;
    default:
      return null;
  }
}

/** Small wrapper so the opening can pull `goTo` without prop drilling. */
function OpeningKeyed() {
  const { goTo } = useGameProgress();
  return <OpeningScene onStart={() => goTo('garden')} />;
}
