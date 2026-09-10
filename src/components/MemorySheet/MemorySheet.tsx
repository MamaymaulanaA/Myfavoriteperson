import { motion } from 'motion/react';
import type { Memory } from '../../data/memories';
import { PhotoSlot } from '../Frame/PhotoSlot';
import { teks } from '../../data/birthday';
import './MemorySheet.css';

export interface MemorySheetProps {
  memory: Memory;
  onClose: () => void;
}

const ease = [0.16, 0.84, 0.24, 1] as const;

const text = {
  initial: {},
  enter: { transition: { staggerChildren: 0.13, delayChildren: 0.78 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const line = {
  initial: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.24 } },
};

/**
 * Satu bunga, dibuka.
 *
 * Fotonya naik keluar dari bunga — ke atas, lurus pelan, keluar dari
 * kabur — lalu berhenti sedikit miring, seperti barang yang baru saja
 * dipegang. Kata-katanya datang belakangan dan pergi duluan.
 *
 * Judul kecil di atas beda-beda tiap bunga ("Potongan Cerita", "Satu
 * Doa", dan seterusnya), supaya nggak terasa seperti galeri yang isinya
 * "Kenangan 1", "Kenangan 2".
 */
export function MemorySheet({ memory, onClose }: MemorySheetProps) {
  return (
    <motion.div
      className="sheet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease, delay: 0.12 } }}
      transition={{ duration: 0.5, ease }}
      role="dialog"
      aria-modal="true"
      aria-label={memory.judul}
    >
      <div className="sheet__scrim" aria-hidden="true" />

      <div className="sheet__inner pad">
        <motion.div
          className="sheet__print"
          initial={{ opacity: 0, y: 70, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.1 }}
          exit={{
            opacity: 0,
            y: 40,
            scale: 0.85,
            rotate: -4,
            transition: { duration: 0.45, ease },
          }}
          transition={{ duration: 1.1, ease }}
        >
          <div className="sheet__mat">
            <PhotoSlot src={memory.media.src} alt={memory.media.alt} />
          </div>
        </motion.div>

        <motion.div className="sheet__text" variants={text} initial="initial" animate="enter" exit="exit">
          <motion.span className="t-micro sheet__label" variants={line}>
            {memory.label}
          </motion.span>

          <motion.h2 className="t-title sheet__title" variants={line}>
            {memory.judul}
          </motion.h2>

          <motion.p className="t-body sheet__caption" variants={line}>
            {memory.pesan}
          </motion.p>

          <motion.button type="button" className="sheet__close" onClick={onClose} variants={line}>
            {teks.potongan.tutup}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
