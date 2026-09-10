import { useState } from 'react';
import { Lottie } from 'lottie-react';
import { useLottieData } from '../hooks/useLottieData';
import { lottieAssets } from '../lib/lottie';
import type { LottieKey } from '../lib/lottie';

/* ------------------------------------------------------------------
   Development-only contact sheet.

   Renders every Lottie at a known size, with and without the palette
   correction, so the art direction can be judged by looking rather than
   by reading metadata. Reachable at /?audit=1 in `npm run dev` only.
   ------------------------------------------------------------------ */

const KEYS = Object.keys(lottieAssets) as LottieKey[];

function Cell({ name, raw }: { name: LottieKey; raw: boolean }) {
  const meta = lottieAssets[name];
  const tinted = useLottieData(name);
  const [rawData, setRawData] = useState<object | null>(null);

  if (raw && !rawData) {
    void fetch(meta.path)
      .then((r) => r.json())
      .then(setRawData);
  }

  const data = raw ? rawData : tinted;

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 8, border: '1px solid #ddd' }}>
      <div
        style={{
          width: '100%',
          aspectRatio: `${meta.width} / ${meta.height}`,
          background:
            'repeating-conic-gradient(#f4efe9 0% 25%, #fff 0% 50%) 50% / 16px 16px',
        }}
      >
        {data ? (
          <Lottie src={data} loop style={{ width: '100%', height: '100%' }} />
        ) : null}
      </div>
      <div style={{ font: '11px/1.4 monospace', marginTop: 6, color: '#555' }}>
        <strong>{name}</strong>
        <br />
        {meta.width}×{meta.height} · {meta.fps.toFixed(0)}fps ·{' '}
        {(meta.frames / meta.fps).toFixed(1)}s · {meta.weightKb}KB
        <br />
        tint: {meta.tint} {raw ? '(RAW)' : '(corrected)'}
      </div>
    </div>
  );
}

export function AssetAudit() {
  const [raw, setRaw] = useState(false);

  return (
    <div style={{ padding: 16, background: '#e9e4de', minHeight: '100vh' }}>
      <label style={{ font: '13px system-ui', display: 'block', marginBottom: 12 }}>
        <input type="checkbox" checked={raw} onChange={(e) => setRaw(e.target.checked)} /> show
        original colours
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 12,
        }}
      >
        {KEYS.map((k) => (
          <Cell key={`${k}-${raw}`} name={k} raw={raw} />
        ))}
      </div>
    </div>
  );
}
