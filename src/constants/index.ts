export const COLORS = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  secondary: '#4CAF50',
  accent: '#FF9800',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  income: '#4CAF50',
  expense: '#F44336',
  border: '#E0E0E0',
};

export const CATEGORIES = {
  INCOME: [
    'Gaji',
    'Freelance',
    'Investasi',
    'Bonus',
    'Hadiah',
    'Lainnya'
  ],
  EXPENSE: [
    'Makanan',
    'Transportasi',
    'Belanja',
    'Hiburan',
    'Kesehatan',
    'Pendidikan',
    'Tagihan',
    'Lainnya'
  ]
};

export const STORAGE_KEYS = {
  TRANSACTIONS: '@smartfinance_transactions',
  USER_PREFERENCES: '@smartfinance_preferences',
};

export const API_CONFIG = {
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  // Ganti dengan API key Gemini Anda
  GEMINI_API_KEY: 'AIzaSyBrVS_9XFEykXFA7iydEmZhqNqpXCdAzN8',
};

export const VOICE_CONFIG = {
  LANGUAGE: 'id-ID',
  MAX_DURATION: 10000, // 10 seconds
  TIMEOUT: 5000, // 5 seconds
};

export const CURRENCY = {
  SYMBOL: 'Rp',
  LOCALE: 'id-ID',
};
