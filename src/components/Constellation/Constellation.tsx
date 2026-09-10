import { useMemo } from 'react';
import { motion } from 'motion/react';
import { CAHAYA_TOTAL } from '../../data/game';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import './Constellation.css';

/* ------------------------------------------------------------------
   Dua puluh cahaya menyusun angka 20.

   Titiknya digambar tangan pada kanvas 200x110 — sepuluh menyusun "2",
   sepuluh lagi mengitari "0". Bukan font, bukan teks: dua puluh benda
   yang sepanjang permainan tadi dikumpulkan satu-satu, sekarang naik ke
   langit dan berhenti di tempatnya masing-masing.

   Itu sebabnya jumlahnya harus pas dua puluh. Kalau ini cuma tulisan
   "20" yang di-fade in, angkanya nggak berarti apa-apa.
   ------------------------------------------------------------------ */

/** Sepuluh titik menyusun "2": bahu atas, lengkung, lalu turun ke alas. */
const DUA: [number, number][] = [
  [26, 32],
  [38, 16],
  [58, 12],
  [76, 21],
  [79, 40],
  [64, 58],
  [45, 77],
  [24, 97],
  [54, 97],
  [84, 97],
];

/** Sepuluh titik mengitari elips: pusat (139,54), rx 39, ry 43.
    Tepi kirinya di x=100, jadi jaraknya ke "2" cuma 16 dari 200 —
    satu angka, bukan dua yang kebetulan berdampingan. */
const NOL: [number, number][] = Array.from({ length: 10 }, (_, i) => {
  const t = (i / 10) * Math.PI * 2;
  return [
    Number((139 + 39 * Math.sin(t)).toFixed(1)),
    Number((54 - 43 * Math.cos(t)).toFixed(1)),
  ] as [number, number];
});

const TITIK = [...DUA, ...NOL];

const W = 200;
const H = 110;

/** Arah datang tiap cahaya — disebar, tapi tetap sama tiap kali dibuka. */
function asal(i: number) {
  const a = (i * 137.5 * Math.PI) / 180; // sudut emas, sebarannya rapi
  const jauh = 120 + ((i * 37) % 90);
  return { dx: Math.cos(a) * jauh, dy: Math.sin(a) * jauh * 0.6 + 90 };
}

export interface ConstellationProps {
  /** Mulai menyusun. */
  active: boolean;
  /**
   * Berapa cahaya yang benar-benar dia kumpulkan. Yang ini datang
   * duluan dan lebih terang; sisanya menyusul lebih pelan.
   */
  collected?: number;
}

export function Constellation({ active, collected = CAHAYA_TOTAL }: ConstellationProps) {
  const { reduced } = useMotionProfile();

  const dots = useMemo(
    () =>
      TITIK.map(([x, y], i) => ({
        i,
        left: (x / W) * 100,
        top: (y / H) * 100,
        ...asal(i),
        mine: i < collected,
      })),
    [collected],
  );

  return (
    <div className="constel" aria-label={`Dua puluh`} role="img">
      <div className="constel__box">
        {dots.map((d) => (
          <motion.span
            key={d.i}
            className={`constel__dot${d.mine ? ' is-mine' : ''}`}
            style={{ left: `${d.left}%`, top: `${d.top}%` }}
            initial={{ x: d.dx, y: d.dy, opacity: 0, scale: 0.4 }}
            animate={
              active
                ? { x: 0, y: 0, opacity: 1, scale: 1 }
                : { x: d.dx, y: d.dy, opacity: 0, scale: 0.4 }
            }
            transition={
              reduced
                ? { duration: 0.3, delay: d.i * 0.01 }
                : {
                    duration: 1.9,
                    delay: (d.mine ? 0 : 0.5) + d.i * 0.075,
                    ease: [0.16, 0.84, 0.24, 1],
                  }
            }
          />
        ))}

        {/* Nyala halus di belakang angkanya, muncul setelah semua sampai. */}
        <motion.span
          className="constel__halo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 2.4, delay: reduced ? 0.2 : 2.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
