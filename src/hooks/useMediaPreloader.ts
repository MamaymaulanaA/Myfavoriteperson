import { useEffect } from 'react';
import type { Scene } from '../app/scenes';
import { prefetchLottie } from '../lib/lottie';
import type { LottieKey } from '../lib/lottie';
import { warmMedia } from './useMediaAvailability';
import { memories } from '../data/memories';
import { jejak, penutup } from '../data/cinema';

/**
 * Preload strategy, one step ahead and no further.
 *
 * Opening warms the garden. The garden warms the first memory. A memory
 * warms the cinema. The cinema warms the mini game. Only when the letter is
 * on screen does the closing film's metadata get touched — it is the
 * heaviest thing in the project and nobody should pay for it at launch.
 */

const lottieByScene: Record<Scene, LottieKey[]> = {
  opening: ['teddyBear', 'heartsStream'],
  garden: ['butterfly', 'catLove'],
  memory: ['heartsFeedback', 'paperPlaneHeart'],
  cinema: ['butterfly', 'heartsFeedback'],
  minigame: ['heartsFeedback', 'heartsStream'],
  birthday: ['couple', 'envelope'],
  letter: ['envelope', 'paperPlaneHeart'],
  'final-video': ['heartsStream'],
  ending: ['heartsStream', 'couple'],
};

export function useMediaPreloader(scene: Scene): void {
  useEffect(() => {
    // Give the arriving scene its first frames before competing for bandwidth.
    const id = window.setTimeout(() => {
      prefetchLottie(...lottieByScene[scene]);

      switch (scene) {
        case 'opening': {
          const first = memories[0];
          if (first) warmMedia(first.media.src, 'photo');
          break;
        }
        case 'garden':
        case 'memory': {
          for (const memory of memories) warmMedia(memory.media.src, 'photo');
          const awal = jejak[0];
          if (awal) warmMedia(awal.src, awal.type);
          break;
        }
        case 'cinema': {
          for (const item of jejak) {
            warmMedia(item.src, item.type);
            if (item.type === 'video' && item.poster) warmMedia(item.poster, 'photo');
          }
          break;
        }
        case 'letter': {
          // Yang terakhir baru disentuh di sini — ini yang paling berat.
          warmMedia(penutup.foto, 'photo');
          warmMedia(penutup.video, 'video');
          break;
        }
        default:
          break;
      }
    }, 700);

    return () => window.clearTimeout(id);
  }, [scene]);
}
