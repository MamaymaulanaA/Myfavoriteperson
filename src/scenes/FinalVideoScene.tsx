import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { VideoSlot } from '../components/Frame/VideoSlot';
import { PhotoSlot } from '../components/Frame/PhotoSlot';
import { babak } from '../data/birthday';
import { penutup } from '../data/cinema';
import { useMediaAvailability } from '../hooks/useMediaAvailability';
import { useGameProgress } from '../hooks/useGameProgress';
import { useAudio } from '../hooks/useAudio';
import { useMotionProfile } from '../hooks/useMotionProfile';
import './FinalVideoScene.css';

type Tahap = 'gelap' | 'main' | 'habis';

const ease = [0.16, 0.84, 0.24, 1] as const;

/**
 * Babak VI — yang terakhir.
 *
 * Layarnya gelap dulu, dan tetap gelap satu setengah detik. Jeda itu satu-
 * satunya sunyi di seluruh perjalanan, dan dia bekerja: semua sebelum ini
 * bercahaya, bergerak, dan ada musiknya — jadi menghentikan ketiganya
 * sebentar yang bikin bagian terakhir terasa memang terakhir.
 *
 * Kalau ada video di /public/media/videos/vidio.mp4, dia yang dipakai.
 * Kalau nggak ada, satu foto paling spesial yang mendekat pelan-pelan —
 * bukan kotak kosong, dan tetap foto asli.
 */
export function FinalVideoScene() {
  const { goTo, completeFinalVideo } = useGameProgress();
  const audio = useAudio();
  const { reduced, kenBurns } = useMotionProfile();
  const [tahap, setTahap] = useState<Tahap>('gelap');

  const adaVideo = useMediaAvailability(penutup.video, 'video') === 'ready';

  useEffect(() => {
    audio.setIntensity('quiet');
    const id = window.setTimeout(() => setTahap('main'), reduced ? 400 : 1600);
    return () => window.clearTimeout(id);
  }, [audio, reduced]);

  const selesai = useCallback(() => {
    setTahap('habis');
    window.setTimeout(() => {
      completeFinalVideo();
      audio.setIntensity('normal');
      goTo('ending');
    }, 1500);
  }, [audio, completeFinalVideo, goTo]);

  // Kalau yang tampil foto, dia ditahan sebentar lalu lanjut sendiri.
  useEffect(() => {
    if (tahap !== 'main' || adaVideo) return;
    const id = window.setTimeout(selesai, reduced ? 3000 : 9000);
    return () => window.clearTimeout(id);
  }, [adaVideo, reduced, selesai, tahap]);

  return (
    <motion.section
      className="scene final"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease } }}
      transition={{ duration: 1.1, ease }}
    >
      <AnimatePresence>
        {tahap === 'gelap' ? (
          <motion.div
            key="judul"
            className="final__title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1, ease }}
          >
            <span className="t-numeral final__numeral">{babak.penutup.angka}</span>
            <span className="t-micro final__label">{babak.penutup.judul}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {tahap === 'main' ? (
          <motion.div
            key="isi"
            className="final__frame"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease } }}
            transition={{ duration: 1.6, ease }}
          >
            {adaVideo ? (
              <VideoSlot src={penutup.video} variant="feature" onEnded={selesai} tone="dark" />
            ) : (
              <motion.div
                className="final__photo"
                initial={{ scale: 1.06 }}
                animate={{ scale: kenBurns ? 1 : 1.06 }}
                transition={{ duration: 11, ease: 'linear' }}
              >
                <PhotoSlot src={penutup.foto} alt="Foto kamu" drift={false} corners={false} tone="dark" />
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {tahap === 'main' ? (
          <motion.div
            className="final__foot pad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <p className="t-lead final__caption">{penutup.caption}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="final__blackout"
        initial={false}
        animate={{ opacity: tahap === 'habis' ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.55, 0, 1, 0.45] }}
        aria-hidden="true"
      />
    </motion.section>
  );
}
