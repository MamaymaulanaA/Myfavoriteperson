import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import './Button.css';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /**
   * `light` sits on a dark ground, `ink` on paper, `outline` is the quiet
   * second option, `bare` is a text link with a proper touch target.
   */
  variant?: 'light' | 'ink' | 'outline' | 'bare';
  block?: boolean;
  disabled?: boolean;
  className?: string;
}

const press = {
  rest: { y: 0, scale: 1 },
  hover: { y: -1, scale: 1.01 },
  tap: { y: 2, scale: 0.98 },
};

const spring = { type: 'spring', stiffness: 620, damping: 26, mass: 0.7 } as const;

export function Button({
  children,
  onClick,
  variant = 'light',
  block = false,
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      className={['btn', `btn--${variant}`, block ? 'is-block' : '', className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      variants={press}
      initial="rest"
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : 'tap'}
      transition={spring}
    >
      <span className="btn__label">{children}</span>
    </motion.button>
  );
}
