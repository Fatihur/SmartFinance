import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../store/AppContext';
import TransactionCard from '../components/TransactionCard';
import { Transaction } from '../types';
import { COLORS } from '../constants';
import { formatDate } from '../utils';

type PeriodType = 'day' | 'week' | 'month' | 'all';
type FilterType = 'all' | 'income' | 'expense';

const HistoryScreen: React.FC = () => {
  const { state, getTransactionsByPeriod, deleteTransaction } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('all');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const periods = [
    { key: 'day' as PeriodType, label: 'Today' },
    { key: 'week' as PeriodType, label: 'Week' },
    { key: 'month' as PeriodType, label: 'Month' },
    { key: 'all' as PeriodType, label: 'All' },
  ];

  const filters = [
    { key: 'all' as FilterType, label: 'All', icon: 'list' },
    { key: 'income' as FilterType, label: 'Income', icon: 'trending-up' },
    { key: 'expense' as FilterType, label: 'Expense', icon: 'trending-down' },
  ];

  const getFilteredTransactions = (): Transaction[] => {
    let transactions = getTransactionsByPeriod(selectedPeriod);
    
    if (selectedFilter !== 'all') {
      transactions = transactions.filter(t => t.type === selectedFilter);
    }
    
    return transactions;
  };

  const transactions = getFilteredTransactions();

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(transactionId),
        },
      ]
    );
  };

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const dateKey = formatDate(transaction.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    
    return Object.entries(grouped).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  const renderTransactionGroup = ({ item }: { item: [string, Transaction[]] }) => {
    const [date, dayTransactions] = item;
    const dayTotal = dayTransactions.reduce((sum, t) => 
      sum + (t.type === 'income' ? t.amount : -t.amount), 0
    );

    return (
      <View style={styles.dateGroup}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={[
            styles.dayTotal,
            { color: dayTotal >= 0 ? COLORS.income : COLORS.expense }
          ]}>
            {dayTotal >= 0 ? '+' : ''}{dayTotal.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            })}
          </Text>
        </View>
        
        {dayTransactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onDelete={() => handleDeleteTransaction(transaction.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <Text style={styles.headerSubtitle}>
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Period Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Period:</Text>
        <View style={styles.filterButtons}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.filterButton,
                selectedPeriod === period.key && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedPeriod === period.key && styles.filterButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Type Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Type:</Text>
        <View style={styles.filterButtons}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Icon
                name={filter.icon}
                size={16}
                color={selectedFilter === filter.key ? COLORS.surface : COLORS.textSecondary}
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Transactions List */}
      {state.isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No transactions found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your filters or add some transactions
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupedTransactions}
          renderItem={renderTransactionGroup}
          keyExtractor={([date]) => date}
          style={styles.transactionsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterButtonTextActive: {
    color: COLORS.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  transactionsList: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HistoryScreen;
