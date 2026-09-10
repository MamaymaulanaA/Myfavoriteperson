/* ------------------------------------------------------------------
   Letak file media.

   Semua yang ada di sini menunjuk ke file asli milikmu di folder
   /public/media. Nggak ada stock photo, nggak ada gambar buatan.
   ------------------------------------------------------------------ */

export const MEDIA_ROOT = '/media';

export const foto = (file: string) => `${MEDIA_ROOT}/photos/${file}`;
export const video = (file: string) => `${MEDIA_ROOT}/videos/${file}`;
export const audio = (file: string) => `${MEDIA_ROOT}/audio/${file}`;

/**
 * Soundtrack.
 *
 * File aslinya container MP4 (hasil unduhan) walau namanya .mp3, jadi
 * ekstensinya dibetulkan ke .m4a — supaya server mengirim
 * `audio/mp4`, yang justru paling aman di Safari/iOS.
 */
export const LAGU = audio('theme.m4a');

/** Foto paling spesial. Dipakai di bagian penutup. */
export const FOTO_UTAMA = foto('utama.jpg');

export type MediaKind = 'photo' | 'video';

export interface MediaRef {
  kind: MediaKind;
  src: string;
  poster?: string;
  alt?: string;
}
