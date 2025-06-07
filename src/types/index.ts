export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface VoiceTranscription {
  text: string;
  confidence: number;
}

export interface ParsedTransaction {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  confidence: number;
}

export interface AppState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  MainTabs: undefined;
  AddTransaction: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  AddTransaction: undefined;
  History: undefined;
  Stats: undefined;
};

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}
