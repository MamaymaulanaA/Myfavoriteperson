/* ------------------------------------------------------------------
   Sisa huruf yang belum dipakai di layar pertama.

   index.html sudah menarik duluan tiga yang dipakai layar pembuka.
   Sisanya baru dipanggil browser waktu ada tulisan pertama yang
   memakainya, dan itu bisa jatuh di tengah babak: tulisannya sempat
   digambar pakai huruf cadangan, lalu diganti. Pergantian itu yang
   kelihatan seperti kedip.

   Jadi begitu layar pembuka selesai digambar, sisanya diambil diam-diam
   sementara dia masih membaca. Semuanya dari server yang sama dan
   sambungannya sudah hangat, jadi murah, dan waktu babak berikutnya
   datang hurufnya sudah siap semua.
   ------------------------------------------------------------------ */

/** Persis yang dipakai di src/styles/*.css, tidak lebih. */
const SISA = [
  '500 1rem "Cormorant Garamond"',
  '600 1rem "Cormorant Garamond"',
  'italic 400 1rem "Cormorant Garamond"',
  'italic 500 1rem "Cormorant Garamond"',
  '500 1rem "Manrope"',
  '700 1rem "Manrope"',
] as const;

export function hangatkanHuruf(): void {
  if (typeof document === 'undefined' || !document.fonts) return;

  const ambil = () => {
    for (const muka of SISA) {
      // Ditelan kalau gagal. Huruf cadangan sistem tetap terbaca, dan
      // ini bukan alasan untuk merusak apa pun.
      void document.fonts.load(muka).catch(() => undefined);
    }
  };

  // Tunggu layar pertama selesai dulu. Kalau ini ikut berebut jalur di
  // awal, dia justru memperlambat yang mau dia percepat.
  const nanti = window.requestIdleCallback;
  if (typeof nanti === 'function') nanti(ambil, { timeout: 3000 });
  else window.setTimeout(ambil, 1200);
}
