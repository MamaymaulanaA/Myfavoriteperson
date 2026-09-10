import { AnimatePresence, motion, useAnimationControls } from 'motion/react';
import type { GardenFlowerConfig } from '../../data/memories';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import { BloomArt } from './BloomArt';
import { LightBurst } from './LightBurst';
import './Bloom.css';

export interface BloomProps {
  config: GardenFlowerConfig;
  open: boolean;
  /** True for the moment right after a tap, while the petals unfold. */
  bursting?: boolean;
  onTap: (id: string) => void;
  disabled?: boolean;
  /** Base width in px at scale 1. */
  size?: number;
  /** Illustrated replacement: /public/garden/flowers/your-flower.webp */
  src?: string;
}

const press = {
  idle: { scale: 1, rotate: 0 },
  press: {
    scale: [1, 0.9, 1.09, 1],
    rotate: [0, -4, 2.5, 0],
    transition: { duration: 0.66, ease: [0.22, 1, 0.36, 1] as const, times: [0, 0.16, 0.5, 1] },
  },
};

/**
 * A flower at the focal plane.
 *
 * Big enough to be the subject rather than a prop — roughly a third of
 * the screen width — because a memory worth keeping should not be a
 * twelve-pixel sticker on a landscape.
 */
export function Bloom({ config, open, bursting = false, onTap, disabled = false, size = 146, src }: BloomProps) {
  const controls = useAnimationControls();
  const { ambient } = useMotionProfile();

  const w = size * config.scale;

  const tap = () => {
    if (disabled || open) return;
    void controls.start('press');
    onTap(config.id);
  };

  return (
    <div
      className="bloom"
      style={{ left: `${config.x}%`, top: `${config.y}%`, width: w, height: w * 1.83 }}
    >
      <motion.div
        className="bloom__sway"
        animate={ambient ? { rotate: [-1.6, 1.6, -1.6] } : { rotate: 0 }}
        transition={
          ambient
            ? { duration: config.swayDuration, repeat: Infinity, ease: 'easeInOut', delay: config.swayDelay }
            : { duration: 0 }
        }
      >
        <motion.button
          type="button"
          className={`bloom__hit${open ? ' is-open' : ''}`}
          variants={press}
          initial="idle"
          animate={controls}
          onClick={tap}
          disabled={disabled || open}
          aria-label={open ? 'Bunga ini sudah terbuka' : 'Buka bunga ini'}
        >
          {src ? (
            <img className="bloom__img" src={src} alt="" decoding="async" />
          ) : (
            <BloomArt species={config.species} hue={config.hue} open={open} uid={config.id} />
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>{bursting ? <LightBurst key="burst" /> : null}</AnimatePresence>

      <span className="bloom__shadow" aria-hidden="true" />
    </div>
  );
}
