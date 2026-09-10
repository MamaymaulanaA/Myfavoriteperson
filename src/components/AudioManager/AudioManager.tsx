import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AudioCtx } from '../../app/audioContext';
import type { AudioContextValue } from '../../app/audioContext';
import { useGameProgress } from '../../hooks/useGameProgress';
import { LAGU } from '../../data/media';
import { game } from '../../data/game';

/**
 * Musik.
 *
 * Dicoba jalan sendiri begitu halaman terbuka. Browser HP hampir selalu
 * menolak itu, dan itu wajar: penolakannya ditelan diam-diam, tanpa
 * popup, tanpa pesan teknis. Sentuhan pertama di layar pembuka ("Sentuh
 * untuk memulai") yang jadi pemicunya, dan pada titik itu suaranya masuk
 * pelan selama tiga detik.
 *
 * Di bawah itu masih ada jaring pengaman: satu pendengar di seluruh
 * dokumen yang menangkap sentuhan apa pun. Kalau layar pembukanya
 * terlewat, atau play()-nya ditolak karena filenya belum sempat termuat,
 * sentuhan berikutnya di mana pun tetap menyalakan lagunya. Pendengarnya
 * lepas sendiri begitu berhasil.
 *
 * Catatan iOS: Safari di iPhone mengabaikan pengaturan volume lewat
 * skrip. Fade-nya nggak kerja di sana dan lagunya masuk langsung di
 * volume perangkat. Itu batasan sistemnya, bukan yang bisa diakali.
 *
 * Elemen audionya hidup di atas SceneManager, jadi lagunya nggak pernah
 * mengulang dari awal waktu pindah babak.
 */
export function AudioManager({ children }: { children: ReactNode }) {
  const { state, setMusicEnabled } = useGameProgress();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const targetRef = useRef<number>(game.volume);

  const [available, setAvailable] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const stopFade = useCallback(() => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (target: number, ms: number, done?: () => void) => {
      const el = audioRef.current;
      if (!el) return;
      stopFade();
      const from = el.volume;
      const delta = target - from;
      if (Math.abs(delta) < 0.001 || ms <= 0) {
        el.volume = target;
        done?.();
        return;
      }
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / ms);
        const eased = 1 - Math.pow(1 - t, 3);
        el.volume = Math.max(0, Math.min(1, from + delta * eased));
        if (t < 1) fadeRef.current = requestAnimationFrame(step);
        else {
          fadeRef.current = null;
          done?.();
        }
      };
      fadeRef.current = requestAnimationFrame(step);
    },
    [stopFade],
  );

  // Apakah filenya benar-benar ada?
  useEffect(() => {
    let alive = true;
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.onloadedmetadata = () => alive && setAvailable(true);
    probe.oncanplaythrough = () => alive && setAvailable(true);
    probe.onerror = () => alive && setAvailable(false);
    probe.src = LAGU;
    return () => {
      alive = false;
      probe.src = '';
    };
  }, []);

  useEffect(() => stopFade, [stopFade]);

  const play = useCallback(
    (ms: number) => {
      const el = audioRef.current;
      if (!el) return Promise.reject(new Error('no element'));
      el.volume = 0;
      return el.play().then(() => {
        setUnlocked(true);
        fadeTo(targetRef.current, ms);
      });
    },
    [fadeTo],
  );

  // Coba jalan sendiri. Kalau ditolak, diam saja — sentuhan pertama nanti
  // yang mengurus. Tidak ada trik untuk memaksa autoplay.
  useEffect(() => {
    if (!available || unlocked || !state.musicEnabled) return;
    void play(game.fadeMs).catch(() => undefined);
  }, [available, play, state.musicEnabled, unlocked]);

  const start = useCallback(() => {
    if (!available || !state.musicEnabled) {
      setUnlocked(true);
      return;
    }
    void play(game.fadeMs).catch(() => undefined);
  }, [available, play, state.musicEnabled]);

  // Jaring pengaman: sentuhan apa pun, di mana pun.
  useEffect(() => {
    if (!available || unlocked || !state.musicEnabled) return;

    const el = audioRef.current;
    if (!el) return;

    let lepas = false;
    const coba = () => {
      if (lepas) return;
      void play(game.fadeMs)
        .then(() => buang())
        .catch(() => undefined);
    };
    const buang = () => {
      lepas = true;
      document.removeEventListener('pointerdown', coba);
      document.removeEventListener('touchstart', coba);
      document.removeEventListener('keydown', coba);
    };

    document.addEventListener('pointerdown', coba);
    document.addEventListener('touchstart', coba);
    document.addEventListener('keydown', coba);
    return buang;
  }, [available, play, state.musicEnabled, unlocked]);

  const toggle = useCallback(() => {
    const next = !state.musicEnabled;
    setMusicEnabled(next);
    const el = audioRef.current;
    if (!el || !available) return;

    if (next) void play(900).catch(() => undefined);
    else fadeTo(0, 600, () => el.pause());
  }, [available, fadeTo, play, setMusicEnabled, state.musicEnabled]);

  /** Meredam sebentar supaya sebuah momen punya ruang. */
  const setIntensity = useCallback(
    (level: 'quiet' | 'normal') => {
      targetRef.current = level === 'quiet' ? game.volume * 0.42 : game.volume;
      if (state.musicEnabled && unlocked) fadeTo(targetRef.current, 1600);
    },
    [fadeTo, state.musicEnabled, unlocked],
  );

  const value = useMemo<AudioContextValue>(
    () => ({ unlocked, enabled: state.musicEnabled, available, toggle, start, setIntensity }),
    [available, setIntensity, start, state.musicEnabled, toggle, unlocked],
  );

  return (
    <AudioCtx value={value}>
      <audio ref={audioRef} src={LAGU} loop preload="auto" playsInline />
      {children}
    </AudioCtx>
  );
}
