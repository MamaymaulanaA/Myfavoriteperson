import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LottieAsset } from '../LottieAsset/LottieAsset';
import { teks } from '../../data/birthday';
import { game } from '../../data/game';
import type { MemoryReward } from '../../data/memories';
import './Reward.css';

export interface RewardLayerProps {
  reward: MemoryReward;
  onDone: () => void;
}

const spring = { type: 'spring', stiffness: 260, damping: 20, mass: 0.9 } as const;

/**
 * The small rewards, as stickers.
 *
 * The cat and the bunnies are kawaii sticker art — heavy outlines, flat
 * fills — and they do not belong in a hand-cut paper night garden. Rather
 * than fight that, they are presented as what they look like: a sticker,
 * die-cut with a white border, pressed onto the corner of the screen at a
 * slight angle. The style clash stops being an accident and becomes the
 * joke. Neither loops forever and neither takes the screen.
 */
export function RewardLayer({ reward, onDone }: RewardLayerProps) {
  useEffect(() => {
    if (!reward) return;
    const id = window.setTimeout(onDone, game.hadiahMs);
    return () => window.clearTimeout(id);
  }, [reward, onDone]);

  return (
    <AnimatePresence>
      {reward ? (
        <motion.div
          key={reward}
          className={`sticker sticker--${reward}`}
          initial={{ opacity: 0, y: 40, scale: 0.6, rotate: reward === 'cat' ? -14 : 10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: reward === 'cat' ? -7 : 5 }}
          exit={{ opacity: 0, y: 26, scale: 0.86, transition: { duration: 0.5 } }}
          transition={spring}
        >
          <div className="sticker__cut">
            <LottieAsset
              name={reward === 'cat' ? 'catLove' : 'bunnies'}
              width="100%"
              loop={reward === 'bunnies'}
              speed={0.95}
            />
          </div>
          <motion.span
            className="t-micro sticker__note"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            {reward === 'cat' ? teks.hadiah.kucing : teks.hadiah.kelinci}
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
