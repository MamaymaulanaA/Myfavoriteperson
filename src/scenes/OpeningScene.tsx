import { motion } from 'motion/react';
import { World } from '../components/World/World';
import { Button } from '../components/Button/Button';
import { LottieAsset } from '../components/LottieAsset/LottieAsset';
import { teks } from '../data/birthday';
import { useAudio } from '../hooks/useAudio';
import { useMotionProfile } from '../hooks/useMotionProfile';
import './OpeningScene.css';

export interface OpeningSceneProps {
  onStart: () => void;
}

const ease = [0.16, 0.84, 0.24, 1] as const;

/**
 * Pintu masuk.
 *
 * Ini taman yang sama dengan babak berikutnya — plat yang sama, lentera
 * yang sama — cuma belum menyala, di luar fokus, dan dilihat dari luar.
 * Beruangnya berdiri di satu-satunya kolam cahaya yang ada.
 *
 * Tombolnya bertuliskan "Sentuh untuk memulai" bukan sekadar ajakan:
 * sentuhan itu juga yang menyalakan musiknya, karena browser HP menolak
 * suara yang jalan sendiri. Dia tidak perlu tahu soal itu.
 */
export function OpeningScene({ onStart }: OpeningSceneProps) {
  const audio = useAudio();
  const { reduced } = useMotionProfile();
  const at = (ms: number) => (reduced ? 0.04 : ms / 1000);

  const mulai = () => {
    audio.start();
    onStart();
  };

  return (
    <motion.section
      className="scene opening"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease } }}
      transition={{ duration: 1.4, ease }}
    >
      <motion.div
        className="opening__world"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 7, ease }}
      >
        <World mood="night" progress={0} lit={0} pannable={false} />
      </motion.div>

      <div className="opening__dim" aria-hidden="true" />

      <div className="opening__body pad">
        <motion.div
          className="opening__greeter"
          initial={{ opacity: 0, scale: 0.86, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: at(600), duration: 1.5, ease }}
        >
          <span className="opening__pool" aria-hidden="true" />
          <LottieAsset name="teddyBear" width="100%" loop tone="softened" speed={0.78} />
        </motion.div>

        <div className="opening__copy">
          <motion.span
            className="t-micro opening__eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: at(1000), duration: 0.9, ease }}
          >
            {teks.pembuka.label}
          </motion.span>

          <motion.h1
            className="t-chapter opening__heading"
            initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: at(1300), duration: 1.4, ease }}
          >
            {teks.pembuka.judul}
          </motion.h1>

          <motion.p
            className="t-caption opening__sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: at(1650), duration: 1, ease }}
          >
            {teks.pembuka.sub}
          </motion.p>
        </div>

        <motion.div
          className="opening__cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: at(2000), duration: 1, ease }}
        >
          <Button variant="light" onClick={mulai}>
            {teks.pembuka.tombol}
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
