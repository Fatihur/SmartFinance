import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../store/AppContext';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { COLORS } from '../constants';

type PeriodType = 'day' | 'week' | 'month' | 'all';

const HomeScreen: React.FC = () => {
  const { state, getTransactionSummary, getTransactionsByPeriod, deleteTransaction } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [refreshing, setRefreshing] = useState(false);

  const periods = [
    { key: 'day' as PeriodType, label: 'Day' },
    { key: 'week' as PeriodType, label: 'Week' },
    { key: 'month' as PeriodType, label: 'Month' },
    { key: 'all' as PeriodType, label: 'All' },
  ];

  const transactions = getTransactionsByPeriod(selectedPeriod);
  const summary = getTransactionSummary();

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, you might want to reload data from server
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

  const getPeriodLabel = (period: PeriodType): string => {
    switch (period) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'all':
        return 'All Time';
      default:
        return 'This Month';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SmartFinance</Text>
          <Text style={styles.headerSubtitle}>Track your finances with voice</Text>
        </View>

        {/* Period Filter */}
        <View style={styles.periodContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.key && styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Summary Card */}
        <SummaryCard summary={summary} period={getPeriodLabel(selectedPeriod)} />

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            {transactions.length > 0 && (
              <Text style={styles.transactionsCount}>
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {state.isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="receipt-long" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>Start by adding a transaction</Text>
              <Text style={styles.emptySubtitle}>
                No transactions yet
              </Text>
              <Text style={styles.emptyHint}>
                Tap the microphone button and say something like:
              </Text>
              <Text style={styles.exampleText}>"Spent $12.50 on lunch"</Text>
              <Text style={styles.exampleText}>"Received $500 salary"</Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.slice(0, 10).map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={() => handleDeleteTransaction(transaction.id)}
                />
              ))}
              
              {transactions.length > 10 && (
                <View style={styles.moreTransactions}>
                  <Text style={styles.moreTransactionsText}>
                    +{transactions.length - 10} more transactions
                  </Text>
                  <Text style={styles.moreTransactionsHint}>
                    Go to History tab to see all
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
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
  periodContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodButtonTextActive: {
    color: COLORS.surface,
  },
  transactionsSection: {
    flex: 1,
    marginTop: 8,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  transactionsCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
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
    marginBottom: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  exampleText: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
    marginVertical: 2,
  },
  transactionsList: {
    paddingBottom: 20,
  },
  moreTransactions: {
    alignItems: 'center',
    padding: 20,
  },
  moreTransactionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  moreTransactionsHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

export default HomeScreen;
