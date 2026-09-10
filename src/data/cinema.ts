import { foto, video, FOTO_UTAMA } from './media';

/* ------------------------------------------------------------------
   Babak II — Jejak Perjalanan.

   Bukan galeri. Foto-fotonya penuh satu layar dan lewat satu per satu
   seperti film pendek: muncul pelan, ditahan lama, lalu larut lagi.
   Nggak ada titik navigasi, nggak ada panah, nggak bisa di-swipe.

   `duration` di bawah sengaja panjang. Kalau kependekan, fotonya cuma
   lewat; yang mau dikasih di sini justru waktunya untuk melihat.
   ------------------------------------------------------------------ */

/** Cara sebuah foto masuk. Sengaja beda-beda supaya nggak terasa carousel. */
export type Arrival = 'kabut' | 'geserPelan' | 'zoomHalus' | 'larut';

interface JejakBase {
  id: string;
  caption?: string;
  arrival: Arrival;
}

export interface JejakFoto extends JejakBase {
  type: 'photo';
  src: string;
  /** Berapa lama ditahan di layar, milidetik. */
  duration: number;
}

export interface JejakVideo extends JejakBase {
  type: 'video';
  src: string;
  poster?: string;
  duration: number;
}

export type JejakItem = JejakFoto | JejakVideo;

export const jejak: JejakItem[] = [
  {
    id: 'jejak-1',
    type: 'photo',
    src: foto('jejak-1.jpg'),
    duration: 7800,
    caption: 'Hari-hari biasa yang ternyata kesimpan.',
    arrival: 'kabut',
  },
  {
    id: 'jejak-2',
    type: 'photo',
    src: foto('jejak-2.jpg'),
    duration: 8600,
    caption: 'Di sini kamu kelihatan capek. Tapi tetap senyum.',
    arrival: 'geserPelan',
  },
  {
    id: 'jejak-3',
    type: 'photo',
    src: foto('jejak-3.jpg'),
    duration: 7800,
    caption: 'Entah kenapa aku suka yang ini.',
    arrival: 'larut',
  },
  {
    id: 'jejak-4',
    type: 'photo',
    src: foto('jejak-4.jpg'),
    duration: 9200,
    caption: 'Dan sekarang sudah sampai di sini.',
    arrival: 'zoomHalus',
  },
];

/* ------------------------------------------------------------------
   Babak VI — yang terakhir.

   Kalau kamu punya video, taruh di /public/media/videos/vidio.mp4 dan
   dia yang akan dipakai. Kalau nggak ada, satu foto paling spesial yang
   tampil pelan-pelan — bukan kotak kosong.
   ------------------------------------------------------------------ */

export const penutup = {
  video: video('vidio.mp4'),
  foto: FOTO_UTAMA,
  caption: 'Sehat selalu ya, kamu.',
} as const;
