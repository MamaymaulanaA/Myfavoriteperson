import { AnimatePresence, motion } from 'motion/react';
import { toastVariants } from '../../motion/variants';
import { SparkIcon } from '../HUD/icons';
import './Reward.css';

export interface ToastProps {
  message: string | null;
  /** Sits lower when a caption block is already using the bottom of the stage. */
  position?: 'centre' | 'low';
}

/** A single quiet line that appears, is read, and goes. */
export function Toast({ message, position = 'centre' }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          key={message}
          className={`toast toast--${position}`}
          variants={toastVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          role="status"
        >
          <span className="toast__icon">
            <SparkIcon />
          </span>
          <span className="toast__text">{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
