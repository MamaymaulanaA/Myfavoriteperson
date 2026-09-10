import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { World, WORLD_RATIO } from '../components/World/World';
import { Moth } from '../components/World/Moth';
import { Bloom } from '../components/Bloom/Bloom';
import { Butterfly } from '../components/Butterfly/Butterfly';
import { makeFlightPath } from '../components/Butterfly/flight';
import { MemorySheet } from '../components/MemorySheet/MemorySheet';
import { RewardLayer } from '../components/Reward/RewardLayer';
import { ChapterCard } from '../components/ChapterCard/ChapterCard';
import { HUD } from '../components/HUD/HUD';
import { PaperPlaneTransition } from '../components/SceneTransition/SceneTransition';
import { gardenFlowers, memories, memoryById, memoryByFlowerId, secretSpot } from '../data/memories';
import { babak, teks } from '../data/birthday';
import { cahaya as jatah, game } from '../data/game';
import { useGameProgress } from '../hooks/useGameProgress';
import { useAudio } from '../hooks/useAudio';
import { useElementSize } from '../hooks/useElementSize';
import { useMotionProfile } from '../hooks/useMotionProfile';
import './GardenScene.css';

type Phase = 'kartu' | 'jelajah' | 'pergi' | 'bangun';

/**
 * Babak I — Taman.
 *
 * Diorama kertas yang lebarnya satu setengah layar, berisi lima bunga
 * yang masing-masing menyimpan sesuatu, dan satu hal kecil yang tidak.
 * Tiap bunga yang dibuka menyalakan satu lentera, melepas dua cahaya ke
 * langit, dan menghangatkan seluruh dunia satu langkah — jadi perubahan
 * dari senja ke emas itu sesuatu yang dia lakukan, bukan sesuatu yang
 * terjadi padanya.
 */
export function GardenScene() {
  const {
    state,
    discoverFlower,
    closeMemory,
    showReward,
    clearReward,
    unlockSecret,
    addCahaya,
    goTo,
    markGardenTransformed,
  } = useGameProgress();
  const audio = useAudio();
  const { ambient, reduced } = useMotionProfile();
  const { ref, size } = useElementSize<HTMLDivElement>();

  const [phase, setPhase] = useState<Phase>(() => (state.minigameCompleted ? 'bangun' : 'kartu'));
  const [mekar, setMekar] = useState<string | null>(null);
  const [petunjuk, setPetunjuk] = useState<string | null>(null);
  const [nyala, setNyala] = useState(() => (state.minigameCompleted ? gardenFlowers.length : 0));
  const [mundur, setMundur] = useState(false);

  const timers = useRef<number[]>([]);
  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    },
    [],
  );

  const terbuka = state.scene === 'memory';
  const aktif = state.activeMemoryId ? memoryById(state.activeMemoryId) : undefined;
  const ketemu = state.discoveredFlowers.length;
  const total = gardenFlowers.length;
  const semuaDibaca = state.discoveredMemories.length >= memories.length;

  const bangun = phase === 'bangun' || state.gardenTransformed;
  const progress = bangun ? 1 : ketemu / total;

  /* --- Membuka bunga ------------------------------------------------ */

  const sentuhBunga = useCallback(
    (flowerId: string) => {
      const isi = memoryByFlowerId(flowerId);
      if (!isi || mekar) return;
      setMekar(flowerId);
      setPetunjuk(null);
      setNyala((n) => Math.min(total, n + 1));
      addCahaya(jatah.perBunga);
      after(reduced ? 280 : 1000, () => {
        discoverFlower(flowerId, isi.id);
        setMekar(null);
      });
    },
    [addCahaya, after, discoverFlower, mekar, reduced, total],
  );

  const tutup = useCallback(() => {
    const hadiah = aktif?.reward ?? null;
    closeMemory();
    if (hadiah) after(760, () => showReward(hadiah));
  }, [aktif, after, closeMemory, showReward]);

  /* --- Yang disembunyikan -------------------------------------------- */

  const ngengatTampak =
    ketemu >= secretSpot.revealAfterFlowers && !state.unlockedSecrets.includes(secretSpot.id);

  const sudahBilang = useRef(false);
  useEffect(() => {
    if (!ngengatTampak || sudahBilang.current) return;
    sudahBilang.current = true;
    after(1200, () => {
      setPetunjuk(teks.taman.rahasia);
      after(4200, () => setPetunjuk(null));
    });
  }, [after, ngengatTampak]);

  const sentuhNgengat = useCallback(() => {
    unlockSecret(secretSpot.id, secretSpot.reward);
    addCahaya(jatah.rahasia);
  }, [addCahaya, unlockSecret]);

  /* --- Kupu-kupu ------------------------------------------------------ */

  const worldW = Math.round((size.width || 390) * WORLD_RATIO);
  const jalur = useMemo(() => {
    if (!size.width) return [];
    const n = game.kupuTaman + (bangun ? 2 : 0);
    return Array.from({ length: n }, (_, i) =>
      makeFlightPath(worldW, size.height, i * 41 + 7, { band: [0.2, 0.6], margin: 70 }),
    );
  }, [bangun, size.height, size.width, worldW]);

  /* --- Petunjuk awal --------------------------------------------------- */

  useEffect(() => {
    if (phase !== 'jelajah') return;
    if (ketemu === 0) {
      // Nggak pakai batas waktu. Selama belum ada satu bunga pun yang
      // disentuh, petunjuknya tetap di sana. Kalau dia lagi asyik
      // menggeser layar dan melihat-lihat, tulisannya jangan keburu
      // hilang sebelum sempat dibaca.
      after(1200, () => setPetunjuk(teks.taman.petunjuk));
      return;
    }

    // Bunga pertama sudah dibuka: sekarang dia sudah paham caranya.
    // Petunjuknya pamit pelan-pelan (exit-nya 2.4 detik).
    setPetunjuk((p) => (p === teks.taman.petunjuk ? null : p));

    // Pengingat lembut kalau lama nggak ada yang disentuh lagi.
    if (ketemu > 0 && ketemu < total && !terbuka) {
      after(26000, () => setPetunjuk((p) => p ?? teks.taman.petunjukLagi));
      after(40000, () => setPetunjuk((p) => (p === teks.taman.petunjukLagi ? null : p)));
    }
  }, [after, ketemu, phase, terbuka, total]);

  /* --- Menuju jejak perjalanan ---------------------------------------- */

  useEffect(() => {
    if (!semuaDibaca || state.cinemaCompleted || phase !== 'jelajah' || terbuka) return;
    after(1400, () => setPhase('pergi'));
  }, [after, phase, semuaDibaca, state.cinemaCompleted, terbuka]);

  /* --- Kembali, dan tamannya bangun ----------------------------------- */

  useEffect(() => {
    if (!state.minigameCompleted || state.gardenTransformed || phase !== 'bangun') return;
    audio.setIntensity('quiet');
    after(1600, () => setMundur(true));
    after(2600, () => {
      audio.setIntensity('normal');
      markGardenTransformed();
      goTo('birthday');
    });
  }, [after, audio, goTo, markGardenTransformed, phase, state.gardenTransformed, state.minigameCompleted]);

  /* -------------------------------------------------------------------- */

  return (
    <motion.section
      className="scene garden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.24, 1] } }}
      transition={{ duration: 0.9, ease: [0.16, 0.84, 0.24, 1] }}
      ref={ref}
    >
      <World
        mood={bangun ? 'golden' : 'dusk'}
        progress={progress}
        lit={nyala}
        lanternCount={total}
        pannable={phase === 'jelajah' && !terbuka}
        pulledBack={mundur}
        recede={terbuka}
      >
        {gardenFlowers.map((bunga) => (
          <Bloom
            key={bunga.id}
            config={bunga}
            open={state.discoveredFlowers.includes(bunga.id) || mekar === bunga.id}
            bursting={mekar === bunga.id}
            onTap={sentuhBunga}
            disabled={terbuka || phase !== 'jelajah'}
          />
        ))}

        {ambient
          ? jalur.map((path, i) => (
              <Butterfly key={i} path={path} size={i % 2 === 0 ? 46 : 36} delay={i * 1.8} opacity={0.92} />
            ))
          : null}

        <Moth x={secretSpot.x} y={secretSpot.y} visible={ngengatTampak} onTap={sentuhNgengat} />
      </World>

      <HUD
        angka={babak.taman.angka}
        babak={babak.taman.judul}
        cahaya={state.cahaya}
        tone="dark"
        visible={phase === 'jelajah' && !terbuka}
      />

      <AnimatePresence>
        {petunjuk && !terbuka ? (
          <motion.div
            key={petunjuk}
            className="world-hint"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 2.4, ease: 'easeInOut' } }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="world-hint__swipe" />
            <span>{petunjuk}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {terbuka && aktif ? <MemorySheet key={aktif.id} memory={aktif} onClose={tutup} /> : null}
      </AnimatePresence>

      <RewardLayer reward={state.pendingReward} onDone={clearReward} />

      <AnimatePresence>
        {phase === 'kartu' ? (
          <ChapterCard
            key="kartu"
            numeral={babak.taman.angka}
            title={babak.taman.judul}
            line={babak.taman.baris}
            tone="night"
            onDone={() => setPhase('jelajah')}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'pergi' ? (
          <PaperPlaneTransition key="pesawat" onComplete={() => goTo('cinema')} />
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
