import { AnimatePresence, motion } from 'motion/react';
import { useAudio } from '../../hooks/useAudio';
import { CAHAYA_TOTAL } from '../../data/game';
import { teks } from '../../data/birthday';
import './HUD.css';

export interface HUDProps {
  /** Angka romawi babak, misalnya "I". */
  angka?: string;
  /** Nama babak, tampil kecil di sebelahnya. */
  babak?: string;
  /** Cahaya yang sudah terkumpul. Kalau diisi, penghitungnya muncul. */
  cahaya?: number;
  tone?: 'light' | 'dark';
  visible?: boolean;
}

/**
 * Nyaris nggak ada apa-apa.
 *
 * Cuma nama babak dan satu penghitung: cahaya yang sudah terkumpul dari
 * dua puluh. Penghitung itu sengaja kelihatan dari awal tanpa pernah
 * dijelaskan — biar rasa penasarannya yang jalan sendiri sampai babak IV.
 */
export function HUD({ angka, babak, cahaya, tone = 'dark', visible = true }: HUDProps) {
  const audio = useAudio();
  const adaCahaya = typeof cahaya === 'number';

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={`hud hud--${tone}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hud__left">
            {angka || babak ? (
              <div className="hud__act">
                {angka ? <span className="hud__numeral">{angka}</span> : null}
                {angka && babak ? <span className="hud__tick" /> : null}
                {babak ? <span className="t-micro hud__chapter">{babak}</span> : null}
              </div>
            ) : null}

            {adaCahaya ? (
              <div className="hud__cahaya" aria-label={`${cahaya} dari ${CAHAYA_TOTAL} cahaya`}>
                <span className="hud__spark" aria-hidden="true" />
                <span className="hud__count">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={cahaya}
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -7 }}
                      transition={{ type: 'spring', stiffness: 460, damping: 26 }}
                      className="hud__now"
                    >
                      {cahaya}
                    </motion.span>
                  </AnimatePresence>
                  <span className="hud__of">/ {CAHAYA_TOTAL}</span>
                </span>
              </div>
            ) : null}
          </div>

          {audio.available ? (
            <motion.button
              type="button"
              className="hud__sound"
              onClick={audio.toggle}
              whileTap={{ scale: 0.88 }}
              aria-label={audio.enabled ? teks.suara.nyala : teks.suara.mati}
              aria-pressed={audio.enabled}
            >
              <span className={`hud__wave${audio.enabled ? ' is-on' : ''}`}>
                <i />
                <i />
                <i />
              </span>
            </motion.button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
