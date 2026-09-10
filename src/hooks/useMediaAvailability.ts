import { useEffect, useState } from 'react';
import type { MediaKind } from '../data/media';

export type MediaStatus = 'checking' | 'ready' | 'missing';

/**
 * Answers one question: does a real file exist at this path?
 *
 * The app ships without any personal photos or videos. Rather than filling
 * the gap with stock imagery, every media slot asks this hook first and
 * renders a drawn botanical plate when the answer is no. When the real file
 * is dropped into /public/media the answer flips and the layout does not
 * move by a pixel.
 */

const results = new Map<string, MediaStatus>();
const pending = new Map<string, Promise<MediaStatus>>();

function probe(src: string, kind: MediaKind): Promise<MediaStatus> {
  const known = results.get(src);
  if (known) return Promise.resolve(known);

  const existing = pending.get(src);
  if (existing) return existing;

  const check = new Promise<MediaStatus>((resolve) => {
    let settled = false;
    const finish = (status: MediaStatus) => {
      if (settled) return;
      settled = true;
      results.set(src, status);
      pending.delete(src);
      resolve(status);
    };

    if (kind === 'photo') {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => finish('ready');
      img.onerror = () => finish('missing');
      img.src = src;
      return;
    }

    const el = document.createElement('video');
    el.preload = 'metadata';
    el.muted = true;
    el.onloadedmetadata = () => finish('ready');
    el.onerror = () => finish('missing');
    el.src = src;
    // A server that answers every path with index.html will neither load nor
    // error; give it a bounded amount of rope.
    window.setTimeout(() => finish('missing'), 6000);
  });

  pending.set(src, check);
  return check;
}

export function useMediaAvailability(src: string | undefined, kind: MediaKind): MediaStatus {
  const [status, setStatus] = useState<MediaStatus>(() =>
    src ? (results.get(src) ?? 'checking') : 'missing',
  );

  useEffect(() => {
    if (!src) {
      setStatus('missing');
      return;
    }

    const known = results.get(src);
    if (known) {
      setStatus(known);
      return;
    }

    let active = true;
    setStatus('checking');
    void probe(src, kind).then((result) => {
      if (!active) return;
      setStatus(result);
      if (result === 'missing' && import.meta.env.DEV) {
        console.info(
          `[media] no file at ${src} — showing the drawn placeholder. ` +
            'Drop the real file in and it will appear automatically.',
        );
      }
    });

    return () => {
      active = false;
    };
  }, [src, kind]);

  return status;
}

/** Fire-and-forget warm-up used by the preload strategy. */
export function warmMedia(src: string | undefined, kind: MediaKind): void {
  if (!src) return;
  void probe(src, kind);
}
