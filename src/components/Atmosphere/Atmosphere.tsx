import { useEffect, useRef } from 'react';
import { useMotionProfile } from '../../hooks/useMotionProfile';
import type { Mood } from '../World/light';
import './Atmosphere.css';

/* ------------------------------------------------------------------
   Air.

   Three canvases at three focal distances, each with its own CSS blur —
   which is how you get real depth of field out of particles for the cost
   of one filter per layer. Near motes are big and badly out of focus,
   far ones are small and sharp, and the whole field is under thirty
   sprites so a phone never notices.

   tsParticles was the obvious candidate here and I did reach for it
   first. It renders everything to a single canvas, so per-depth blur
   means either a filter call per sprite or three separate engine
   instances; both cost more than this file does, and neither gives the
   palette control the art direction needs. Roughly 4 KB of loop wins.
   ------------------------------------------------------------------ */

type Kind = 'dust' | 'pollen' | 'petal' | 'firefly';

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  spin: number;
  rot: number;
  hue: number;
  kind: Kind;
}

interface Band {
  count: number;
  blur: number;
  scale: number;
  speed: number;
  alpha: number;
}

const BANDS: Band[] = [
  { count: 11, blur: 0, scale: 0.6, speed: 0.55, alpha: 0.75 }, // far
  { count: 11, blur: 1.6, scale: 1, speed: 1, alpha: 0.9 }, // mid
  { count: 5, blur: 7, scale: 2.6, speed: 1.7, alpha: 0.5 }, // near
];

/** What is in the air depends on the time of day. */
function recipe(mood: Mood, progress: number): Kind[] {
  if (mood === 'night') return ['firefly', 'firefly', 'petal', 'dust'];
  if (mood === 'dawn') return ['dust', 'pollen', 'petal'];
  if (mood === 'golden' || progress > 0.55) return ['pollen', 'petal', 'pollen', 'dust'];
  return ['dust', 'dust', 'pollen'];
}

const TONES: Record<Kind, string> = {
  dust: '255, 244, 226',
  pollen: '255, 220, 160',
  petal: '224, 176, 182',
  firefly: '255, 214, 140',
};

export interface AtmosphereProps {
  mood?: Mood;
  progress?: number;
}

export function Atmosphere({ mood = 'dusk', progress = 0 }: AtmosphereProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const { particleScale, reduced } = useMotionProfile();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvases = Array.from(host.querySelectorAll('canvas'));
    const contexts = canvases.map((c) => c.getContext('2d'));
    const kinds = recipe(mood, progress);

    let w = 0;
    let h = 0;
    const fields: Mote[][] = [];
    let raf = 0;
    let running = true;
    let last = performance.now();

    const spawn = (band: Band, initial: boolean): Mote => {
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      const falls = kind === 'petal';
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : falls ? -30 : h + 30,
        vx: (Math.random() - 0.5) * (falls ? 14 : 6) * band.speed,
        vy: (falls ? 16 + Math.random() * 22 : -(4 + Math.random() * 10)) * band.speed,
        size:
          (kind === 'petal' ? 3.4 + Math.random() * 3.6 : kind === 'firefly' ? 1.8 + Math.random() * 1.6 : 1 + Math.random() * 1.8) *
          band.scale,
        alpha: (kind === 'firefly' ? 0.5 : 0.26 + Math.random() * 0.4) * band.alpha,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.6,
        rot: Math.random() * Math.PI,
        hue: Math.random(),
        kind,
      };
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvases.forEach((c, i) => {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        contexts[i]?.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
      if (fields.length === 0) {
        BANDS.forEach((band) => {
          const n = Math.max(2, Math.round(band.count * particleScale));
          fields.push(Array.from({ length: n }, () => spawn(band, true)));
        });
      }
    };

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      for (let b = 0; b < BANDS.length; b += 1) {
        const ctx = contexts[b];
        const field = fields[b];
        if (!ctx || !field) continue;
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < field.length; i += 1) {
          const p = field[i];
          p.phase += dt * (p.kind === 'firefly' ? 1.6 : 0.7);
          p.x += (p.vx + Math.sin(p.phase) * 7) * dt;
          p.y += p.vy * dt;
          p.rot += p.spin * dt;

          const tone = TONES[p.kind];

          if (p.kind === 'firefly') {
            // Fireflies breathe rather than blink.
            const pulse = 0.35 + (Math.sin(p.phase) * 0.5 + 0.5) * 0.65;
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
            g.addColorStop(0, `rgba(${tone}, ${p.alpha * pulse})`);
            g.addColorStop(0.4, `rgba(${tone}, ${p.alpha * pulse * 0.3})`);
            g.addColorStop(1, `rgba(${tone}, 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(255, 248, 232, ${p.alpha * pulse})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.kind === 'petal') {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = `rgba(${tone}, ${p.alpha})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.52, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            const twinkle = 0.6 + Math.sin(p.phase * 1.5) * 0.4;
            ctx.fillStyle = `rgba(${tone}, ${p.alpha * twinkle})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          const gone = p.kind === 'petal' ? p.y > h + 40 : p.y < -40 || p.x < -60 || p.x > w + 60;
          if (gone) field[i] = spawn(BANDS[b], false);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    document.addEventListener('visibilitychange', onVisibility);

    if (reduced) {
      draw(performance.now());
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [mood, particleScale, progress, reduced]);

  return (
    <div className="air" ref={hostRef} aria-hidden="true">
      {BANDS.map((band, i) => (
        <canvas key={i} className="air__band" style={{ filter: band.blur ? `blur(${band.blur}px)` : undefined }} />
      ))}
    </div>
  );
}
