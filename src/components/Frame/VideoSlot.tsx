import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useMediaAvailability } from '../../hooks/useMediaAvailability';
import './Frame.css';

export interface VideoSlotProps {
  src: string;
  poster?: string;
  /** `clip` is a silent fragment; `feature` is the closing film. */
  variant?: 'clip' | 'feature';
  autoPlay?: boolean;
  onEnded?: () => void;
  tone?: 'paper' | 'dark';
  className?: string;
}

/**
 * Where a film goes.
 *
 * Same contract as PhotoSlot: no stand-in footage, ever. With no file at
 * the path this is an empty mount that still hands control back after a
 * few seconds, so a missing asset can never strand the story mid-scene.
 */
export function VideoSlot({
  src,
  poster,
  variant = 'clip',
  autoPlay = true,
  onEnded,
  tone = 'paper',
  className,
}: VideoSlotProps) {
  const status = useMediaAvailability(src, 'video');
  const [controls, setControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Safari di iPhone menolak play() untuk video yang ada suaranya kalau
     bukan hasil sentuhan langsung. Kalau ditolak, video ini dibisukan
     lalu dijalankan ulang, dan kontrolnya dimunculkan. Yang penting
     ceritanya nggak berhenti di sini. */
  useEffect(() => {
    if (status !== 'ready' || !autoPlay) return;
    const el = videoRef.current;
    if (!el) return;

    let batal = false;
    const jalan = async () => {
      try {
        await el.play();
      } catch {
        if (batal) return;
        el.muted = true;
        try {
          await el.play();
        } catch {
          if (!batal) setControls(true);
        }
      }
    };
    void jalan();

    return () => {
      batal = true;
    };
  }, [autoPlay, src, status]);

  /* Dan kalau ternyata nggak jalan juga: setelah 22 detik masih di detik
     nol berarti nggak akan jalan. Ceritanya lanjut sendiri.

     Ini pengganti tombol "Sudah" yang dulu ada di bawah videonya. Tombol
     itu memang jaring pengaman, tapi dia duduk di daerah ibu jari dan
     sekali kepencet videonya lewat begitu saja. Jaringnya tetap ada,
     cuma sekarang nggak kelihatan dan nggak bisa kesenggol. */
  useEffect(() => {
    if (status !== 'ready' || !onEnded) return;
    const id = window.setTimeout(() => {
      const el = videoRef.current;
      if (!el || el.currentTime < 0.2) onEnded();
    }, 22000);
    return () => window.clearTimeout(id);
  }, [onEnded, src, status]);

  useEffect(() => {
    if (status !== 'missing' || !onEnded) return;
    const id = window.setTimeout(onEnded, variant === 'feature' ? 4600 : 3600);
    return () => window.clearTimeout(id);
  }, [onEnded, status, variant]);

  if (status === 'checking') {
    return <div className={['slot', `slot--${tone}`, 'is-waiting', className].filter(Boolean).join(' ')} />;
  }

  if (status === 'missing') {
    return (
      <div className={['slot', `slot--${tone}`, 'is-empty', className].filter(Boolean).join(' ')}>
        <div className="slot__mount">
          <span className="slot__rule" />
          {import.meta.env.DEV ? <span className="slot__path">{src}</span> : null}
        </div>
        <span className="slot__grain" aria-hidden="true" />
      </div>
    );
  }

  return (
    <motion.div
      className={['slot', `slot--${tone}`, 'is-filled', className].filter(Boolean).join(' ')}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 0.84, 0.24, 1] }}
      onClick={variant === 'feature' ? () => setControls(true) : undefined}
    >
      <video
        ref={videoRef}
        className="slot__print"
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        muted={variant === 'clip'}
        preload="metadata"
        controls={variant === 'feature' && controls}
        onEnded={() => {
          if (variant === 'feature') setControls(true);
          onEnded?.();
        }}
      />
      <span className="slot__grain" aria-hidden="true" />
    </motion.div>
  );
}
