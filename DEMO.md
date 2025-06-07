# SmartFinance Demo Guide

## 🎯 Cara Menggunakan Aplikasi

### 1. Home Screen
- **Dashboard**: Lihat ringkasan keuangan (saldo, pemasukan, pengeluaran)
- **Filter Periode**: Pilih Day/Week/Month/All untuk melihat data periode tertentu
- **Transaksi Terbaru**: Lihat 10 transaksi terakhir
- **Pull to Refresh**: Tarik ke bawah untuk refresh data

### 2. Add Transaction Screen
- **Voice Input**: Tap tombol mikrofon biru dan ucapkan transaksi
- **Contoh Input Suara**:
  - "Saya beli kopi 25 ribu"
  - "Bayar bensin 50000"
  - "Terima gaji 5 juta"
  - "Beli makan siang 30 ribu"
- **Konfirmasi**: Review dan edit hasil parsing sebelum menyimpan
- **Tips**: Ucapkan dengan jelas, sertakan jumlah dan deskripsi

### 3. History Screen
- **Filter Periode**: Day/Week/Month/All
- **Filter Tipe**: All/Income/Expense
- **Grouped by Date**: Transaksi dikelompokkan berdasarkan tanggal
- **Daily Total**: Lihat total harian untuk setiap grup
- **Delete**: Swipe atau tap ikon delete untuk menghapus transaksi

### 4. Stats Screen
- **Summary Cards**: Total income dan expense
- **Category Breakdown**: Grafik batang untuk setiap kategori
- **Monthly Trend**: Tren 6 bulan terakhir
- **Percentage**: Persentase setiap kategori dari total

## 🎤 Voice Input Examples

### Pengeluaran (Expense)
```
"Beli kopi 25 ribu"
"Bayar bensin 50000"
"Beli makan siang 30 ribu"
"Bayar tagihan listrik 200000"
"Beli baju 150 ribu"
"Naik ojek 15000"
"Beli obat 45 ribu"
"Bayar internet 300000"
```

### Pemasukan (Income)
```
"Terima gaji 5 juta"
"Dapat bonus 1 juta"
"Terima uang freelance 500000"
"Dapat hadiah 100 ribu"
"Terima dividen 2 juta"
"Dapat cashback 50000"
```

## 🔧 AI Parsing Features

### Automatic Detection
- **Transaction Type**: Otomatis deteksi income/expense dari kata kunci
- **Amount**: Extract angka dari berbagai format (25000, 25 ribu, 25k)
- **Category**: Kategorisasi otomatis berdasarkan konteks
- **Description**: Gunakan input asli sebagai deskripsi

### Keywords Recognition
- **Expense**: beli, bayar, buat, keluar, habis, spend
- **Income**: terima, dapat, gaji, bonus, hadiah, untung, masuk

### Category Mapping
- **Makanan**: kopi, makan, nasi, burger, dll
- **Transportasi**: bensin, ojek, bus, taxi, dll
- **Belanja**: baju, sepatu, shopping, dll
- **Tagihan**: listrik, air, internet, dll

## 📊 Data Management

### Local Storage
- Data tersimpan di AsyncStorage device
- Tidak perlu internet untuk melihat data
- Data persist setelah restart aplikasi

### Data Format
```json
{
  "id": "unique_id",
  "type": "income|expense",
  "amount": 25000,
  "category": "Makanan",
  "description": "Beli kopi",
  "date": "2024-01-01T10:00:00.000Z",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

## 🎨 UI/UX Features

### Modern Design
- Material Design icons
- Consistent color scheme
- Smooth animations
- Responsive layout

### Color Coding
- **Green**: Income/positive amounts
- **Red**: Expense/negative amounts
- **Blue**: Primary actions
- **Gray**: Secondary text

### Accessibility
- Large touch targets
- Clear visual hierarchy
- Readable fonts
- High contrast colors

## 🚀 Performance Tips

### Best Practices
1. **Voice Input**: Speak clearly in quiet environment
2. **Data Entry**: Review parsed data before saving
3. **Categories**: Use consistent category names
4. **Amounts**: Speak numbers clearly (avoid "um", "eh")

### Troubleshooting
1. **Voice not working**: Check microphone permissions
2. **Parsing errors**: Edit manually in confirmation screen
3. **App slow**: Restart app if too many transactions
4. **Data missing**: Check if AsyncStorage has space

## 📱 Platform Differences

### Android
- Voice input works on all Android devices
- Better performance on newer devices
- Supports background audio processing

### iOS
- Requires iOS 13+ for optimal performance
- Voice input may need explicit permission
- Better animation performance

### Web (Limited)
- Voice input not available in web browser
- Manual input only
- Good for testing UI/UX

## 🔮 Future Features

### Coming Soon
- Manual input form
- Export to CSV/Excel
- Dark theme
- Budget tracking
- Recurring transactions
- Cloud backup

### Planned Improvements
- Better voice recognition
- More languages support
- Offline AI parsing
- Smart categorization
- Expense predictions

---

**Happy tracking! 💰📊**
