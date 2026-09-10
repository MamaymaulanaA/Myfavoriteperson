/* ------------------------------------------------------------------
   Aturan main. Semua di sini aman untuk diubah.
   ------------------------------------------------------------------ */

/**
 * DUA PULUH CAHAYA.
 *
 * Angka 20 bukan cuma tulisan di layar. Sepanjang perjalanan, tiap hal
 * yang ditemukan melepas cahaya kecil ke langit — dan totalnya pas dua
 * puluh. Penghitungnya kelihatan di pojok sejak awal, jadi dia lama-lama
 * sadar dia sedang mengumpulkan sesuatu tanpa pernah diberi tahu untuk
 * apa. Di babak IV semua cahaya itu naik dan menyusun angka 20.
 *
 * Ini bukan 20 tugas. Cuma 11 interaksi, yang hasilnya berjumlah 20.
 */
export const CAHAYA_TOTAL = 20;

export const cahaya = {
  /** Tiap bunga = 2 cahaya. Lima bunga = 10. */
  perBunga: 2,
  /** Ngengat yang disembunyikan = 2. Jadi 12. */
  rahasia: 2,
  /** Tiap kupu-kupu = 1. Lima kupu-kupu = 5. Jadi 17. */
  perKupu: 1,
  /** Selesai menonton jejak = 3. Genap 20. */
  jejakSelesai: 3,
} as const;

export const game = {
  /** Kupu-kupu yang harus disentuh di mini game. */
  targetKupu: 5,
  /** Kupu-kupu yang beterbangan di taman (nggak bisa disentuh). */
  kupuTaman: 2,
  /** Berapa yang di udara sekaligus saat mini game. */
  kupuSekaligus: 3,

  /** Umur percikan cahaya saat kupu-kupu tersentuh, ms. */
  percikMs: 620,

  /** Volume musik setelah fade-in. Sengaja pelan. */
  volume: 0.34,
  fadeMs: 3000,

  /** Berapa lama stiker hadiah bertahan, ms. */
  hadiahMs: 3200,
} as const;

/** Jatah partikel — sengaja sedikit supaya HP nggak berat. */
export const partikel = {
  debu: 14,
  kelopak: 16,
} as const;
