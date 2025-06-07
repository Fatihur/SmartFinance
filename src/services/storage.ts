import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';
import { STORAGE_KEYS } from '../constants';

export class StorageService {
  static async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(transactions);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, jsonValue);
    } catch (error) {
      console.error('Error saving transactions:', error);
      throw new Error('Failed to save transactions');
    }
  }

  static async loadTransactions(): Promise<Transaction[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (jsonValue != null) {
        const transactions = JSON.parse(jsonValue);
        // Convert date strings back to Date objects
        return transactions.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
          createdAt: new Date(transaction.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  static async addTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = await this.loadTransactions();
      transactions.push(transaction);
      await this.saveTransactions(transactions);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw new Error('Failed to add transaction');
    }
  }

  static async updateTransaction(updatedTransaction: Transaction): Promise<void> {
    try {
      const transactions = await this.loadTransactions();
      const index = transactions.findIndex(t => t.id === updatedTransaction.id);
      if (index !== -1) {
        transactions[index] = updatedTransaction;
        await this.saveTransactions(transactions);
      } else {
        throw new Error('Transaction not found');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error('Failed to update transaction');
    }
  }

  static async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const transactions = await this.loadTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== transactionId);
      await this.saveTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  }

  static async clearAllTransactions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    } catch (error) {
      console.error('Error clearing transactions:', error);
      throw new Error('Failed to clear transactions');
    }
  }

  static async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      const transactions = await this.loadTransactions();
      return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    } catch (error) {
      console.error('Error getting transactions by date range:', error);
      return [];
    }
  }

  static async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    try {
      const transactions = await this.loadTransactions();
      return transactions.filter(transaction => 
        transaction.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting transactions by category:', error);
      return [];
    }
  }
}
