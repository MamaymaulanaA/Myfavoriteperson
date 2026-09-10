import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import type { FlowerSpecies } from '../../data/memories';
import { SPECIES, speciesPalette } from './species';
import { BotanicalCore, BotanicalSepals, BotanicalStemAndLeaves } from './BotanicalParts';

/* `fill-box` is the only reliable way to pivot an SVG petal about its
   own base across browsers. */
const pivotBase: CSSProperties = { transformBox: 'fill-box', transformOrigin: '50% 100%' };
const pivotCentre: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center' };

const ease = [0.22, 1, 0.36, 1] as const;

export interface BloomArtProps {
  species: FlowerSpecies;
  hue: number;
  open: boolean;
  /** Seeds the gradient ids so two blooms never share a definition. */
  uid: string;
  instant?: boolean;
}

/**
 * One botanical flower, cut from fine artisanal paper.
 *
 * Closed: an intimate bud with a living warm ember breathing inside —
 * an inviting lantern waiting for touch.
 *
 * Open: two tiers of uniquely shaped botanical petals unfold outward
 * with crisp crease folds, revealing an authentic species-specific core
 * (radiating poppy stamens, textured daisy honey-disc, spiral rose rosette,
 * golden tulip stigma, or dangling bell pistil) with a warm radiant aura.
 */
export function BloomArt({ species, hue, open, uid, instant = false }: BloomArtProps) {
  const s = SPECIES[species];
  const c = speciesPalette(species, hue);
  const cx = 60;
  const cy = s.headY;

  const outer = Array.from({ length: s.outer }, (_, i) => (i * 360) / s.outer);
  const inner = Array.from({ length: s.inner }, (_, i) => (i * 360) / s.inner + 180 / s.outer);

  const t = instant ? { duration: 0 } : { duration: 0.85, ease };

  return (
    <svg viewBox="0 0 120 220" className="bloom__svg" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        {/* Outer petal gradient */}
        <linearGradient id={`p-${uid}`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.tip} />
        </linearGradient>

        {/* Inner petal gradient */}
        <linearGradient id={`pi-${uid}`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor={c.innerBase} />
          <stop offset="100%" stopColor={c.innerTip} />
        </linearGradient>

        {/* Stem gradient */}
        <linearGradient id={`st-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.stemLight} />
          <stop offset="50%" stopColor={c.stemDark} />
          <stop offset="100%" stopColor="#3C4B33" />
        </linearGradient>

        {/* Leaf gradient */}
        <linearGradient id={`lf-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={c.leafLight} />
          <stop offset="100%" stopColor={c.leafDark} />
        </linearGradient>

        {/* Radiant flower glow / aura */}
        <radialGradient id={`gl-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFF4DE" stopOpacity="1" />
          <stop offset="30%" stopColor={c.ember} stopOpacity="0.75" />
          <stop offset="65%" stopColor={c.glow} stopOpacity="0.28" />
          <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>

        {/* Subtle translucent bud glow */}
        <radialGradient id={`bud-glow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFF9EB" stopOpacity="1" />
          <stop offset="45%" stopColor={c.ember} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c.ember} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Flower Aura / Light Halo */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={84}
        fill={`url(#gl-${uid})`}
        initial={false}
        animate={
          open
            ? { opacity: [0.85, 0.95, 0.85], scale: [0.98, 1.04, 0.98] }
            : { opacity: [0.35, 0.62, 0.35], scale: [0.44, 0.54, 0.44] }
        }
        transition={
          open
            ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
        }
        style={pivotCentre}
      />

      {/* Species-specific stem and foliage */}
      <BotanicalStemAndLeaves species={species} cx={cx} cy={cy} uid={uid} palette={c} />

      {/* Sepals at the neck */}
      <BotanicalSepals species={species} cx={cx} cy={cy} uid={uid} />

      {/* Bud State (When unlit / waiting to bloom) */}
      <motion.g
        initial={false}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.35 : 1 }}
        transition={t}
        style={pivotBase}
      >
        {/* Main bud body */}
        <path
          d={`M${cx} ${cy - s.budH} C ${cx + s.budW} ${cy - s.budH * 0.45} ${cx + s.budW * 0.88} ${cy + s.budH * 0.42} ${cx} ${cy + s.budH * 0.6} C ${cx - s.budW * 0.88} ${cy + s.budH * 0.42} ${cx - s.budW} ${cy - s.budH * 0.45} ${cx} ${cy - s.budH} Z`}
          fill={`url(#p-${uid})`}
        />

        {/* Paper crease / contour line */}
        <path
          d={`M${cx} ${cy - s.budH + 2} C ${cx + 4} ${cy - s.budH * 0.4} ${cx + 4} ${cy + s.budH * 0.3} ${cx} ${cy + s.budH * 0.55}`}
          fill="none"
          stroke={c.crease}
          strokeWidth="1.2"
        />

        {/* The living warm ember shining from within the paper bud */}
        <motion.ellipse
          cx={cx}
          cy={cy - s.budH * 0.05}
          rx={s.budW * 0.38}
          ry={s.budH * 0.38}
          fill={`url(#bud-glow-${uid})`}
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={pivotCentre}
        />

        {/* Bud base sepals */}
        <path
          d={`M${cx - s.budW * 0.85} ${cy + s.budH * 0.22} C ${cx - 5} ${cy + s.budH * 0.88} ${cx + 5} ${cy + s.budH * 0.88} ${cx + s.budW * 0.85} ${cy + s.budH * 0.22} C ${cx + 5} ${cy + s.budH * 0.58} ${cx - 5} ${cy + s.budH * 0.58} ${cx - s.budW * 0.85} ${cy + s.budH * 0.22} Z`}
          fill={`url(#st-${uid})`}
        />
      </motion.g>

      {/* Bloom State (When open) */}
      <motion.g
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.22 }}
        transition={t}
        style={pivotCentre}
      >
        <g transform={`translate(${cx} ${cy})`}>
          {/* Outer Petals Ring */}
          {outer.map((angle, i) => (
            <motion.g
              key={`o${angle}`}
              initial={false}
              animate={{ rotate: open ? angle : angle * 0.2, scale: open ? 1 : 0.3 }}
              transition={instant ? { duration: 0 } : { duration: 0.72, ease, delay: 0.025 * i }}
              style={pivotBase}
            >
              <path d={s.petal} fill={`url(#p-${uid})`} transform={`scale(${s.wide} ${s.long})`} />
              <path
                d={s.crease}
                fill="none"
                stroke={c.crease}
                strokeWidth="1.1"
                transform={`scale(${s.wide} ${s.long})`}
              />
            </motion.g>
          ))}

          {/* Inner Petals Ring (offset angle for staggered floral layering) */}
          {inner.map((angle, i) => (
            <motion.g
              key={`i${angle}`}
              initial={false}
              animate={{
                rotate: open ? angle : angle * 0.2,
                scale: open ? s.innerScale : 0.16,
              }}
              transition={instant ? { duration: 0 } : { duration: 0.72, ease, delay: 0.08 + 0.025 * i }}
              style={pivotBase}
            >
              <path d={s.petal} fill={`url(#pi-${uid})`} transform={`scale(${s.wide} ${s.long})`} />
              <path
                d={s.crease}
                fill="none"
                stroke={c.crease}
                strokeWidth="0.9"
                transform={`scale(${s.wide} ${s.long})`}
                opacity="0.8"
              />
            </motion.g>
          ))}

          {/* Botanical species-specific center */}
          <BotanicalCore species={species} palette={c} coreRadius={s.core} open={open} />
        </g>
      </motion.g>
    </svg>
  );
}

