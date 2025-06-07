# Setup Guide - SmartFinance

## Prerequisites

1. **Node.js** (v16 atau lebih baru)
2. **npm** atau **yarn**
3. **Expo CLI** (optional, untuk development)
4. **Android Studio** (untuk Android development)
5. **Xcode** (untuk iOS development - hanya di macOS)

## Quick Start

1. **Clone dan Install**
   ```bash
   cd SmartFinance
   npm install
   ```

2. **Setup Gemini API Key**
   - Buka `src/constants/index.ts`
   - Ganti `YOUR_GEMINI_API_KEY_HERE` dengan API key Anda
   - Dapatkan API key di: https://makersuite.google.com/app/apikey

3. **Jalankan Aplikasi**
   ```bash
   npm start
   ```

4. **Test di Device**
   - Install Expo Go app di smartphone
   - Scan QR code yang muncul di terminal
   - Atau jalankan di emulator dengan `npm run android` atau `npm run ios`

## Konfigurasi Development

### 1. Gemini AI API Setup

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Buat API key baru
4. Copy API key
5. Paste di `src/constants/index.ts`:
   ```typescript
   export const API_CONFIG = {
     GEMINI_API_KEY: 'your_actual_api_key_here',
     // ...
   };
   ```

### 2. Testing Voice Features

Voice features memerlukan:
- Microphone permission
- Physical device (tidak bisa di web simulator)
- Internet connection (untuk Gemini API)

### 3. Development Tips

1. **Hot Reload**: Aplikasi akan reload otomatis saat ada perubahan code
2. **Debug**: Gunakan `console.log()` atau React Native Debugger
3. **Error Handling**: Check terminal untuk error messages
4. **Performance**: Test di device fisik untuk performa yang akurat

## Build untuk Production

### Android APK
```bash
expo build:android
```

### iOS IPA (memerlukan macOS)
```bash
expo build:ios
```

### Web Build
```bash
npm run web
```

## Troubleshooting

### Common Issues

1. **Metro bundler error**
   ```bash
   npx expo start --clear
   ```

2. **Package version conflicts**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Android build issues**
   - Pastikan Android SDK terinstall
   - Set ANDROID_HOME environment variable

4. **Voice recording tidak berfungsi**
   - Test di device fisik (bukan simulator)
   - Check microphone permissions
   - Pastikan internet connection untuk Gemini API

### Performance Optimization

1. **Reduce bundle size**
   - Import hanya komponen yang diperlukan
   - Gunakan tree shaking

2. **Optimize images**
   - Compress images di folder assets
   - Gunakan format WebP jika memungkinkan

3. **Memory management**
   - Cleanup listeners di useEffect
   - Avoid memory leaks di async operations

## Development Workflow

1. **Feature Development**
   - Buat branch baru untuk setiap fitur
   - Test di device fisik
   - Update dokumentasi jika diperlukan

2. **Code Quality**
   - Gunakan TypeScript untuk type safety
   - Follow React Native best practices
   - Add error boundaries untuk error handling

3. **Testing**
   - Test voice features di device fisik
   - Test offline functionality
   - Test dengan data yang bervariasi

## Deployment

### Expo Managed Workflow
```bash
expo publish
```

### Standalone Apps
```bash
expo build:android --type apk
expo build:ios --type archive
```

## Support

Jika mengalami masalah:
1. Check dokumentasi Expo: https://docs.expo.dev/
2. Check React Native docs: https://reactnative.dev/
3. Buat issue di repository ini
4. Check Stack Overflow untuk masalah umum

---

Happy coding! 🚀
