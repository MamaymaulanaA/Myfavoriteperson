import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { World } from '../components/World/World';
import { LottieAsset } from '../components/LottieAsset/LottieAsset';
import { Button } from '../components/Button/Button';
import { Gift } from '../components/Gift/Gift';
import { teks } from '../data/birthday';
import { gardenFlowers, memories } from '../data/memories';
import { CAHAYA_TOTAL } from '../data/game';
import { useGameProgress } from '../hooks/useGameProgress';
import './EndingScene.css';

const ease = [0.16, 0.84, 0.24, 1] as const;

const kelompok = {
  initial: {},
  enter: { transition: { staggerChildren: 0.18, delayChildren: 0.8 } },
};

const satuan = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

/**
 * Penutup — cahaya pertama.
 *
 * Taman yang sama sekali lagi, kali ini menjelang pagi, semuanya menyala.
 * Hitungan kecil dari apa yang ditemukan, dan satu jalan untuk mengulang.
 * Nggak ada tombol bagikan — ini dibuat untuk satu orang dan biar tetap
 * begitu.
 */
export function EndingScene() {
  const { state, reset } = useGameProgress();
  const [hadiahDibuka, setHadiahDibuka] = useState(false);

  const hitungan = [
    { label: teks.penutup.hitungan.cerita, nilai: `${state.discoveredMemories.length}/${memories.length}` },
    { label: teks.penutup.hitungan.cahaya, nilai: `${state.cahaya}/${CAHAYA_TOTAL}` },
    { label: teks.penutup.hitungan.rahasia, nilai: `${state.unlockedSecrets.length}/1` },
  ];

  return (
    <motion.section
      className="scene ending"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease } }}
      transition={{ duration: 2, ease }}
    >
      <World mood="dawn" progress={1} lit={gardenFlowers.length} pannable={false} />

      {/* Hati-hatinya diburamkan jadi bokeh, supaya terbaca sebagai cahaya
          di udara, bukan stiker yang ditempel di atas frame. */}
      <div className="ending__hearts" aria-hidden="true">
        <LottieAsset name="heartsStream" width="100%" loop speed={0.7} />
      </div>

      <div className="ending__lift" aria-hidden="true" />

      <motion.div className="ending__body pad" variants={kelompok} initial="initial" animate="enter">
        <motion.span className="rule ending__rule" variants={satuan} />

        <motion.h1 className="t-hero ending__heading" variants={satuan}>
          {teks.penutup.judul}
        </motion.h1>

        <motion.p className="t-caption ending__sub" variants={satuan}>
          {teks.penutup.sub}
        </motion.p>

        <motion.dl className="ending__stats" variants={satuan}>
          {hitungan.map((h) => (
            <div key={h.label} className="ending__stat">
              <dt className="t-micro ending__stat-label">{h.label}</dt>
              <dd className="ending__stat-value">{h.nilai}</dd>
            </div>
          ))}
        </motion.dl>

        {/* Kotak kecil di ujung. Sekali ditekan, isinya keluar dan
            nggak bisa ditutup lagi: nggak ada yang perlu disembunyikan
            balik, dan tombol yang bisa dibolak-balik bikin dia terbaca
            seperti mainan, bukan seperti sesuatu yang dikasih. */}
        <motion.div className="ending__hadiah" variants={satuan}>
          <AnimatePresence mode="wait" initial={false}>
            {hadiahDibuka ? (
              <motion.div
                key="isi"
                className="ending__kado"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease }}
              >
                <Gift />
                {teks.penutup.hadiah.judul ? (
                  <motion.p
                    className="t-lead ending__kado-judul"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.9, ease }}
                  >
                    {teks.penutup.hadiah.judul}
                  </motion.p>
                ) : null}
                {teks.penutup.hadiah.baris ? (
                  <motion.p
                    className="t-caption ending__kado-baris"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.62, duration: 0.9, ease }}
                  >
                    {teks.penutup.hadiah.baris}
                  </motion.p>
                ) : null}
              </motion.div>
            ) : (
              <motion.div
                key="tombol"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.28 } }}
                transition={{ duration: 0.5, ease }}
              >
                <Button variant="light" onClick={() => setHadiahDibuka(true)}>
                  {teks.penutup.hadiah.tombol}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="ending__cta" variants={satuan}>
          <Button variant="bare" onClick={reset}>
            {teks.penutup.ulang}
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
