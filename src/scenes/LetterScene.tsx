import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LottieAsset } from '../components/LottieAsset/LottieAsset';
import { Button } from '../components/Button/Button';
import { Atmosphere } from '../components/Atmosphere/Atmosphere';
import { HUD } from '../components/HUD/HUD';
import { babak, surat, teks } from '../data/birthday';
import { ENVELOPE_OPEN_SEGMENT } from '../lib/lottie';
import { useGameProgress } from '../hooks/useGameProgress';
import { useMotionProfile } from '../hooks/useMotionProfile';
import './LetterScene.css';

type Tahap = 'tertutup' | 'membuka' | 'baca';

const ease = [0.16, 0.84, 0.24, 1] as const;

/** Lama sebuah potongan ditahan, dihitung dari panjangnya sendiri.
    Dasarnya dua setengah detik, lalu ditambah per kata dan per baris.
    Barisnya ikut dihitung karena tulisannya dipecah satu pikiran satu
    baris: mata berhenti sebentar di tiap ujung baris, dan hitungan
    yang cuma pakai jumlah kata selalu kecepetan untuk bentuk begini. */
function lamaBaca(teksnya: string, reduced: boolean) {
  const isi = teksnya.trim();
  const kata = isi.split(/\s+/).length;
  const baris = isi.split('\n').length;
  const ms = 2500 + kata * 260 + baris * 420;
  return reduced ? Math.min(2200, ms) : Math.min(11000, ms);
}

/**
 * Babak V — Surat.
 *
 * Lottie yang memainkan amplopnya, tapi cuma separuh pertama garis
 * waktunya — frame 0 sampai 120, saat penutupnya terbuka dan kertasnya
 * mulai naik. File aslinya menutup dirinya lagi di frame 165 dan separuh
 * itu nggak pernah dijalankan. Setelah itu Motion yang mengangkat
 * kertasnya, karena isinya harus teks sungguhan yang bisa dibaca dan
 * diseleksi, bukan frame animasi.
 *
 * Suratnya nggak digulung. Satu potongan satu layar, ganti sendiri, dan
 * kartunya nggak pernah berubah tinggi. Surat panjang yang harus di-
 * scroll itu terbaca seperti syarat dan ketentuan; yang datang satu per
 * satu terbaca seperti orang yang sedang bicara dan berhenti sebentar
 * di tiap kalimat. Sentuh kartunya kalau mau lebih cepat.
 */
export function LetterScene() {
  const { goTo, openLetter } = useGameProgress();
  const { reduced } = useMotionProfile();
  const [tahap, setTahap] = useState<Tahap>('tertutup');
  const [i, setI] = useState(0);

  const total = surat.paragraf.length;
  const terakhir = i >= total - 1;
  const baris = surat.paragraf[i] ?? '';

  const tahan = useMemo(() => lamaBaca(baris, reduced), [baris, reduced]);

  const buka = useCallback(() => {
    setTahap('membuka');
    openLetter();
  }, [openLetter]);

  useEffect(() => {
    if (tahap !== 'membuka') return;
    const id = window.setTimeout(() => setTahap('baca'), reduced ? 400 : 1700);
    return () => window.clearTimeout(id);
  }, [reduced, tahap]);

  const lanjut = useCallback(() => {
    setI((n) => Math.min(total - 1, n + 1));
  }, [total]);

  // Jalan sendiri sampai potongan terakhir, lalu berhenti di situ. Yang
  // terakhir dibiarkan diam supaya sempat dibaca tanpa terburu-buru.
  useEffect(() => {
    if (tahap !== 'baca' || terakhir) return;
    const id = window.setTimeout(lanjut, tahan);
    return () => window.clearTimeout(id);
  }, [i, lanjut, tahan, tahap, terakhir]);

  return (
    <motion.section
      className="scene letter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease } }}
      transition={{ duration: 1.1, ease }}
    >
      <div className="letter__glow" aria-hidden="true" />
      <Atmosphere mood="night" />

      <HUD angka={babak.surat.angka} babak={babak.surat.judul} tone="dark" visible={tahap !== 'baca'} />

      <AnimatePresence>
        {tahap !== 'baca' ? (
          <motion.div
            key="amplop"
            className="letter__stage pad"
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.8, ease } }}
            transition={{ duration: 1.3, ease }}
          >
            <div className="letter__envelope">
              <LottieAsset
                name="envelope"
                width="100%"
                loop={false}
                autoplay={tahap === 'membuka'}
                segment={tahap === 'membuka' ? ENVELOPE_OPEN_SEGMENT : [0, 1]}
                speed={reduced ? 2.4 : 1}
              />
            </div>

            <AnimatePresence>
              {tahap === 'tertutup' ? (
                <motion.div
                  className="letter__cta"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.35 } }}
                  transition={{ delay: 0.6, duration: 1, ease }}
                >
                  <p className="t-caption letter__hint">{babak.surat.baris}</p>
                  <Button variant="light" onClick={buka}>
                    {teks.surat.buka}
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {tahap === 'baca' ? (
          <motion.article
            key="halaman"
            className="letter__page pad"
            initial={{ opacity: 0, y: 70, scale: 0.94, rotate: -1.4 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.6, ease } }}
            transition={{ type: 'spring', stiffness: 130, damping: 22, mass: 1.2 }}
          >
            <div
              className="letter__card"
              role="button"
              tabIndex={0}
              aria-label="Potongan berikutnya"
              onClick={terakhir ? undefined : lanjut}
              onKeyDown={(e) => {
                if (terakhir) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  lanjut();
                }
              }}
            >
              <header className="letter__head">
                <h1 className="t-title t-it letter__heading">{surat.sapaan}</h1>
                <span className="rule letter__rule" />
              </header>

              {/* Tingginya dikunci di sini. Tanpa itu kartunya kembang
                  kempis tiap ganti potongan dan seluruh halaman ikut
                  bergoyang, dan itu yang kebaca sebagai kedip. */}
              <div className="letter__slot">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={i}
                    className="t-body letter__para"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12, transition: { duration: 0.45, ease } }}
                    transition={{ duration: 0.9, ease }}
                  >
                    {baris}
                  </motion.p>
                </AnimatePresence>
              </div>

              <footer className="letter__foot">
                {terakhir ? (
                  <motion.p
                    className="letter__sign"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 1, ease }}
                  >
                    <span className="letter__signRule" aria-hidden="true" />
                    <span className="t-lead t-it letter__signName">{surat.ttd}</span>
                  </motion.p>
                ) : (
                  <div className="letter__track" aria-hidden="true">
                    {/* Satu ruas per potongan. Yang sedang dibaca terisi
                        pelan-pelan, jadi kelihatan suratnya memang jalan
                        sendiri dan tahu kapan mau ganti. */}
                    {surat.paragraf.map((_, n) => (
                      <span key={n} className={`letter__seg${n < i ? ' is-past' : ''}`}>
                        {n === i ? (
                          <motion.span
                            className="letter__segFill"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: tahan / 1000, ease: 'linear' }}
                          />
                        ) : null}
                      </span>
                    ))}
                  </div>
                )}
              </footer>
            </div>

            <div className="letter__below">
              <AnimatePresence mode="wait">
                {terakhir ? (
                  <motion.div
                    key="lanjut"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 1.6, duration: 1, ease }}
                  >
                    <Button variant="outline" onClick={() => goTo('final-video')}>
                      {teks.surat.lanjut}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.p
                    key="petunjuk"
                    className="t-caption letter__tip"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i === 0 ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i === 0 ? 1.8 : 0, duration: 1.4, ease }}
                  >
                    {teks.surat.petunjuk}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.article>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
