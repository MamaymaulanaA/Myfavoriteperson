import { motion } from 'motion/react';
import { useMediaAvailability } from '../../hooks/useMediaAvailability';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import './Frame.css';

export interface PhotoSlotProps {
  src: string;
  alt?: string;
  /** Slow drift while a photograph is being looked at. */
  drift?: boolean;
  /** Album corners that hold the print. On by default. */
  corners?: boolean;
  /** An empty mount on a dark ground should be dark, not a white screen. */
  tone?: 'paper' | 'dark';
  className?: string;
}

/**
 * Where a photograph goes.
 *
 * There is no stand-in image here and there never will be — no stock, no
 * illustration standing in for a face, no gradient pretending to be a
 * picture. Until a real file exists at the path this is an empty mount:
 * paper, a hairline, and the four corners that will hold the print. The
 * corners do not disappear when the photograph arrives; they hold it.
 *
 * Drop the file into /public/media/photos and it appears here, in this
 * exact box, with no layout change at all.
 */
export function PhotoSlot({
  src,
  alt = '',
  drift = true,
  corners = true,
  tone = 'paper',
  className,
}: PhotoSlotProps) {
  const status = useMediaAvailability(src, 'photo');
  const { kenBurns } = useMotionProfile();

  return (
    <div
      className={['slot', `slot--${tone}`, status === 'ready' ? 'is-filled' : 'is-empty', className]
        .filter(Boolean)
        .join(' ')}
    >
      {status === 'ready' ? (
        <motion.img
          className="slot__print"
          src={src}
          alt={alt}
          decoding="async"
          initial={{ scale: 1 }}
          animate={drift && kenBurns ? { scale: 1.045 } : { scale: 1 }}
          transition={drift && kenBurns ? { duration: 9, ease: 'linear' } : { duration: 0 }}
        />
      ) : null}

      {status !== 'ready' ? (
        <div className="slot__mount">
          <span className="slot__rule" />
          {import.meta.env.DEV ? <span className="slot__path">{src}</span> : null}
        </div>
      ) : null}

      {corners ? (
        <>
          <span className="slot__corner slot__corner--tl" aria-hidden="true" />
          <span className="slot__corner slot__corner--tr" aria-hidden="true" />
          <span className="slot__corner slot__corner--bl" aria-hidden="true" />
          <span className="slot__corner slot__corner--br" aria-hidden="true" />
        </>
      ) : null}

      <span className="slot__grain" aria-hidden="true" />
    </div>
  );
}
