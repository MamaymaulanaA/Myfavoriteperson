import { motion } from 'motion/react';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import './World.css';

export interface MothProps {
  x: number;
  y: number;
  width?: number;
  visible: boolean;
  onTap: () => void;
}

/**
 * The one thing in the garden that is not a flower.
 *
 * It sits out past the edge of the first screen, so it can only be found
 * by someone who bothered to look around. It breathes rather than pulses,
 * and it is deliberately small.
 */
export function Moth({ x, y, width = 46, visible, onTap }: MothProps) {
  const { ambient } = useMotionProfile();

  return (
    <div className="moth" style={{ left: `${x}%`, top: `${y}%`, width }}>
      <motion.button
        type="button"
        className="moth__btn"
        onClick={onTap}
        aria-label="Ada sesuatu yang pucat, sedang diam"
        aria-hidden={visible ? undefined : true}
        tabIndex={visible ? 0 : -1}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.7,
          y: ambient && visible ? [0, -5, 0] : 0,
        }}
        transition={{
          opacity: { duration: 1.6, ease: 'easeOut' },
          scale: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileTap={{ scale: 0.86 }}
      >
        <span className="moth__glow" />
        <svg viewBox="0 0 40 32" className="moth__svg" aria-hidden="true">
          <g fill="#F6EDE1">
            <path d="M19 16 C 14 6 6 4 3 9 C 0.5 13.5 6 19 12 19 C 15 19 17.5 18 19 16 Z" />
            <path d="M21 16 C 26 6 34 4 37 9 C 39.5 13.5 34 19 28 19 C 25 19 22.5 18 21 16 Z" />
            <path d="M19 16 C 15 21 12 27 15 29 C 17.5 30.6 19.5 27 20 22 Z" />
            <path d="M21 16 C 25 21 28 27 25 29 C 22.5 30.6 20.5 27 20 22 Z" />
          </g>
          <g fill="#D9A6AE" opacity="0.5">
            <circle cx="10" cy="12" r="2.4" />
            <circle cx="30" cy="12" r="2.4" />
          </g>
          <ellipse cx="20" cy="17" rx="1.9" ry="6" fill="#6E5E52" />
          <g stroke="#6E5E52" strokeWidth="0.8" strokeLinecap="round" fill="none">
            <path d="M20 11.5 C 18.5 9 17.5 8 16 7.5" />
            <path d="M20 11.5 C 21.5 9 22.5 8 24 7.5" />
          </g>
        </svg>
      </motion.button>
    </div>
  );
}
