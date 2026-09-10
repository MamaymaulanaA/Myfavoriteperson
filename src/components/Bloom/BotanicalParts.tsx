import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import type { FlowerSpecies } from '../../data/memories';
import type { Palette } from './species';

const pivotCenter: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center' };

interface StemAndLeavesProps {
  species: FlowerSpecies;
  cx: number;
  cy: number;
  uid: string;
  palette: Palette;
}

/**
 * Renders custom stems and species-specific foliage for each botanical type:
 * - Poppy: slender organic stem with undulating lobed thistle leaves
 * - Tulip: smooth architectural stem with sweeping leaves clasping the base
 * - Daisy: slender upright stem with feathery chamomile foliage
 * - Rose: sturdy stem with thorn silhouettes and serrated compound leaflets
 * - Bell: gracefully arched nodding stem with slender lanceolate leaves
 */
export function BotanicalStemAndLeaves({ species, cx, cy, uid }: StemAndLeavesProps) {
  const neckY = cy + 18;

  switch (species) {
    case 'tulip':
      return (
        <g className="botanical-foliage">
          {/* Stem: gentle graceful s-curve */}
          <path
            d={`M57 220 C 57 185 58 150 59 ${neckY} L 63 ${neckY} C 64 150 65 185 65 220 Z`}
            fill={`url(#st-${uid})`}
          />
          {/* Left broad tulip leaf clasping base */}
          <path
            d="M57 220 C 35 205 18 175 14 135 C 24 145 42 165 59 180 Z"
            fill={`url(#lf-${uid})`}
          />
          <path
            d="M57 220 C 35 205 20 178 14 135"
            fill="none"
            stroke={`url(#st-${uid})`}
            strokeWidth="1.2"
            opacity="0.6"
          />
          {/* Right sweeping tulip leaf */}
          <path
            d="M63 195 C 80 180 98 150 102 110 C 92 125 78 148 62 168 Z"
            fill={`url(#lf-${uid})`}
            opacity="0.95"
          />
          <path
            d="M63 195 C 80 180 96 152 102 110"
            fill="none"
            stroke={`url(#st-${uid})`}
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      );

    case 'poppy':
      return (
        <g className="botanical-foliage">
          {/* Stem with natural organic sway */}
          <path
            d={`M57 220 C 56 185 55 155 58 ${neckY} L 64 ${neckY} C 61 155 62 185 63 220 Z`}
            fill={`url(#st-${uid})`}
          />
          {/* Left deeply lobed thistle-style leaf */}
          <path
            d="M57 180 C 42 175 32 170 20 156 C 28 154 36 152 38 148 C 26 142 16 132 12 118 C 24 120 38 126 44 124 C 36 112 32 98 34 88 C 42 96 52 110 58 136 Z"
            fill={`url(#lf-${uid})`}
          />
          <path
            d="M57 180 C 44 165 32 145 28 118"
            fill="none"
            stroke="#4A5C41"
            strokeWidth="0.8"
            opacity="0.4"
          />
          {/* Right leaf */}
          <path
            d="M62 160 C 76 155 86 145 98 134 C 92 130 84 128 84 122 C 96 114 104 100 106 88 C 94 92 82 102 76 104 C 82 92 84 80 82 72 C 76 80 68 98 62 122 Z"
            fill={`url(#lf-${uid})`}
            opacity="0.9"
          />
        </g>
      );

    case 'rose':
      return (
        <g className="botanical-foliage">
          {/* Sturdy stem with subtle thorns */}
          <path
            d={`M56 220 C 56 185 57 155 58 ${neckY} L 64 ${neckY} C 65 155 66 185 66 220 Z`}
            fill={`url(#st-${uid})`}
          />
          {/* Thorns */}
          <path d="M57 195 C 52 195 48 198 47 202 C 51 200 55 198 57 198 Z" fill="#4B3B2F" opacity="0.7" />
          <path d="M63 170 C 68 170 72 173 73 177 C 69 175 65 173 63 173 Z" fill="#4B3B2F" opacity="0.7" />
          {/* Left serrated rose leaf cluster */}
          <g transform="translate(58, 172)">
            <path
              d="M0 0 C -12 -5 -22 -14 -28 -28 C -22 -26 -16 -28 -12 -34 C -18 -32 -22 -38 -24 -46 C -16 -40 -8 -38 -4 -42 C -2 -34 -1 -16 0 0 Z"
              fill={`url(#lf-${uid})`}
            />
            <path d="M0 0 C -10 -15 -18 -30 -22 -44" fill="none" stroke="#48583E" strokeWidth="0.8" opacity="0.4" />
          </g>
          {/* Right rose leaf */}
          <g transform="translate(62, 146)">
            <path
              d="M0 0 C 12 -4 20 -12 28 -24 C 22 -22 16 -24 12 -30 C 18 -28 22 -34 24 -42 C 16 -36 8 -34 4 -38 C 2 -30 1 -14 0 0 Z"
              fill={`url(#lf-${uid})`}
              opacity="0.92"
            />
            <path d="M0 0 C 10 -14 18 -26 22 -40" fill="none" stroke="#48583E" strokeWidth="0.8" opacity="0.4" />
          </g>
        </g>
      );

    case 'daisy':
      return (
        <g className="botanical-foliage">
          {/* Slender straight stem */}
          <path
            d={`M57 220 C 57 185 58 150 58 ${neckY} L 63 ${neckY} C 63 150 64 185 64 220 Z`}
            fill={`url(#st-${uid})`}
          />
          {/* Left feathery chamomile leaves */}
          <path
            d="M57 182 C 45 178 35 172 26 162 C 32 162 38 160 38 156 C 26 150 18 140 14 128 C 22 130 30 132 34 130 C 26 122 22 110 24 102 C 30 108 38 120 44 140 Z"
            fill={`url(#lf-${uid})`}
          />
          <path
            d="M63 158 C 74 154 84 148 92 138 C 86 138 80 136 80 132 C 92 126 98 116 102 104 C 94 106 86 108 82 106 C 90 98 92 88 90 80 C 84 86 78 98 72 118 Z"
            fill={`url(#lf-${uid})`}
            opacity="0.9"
          />
        </g>
      );

    case 'bell':
    default:
      return (
        <g className="botanical-foliage">
          {/* Gracefully arching nodding stem */}
          <path
            d={`M57 220 C 56 185 56 150 58 120 C 60 98 62 88 ${cx} ${neckY} L ${cx + 5} ${neckY} C 66 88 65 98 63 120 C 63 150 63 185 63 220 Z`}
            fill={`url(#st-${uid})`}
          />
          {/* Slender drooping lance leaves */}
          <path
            d="M57 178 C 38 174 22 162 14 144 C 28 152 44 162 58 168 Z"
            fill={`url(#lf-${uid})`}
          />
          <path
            d="M63 148 C 80 142 94 130 104 112 C 92 122 76 134 62 140 Z"
            fill={`url(#lf-${uid})`}
            opacity="0.9"
          />
        </g>
      );
  }
}

/**
 * Sepals and Calyx clasping the flower head
 */
export function BotanicalSepals({
  species,
  cx,
  cy,
  uid,
}: {
  species: FlowerSpecies;
  cx: number;
  cy: number;
  uid: string;
}) {
  switch (species) {
    case 'rose':
      return (
        <g className="botanical-sepals" transform={`translate(${cx}, ${cy + 18})`}>
          <path d="M-14 -4 C -8 8 0 14 0 16 C 0 14 8 8 14 -4 C 10 4 0 8 0 8 C 0 8 -10 4 -14 -4 Z" fill={`url(#st-${uid})`} />
          <path d="M-12 -6 C -18 2 -26 12 -28 18 C -24 14 -18 8 -10 2 Z" fill={`url(#lf-${uid})`} opacity="0.9" />
          <path d="M12 -6 C 18 2 26 12 28 18 C 24 14 18 8 10 2 Z" fill={`url(#lf-${uid})`} opacity="0.9" />
        </g>
      );
    case 'tulip':
      return (
        <g className="botanical-sepals" transform={`translate(${cx}, ${cy + 16})`}>
          <path d="M-8 -2 C -4 4 0 8 0 10 C 0 8 4 4 8 -2 C 4 3 0 5 0 5 C 0 5 -4 3 -8 -2 Z" fill={`url(#st-${uid})`} />
        </g>
      );
    case 'poppy':
      return (
        <g className="botanical-sepals" transform={`translate(${cx}, ${cy + 16})`}>
          <ellipse cx="0" cy="4" rx="10" ry="7" fill={`url(#st-${uid})`} />
        </g>
      );
    case 'daisy':
      return (
        <g className="botanical-sepals" transform={`translate(${cx}, ${cy + 14})`}>
          <path d="M-14 -2 C -10 6 0 10 0 12 C 0 10 10 6 14 -2 C 8 4 0 6 0 6 C 0 6 -8 4 -14 -2 Z" fill={`url(#st-${uid})`} />
          <circle cx="0" cy="5" r="9" fill={`url(#st-${uid})`} />
        </g>
      );
    case 'bell':
    default:
      return (
        <g className="botanical-sepals" transform={`translate(${cx}, ${cy + 16})`}>
          <path d="M-12 -4 C -8 6 0 12 0 14 C 0 12 8 6 12 -4 C 6 4 0 6 0 6 C 0 6 -6 4 -12 -4 Z" fill={`url(#st-${uid})`} />
        </g>
      );
  }
}

/**
 * Botanical Flower Core (Seed head, Stigmas, Rosette, Anthers)
 */
export function BotanicalCore({
  species,
  palette,
  coreRadius,
  open,
}: {
  species: FlowerSpecies;
  palette: Palette;
  coreRadius: number;
  open: boolean;
}) {
  const r = coreRadius;

  switch (species) {
    case 'daisy': {
      // Textured sunny honey-gold disk floret with radiating dots
      const dots = [
        { angle: 0, d: r * 0.5 },
        { angle: 45, d: r * 0.5 },
        { angle: 90, d: r * 0.5 },
        { angle: 135, d: r * 0.5 },
        { angle: 180, d: r * 0.5 },
        { angle: 225, d: r * 0.5 },
        { angle: 270, d: r * 0.5 },
        { angle: 315, d: r * 0.5 },
        { angle: 22, d: r * 0.75 },
        { angle: 67, d: r * 0.75 },
        { angle: 112, d: r * 0.75 },
        { angle: 157, d: r * 0.75 },
        { angle: 202, d: r * 0.75 },
        { angle: 247, d: r * 0.75 },
        { angle: 292, d: r * 0.75 },
        { angle: 337, d: r * 0.75 },
      ];

      return (
        <g className="core-daisy" style={pivotCenter}>
          {/* Main button disc */}
          <circle r={r} fill={palette.core} />
          <circle r={r} fill="none" stroke={palette.coreRim} strokeWidth="1.2" />
          <circle r={r * 0.88} fill="none" stroke={palette.coreAccent ?? '#FFEBA3'} strokeWidth="0.8" opacity="0.6" />

          {/* Textured florets / pollen dots */}
          {dots.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const x = Math.cos(rad) * p.d;
            const y = Math.sin(rad) * p.d;
            return <circle key={i} cx={x} cy={y} r={1.2} fill={palette.coreAccent ?? '#FFF4CF'} opacity="0.9" />;
          })}

          {/* Soft inner highlight */}
          <circle r={r * 0.38} fill="#FFF9E8" opacity="0.92" />
        </g>
      );
    }

    case 'poppy': {
      // Dark jewel seed capsule with radiating star crown & golden anthers
      const stamenRays = Array.from({ length: 14 }, (_, i) => (i * 360) / 14);

      return (
        <g className="core-poppy" style={pivotCenter}>
          {/* Radiating golden stamens around the capsule */}
          {stamenRays.map((ang) => {
            const rad = (ang * Math.PI) / 180;
            const x1 = Math.cos(rad) * (r * 0.75);
            const y1 = Math.sin(rad) * (r * 0.75);
            const x2 = Math.cos(rad) * (r * 1.45);
            const y2 = Math.sin(rad) * (r * 1.45);
            return (
              <g key={ang}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.coreRim} strokeWidth="0.9" opacity="0.85" />
                <circle cx={x2} cy={y2} r={1.6} fill={palette.coreAccent ?? '#FAD968'} />
              </g>
            );
          })}

          {/* Velvet dark seed pod */}
          <circle r={r} fill={palette.core} />
          <circle r={r} fill="none" stroke={palette.coreRim} strokeWidth="1.1" />

          {/* Star crown on top of the capsule */}
          <path
            d="M0 -6 L2 -2 L6 -2 L3 1 L4 5 L0 2 L-4 5 L-3 1 L-6 -2 L-2 -2 Z"
            fill={palette.coreAccent ?? '#FAD968'}
            opacity="0.85"
          />
        </g>
      );
    }

    case 'rose': {
      // Multi-layered spiral rosette folds
      return (
        <g className="core-rose" style={pivotCenter}>
          <circle r={r} fill={palette.core} />
          <path
            d="M-5 -2 C -7 -8 0 -9 4 -6 C 8 -3 7 4 2 6 C -4 8 -8 2 -5 -2 Z"
            fill="none"
            stroke={palette.coreRim}
            strokeWidth="1.4"
          />
          <path
            d="M-3 -1 C -4 -4 0 -5 2 -3 C 4 -1 3 3 1 4"
            fill="none"
            stroke={palette.coreAccent ?? '#FFF0F4'}
            strokeWidth="1.2"
          />
          <circle r={r * 0.25} fill="#FFF6F8" opacity="0.9" />
        </g>
      );
    }

    case 'tulip': {
      // 3-part stigma and velvety anther rays
      return (
        <g className="core-tulip" style={pivotCenter}>
          <circle r={r * 1.1} fill={palette.core} opacity="0.95" />
          <circle r={r * 1.1} fill="none" stroke={palette.coreRim} strokeWidth="1.1" />

          {/* 3 velvety anthers */}
          <ellipse cx="-4" cy="-3" rx="2" ry="3.5" fill={palette.coreRim} transform="rotate(-30 -4 -3)" />
          <ellipse cx="4" cy="-3" rx="2" ry="3.5" fill={palette.coreRim} transform="rotate(30 4 -3)" />
          <ellipse cx="0" cy="5" rx="2" ry="3.5" fill={palette.coreRim} />

          {/* Central 3-pointed stigma */}
          <circle r={3} fill={palette.coreAccent ?? '#FFF5CF'} />
        </g>
      );
    }

    case 'bell':
    default: {
      // Bell blossom interior with golden clapper/pistil
      return (
        <g className="core-bell" style={pivotCenter}>
          <circle r={r} fill={palette.core} />
          <circle r={r} fill="none" stroke={palette.coreRim} strokeWidth="1" />
          <line x1="0" y1="-2" x2="0" y2="7" stroke={palette.coreRim} strokeWidth="1.5" />
          <circle cx="0" cy="7" r="2.2" fill={palette.coreAccent ?? '#FFF6D8'} />
        </g>
      );
    }
  }
}
