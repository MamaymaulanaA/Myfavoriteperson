import { useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Lottie } from 'lottie-react';
import type { LottieHandle } from 'lottie-react';
import { motion } from 'motion/react';
import { useLottieData } from '../../hooks/useLottieData';
import { lottieAssets } from '../../lib/lottie';
import type { LottieKey } from '../../lib/lottie';
import './LottieAsset.css';

export interface LottieAssetProps {
  name: LottieKey;
  /** Overrides the asset's own recommendation from the registry. */
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  /** Play only part of the timeline, e.g. the envelope's opening half. */
  segment?: [number, number];
  onComplete?: () => void;
  className?: string;
  style?: CSSProperties;
  /** Width as a CSS length. Height follows the asset's own aspect ratio. */
  width?: string;
  /** Trims saturation so an imported character sits inside the palette. */
  tone?: 'as-drawn' | 'softened';
  /** Skip the network request until the component is actually wanted. */
  enabled?: boolean;
}

/**
 * The single way a Lottie file reaches the screen.
 *
 * Handles the lazy fetch, the palette correction, the fade-in once frames are
 * ready, and the aspect-ratio box that stops the layout jumping while the
 * JSON is still in flight.
 */
export function LottieAsset({
  name,
  loop,
  autoplay = true,
  speed = 1,
  segment,
  onComplete,
  className,
  style,
  width = '100%',
  tone = 'as-drawn',
  enabled = true,
}: LottieAssetProps) {
  const meta = lottieAssets[name];
  const data = useLottieData(name, enabled);
  const lottieRef = useRef<LottieHandle>(null);

  const subscriptions = useMemo(
    () => (onComplete ? { complete: onComplete } : undefined),
    [onComplete]
  );

  const aspectRatio = `${meta.width} / ${meta.height}`;

  return (
    <div
      className={['lottie-asset', `is-${tone}`, className].filter(Boolean).join(' ')}
      style={{ width, aspectRatio, ...style }}
      aria-hidden="true"
    >
      {data ? (
        <motion.div
          className="lottie-asset__inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <Lottie
            lottieRef={lottieRef}
            src={data}
            loop={loop ?? meta.loops}
            autoplay={autoplay}
            speed={speed}
            segment={segment}
            subscriptions={subscriptions}
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid meet',
              progressiveLoad: true,
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </motion.div>
      ) : null}
    </div>
  );
}
