import { motion, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';

export interface LayerProps {
  /** 1 = moves with the camera. Below 1 is further away, above 1 is nearer. */
  factor: number;
  /** Camera position, shared by every layer. */
  pan: MotionValue<number>;
  /** Pointer tilt, −1 to 1. */
  tilt: MotionValue<number>;
  z: number;
  /** Depth of field, in pixels. */
  blur?: number;
  /** Illustrated replacement for this depth, from /public/garden. */
  src?: string;
  width: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * One plate of the diorama.
 *
 * The whole world is dragged as a single element, so a layer only has to
 * apply the *difference* between its own rate and the camera's — which is
 * why the flowers (factor 1) need no transform at all and stay perfectly
 * clickable while everything behind and in front of them slides.
 */
export function Layer({
  factor,
  pan,
  tilt,
  z,
  blur = 0,
  src,
  width,
  className,
  style,
  children,
}: LayerProps) {
  const x = useTransform(pan, (v) => v * (factor - 1));
  const y = useTransform(tilt, (v) => v * factor * 7);

  return (
    <motion.div
      className={['layer', className].filter(Boolean).join(' ')}
      style={{
        x,
        y,
        zIndex: z,
        width,
        filter: blur ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {src ? <img className="layer__img" src={src} alt="" decoding="async" /> : children}
    </motion.div>
  );
}
