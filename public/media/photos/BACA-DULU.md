# Taruh foto Puja di folder ini

Aplikasi mencari **10 file** dengan nama persis seperti di bawah. Simpan
fotonya di folder ini dengan nama itu, refresh halaman, langsung muncul —
tidak ada kode yang perlu diubah dan tata letaknya tidak bergeser sedikit pun.

## Daftar slotnya

| Nama file | Dipakai di mana | Saran foto |
|---|---|---|
| `cerita-1.jpg` | Bunga 1 — *"Potongan Cerita"* | yang lagi ketawa / candid |
| `cerita-2.jpg` | Bunga 2 — *"Hal Kecil yang Kuingat"* | mirror selfie, lagi benerin jilbab |
| `cerita-3.jpg` | Bunga 3 — *"Yang Belum Sempat Kubilang"* | yang menurutmu dia paling cantik |
| `cerita-4.jpg` | Bunga 4 — *"Kalau Lagi Berat"* | yang agak tenang / murung |
| `cerita-5.jpg` | Bunga 5 — *"Satu Doa"* | yang cerah, di luar ruangan |
| `jejak-1.jpg` | Jejak Perjalanan, ke-1 | bebas |
| `jejak-2.jpg` | Jejak Perjalanan, ke-2 | bebas |
| `jejak-3.jpg` | Jejak Perjalanan, ke-3 | bebas |
| `jejak-4.jpg` | Jejak Perjalanan, ke-4 | yang paling baru |
| `utama.jpg` | **Penutup** — layar penuh, mendekat pelan | yang paling bagus |

## Cara cepat

Kumpulkan fotonya di satu folder, kasih nama urut (`1.jpg`, `2.jpg`, …),
lalu dari folder project jalankan:

```bash
node tools/impor-foto.mjs "C:/Users/mamay/Downloads/foto-puja"
```

Semuanya akan disalin dan diberi nama otomatis sesuai urutan.

## Catatan

- **Format**: `.jpg` paling aman. Lebar 1200px sudah lebih dari cukup untuk HP.
- **Orientasi**: potret (9:16) paling pas, karena semua bingkainya potret.
- Selama filenya belum ada, slotnya tampil sebagai **dudukan kosong** —
  kertas dengan garis tipis dan empat sudut album. Bukan foto palsu, bukan
  ilustrasi pengganti. Saat dev, nama file yang dicari ikut tertulis di
  dudukan itu.

## Video (opsional)

Kalau ada video untuk bagian penutup, simpan di:

```
public/media/videos/terakhir.mp4
```

Kalau ada, dia yang dipakai. Kalau tidak ada, `utama.jpg` yang tampil pelan-pelan.
