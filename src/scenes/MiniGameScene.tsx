import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { World } from '../components/World/World';
import { Butterfly } from '../components/Butterfly/Butterfly';
import type { CatchPoint } from '../components/Butterfly/Butterfly';
import { CatchBurst } from '../components/Butterfly/CatchBurst';
import { makeFlightPath } from '../components/Butterfly/flight';
import { LottieAsset } from '../components/LottieAsset/LottieAsset';
import { Button } from '../components/Button/Button';
import { HUD } from '../components/HUD/HUD';
import { babak, teks } from '../data/birthday';
import { cahaya as jatah, game } from '../data/game';
import { useGameProgress } from '../hooks/useGameProgress';
import { useElementSize } from '../hooks/useElementSize';
import { useMotionProfile } from '../hooks/useMotionProfile';
import './MiniGameScene.css';

interface Terbang {
  key: number;
  seed: number;
}

interface Percik {
  id: number;
  x: number;
  y: number;
}

type Tahap = 'petunjuk' | 'main' | 'selesai';

const ease = [0.16, 0.84, 0.24, 1] as const;

/**
 * Babak III — Kupu-kupu.
 *
 * Lima kupu-kupu membawa sisa cahayanya, tiga di udara sekaligus. Nggak
 * ada waktu dan nggak ada cara kalah — tekanan itu rasa yang salah untuk
 * bagian ini. Petunjuknya ditulis di kartu pembuka sebelum mulai, jadi
 * dia tahu persis apa yang harus dilakukan tanpa perlu tulisan bergaya
 * tutorial di tengah permainan.
 */
export function MiniGameScene() {
  const { state, catchButterfly, addCahaya, completeMinigame, goTo } = useGameProgress();
  const { reduced } = useMotionProfile();
  const { ref, size } = useElementSize<HTMLDivElement>();

  const [tahap, setTahap] = useState<Tahap>('petunjuk');
  const [terbang, setTerbang] = useState<Terbang[]>([]);
  const [percik, setPercik] = useState<Percik[]>([]);

  const dibuat = useRef(0);
  const percikId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    },
    [],
  );

  const kena = state.butterfliesCaught;
  const sisa = game.targetKupu - kena;

  const jalur = useMemo(() => {
    const map = new Map<number, ReturnType<typeof makeFlightPath>>();
    if (!size.width) return map;
    for (const t of terbang) {
      map.set(t.key, makeFlightPath(size.width, size.height, t.seed, { band: [0.16, 0.66], margin: 58 }));
    }
    return map;
  }, [size.height, size.width, terbang]);

  const mulai = useCallback(() => {
    dibuat.current = 0;
    const awal = Array.from({ length: Math.min(game.kupuSekaligus, game.targetKupu) }, () => {
      dibuat.current += 1;
      return { key: dibuat.current, seed: dibuat.current * 53 + 11 };
    });
    setTerbang(awal);
    setTahap('main');
  }, []);

  const tangkap = useCallback(
    (key: number, titik: CatchPoint) => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        percikId.current += 1;
        const p = { id: percikId.current, x: titik.x - r.left, y: titik.y - r.top };
        setPercik((list) => [...list, p]);
        timers.current.push(
          window.setTimeout(() => setPercik((list) => list.filter((x) => x.id !== p.id)), game.percikMs),
        );
      }

      catchButterfly();
      addCahaya(jatah.perKupu);
      setTerbang((sekarang) => {
        const tanpa = sekarang.filter((t) => t.key !== key);
        const butuh = game.targetKupu - (kena + 1);
        if (tanpa.length < Math.min(game.kupuSekaligus, butuh)) {
          dibuat.current += 1;
          return [...tanpa, { key: dibuat.current, seed: dibuat.current * 53 + 11 }];
        }
        return tanpa;
      });
    },
    [addCahaya, catchButterfly, kena, ref],
  );

  useEffect(() => {
    if (tahap !== 'main' || sisa > 0) return;
    setTahap('selesai');
    timers.current.push(
      window.setTimeout(
        () => {
          completeMinigame();
          goTo('garden');
        },
        reduced ? 1800 : 4200,
      ),
    );
  }, [completeMinigame, goTo, reduced, sisa, tahap]);

  return (
    <motion.section
      className="scene minigame"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease } }}
      transition={{ duration: 0.9, ease }}
      ref={ref}
    >
      <motion.div
        className="minigame__world"
        animate={{ filter: tahap === 'selesai' ? 'blur(9px) saturate(0.85)' : 'blur(0px) saturate(1)' }}
        transition={{ duration: 1.2, ease }}
      >
        <World mood="night" progress={1} lit={kena} lanternCount={game.targetKupu} pannable={false}>
          {tahap === 'main'
            ? terbang.map((t) => {
                const path = jalur.get(t.key);
                if (!path) return null;
                return (
                  <Butterfly
                    key={t.key}
                    path={path}
                    size={56}
                    speed={1.85}
                    onCatch={(titik) => tangkap(t.key, titik)}
                  />
                );
              })
            : null}
        </World>
      </motion.div>

      <AnimatePresence>
        {percik.map((p) => (
          <CatchBurst key={p.id} x={p.x} y={p.y} />
        ))}
      </AnimatePresence>

      <HUD
        angka={babak.kupu.angka}
        babak={babak.kupu.judul}
        cahaya={state.cahaya}
        tone="dark"
        visible={tahap === 'main'}
      />

      {/* --- Petunjuk sebelum mulai --------------------------------- */}
      <AnimatePresence>
        {tahap === 'petunjuk' ? (
          <motion.div
            key="petunjuk"
            className="minigame__intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease } }}
            transition={{ duration: 0.9, ease }}
          >
            <div className="minigame__card">
              <motion.span
                className="rule minigame__rule"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1, ease }}
              />
              <motion.span
                className="t-numeral minigame__angka"
                initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3, duration: 1.1, ease }}
              >
                {babak.kupu.angka}
              </motion.span>
              <motion.h2
                className="t-chapter minigame__judul"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease }}
              >
                {babak.kupu.judul}
              </motion.h2>
              <motion.p
                className="t-body minigame__cara"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1, ease }}
              >
                {teks.kupu.petunjuk}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.9, ease }}
              >
                <Button variant="light" onClick={mulai}>
                  {teks.kupu.tombol}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* --- Selesai ------------------------------------------------- */}
      <AnimatePresence>
        {tahap === 'selesai' ? (
          <motion.div
            className="minigame__reward"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
            transition={{ duration: 0.7 }}
          >
            <div className="minigame__hearts">
              <LottieAsset name="heartsFeedback" width="100%" loop={false} />
            </div>
            <motion.p
              className="t-micro minigame__line"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, ease }}
            >
              {teks.kupu.selesai}
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
