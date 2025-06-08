import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TransactionSummary } from '../types';
import { formatCurrency, formatCurrencyCompact } from '../utils';
import { COLORS } from '../constants';

interface SummaryCardProps {
  summary: TransactionSummary;
  period: string;
}

const { width: screenWidth } = Dimensions.get('window');
const isLargeScreen = screenWidth > 400;
const paddingHorizontal = isLargeScreen ? 20 : 16;

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, period }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Summary</Text>
          <View style={styles.periodBadge}>
            <Text style={styles.period}>{period}</Text>
          </View>
        </View>

        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={[
            styles.balanceAmount,
            { color: summary.balance >= 0 ? COLORS.income : COLORS.expense }
          ]}>
            {summary.balance >= 0 ? '+' : '-'} {formatCurrencyCompact(Math.abs(summary.balance))}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.income + '10' }]}>
              <Icon name="trending-up" size={20} color={COLORS.income} />
            </View>
            <View style={styles.statText}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={[styles.statAmount, { color: COLORS.income }]}>
                +{formatCurrencyCompact(summary.totalIncome)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.expense + '10' }]}>
              <Icon name="trending-down" size={20} color={COLORS.expense} />
            </View>
            <View style={styles.statText}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={[styles.statAmount, { color: COLORS.expense }]}>
                -{formatCurrencyCompact(summary.totalExpense)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: paddingHorizontal,
    paddingVertical: 16,
  },
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: isLargeScreen ? 24 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  periodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  period: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: isLargeScreen ? 40 : 36,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: 20,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  statAmount: {
    fontSize: isLargeScreen ? 17 : 16,
    fontWeight: '600',
  },
});

export default SummaryCard;
