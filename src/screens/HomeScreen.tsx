import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../store/AppContext';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { COLORS } from '../constants';

type PeriodType = 'day' | 'week' | 'month' | 'all';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { state, getTransactionSummary, getTransactionsByPeriod, deleteTransaction } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [refreshing, setRefreshing] = useState(false);

  const periods = [
    { key: 'day' as PeriodType, label: 'Hari Ini' },
    { key: 'week' as PeriodType, label: 'Minggu Ini' },
    { key: 'month' as PeriodType, label: 'Bulan Ini' },
    { key: 'all' as PeriodType, label: 'Semua' },
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
      'Hapus Transaksi',
      'Apakah Anda yakin ingin menghapus transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => deleteTransaction(transactionId),
        },
      ]
    );
  };

  const getPeriodLabel = (period: PeriodType): string => {
    switch (period) {
      case 'day':
        return 'Hari Ini';
      case 'week':
        return 'Minggu Ini';
      case 'month':
        return 'Bulan Ini';
      case 'all':
        return 'Semua Waktu';
      default:
        return 'Bulan Ini';
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
          <Text style={styles.headerSubtitle}>Kelola keuangan dengan suara</Text>
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
            <Text style={styles.transactionsTitle}>Transaksi Terbaru</Text>
            {transactions.length > 0 && (
              <Text style={styles.transactionsCount}>
                {transactions.length} transaksi
              </Text>
            )}
          </View>

          {state.isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Memuat...</Text>
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="receipt-long" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>Mulai dengan menambah transaksi</Text>
              <Text style={styles.emptySubtitle}>
                Belum ada transaksi
              </Text>
              <Text style={styles.emptyHint}>
                Tekan tombol mikrofon dan katakan sesuatu seperti:
              </Text>
              <Text style={styles.exampleText}>"Beli makan siang 25 ribu"</Text>
              <Text style={styles.exampleText}>"Terima gaji 5 juta"</Text>
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
                    +{transactions.length - 10} transaksi lainnya
                  </Text>
                  <Text style={styles.moreTransactionsHint}>
                    Lihat semua di tab Statistik
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
    paddingBottom: 90, // Space for bottom navigation
  },
  header: {
    padding: screenWidth > 400 ? 24 : 20,
    paddingTop: screenWidth > 400 ? 50 : 40,
  },
  headerTitle: {
    fontSize: screenWidth > 400 ? 32 : 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: screenWidth > 400 ? 18 : 16,
    color: COLORS.textSecondary,
  },
  periodContainer: {
    paddingHorizontal: screenWidth > 400 ? 20 : 16,
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
