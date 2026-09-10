import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import './ChapterCard.css';

export interface ChapterCardProps {
  numeral: string;
  title: string;
  /** One quiet line under the title. Optional. */
  line?: string;
  onDone?: () => void;
  /** Berapa lama kartunya ditahan sebelum larut, milidetik. */
  hold?: number;
  tone?: 'paper' | 'night';
}

const ease = [0.16, 0.84, 0.24, 1] as const;

/**
 * The card between acts.
 *
 * Dua garis rambut, satu angka, satu judul. Tanpa ini babak-babaknya
 * saling tabrak dan nggak ada yang sempat mendarat.
 *
 * `hold` dihitung dari kapan barisnya selesai muncul, bukan dari kapan
 * kartunya muncul: baris terakhir baru utuh di detik 1,65. Jadi 4,6
 * detik itu artinya kira-kira tiga detik untuk benar-benar membacanya.
 */
export function ChapterCard({ numeral, title, line, onDone, hold = 4600, tone = 'paper' }: ChapterCardProps) {
  const { reduced } = useMotionProfile();
  const wait = reduced ? Math.min(1200, hold) : hold;

  useEffect(() => {
    if (!onDone) return;
    const id = window.setTimeout(onDone, wait);
    return () => window.clearTimeout(id);
  }, [onDone, wait]);

  const at = (s: number) => (reduced ? 0.02 : s);

  return (
    <motion.div
      className={`chapter chapter--${tone}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.85, ease } }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="chapter__inner pad">
        <motion.span
          className="rule chapter__rule"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: at(0.15), duration: 1, ease }}
        />

        <motion.span
          className="t-numeral chapter__numeral"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: at(0.28), duration: 1.1, ease }}
        >
          {numeral}
        </motion.span>

        <motion.h2
          className="t-chapter chapter__title"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: at(0.5), duration: 1, ease }}
        >
          {title}
        </motion.h2>

        {line ? (
          <motion.p
            className="t-caption chapter__line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: at(0.75), duration: 0.9, ease }}
          >
            {line}
          </motion.p>
        ) : null}

        <motion.span
          className="rule chapter__rule"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: at(0.2), duration: 1, ease }}
        />
      </div>
    </motion.div>
  );
}
