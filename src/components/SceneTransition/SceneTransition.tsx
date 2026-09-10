import { useEffect } from 'react';
import { motion } from 'motion/react';
import { LottieAsset } from '../LottieAsset/LottieAsset';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import './SceneTransition.css';

export interface TransitionProps {
  onComplete: () => void;
}

/**
 * The paper plane crossing the screen.
 *
 * This is a transition, never a button. It enters low on the left, climbs
 * across, and the wash behind it drifts a little in the same direction so
 * the camera reads as following it. When it leaves the frame the next scene
 * is already fading up underneath.
 */
export function PaperPlaneTransition({ onComplete }: TransitionProps) {
  const { reduced } = useMotionProfile();
  const duration = reduced ? 0.9 : 2.5;

  useEffect(() => {
    const id = window.setTimeout(onComplete, duration * 1000 - 250);
    return () => window.clearTimeout(id);
  }, [duration, onComplete]);

  return (
    <motion.div
      className="transition transition--plane"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <motion.div
        className="transition__wash"
        initial={{ x: 0, y: 0 }}
        animate={reduced ? { x: 0, y: 0 } : { x: -18, y: 12 }}
        transition={{ duration, ease: [0.4, 0, 0.4, 1] }}
      />

      {reduced ? null : (
        <motion.div
          className="transition__plane"
          initial={{ x: '-32vw', y: '46vh', rotate: -8, scale: 0.7, opacity: 0 }}
          animate={{
            x: ['-32vw', '10vw', '52vw', '108vw'],
            y: ['46vh', '18vh', '2vh', '-26vh'],
            rotate: [-8, -14, -18, -24],
            scale: [0.7, 1, 0.95, 0.72],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration, ease: [0.32, 0, 0.5, 1], times: [0, 0.32, 0.68, 1] }}
        >
          <LottieAsset name="paperPlaneHeart" width="100%" loop speed={1} />
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * A thin veil of rising hearts. Used exactly three times in the whole
 * experience — leaving the opening, arriving at the birthday, and the very
 * end — so it never becomes wallpaper.
 */
export function HeartsVeil({
  onComplete,
  duration = 2.2,
  intensity = 0.5,
}: {
  onComplete?: () => void;
  duration?: number;
  intensity?: number;
}) {
  const { reduced } = useMotionProfile();
  const total = reduced ? 0.7 : duration;

  useEffect(() => {
    if (!onComplete) return;
    const id = window.setTimeout(onComplete, total * 1000 - 200);
    return () => window.clearTimeout(id);
  }, [onComplete, total]);

  return (
    <motion.div
      className="transition transition--hearts"
      initial={{ opacity: 0 }}
      animate={{ opacity: intensity }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      aria-hidden="true"
    >
      {reduced ? null : <LottieAsset name="heartsStream" width="100%" loop speed={1} />}
    </motion.div>
  );
}
