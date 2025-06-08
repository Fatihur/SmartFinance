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
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../store/AppContext';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { COLORS } from '../constants';

type PeriodType = 'day' | 'week' | 'month' | 'all';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isLargeScreen = screenWidth > 400;
const paddingHorizontal = isLargeScreen ? 20 : 16;
const paddingVertical = isLargeScreen ? 16 : 12;

const HomeScreen: React.FC = () => {
  const { getTransactionSummary, getTransactionsByPeriod, deleteTransaction } = useApp();
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
    setTimeout(() => setRefreshing(false), 800);
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



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      
      {/* Fixed Header Content */}
      <View style={styles.fixedContent}>
        <View style={styles.headerContainer}>
          <SummaryCard
            summary={summary}
            period={periods.find(p => p.key === selectedPeriod)?.label || ''}
          />
        </View>
      
        {/* Period Selector */}
        <View style={styles.periodSelectorWrapper}>
          <View style={styles.periodSelector}>
            {periods.map(period => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Transactions Header */}
        <View style={styles.transactionsHeader}>
          <View style={styles.transactionsTitleContainer}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <View style={styles.transactionCountBadge}>
              <Text style={styles.transactionCount}>
                {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Transactions List */}
      <ScrollView
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {transactions.length > 0 ? (
          transactions.map(transaction => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onDelete={() => handleDeleteTransaction(transaction.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="mic" size={64} color={COLORS.primary} />
            <Text style={styles.emptyStateTitle}>
              Mulai Tambah Transaksi
            </Text>
            <Text style={styles.emptyStateText}>
              Tekan tombol mikrofon dan coba katakan:
            </Text>
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>"Beli kopi 25 ribu"</Text>
              <Text style={styles.exampleText}>"Terima gaji 5 juta"</Text>
            </View>
          </View>
        )}
        {/* Bottom padding for last item */}
        <View style={styles.bottomPadding} />
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: paddingVertical * 1.5,
  },
  fixedContent: {
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  headerContainer: {
    marginTop: paddingVertical,
    marginBottom: paddingVertical * 1.5,
    paddingHorizontal: paddingHorizontal,
  },
  periodSelectorWrapper: {
    paddingHorizontal: paddingHorizontal,
    marginBottom: 24,
    marginHorizontal: paddingHorizontal,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 25,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  transactionsHeader: {
    backgroundColor: COLORS.background,
    paddingHorizontal: paddingHorizontal,
    marginTop: 16,
    marginBottom: 8,
  },
  transactionsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  transactionCountBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  transactionCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  transactionsList: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  transactionsContent: {
    paddingTop: paddingVertical,
    paddingBottom: paddingVertical * 3,
    paddingHorizontal: paddingHorizontal,
  },
  emptyState: {
    paddingVertical: screenHeight * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    margin: paddingHorizontal,
    borderRadius: 24,
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  exampleContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  exampleText: {
    fontSize: 15,
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 4,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
});

export default HomeScreen;
