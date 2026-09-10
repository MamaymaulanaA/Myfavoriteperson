import { useCallback, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import type { ReactNode } from 'react';
import { Layer } from './Layer';
import { BokehPlate, FarPlate, MidPlate, NearPlate, SkyPlate } from './scenery';
import { Atmosphere } from '../Atmosphere/Atmosphere';
import { mixLight } from './light';
import type { Mood } from './light';
import { useElementSize } from '../../hooks/useElementSize';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import './World.css';

/** How much wider the world is than the window. */
export const WORLD_RATIO = 1.5;

export interface WorldProps {
  mood?: Mood;
  /** 0–1. Warms the garden as memories are found. */
  progress?: number;
  /** Lanterns currently lit. */
  lit?: number;
  lanternCount?: number;
  /** Dragging is off during cutscenes. */
  pannable?: boolean;
  /** Pulls the camera back a little for the birthday beat. */
  pulledBack?: boolean;
  /** Softens the whole world behind an overlay. */
  recede?: boolean;
  /**
   * Illustrated replacements, when you have them. Each one takes over its
   * depth entirely: /public/garden/<layer>/your-art.webp
   */
  art?: Partial<Record<'sky' | 'far' | 'mid' | 'near', string>>;
  children?: ReactNode;
}

/**
 * The paper diorama.
 *
 * Five plates cut from progressively darker stock, each drifting at its own
 * rate and sitting at its own focal distance, inside a world half again as
 * wide as the screen so there is somewhere to look.
 *
 * Light is the part worth explaining. Sky and foliage are lit *separately*
 * and in opposite directions: the sky group has a twilight gradient laid
 * over it, while the foliage group is multiplied down toward silhouette.
 * Washing both with one pass — which is what I tried first — drags them to
 * the same middle value and the whole thing reads as fog. Keeping them
 * apart is what produces contrast, and contrast is what makes a night
 * scene legible.
 *
 * The flowers sit above the foliage pass, because a light source cannot
 * live underneath the layer that darkens the room.
 */
export function World({
  mood = 'dusk',
  progress = 0,
  lit = 0,
  lanternCount = 5,
  pannable = true,
  pulledBack = false,
  recede = false,
  art,
  children,
}: WorldProps) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const { reduced, parallax } = useMotionProfile();

  const stageW = size.width || 390;
  const worldW = Math.round(stageW * WORLD_RATIO);
  const travel = worldW - stageW;

  const pan = useMotionValue(0);
  const rawTilt = useMotionValue(0);
  const tilt = useSpring(rawTilt, { stiffness: 55, damping: 18, mass: 0.7 });

  const light = useMemo(() => mixLight(mood, progress), [mood, progress]);
  const fade = { duration: 2.2, ease: 'easeOut' } as const;

  const dragging = useRef(false);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!parallax || dragging.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      rawTilt.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [parallax, rawTilt],
  );

  const canPan = pannable && !reduced && travel > 8;

  return (
    <div
      className={`world${recede ? ' is-receded' : ''}`}
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => rawTilt.set(0)}
    >
      {/* Kameranya nggak pernah turun di bawah 1, dan itu bukan angka
          asal. Titik putarnya di 50% 68%, jadi tiap kali skalanya di
          bawah 1 tepi atas layar turun sebesar 0,68 x tinggi x (1 - s).
          Waktu s masih 0,94, itu 34 piksel di layar 844: satu pita rata
          selebar layar di paling atas, isinya warna latar mentah .world,
          bukan langit. Itu "gap hitam" yang kelihatan di babak 20.

          Jadi mundurnya sekarang dihitung dari 1,08, bukan ke bawah 1.
          Jarak mundurnya tetap sama persis (rasionya 0,94), cuma
          keduanya diangkat ke atas 1 supaya layarnya selalu tertutup.
          Jangan turunkan angka ini ke bawah 1 lagi. */}
      <motion.div
        className="world__camera"
        animate={{ scale: pulledBack ? 1.015 : 1.08 }}
        transition={{ duration: 2.4, ease: [0.16, 0.84, 0.24, 1] }}
      >
        <motion.div
          className="world__drag"
          style={{ x: pan, width: worldW }}
          drag={canPan ? 'x' : false}
          dragConstraints={{ left: -travel, right: 0 }}
          dragElastic={0.06}
          dragMomentum
          dragTransition={{ power: 0.24, timeConstant: 260, bounceStiffness: 240, bounceDamping: 34 }}
          onDragStart={() => {
            dragging.current = true;
          }}
          onDragEnd={() => {
            dragging.current = false;
          }}
        >
          {/* --- Sky: painted, never darkened -------------------------- */}
          <div className="world__group world__group--sky">
            <Layer factor={0.08} pan={pan} tilt={tilt} z={1} width={worldW} src={art?.sky}>
              <SkyPlate />
            </Layer>

            {/* The dusk gradient is the base and is always fully opaque —
                a partly transparent sky is what produced grey haze. Night
                and gold cross-fade over the top of it. */}
            <Layer factor={0} pan={pan} tilt={tilt} z={2} width={worldW} className="layer--wash">
              <div className="sky sky--dusk" />
              <motion.div className="sky sky--night" animate={{ opacity: light.skyNight }} transition={fade} />
              <motion.div className="sky sky--gold" animate={{ opacity: light.skyGold }} transition={fade} />
            </Layer>

            {/* Distant points of light, so they sit in the sky rather than
                under it. */}
            <Layer factor={0.22} pan={pan} tilt={tilt} z={3} width={worldW} blur={10} className="layer--bokeh">
              <BokehPlate />
            </Layer>
          </div>

          {/* --- Foliage: multiplied down toward silhouette ------------- */}
          <div className="world__group world__group--foliage">
            <Layer factor={0.42} pan={pan} tilt={tilt} z={1} width={worldW} blur={2.2} src={art?.far}>
              <FarPlate />
            </Layer>

            <Layer factor={0.72} pan={pan} tilt={tilt} z={2} width={worldW} src={art?.mid}>
              <MidPlate lit={lit} total={lanternCount} />
            </Layer>

            <Layer factor={0} pan={pan} tilt={tilt} z={3} width={worldW} className="layer--wash">
              <motion.div className="shade shade--cool" animate={{ opacity: light.shadeCool }} transition={fade} />
              <motion.div className="shade shade--night" animate={{ opacity: light.shadeNight }} transition={fade} />
              <motion.div className="shade shade--warm" animate={{ opacity: light.shadeWarm }} transition={fade} />
            </Layer>
          </div>

          {/* The flowers: at the focal plane, above the shading pass. */}
          <Layer factor={1} pan={pan} tilt={tilt} z={6} width={worldW} className="layer--actors">
            {children}
          </Layer>

          <Layer factor={1.34} pan={pan} tilt={tilt} z={7} width={worldW} blur={5} src={art?.near}>
            <NearPlate />
          </Layer>
        </motion.div>
      </motion.div>

      {/* --- Camera effects ----------------------------------------- */}
      <motion.div className="world__glow" animate={{ opacity: light.glow }} transition={fade} />

      <Atmosphere mood={mood} progress={progress} />

      <motion.div className="world__vignette" animate={{ opacity: light.vignette }} transition={fade} />

      <div className="world__grain" />
    </div>
  );
}
