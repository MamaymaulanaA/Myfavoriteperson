import { motion } from 'motion/react';
import './Butterfly.css';

export interface CatchBurstProps {
  /** Stage-relative position, in pixels. */
  x: number;
  y: number;
}

const SPARKS = Array.from({ length: 9 }, (_, i) => {
  const angle = (i / 9) * Math.PI * 2 + 0.3;
  const distance = 22 + (i % 3) * 9;
  return {
    id: i,
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance - 6,
    size: 3 + (i % 3),
  };
});

/** The small burst left behind when a butterfly is caught. */
export function CatchBurst({ x, y }: CatchBurstProps) {
  return (
    <div className="catch-burst" style={{ left: x, top: y }} aria-hidden="true">
      {SPARKS.map((spark) => (
        <motion.span
          key={spark.id}
          className="catch-burst__spark"
          style={{ width: spark.size, height: spark.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
          animate={{ x: spark.dx, y: spark.dy, opacity: 0, scale: 1 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <motion.span
        className="catch-burst__ring"
        initial={{ scale: 0.2, opacity: 0.55 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
