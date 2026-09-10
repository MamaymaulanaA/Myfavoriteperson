import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PhotoSlot } from '../components/Frame/PhotoSlot';
import { VideoSlot } from '../components/Frame/VideoSlot';
import { ChapterCard } from '../components/ChapterCard/ChapterCard';
import { jejak } from '../data/cinema';
import type { Arrival } from '../data/cinema';
import type { Variants } from 'motion/react';
import { babak } from '../data/birthday';
import { cahaya as jatah } from '../data/game';
import { useGameProgress } from '../hooks/useGameProgress';
import { useMotionProfile } from '../hooks/useMotionProfile';
import './CinemaScene.css';

const ease = [0.16, 0.84, 0.24, 1] as const;

/** Empat cara masuk, supaya rentetan foto nggak terasa seperti carousel. */
const masuk: Record<Arrival, Variants> = {
  kabut: {
    initial: { opacity: 0, scale: 1.06 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 2.2, ease },
        scale: { duration: 17, ease: 'linear' },
      },
    },
    exit: { opacity: 0, transition: { duration: 1.6, ease } },
  },
  geserPelan: {
    initial: { opacity: 0, scale: 1.16, x: '-4%' },
    enter: {
      opacity: 1,
      scale: 1.08,
      x: '4%',
      transition: {
        opacity: { duration: 2, ease },
        scale: { duration: 17, ease: 'linear' },
        x: { duration: 17, ease: 'linear' },
      },
    },
    exit: { opacity: 0, transition: { duration: 1.6, ease } },
  },
  zoomHalus: {
    initial: { opacity: 0, scale: 1 },
    enter: {
      opacity: 1,
      scale: 1.1,
      transition: { opacity: { duration: 2, ease }, scale: { duration: 17, ease: 'linear' } },
    },
    exit: { opacity: 0, scale: 1.12, transition: { duration: 1.6, ease } },
  },
  larut: {
    initial: { opacity: 0, scale: 1.04 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: { opacity: { duration: 2.4, ease }, scale: { duration: 15, ease: 'linear' } },
    },
    exit: { opacity: 0, transition: { duration: 1.8, ease } },
  },
};

/**
 * Babak II — Jejak Perjalanan.
 *
 * Garis waktu, bukan galeri: nggak ada titik navigasi, panah, atau swipe.
 * Fotonya penuh satu layar, dari tepi ke tepi, dan bergerak pelan sekali.
 * Yang bikin bagian ini terasa seperti film pendek bukan bilah hitam di
 * atas-bawah, tapi kecepatannya: satu foto ditahan delapan sampai
 * sembilan detik, cukup lama untuk benar-benar dilihat.
 */
export function CinemaScene() {
  const { completeCinema, addCahaya, goTo } = useGameProgress();
  const { reduced } = useMotionProfile();

  const [jalan, setJalan] = useState(false);
  const [i, setI] = useState(0);

  const item = jejak[i];
  const terakhir = i >= jejak.length - 1;

  const selesai = useCallback(() => {
    addCahaya(jatah.jejakSelesai);
    completeCinema();
    goTo('minigame');
  }, [addCahaya, completeCinema, goTo]);

  const lanjut = useCallback(() => {
    if (terakhir) {
      selesai();
      return;
    }
    setI((n) => n + 1);
  }, [selesai, terakhir]);

  useEffect(() => {
    if (!jalan || !item || item.type !== 'photo') return;
    const tahan = reduced ? Math.min(3000, item.duration) : item.duration;
    const id = window.setTimeout(lanjut, tahan);
    return () => window.clearTimeout(id);
  }, [item, jalan, lanjut, reduced]);

  const progress = jejak.length ? (i + 1) / jejak.length : 0;

  return (
    <motion.section
      className="scene cinema"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease } }}
      transition={{ duration: 1.2, ease }}
    >
      <div className="cinema__reel">
        <AnimatePresence>
          {jalan && item ? (
            <motion.div
              key={item.id}
              className="cinema__frame"
              variants={masuk[item.arrival]}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {item.type === 'photo' ? (
                <PhotoSlot src={item.src} drift={false} corners={false} tone="dark" />
              ) : (
                <VideoSlot src={item.src} poster={item.poster} variant="clip" onEnded={lanjut} tone="dark" />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="cinema__vignette" aria-hidden="true" />
      <div className="cinema__scrim" aria-hidden="true" />
      <div className="cinema__grain" aria-hidden="true" />

      <AnimatePresence>
        {jalan ? (
          <motion.div
            className="cinema__foot pad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {item?.caption ? (
                <motion.p
                  key={item.id}
                  className="t-lead cinema__caption"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 1.3, delay: 0.7, ease }}
                >
                  {item.caption}
                </motion.p>
              ) : null}
            </AnimatePresence>

            {/* Sengaja nggak ada tombol lewati. Fotonya cuma empat dan
                jalan sendiri; tombol di daerah ibu jari cuma nunggu
                kepencet, dan sekali kepencet nggak ada jalan balik. */}
            <div className="cinema__controls">
              <div className="cinema__track" aria-hidden="true">
                <motion.span
                  className="cinema__fill"
                  initial={false}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.9, ease }}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!jalan ? (
          <ChapterCard
            key="kartu"
            numeral={babak.jejak.angka}
            title={babak.jejak.judul}
            line={babak.jejak.baris}
            tone="night"
            onDone={() => setJalan(true)}
          />
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
