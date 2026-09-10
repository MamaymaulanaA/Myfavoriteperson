import { foto } from './media';
import type { MediaRef } from './media';

/* ------------------------------------------------------------------
   Lima bunga di taman, dan apa yang disimpan masing-masing.

   Kata-katanya ditulis sendiri, apa adanya. Baris-barisnya sengaja
   dipisah dan ditampilkan persis begitu, bukan disambung jadi paragraf
   rapi. Itu bagian dari nadanya: satu pikiran satu baris, seperti orang
   yang lagi ngetik pelan-pelan.

   Jangan dirapikan jadi kalimat panjang, dan jangan diganti jadi bahasa
   yang lebih formal. Yang bikin ini kebaca sebagai orangnya sendiri
   yang ngomong justru karena nggak rapi.
   ------------------------------------------------------------------ */

export type FlowerSpecies = 'rose' | 'tulip' | 'daisy' | 'bell' | 'poppy';

export interface GardenFlowerConfig {
  id: string;
  species: FlowerSpecies;
  /** Persen dari LEBAR DUNIA (1.5x layar), jadi dua terakhir cuma
      kelihatan kalau layarnya digeser. */
  x: number;
  /** Persen dari tinggi layar, diukur ke pangkal batang. */
  y: number;
  scale: number;
  swayDelay: number;
  swayDuration: number;
  /** 0 sampai 1, menggeser warna kelopak dari mawar tua ke merah muda. */
  hue: number;
}

export const gardenFlowers: GardenFlowerConfig[] = [
  { id: 'bunga-1', species: 'poppy', x: 14, y: 91, scale: 1.16, swayDelay: 0, swayDuration: 7.5, hue: 0.1 },
  { id: 'bunga-2', species: 'tulip', x: 29, y: 78, scale: 0.78, swayDelay: 1.9, swayDuration: 8.8, hue: 0.62 },
  { id: 'bunga-3', species: 'daisy', x: 46, y: 94, scale: 1.24, swayDelay: 3.4, swayDuration: 6.9, hue: 0.92 },
  { id: 'bunga-4', species: 'rose', x: 67, y: 82, scale: 0.88, swayDelay: 0.9, swayDuration: 9.4, hue: 0.32 },
  { id: 'bunga-5', species: 'bell', x: 86, y: 90, scale: 1.1, swayDelay: 5.1, swayDuration: 7.9, hue: 0.7 },
];

/* ------------------------------------------------------------------
   Isi tiap bunga
   ------------------------------------------------------------------ */

/** Hadiah kecil yang main sekali setelah sebuah bunga ditutup. */
export type MemoryReward = 'cat' | 'bunnies' | null;

export interface Memory {
  id: string;
  flowerId: string;
  /** Judul kecil di atas. Beda tiap bunga, ini yang bikin tidak monoton. */
  label: string;
  judul: string;
  /** Baris barunya ditampilkan apa adanya (white-space: pre-line). */
  pesan: string;
  media: MediaRef;
  reward: MemoryReward;
}

export const memories: Memory[] = [
  {
    id: 'pesan-1',
    flowerId: 'bunga-1',
    label: 'Yang bikin aku tertarik',
    judul: 'entah kenapa ada aja yang bikin aku ngeliatin kamu',
    pesan:
      'bukan cuma karena kamu cantik, cara kamu diem, cara kamu ngeliat sesuatu, bahkan ekspresi kecil yang mungkin kamu sendiri nggak sadar. susah jelasinnya sih, cuma dari awal emang ada sesuatu dari kamu yang bikin aku pengen tau lebih banyak.',
    media: { kind: 'photo', src: foto('cerita-1.jpg'), alt: 'Foto kamu' },
    reward: null,
  },
  {
    id: 'pesan-2',
    flowerId: 'bunga-2',
    label: 'Hal kecil yang aku suka',
    judul: 'senyum kamu',
    pesan:
      'mungkin buat kamu biasa aja, tapi entah kenapa tiap liat kamu senyum suasananya jadi beda, jadi lebih enak aja diliatnya. makanya kalau lagi banyak pikiran jangan lupa senyum lagi ya walaupun cuma sebentar.',
    media: { kind: 'photo', src: foto('cerita-2.jpg'), alt: 'Foto kamu' },
    reward: 'cat',
  },
  {
    id: 'pesan-3',
    flowerId: 'bunga-3',
    label: 'Kalau suatu hari kamu lupa',
    judul: 'kamu nggak sendirian',
    pesan:
      'kalau suatu hari semuanya lagi berat jangan ngerasa harus ngadepin semuanya sendiri. kalau capek ya istirahat dulu, kalau sedih juga nggak harus pura-pura baik-baik aja. jalan pelan aja nggak apa-apa, yang penting jangan nyerah sama diri kamu sendiri.',
    media: { kind: 'photo', src: foto('cerita-3.jpg'), alt: 'Foto kamu' },
    reward: null,
  },
  {
    id: 'pesan-4',
    flowerId: 'bunga-4',
    label: 'Kalau lagi capek banget',
    judul: 'jangan dipendem sendiri ya',
    pesan:
      'nggak harus selalu keliatan kuat, nggak harus selalu bilang gapapa padahal sebenarnya lagi nggak baik-baik aja. kalau mau istirahat ya istirahat, kalau mau cerita ya cerita. aku cuma pengen kamu jangan terlalu keras sama diri sendiri.',
    media: { kind: 'photo', src: foto('cerita-4.jpg'), alt: 'Foto kamu' },
    reward: null,
  },
  {
    id: 'pesan-5',
    flowerId: 'bunga-5',
    label: 'Sedikit doa buat kamu',
    judul: 'semoga tahun ini lebih baik ke kamu',
    pesan:
      'semoga lebih banyak hari yang bikin kamu tenang, lebih banyak ketemu orang baik, dan lebih banyak hal kecil yang bikin kamu senyum. kalau sekarang ada sesuatu yang lagi kamu perjuangin semoga pelan-pelan ada jalannya, nggak harus cepet yang penting jangan berhenti.',
    media: { kind: 'photo', src: foto('cerita-5.jpg'), alt: 'Foto kamu' },
    reward: null,
  },
];

export const memoryByFlowerId = (flowerId: string): Memory | undefined =>
  memories.find((m) => m.flowerId === flowerId);

export const memoryById = (id: string): Memory | undefined => memories.find((m) => m.id === id);

/* ------------------------------------------------------------------
   Yang disembunyikan
   ------------------------------------------------------------------ */

/** Ngengat kecil di balik daun, di luar batas layar pertama. */
export const secretSpot = {
  id: 'rahasia-ngengat',
  x: 79,
  y: 62,
  /** Baru bisa disentuh setelah sekian bunga dibuka. */
  revealAfterFlowers: 2,
  reward: 'bunnies' as const,
};
