import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { World } from '../components/World/World';
import { Constellation } from '../components/Constellation/Constellation';
import { LottieAsset } from '../components/LottieAsset/LottieAsset';
import { Button } from '../components/Button/Button';
import { dia, teks } from '../data/birthday';
import { gardenFlowers } from '../data/memories';
import { useGameProgress } from '../hooks/useGameProgress';
import { useAudio } from '../hooks/useAudio';
import { useMotionProfile } from '../hooks/useMotionProfile';
import './BirthdayScene.css';

const ease = [0.16, 0.84, 0.24, 1] as const;

/**
 * Babak IV — Langit.
 *
 * Ini puncaknya, dan sengaja nggak buru-buru. Tamannya tenang dulu, satu
 * baris kalimat, baru cahaya-cahaya yang tadi dikumpulkan naik dan
 * berhenti membentuk angka 20. Ucapannya menyusul setelah angkanya utuh —
 * bukan sebaliknya. Nggak ada confetti; yang meledak di sini cuma
 * cahayanya sendiri.
 */
export function BirthdayScene() {
  const { state, goTo } = useGameProgress();
  const audio = useAudio();
  const { reduced } = useMotionProfile();

  const [beat, setBeat] = useState(0);
  const at = (s: number) => (reduced ? s * 0.25 : s);

  useEffect(() => {
    // Musiknya mundur sedikit supaya momen ini punya ruang.
    audio.setIntensity('quiet');
    const marks = [0.6, 2.2, 6.4, 7.7, 8.6].map((s, i) =>
      window.setTimeout(() => setBeat(i + 1), at(s) * 1000),
    );
    const back = window.setTimeout(() => audio.setIntensity('normal'), at(6.4) * 1000);
    return () => {
      marks.forEach(window.clearTimeout);
      window.clearTimeout(back);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.section
      className="scene langit"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease } }}
      transition={{ duration: 1.8, ease }}
    >
      <World mood="gala" progress={1} lit={gardenFlowers.length} pannable={false} pulledBack />

      <div className="langit__lift" aria-hidden="true" />

      {/* Pasangan berjalan di kejauhan — siluet, bukan ilustrasi. */}
      <motion.div
        className="langit__couple"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: beat >= 3 ? 1 : 0, y: 0 }}
        transition={{ duration: 2.4, ease }}
        aria-hidden="true"
      >
        <LottieAsset name="couple" width="100%" loop speed={0.6} />
      </motion.div>

      <div className="langit__body pad">
        {/* Satu baris sebelum apa pun terjadi. */}
        <AnimatePresence>
          {beat >= 1 && beat < 3 ? (
            <motion.p
              className="t-caption langit__intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
              transition={{ duration: 1.2, ease }}
            >
              {teks.langit.sebelum}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <Constellation active={beat >= 2} collected={state.cahaya} />

        <div className="langit__ucapan">
          <motion.p
            className="t-lead langit__selamat"
            initial={{ opacity: 0, y: 14 }}
            animate={beat >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.3, ease }}
          >
            {teks.langit.ucapan}
          </motion.p>

          <motion.h1
            className="t-hero t-it langit__nama"
            initial={{ opacity: 0, y: 22, scale: 0.94 }}
            animate={beat >= 3 ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: at(0.35), duration: reduced ? 0.4 : 1.9, ease }}
          >
            {dia.sebutan}
          </motion.h1>

          <motion.p
            className="t-caption langit__sesudah"
            initial={{ opacity: 0 }}
            animate={beat >= 4 ? { opacity: 1 } : {}}
            transition={{ duration: 1.4, ease }}
          >
            {teks.langit.sesudah}
          </motion.p>
        </div>

        <motion.div
          className="langit__cta"
          initial={{ opacity: 0, y: 16 }}
          animate={beat >= 5 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease }}
        >
          <Button variant="light" onClick={() => goTo('letter')}>
            {teks.langit.tombol}
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
