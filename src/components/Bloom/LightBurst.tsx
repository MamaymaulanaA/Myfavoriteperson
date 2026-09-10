import { motion } from 'motion/react';
import './Bloom.css';

const MOTES = [
  { x: -30, y: -46, s: 5, d: 0 },
  { x: 24, y: -58, s: 4, d: 0.05 },
  { x: -4, y: -78, s: 6.5, d: 0.11 },
  { x: -46, y: -22, s: 3.5, d: 0.17 },
  { x: 40, y: -30, s: 4.5, d: 0.09 },
  { x: 14, y: -94, s: 3, d: 0.23 },
  { x: -18, y: -68, s: 3.5, d: 0.29 },
  { x: 52, y: -60, s: 3, d: 0.2 },
];

/**
 * The light a flower lets go of as it opens. Eight motes and one ring,
 * once. It stays special because it is brief and rare.
 */
export function LightBurst() {
  return (
    <div className="bloom__burst" aria-hidden="true">
      <motion.span
        className="bloom__ring"
        initial={{ scale: 0.2, opacity: 0.7 }}
        animate={{ scale: 2.1, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      {MOTES.map((m) => (
        <motion.span
          key={`${m.x}-${m.y}`}
          className="bloom__mote"
          style={{ width: m.s, height: m.s }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
          animate={{ x: m.x, y: m.y, opacity: [0, 1, 0], scale: [0.2, 1, 0.4] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.35, delay: m.d, ease: [0.22, 1, 0.36, 1], times: [0, 0.32, 1] }}
        />
      ))}
    </div>
  );
}
