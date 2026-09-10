import { useMemo } from 'react';
import { motion } from 'motion/react';
import { BLADE, CLOVER, FERN_FROND, LEAF, LEAF_BROAD, WILD_SPICATE, bokeh, cluster, lanterns } from './foliage';
import type { Cut } from './foliage';

/* ------------------------------------------------------------------
   The five plates of the diorama.

   The world is wider than the window — 660 units across against a
   portrait viewport that shows roughly 430 of them — so there is
   somewhere to go when you drag. Composition is macro and intimate:
   no horizon, no empty sky, just depth falling away into bokeh.
   ------------------------------------------------------------------ */

export const WORLD_W = 660;
export const WORLD_H = 900;
const VIEW = `0 0 ${WORLD_W} ${WORLD_H}`;

/** Renders one generated drift of leaves. */
function Cuts({ cuts, fill }: { cuts: Cut[]; fill: string }) {
  return (
    <>
      {cuts.map((c, i) => (
        <path
          key={i}
          d={c.path}
          fill={fill}
          opacity={0.62 + c.shade * 0.38}
          transform={`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${c.rotate.toFixed(1)}) scale(${c.scale.toFixed(2)})`}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------
   1 — Sky. Not sky: a wash of light with pools in it.
   ------------------------------------------------------------------ */

export function SkyPlate() {
  return (
    <svg viewBox={VIEW} className="plate" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor="#FFF6EA" />
          <stop offset="34%" stopColor="#FBEDDD" />
          <stop offset="64%" stopColor="#F2E2CE" />
          <stop offset="100%" stopColor="#E7D6C0" />
        </linearGradient>
        <radialGradient id="pool-a" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFEBC8" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#FFE2B8" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FFE2B8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pool-b" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F6DCE0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F6DCE0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={WORLD_W} height={WORLD_H} fill="url(#sky)" />
      <ellipse cx="470" cy="150" rx="290" ry="250" fill="url(#pool-a)" />
      <ellipse cx="120" cy="330" rx="220" ry="190" fill="url(#pool-b)" />
      <ellipse cx="330" cy="640" rx="380" ry="230" fill="url(#pool-a)" opacity="0.35" />
    </svg>
  );
}

/* ------------------------------------------------------------------
   2 — Bokeh. The whole upper field, out of focus.
   ------------------------------------------------------------------ */

export function BokehPlate() {
  const orbs = useMemo(() => bokeh(91, WORLD_W, WORLD_H, 22), []);

  return (
    <svg viewBox={VIEW} className="plate" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="orb-warm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFEFD2" stopOpacity="1" />
          <stop offset="62%" stopColor="#FFE6BE" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE6BE" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb-sage" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#CFDCC2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#CFDCC2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb-rose" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F0CFD3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F0CFD3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {orbs.map((o, i) => (
        <circle
          key={i}
          cx={o.cx}
          cy={o.cy}
          r={o.r}
          opacity={o.opacity}
          fill={o.tone < 0.55 ? 'url(#orb-warm)' : o.tone < 0.82 ? 'url(#orb-sage)' : 'url(#orb-rose)'}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------
   3 — Far foliage. Hangs from the top, softly out of focus.
   ------------------------------------------------------------------ */

export function FarPlate() {
  const canopy = useMemo(
    () => cluster(3, { count: 52, x0: -60, x1: 720, y0: 10, y1: 175, scale: [0.7, 1.5], spread: 62, lean: 170 }),
    [],
  );
  const left = useMemo(
    () => cluster(11, { count: 26, x0: -50, x1: 150, y0: 200, y1: 620, scale: [0.7, 1.4], spread: 54, lean: 118 }),
    [],
  );
  const right = useMemo(
    () => cluster(17, { count: 24, x0: 520, x1: 730, y0: 230, y1: 640, scale: [0.7, 1.35], spread: 54, lean: -118 }),
    [],
  );
  // Fills the band the eye would otherwise read as empty sky.
  const middle = useMemo(
    () => cluster(19, { count: 30, x0: -40, x1: 720, y0: 430, y1: 585, scale: [0.75, 1.5], spread: 46 }),
    [],
  );
  const bank = useMemo(
    () => cluster(23, { count: 44, x0: -60, x1: 730, y0: 560, y1: 665, scale: [0.95, 1.9], spread: 40 }),
    [],
  );

  return (
    <svg viewBox={VIEW} className="plate" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="far-leaf" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#BCC8AE" />
          <stop offset="100%" stopColor="#9FAE91" />
        </linearGradient>
        <linearGradient id="far-leaf-2" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#A9B79A" />
          <stop offset="100%" stopColor="#8B9B7D" />
        </linearGradient>
      </defs>

      <Cuts cuts={canopy} fill="url(#far-leaf)" />
      <Cuts cuts={left} fill="url(#far-leaf)" />
      <Cuts cuts={right} fill="url(#far-leaf)" />
      <Cuts cuts={middle} fill="url(#far-leaf-2)" />
      <Cuts cuts={bank} fill="url(#far-leaf)" />
    </svg>
  );
}

/* ------------------------------------------------------------------
   4 — Mid. The bed the flowers stand in, and the lanterns.
   ------------------------------------------------------------------ */

export function MidPlate({ lit, total }: { lit: number; total: number }) {
  const bed = useMemo(
    () => cluster(31, { count: 54, x0: -60, x1: 730, y0: 660, y1: 815, scale: [1.1, 2.3], spread: 36 }),
    [],
  );
  const ferns = useMemo(
    () =>
      cluster(33, {
        count: 24,
        x0: -50,
        x1: 720,
        y0: 620,
        y1: 780,
        scale: [1.2, 2.4],
        spread: 32,
        path: FERN_FROND,
      }),
    [],
  );
  const spicate = useMemo(
    () =>
      cluster(35, {
        count: 28,
        x0: -40,
        x1: 710,
        y0: 580,
        y1: 730,
        scale: [1, 2],
        spread: 22,
        path: WILD_SPICATE,
      }),
    [],
  );
  const clovers = useMemo(
    () =>
      cluster(39, {
        count: 26,
        x0: -50,
        x1: 720,
        y0: 740,
        y1: 850,
        scale: [0.9, 1.8],
        spread: 40,
        path: CLOVER,
      }),
    [],
  );
  const grass = useMemo(
    () =>
      cluster(37, {
        count: 40,
        x0: -50,
        x1: 710,
        y0: 710,
        y1: 830,
        scale: [1, 2.1],
        spread: 26,
        path: BLADE,
      }),
    [],
  );
  const tufts = useMemo(
    () => cluster(41, { count: 32, x0: -40, x1: 720, y0: 545, y1: 680, scale: [0.85, 1.6], spread: 46 }),
    [],
  );
  const lamps = useMemo(() => lanterns(53, total, WORLD_W), [total]);

  return (
    <svg viewBox={VIEW} className="plate" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="mid-leaf" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#7C8C6F" />
          <stop offset="100%" stopColor="#57674B" />
        </linearGradient>
        <linearGradient id="mid-leaf-2" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#8F9E81" />
          <stop offset="100%" stopColor="#6B7B5C" />
        </linearGradient>
        <linearGradient id="mid-fern" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#859976" />
          <stop offset="100%" stopColor="#4E5F42" />
        </linearGradient>
        <linearGradient id="lantern-paper" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#F7E8D2" />
          <stop offset="100%" stopColor="#E3CBA9" />
        </linearGradient>
        <radialGradient id="lantern-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFD9A0" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFC97F" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#FFC97F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Lanterns hang above the bed and light one at a time. */}
      {lamps.map((l, i) => {
        const on = i < lit;
        return (
          <motion.g
            key={i}
            animate={{ rotate: [-l.sway, l.sway, -l.sway] }}
            transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut', delay: l.delay }}
            style={{ transformBox: 'view-box', transformOrigin: `${l.x}px ${l.y - l.cord}px` }}
          >
            <line
              x1={l.x}
              y1={l.y - l.cord}
              x2={l.x}
              y2={l.y - 16 * l.scale}
              stroke="#8B7A62"
              strokeWidth="1.1"
              opacity="0.45"
            />
            <motion.circle
              cx={l.x}
              cy={l.y}
              r={64 * l.scale}
              fill="url(#lantern-glow)"
              initial={false}
              animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.7 }}
              transition={{ duration: 1.4, ease: [0.16, 0.84, 0.24, 1] }}
              style={{ transformBox: 'view-box', transformOrigin: `${l.x}px ${l.y}px` }}
            />
            <motion.g
              transform={`translate(${l.x} ${l.y}) scale(${l.scale})`}
              initial={false}
              animate={{ opacity: on ? 1 : 0.5 }}
              transition={{ duration: 1.4 }}
            >
              <path
                d="M-15 -14 C -15 -22 15 -22 15 -14 L 19 12 C 19 22 -19 22 -19 12 Z"
                fill="url(#lantern-paper)"
                opacity="0.96"
              />
              <motion.path
                d="M-15 -14 C -15 -22 15 -22 15 -14 L 19 12 C 19 22 -19 22 -19 12 Z"
                fill="#FFD9A0"
                initial={false}
                animate={{ opacity: on ? 0.85 : 0 }}
                transition={{ duration: 1.2 }}
              />
              <rect x="-8" y="-19" width="16" height="4" rx="2" fill="#8B7A62" opacity="0.7" />
              <path d="M-19 12 C -19 20 19 20 19 12" fill="none" stroke="#B49A76" strokeWidth="1" opacity="0.6" />
            </motion.g>
          </motion.g>
        );
      })}

      <Cuts cuts={tufts} fill="url(#mid-leaf-2)" />
      <Cuts cuts={spicate} fill="url(#mid-leaf-2)" />
      <Cuts cuts={ferns} fill="url(#mid-fern)" />
      <Cuts cuts={bed} fill="url(#mid-leaf)" />
      <Cuts cuts={clovers} fill="url(#mid-leaf-2)" />
      <Cuts cuts={grass} fill="url(#mid-leaf-2)" />
    </svg>
  );
}

/* ------------------------------------------------------------------
   5 — Near. Heavy, dark, and out of focus: the edge of the frame.
   ------------------------------------------------------------------ */

export function NearPlate() {
  const bottomLeft = useMemo(
    () => cluster(61, { count: 20, x0: -90, x1: 230, y0: 830, y1: 905, scale: [1.5, 2.7], spread: 38, lean: -16 }),
    [],
  );
  const bottomRight = useMemo(
    () => cluster(67, { count: 20, x0: 450, x1: 820, y0: 830, y1: 905, scale: [1.5, 2.6], spread: 38, lean: 18 }),
    [],
  );
  // A dark band right against the lens, so the frame has a floor.
  const sill = useMemo(
    () => cluster(73, { count: 26, x0: -80, x1: 800, y0: 885, y1: 930, scale: [1.7, 3], spread: 30 }),
    [],
  );
  const topRight = useMemo(
    () => cluster(71, { count: 12, x0: 470, x1: 790, y0: -30, y1: 55, scale: [1.4, 2.2], spread: 42, lean: 165 }),
    [],
  );

  return (
    <svg viewBox={VIEW} className="plate" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="near-leaf" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#2C3827" />
          <stop offset="100%" stopColor="#182114" />
        </linearGradient>
        <linearGradient id="near-leaf-2" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#1D2718" />
          <stop offset="100%" stopColor="#101710" />
        </linearGradient>
      </defs>

      <Cuts cuts={topRight} fill="url(#near-leaf)" />
      <Cuts cuts={bottomLeft} fill="url(#near-leaf)" />
      <Cuts cuts={bottomRight} fill="url(#near-leaf)" />
      <Cuts cuts={sill} fill="url(#near-leaf-2)" />
      <g opacity="0.95">
        <path d={LEAF_BROAD} fill="url(#near-leaf-2)" transform="translate(30 905) rotate(-28) scale(2.7)" />
        <path d={LEAF} fill="url(#near-leaf-2)" transform="translate(650 898) rotate(26) scale(2.6)" />
      </g>
    </svg>
  );
}
