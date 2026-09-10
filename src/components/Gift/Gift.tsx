import { motion } from 'motion/react';
import './Gift.css';

/* ------------------------------------------------------------------
   Kotak hadiah.

   Digambar, bukan foto dan bukan emoji, sama seperti bunga dan
   dedaunan di taman. Bahannya juga sama: kertas krem dan pita emas,
   dua warna yang sudah dipakai di seluruh cerita ini, jadi dia nggak
   terasa datang dari tempat lain.

   Tutupnya sedikit terangkat dan miring, seperti kotak yang barusan
   dibuka dan ditaruh lagi buru-buru. Itu yang bikin dia terbaca sebagai
   "isinya belum ada di sini" tanpa perlu ditulis.
   ------------------------------------------------------------------ */

export function Gift() {
  return (
    <motion.div
      className="gift"
      initial={{ opacity: 0, y: 18, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 15, mass: 0.8 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 128 116" className="gift__svg" role="presentation">
        <defs>
          <linearGradient id="giftKertas" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#fffaf1" />
            <stop offset="100%" stopColor="#efdfc9" />
          </linearGradient>
          <linearGradient id="giftPita" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#f0d29a" />
            <stop offset="100%" stopColor="#c9a15e" />
          </linearGradient>
        </defs>

        {/* Bayangan di bawah kotak, supaya dia duduk di sesuatu. */}
        <ellipse cx="64" cy="108" rx="40" ry="5" fill="rgba(0,0,0,0.34)" />

        {/* Badan kotak */}
        <rect x="22" y="54" width="84" height="50" rx="4" fill="url(#giftKertas)" />
        {/* Sisi kanan sedikit lebih gelap: satu sumber cahaya, dari kiri atas. */}
        <path d="M106 54v50H88V54z" fill="rgba(120, 96, 70, 0.14)" />

        {/* Pita yang turun ke badan */}
        <rect x="57" y="54" width="14" height="50" fill="url(#giftPita)" />

        {/* Tutup, terangkat dan miring sedikit */}
        <g transform="rotate(-4 64 44)">
          <rect x="16" y="34" width="96" height="20" rx="3.5" fill="url(#giftKertas)" />
          <rect x="16" y="47" width="96" height="7" rx="2" fill="rgba(120, 96, 70, 0.12)" />
          <rect x="57" y="34" width="14" height="20" fill="url(#giftPita)" />
        </g>

        {/* Simpul dan dua lingkar pita */}
        <g transform="rotate(-4 64 30)">
          <path
            d="M63 30C63 30 48 30 43 22C39.5 16.5 45 11 51 14C57 17 63 26 63 30Z"
            fill="url(#giftPita)"
          />
          <path
            d="M65 30C65 30 80 30 85 22C88.5 16.5 83 11 77 14C71 17 65 26 65 30Z"
            fill="url(#giftPita)"
          />
          <circle cx="64" cy="30" r="6" fill="#f6dcae" />
        </g>
      </svg>
    </motion.div>
  );
}
