import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, AppState, TransactionSummary } from '../types';
import { StorageService } from '../services/storage';
import { generateId } from '../utils';

interface AppContextType {
  state: AppState;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
  getTransactionSummary: () => TransactionSummary;
  getTransactionsByPeriod: (period: 'day' | 'week' | 'month' | 'all') => Transaction[];
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string };

const initialState: AppState = {
  transactions: [],
  isLoading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, isLoading: false, error: null };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        isLoading: false,
        error: null,
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadTransactions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const transactions = await StorageService.loadTransactions();
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load transactions' });
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newTransaction: Transaction = {
        ...transactionData,
        id: generateId(),
        createdAt: new Date(),
      };

      await StorageService.addTransaction(newTransaction);
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add transaction' });
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await StorageService.updateTransaction(transaction);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update transaction' });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await StorageService.deleteTransaction(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete transaction' });
    }
  };

  const getTransactionSummary = (): TransactionSummary => {
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  };

  const getTransactionsByPeriod = (period: 'day' | 'week' | 'month' | 'all'): Transaction[] => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'all':
      default:
        return state.transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    return state.transactions
      .filter(t => t.date >= startDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const value: AppContextType = {
    state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    getTransactionSummary,
    getTransactionsByPeriod,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
