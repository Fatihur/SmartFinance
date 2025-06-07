import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TransactionSummary } from '../types';
import { formatCurrency } from '../utils';
import { COLORS } from '../constants';

interface SummaryCardProps {
  summary: TransactionSummary;
  period: string;
}

const { width: screenWidth } = Dimensions.get('window');

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, period }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ringkasan</Text>
        <Text style={styles.period}>{period}</Text>
      </View>

      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Saldo</Text>
        <Text style={[
          styles.balanceAmount,
          { color: summary.balance >= 0 ? COLORS.income : COLORS.expense }
        ]}>
          {formatCurrency(summary.balance)}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Icon name="trending-up" size={20} color={COLORS.income} />
          </View>
          <View style={styles.statText}>
            <Text style={styles.statLabel}>Pemasukan</Text>
            <Text style={[styles.statAmount, { color: COLORS.income }]}>
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Icon name="trending-down" size={20} color={COLORS.expense} />
          </View>
          <View style={styles.statText}>
            <Text style={styles.statLabel}>Pengeluaran</Text>
            <Text style={[styles.statAmount, { color: COLORS.expense }]}>
              {formatCurrency(summary.totalExpense)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    margin: screenWidth > 400 ? 20 : 16,
    padding: screenWidth > 400 ? 24 : 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  period: {
    fontSize: 14,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: screenWidth > 400 ? 36 : 32,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SummaryCard;
