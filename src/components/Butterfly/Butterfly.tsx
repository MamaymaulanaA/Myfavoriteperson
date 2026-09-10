import { motion } from 'motion/react';
import { LottieAsset } from '../LottieAsset/LottieAsset';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import type { FlightPath } from './flight';
import './Butterfly.css';

export interface CatchPoint {
  /** Viewport coordinates of the butterfly's centre when it was caught. */
  x: number;
  y: number;
}

export interface ButterflyProps {
  path: FlightPath;
  size?: number;
  delay?: number;
  /** Tappable — used by the mini game. Receives where the catch happened. */
  onCatch?: (point: CatchPoint) => void;
  opacity?: number;
  /** Speeds the whole flight up; the mini game flies faster than the garden. */
  speed?: number;
}

/**
 * Lottie animates the wings. Motion animates where the butterfly is.
 *
 * Keeping those two jobs apart is what makes it read as alive: the wing beat
 * has its own rhythm, independent of a flight path that curves slowly across
 * the stage and never repeats visibly.
 */
export function Butterfly({ path, size = 46, delay = 0, onCatch, opacity = 1, speed = 1 }: ButterflyProps) {
  const { ambient, reduced } = useMotionProfile();
  const interactive = Boolean(onCatch);

  const duration = path.duration / speed;

  const reportCatch = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    onCatch?.({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <motion.div
      className={`butterfly${interactive ? ' butterfly--catchable' : ''}`}
      style={{ width: size, height: size, opacity }}
      initial={{ x: path.x[0], y: path.y[0], opacity: 0, scale: 0.6 }}
      animate={
        ambient
          ? {
              x: path.x,
              y: path.y,
              rotate: path.rotate,
              opacity: [0, opacity],
              scale: 1,
            }
          : { x: path.x[0], y: path.y[0], opacity, scale: 1 }
      }
      exit={{
        scale: [1, 1.15, 0],
        rotate: [0, 8, -4],
        opacity: [1, 1, 0],
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1], times: [0, 0.35, 1] },
      }}
      transition={
        ambient
          ? {
              x: { duration, repeat: Infinity, ease: 'easeInOut', delay },
              y: { duration: duration * 0.82, repeat: Infinity, ease: 'easeInOut', delay },
              rotate: { duration, repeat: Infinity, ease: 'easeInOut', delay },
              opacity: { duration: 1.2, delay },
              scale: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
            }
          : { duration: reduced ? 0.2 : 0.8, delay }
      }
      onClick={interactive ? (event) => reportCatch(event.currentTarget) : undefined}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? 'Tangkap kupu-kupunya' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                reportCatch(event.currentTarget);
              }
            }
          : undefined
      }
      whileTap={interactive ? { scale: 0.9 } : undefined}
    >
      <div className="butterfly__wings">
        <LottieAsset name="butterfly" width="100%" loop speed={1.1} />
      </div>
      {interactive ? <span className="butterfly__hit" /> : null}
    </motion.div>
  );
}
