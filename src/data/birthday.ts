/* ==================================================================
   ISI BAGIAN INI. Cuma file ini yang perlu kamu ubah.

   Semua tulisan yang muncul di layar ada di sini.

   Catatan gaya: jangan pakai tanda pisah panjang di dalam kalimat.
   Kalau butuh jeda, pakai titik atau koma saja. Tulisan jadi terasa
   ditulis orang, bukan disusun mesin.
   ================================================================== */

export const dia = {
  /**
   * Namanya sengaja tidak ditulis. Yang tampil di layar cuma sebutan
   * ini, jadi kalau ada orang lain ikut lihat, isinya tetap milik kalian
   * berdua saja.
   */
  sebutan: 'My Favorite Person',
  umur: 20,
} as const;

/* ------------------------------------------------------------------
   Surat utama
   ------------------------------------------------------------------ */

export const surat = {
  sapaan: 'Untuk kamu, orang favoritku,',

  /**
   * Satu isi array = satu layar. Suratnya jalan sendiri, ganti sendiri,
   * dan bisa disentuh kalau mau lebih cepat.
   *
   * Baris barunya ditampilkan apa adanya, nggak disambung jadi paragraf.
   * Itu yang bikin nadanya kebaca seperti orang yang lagi ngetik, bukan
   * seperti surat resmi. Jangan dirapikan.
   */
  paragraf: [
    'di umur 20 ini aku cuma pengen kamu lebih banyak ketemu hari yang baik. nggak harus selalu bahagia banget, yang penting hati kamu lebih tenang dan nggak terlalu sering capek sendiri.',

    'kalau suatu hari kamu capek jangan maksa buat tetep keliatan kuat. istirahat dulu gapapa, besok lanjut lagi.',

    'buat apa pun yang sekarang lagi kamu usahain, aku harap pelan-pelan semuanya ketemu jalannya, walaupun mungkin nggak secepet yang kamu mau.',

    'jangan terlalu jahat sama diri sendiri ya. kalau gagal bukan berarti kamu nggak bisa, kalau kecewa juga bukan berarti semuanya selesai. coba lagi nanti kalau udah siap.',

    'jaga kesehatan ya, jangan kebanyakan begadang, jangan lupa makan, dan tidurnya yang cukup. kedengerannya sederhana tapi aku beneran pengen kamu sehat.',

    'kalau nanti ada hari yang sepi banget jangan langsung mikir kamu sendirian. masih ada orang yang peduli sama kamu, masih ada yang pengen denger cerita kamu.',

    'aku harap kamu selalu ketemu sama orang yang baik ke kamu, yang nggak bikin kamu ngerasa kurang, dan nggak bikin kamu terus-terusan nanya apa kamu cukup atau nggak.',

    'semoga tahun ini lebih banyak alasan buat kamu senyum. nggak harus dari sesuatu yang besar, kadang hal kecil juga cukup kok.',

    'kalau ada sesuatu yang belum jadi sesuai yang kamu mau jangan langsung nyalahin diri sendiri. mungkin belum waktunya aja, nggak semua hal harus datang sekarang.',

    'buat hal yang selama ini kamu takutkan, semoga nanti ternyata nggak semenakutkan itu. dan buat hal yang selama ini kamu pengenin, semoga pelan-pelan makin dekat.',

    'kamu jangan lupa jaga diri sendiri juga ya. kadang kamu terlalu mikirin banyak hal sampai lupa kalau diri kamu juga perlu diperhatiin.',

    'aku harap kamu selalu punya tempat buat pulang, punya orang buat diajak cerita, dan punya tempat dimana kamu nggak harus pura-pura jadi siapa-siapa.',

    'umur 20 semoga nggak cuma nambah angka, tapi juga bawa lebih banyak tenang, lebih banyak senyum, dan lebih banyak cerita bagus, serta lebih sedikit hal yang bikin kamu nangis sendirian.',

    'kalau nanti hidup lagi berat banget, jalan pelan aja. nggak usah bandingin langkah kamu sama orang lain, kamu punya waktumu sendiri.',

    'selamat ulang tahun yang ke 20 ya, sehat terus dan panjang umur. semoga urusannya dimudahin, apa yang lagi diperjuangin ketemu jalannya, dan apa yang diharapin bisa pelan-pelan kejadian. dan yang paling penting, semoga kamu punya banyak alasan buat bahagia tahun ini.',
  ],

  ttd: 'dari aku, Maulana',
} as const;

/* ------------------------------------------------------------------
   Babak
   ------------------------------------------------------------------ */

export const babak = {
  taman: {
    angka: 'I',
    judul: 'Taman yang Belum Menyala',
    baris: 'Lima bunga di sini menyimpan hal yang belum sempat kukatakan.',
  },
  jejak: {
    angka: 'II',
    judul: 'Jejak Perjalanan',
    baris: 'Beberapa hari yang sempat tertahan waktu.',
  },
  kupu: {
    angka: 'III',
    judul: 'Kupu-kupu Terakhir',
    baris: 'Merekalah yang membawa sisa cahayanya pulang.',
  },
  langit: {
    angka: 'IV',
    judul: 'Langit',
    baris: '',
  },
  surat: {
    angka: 'V',
    judul: 'Surat',
    baris: 'Yang ini panjang. Tidak apa dibaca pelan-pelan.',
  },
  penutup: {
    angka: 'VI',
    judul: 'Satu Lagi',
    baris: '',
  },
} as const;

/* ------------------------------------------------------------------
   Semua tulisan lain
   ------------------------------------------------------------------ */

export const teks = {
  pembuka: {
    label: 'Untuk Kamu',
    judul: 'Ada satu tempat\nyang kubuat untukmu.',
    sub: 'Kecil, dan gelap. Tapi setiap sudutnya kusiapkan untukmu.',
    tombol: 'Sentuh untuk memulai',
  },

  taman: {
    petunjuk: 'Geser layar untuk melihat sekeliling. Sentuh bunga yang cahayanya masih berkedip, ada sesuatu yang disimpan di dalamnya untukmu.',
    petunjukLagi: 'Masih ada bunga lain yang belum kamu sentuh.',
    rahasia: 'Sepertinya ada yang bergerak di sebelah sana.',
    selesai: 'Semua bunganya sudah menyala.',
  },

  potongan: {
    tutup: 'Tutup',
  },

  kupu: {
    petunjuk: 'Ada beberapa kupu-kupu yang membawa kejutan kecil.\nSentuh semuanya untuk membuka bagian berikutnya.',
    tombol: 'Mulai',
    selesai: 'Cahayanya terkumpul',
  },

  langit: {
    sebelum: 'Semua cahaya yang kamu kumpulkan pulang ke langit.',
    ucapan: 'Selamat Ulang Tahun ke-20,',
    sesudah: 'Dua puluh tahun, dan kamu masih di sini. Terima kasih untuk itu.',
    tombol: 'Ada surat untukmu',
  },

  surat: {
    buka: 'Buka suratnya',
    lanjut: 'Masih ada satu lagi',
    /** Muncul sekali di potongan pertama, lalu nggak ganggu lagi. */
    petunjuk: 'Suratnya jalan sendiri. Sentuh kalau mau lebih cepat.',
  },

  penutup: {
    baris: 'Ini yang terakhir.',
    judul: 'Selamat ulang tahun',
    sub: 'Terima kasih sudah berjalan sampai sini bersamaku.',
    ulang: 'Ulangi dari awal',

    /** Kotak kecil di ujung. Ditekan sekali, isinya keluar. */
    hadiah: {
      tombol: 'Tekan ini',
      judul: 'hadiahnya nyusul ya hehe',
      baris: '',
    },
    hitungan: {
      cerita: 'Pesan',
      cahaya: 'Cahaya',
      rahasia: 'Rahasia',
    },
  },

  hadiah: {
    kucing: 'Dia ikut senang',
    kelinci: 'Kamu menemukan yang paling tersembunyi',
  },

  suara: {
    nyala: 'Matikan musiknya',
    mati: 'Nyalakan musiknya',
  },
} as const;
