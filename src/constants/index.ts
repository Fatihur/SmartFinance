export const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  income: '#10B981',
  expense: '#EF4444',
  border: '#E2E8F0',
  cardBorder: '#F1F5F9',
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
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  // API key Gemini yang aktif
  GEMINI_API_KEY: 'AIzaSyBByL_Cqmb4d_GX1rvM23V9l1c33d4g9AY',
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
