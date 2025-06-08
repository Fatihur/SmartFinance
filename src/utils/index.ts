import { CURRENCY } from '../constants';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const parseAmount = (text: string): number => {
  // Remove non-numeric characters except dots and commas
  const cleanText = text.replace(/[^\d.,]/g, '');
  
  // Handle different number formats
  if (cleanText.includes(',') && cleanText.includes('.')) {
    // Format: 1,234.56 or 1.234,56
    const lastComma = cleanText.lastIndexOf(',');
    const lastDot = cleanText.lastIndexOf('.');
    
    if (lastDot > lastComma) {
      // Format: 1,234.56
      return parseFloat(cleanText.replace(/,/g, ''));
    } else {
      // Format: 1.234,56
      return parseFloat(cleanText.replace(/\./g, '').replace(',', '.'));
    }
  } else if (cleanText.includes(',')) {
    // Check if comma is decimal separator or thousands separator
    const parts = cleanText.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      // Decimal separator
      return parseFloat(cleanText.replace(',', '.'));
    } else {
      // Thousands separator
      return parseFloat(cleanText.replace(/,/g, ''));
    }
  } else if (cleanText.includes('.')) {
    // Could be decimal or thousands separator
    const parts = cleanText.split('.');
    if (parts.length === 2 && parts[1].length <= 2) {
      // Decimal separator
      return parseFloat(cleanText);
    } else {
      // Thousands separator
      return parseFloat(cleanText.replace(/\./g, ''));
    }
  }
  
  return parseFloat(cleanText) || 0;
};

export const extractKeywords = (text: string): string[] => {
  const keywords = text.toLowerCase().split(/\s+/);
  return keywords.filter(word => word.length > 2);
};

export const isValidAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount > 0 && amount < 1000000000; // Max 1 billion
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
