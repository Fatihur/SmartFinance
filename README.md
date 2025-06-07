# SmartFinance - Voice-Based Financial Tracker

SmartFinance adalah aplikasi mobile React Native untuk mencatat keuangan berbasis suara dengan integrasi AI untuk parsing transaksi otomatis.

## 🚀 Fitur Utama

- **Input Suara**: Rekam transaksi menggunakan suara
- **AI Parsing**: Gunakan Gemini AI untuk menganalisis dan mengkategorikan transaksi
- **Konfirmasi Transaksi**: Review dan edit hasil parsing sebelum menyimpan
- **Dashboard**: Ringkasan keuangan dengan total pemasukan, pengeluaran, dan saldo
- **Riwayat Transaksi**: Lihat semua transaksi dengan filter berdasarkan periode dan tipe
- **Statistik**: Analisis keuangan dengan grafik kategori dan tren bulanan
- **Penyimpanan Lokal**: Data tersimpan secara lokal menggunakan AsyncStorage

## 📱 Screenshots

Aplikasi memiliki 4 tab utama:
1. **Home**: Dashboard dan transaksi terbaru
2. **Add**: Input transaksi via suara atau manual
3. **History**: Riwayat semua transaksi
4. **Stats**: Statistik dan analisis keuangan

## 🛠️ Teknologi yang Digunakan

- **React Native** dengan TypeScript
- **Expo** untuk development dan build
- **React Navigation** untuk navigasi
- **AsyncStorage** untuk penyimpanan lokal
- **Expo Speech & Audio** untuk fitur suara
- **Gemini AI API** untuk parsing transaksi
- **React Native Vector Icons** untuk ikon

## 📦 Instalasi

1. Clone repository ini
2. Masuk ke direktori SmartFinance
3. Install dependencies:
   ```bash
   npm install
   ```

4. Konfigurasi Gemini API Key:
   - Buka file `src/constants/index.ts`
   - Ganti `YOUR_GEMINI_API_KEY_HERE` dengan API key Gemini Anda
   - Dapatkan API key di: https://makersuite.google.com/app/apikey

5. Jalankan aplikasi:
   ```bash
   npm start
   ```

6. Scan QR code dengan Expo Go app atau jalankan di emulator

## 🎯 Cara Penggunaan

### Input Suara
1. Buka tab "Add"
2. Tap tombol mikrofon
3. Ucapkan transaksi Anda, contoh:
   - "Saya beli kopi 25 ribu"
   - "Bayar bensin 50000"
   - "Terima gaji 5 juta"
4. Review hasil parsing
5. Edit jika diperlukan
6. Konfirmasi untuk menyimpan

### Contoh Input Suara
- **Pengeluaran**: "Beli makan siang 30 ribu", "Bayar tagihan listrik 200000"
- **Pemasukan**: "Terima gaji 5 juta", "Dapat bonus 1 juta"

## 📁 Struktur Folder

```
SmartFinance/
├── src/
│   ├── components/          # Komponen UI reusable
│   │   ├── TransactionCard.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── VoiceButton.tsx
│   │   └── TransactionConfirmation.tsx
│   ├── screens/            # Halaman aplikasi
│   │   ├── HomeScreen.tsx
│   │   ├── AddTransactionScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── StatsScreen.tsx
│   ├── navigation/         # Konfigurasi navigasi
│   │   ├── AppNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── services/           # API calls dan external services
│   │   ├── storage.ts
│   │   └── gemini.ts
│   ├── store/              # State management (Context)
│   │   └── AppContext.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Helper functions
│   │   └── index.ts
│   └── constants/          # Konstanta aplikasi
│       └── index.ts
├── assets/                 # Gambar, font, dll
└── App.tsx                # Entry point aplikasi
```

## 🔧 Konfigurasi

### Gemini API
Untuk menggunakan fitur AI parsing, Anda perlu:
1. Mendaftar di Google AI Studio
2. Mendapatkan API key
3. Mengganti nilai `GEMINI_API_KEY` di `src/constants/index.ts`

Jika API key tidak dikonfigurasi, aplikasi akan menggunakan fallback parsing sederhana.

### Kategori Transaksi
Kategori dapat dikustomisasi di `src/constants/index.ts`:
- **Income**: Gaji, Freelance, Investasi, Bonus, Hadiah, Lainnya
- **Expense**: Makanan, Transportasi, Belanja, Hiburan, Kesehatan, Pendidikan, Tagihan, Lainnya

## 🎨 Desain

Aplikasi menggunakan desain modern dengan:
- Material Design icons
- Color scheme yang konsisten
- Responsive layout
- Smooth animations
- Dark/Light theme support (coming soon)

## 🚧 Roadmap

- [ ] Manual input form untuk transaksi
- [ ] Export data ke CSV/Excel
- [ ] Backup dan restore data
- [ ] Dark theme
- [ ] Notifikasi pengingat
- [ ] Budget tracking
- [ ] Multi-currency support
- [ ] Cloud sync

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository ini
2. Buat branch fitur baru
3. Commit perubahan Anda
4. Push ke branch
5. Buat Pull Request

## 📄 Lisensi

MIT License - lihat file LICENSE untuk detail.

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buat issue di repository ini.

---

**SmartFinance** - Track your finances with voice! 🎤💰
