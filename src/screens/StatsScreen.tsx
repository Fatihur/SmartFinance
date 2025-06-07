import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../store/AppContext';
import { Transaction } from '../types';
import { formatCurrency } from '../utils';
import { COLORS, CATEGORIES } from '../constants';

type PeriodType = 'day' | 'week' | 'month' | 'all';

const { width } = Dimensions.get('window');

const StatsScreen: React.FC = () => {
  const { getTransactionsByPeriod, getTransactionSummary } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');

  const periods = [
    { key: 'day' as PeriodType, label: 'Hari Ini' },
    { key: 'week' as PeriodType, label: 'Minggu' },
    { key: 'month' as PeriodType, label: 'Bulan' },
    { key: 'all' as PeriodType, label: 'Semua' },
  ];

  const transactions = getTransactionsByPeriod(selectedPeriod);
  const summary = getTransactionSummary();

  const getCategoryStats = (type: 'income' | 'expense') => {
    const categoryTransactions = transactions.filter(t => t.type === type);
    const categoryTotals: { [key: string]: number } = {};
    
    categoryTransactions.forEach(transaction => {
      categoryTotals[transaction.category] = 
        (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const incomeStats = getCategoryStats('income');
  const expenseStats = getCategoryStats('expense');

  const getMonthlyTrend = () => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    
    transactions.forEach(transaction => {
      const monthKey = transaction.date.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6); // Last 6 months
  };

  const monthlyTrend = getMonthlyTrend();

  const renderCategoryBar = (item: { category: string; amount: number; percentage: number }, type: 'income' | 'expense') => {
    const barColor = type === 'income' ? COLORS.income : COLORS.expense;
    const barWidth = Math.max(item.percentage, 5); // Minimum 5% width for visibility

    return (
      <View key={item.category} style={styles.categoryItem}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{item.category}</Text>
          <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
        </View>
        <View style={styles.categoryBarContainer}>
          <View
            style={[
              styles.categoryBar,
              { width: `${barWidth}%`, backgroundColor: barColor }
            ]}
          />
          <Text style={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</Text>
        </View>
      </View>
    );
  };

  const getPeriodLabel = (period: PeriodType): string => {
    switch (period) {
      case 'day': return 'Hari Ini';
      case 'week': return 'Minggu Ini';
      case 'month': return 'Bulan Ini';
      case 'all': return 'Semua Waktu';
      default: return 'Bulan Ini';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistik</Text>
          <Text style={styles.headerSubtitle}>Wawasan dan tren keuangan</Text>
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

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Icon name="trending-up" size={24} color={COLORS.income} />
            <Text style={styles.summaryLabel}>Total Pemasukan</Text>
            <Text style={[styles.summaryAmount, { color: COLORS.income }]}>
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Icon name="trending-down" size={24} color={COLORS.expense} />
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
            <Text style={[styles.summaryAmount, { color: COLORS.expense }]}>
              {formatCurrency(summary.totalExpense)}
            </Text>
          </View>
        </View>

        {/* Income by Category */}
        {incomeStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pemasukan per Kategori</Text>
            <View style={styles.categoryContainer}>
              {incomeStats.map(item => renderCategoryBar(item, 'income'))}
            </View>
          </View>
        )}

        {/* Expenses by Category */}
        {expenseStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pengeluaran per Kategori</Text>
            <View style={styles.categoryContainer}>
              {expenseStats.map(item => renderCategoryBar(item, 'expense'))}
            </View>
          </View>
        )}

        {/* Monthly Trend */}
        {monthlyTrend.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tren Bulanan</Text>
            <View style={styles.trendContainer}>
              {monthlyTrend.map(([month, data]) => (
                <View key={month} style={styles.trendItem}>
                  <Text style={styles.trendMonth}>
                    {new Date(month + '-01').toLocaleDateString('id-ID', { 
                      month: 'short',
                      year: '2-digit'
                    })}
                  </Text>
                  <View style={styles.trendBars}>
                    <View style={styles.trendBar}>
                      <View
                        style={[
                          styles.trendBarFill,
                          { 
                            height: Math.max((data.income / Math.max(...monthlyTrend.map(([, d]) => Math.max(d.income, d.expense)))) * 60, 4),
                            backgroundColor: COLORS.income 
                          }
                        ]}
                      />
                    </View>
                    <View style={styles.trendBar}>
                      <View
                        style={[
                          styles.trendBarFill,
                          { 
                            height: Math.max((data.expense / Math.max(...monthlyTrend.map(([, d]) => Math.max(d.income, d.expense)))) * 60, 4),
                            backgroundColor: COLORS.expense 
                          }
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.trendBalance}>
                    {formatCurrency(data.income - data.expense)}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.trendLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: COLORS.income }]} />
                <Text style={styles.legendText}>Pemasukan</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: COLORS.expense }]} />
                <Text style={styles.legendText}>Pengeluaran</Text>
              </View>
            </View>
          </View>
        )}

        {transactions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="bar-chart" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>Tidak ada data untuk ditampilkan</Text>
            <Text style={styles.emptySubtitle}>
              Tambahkan beberapa transaksi untuk melihat statistik keuangan Anda
            </Text>
          </View>
        )}
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
    marginBottom: 20,
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  categoryContainer: {
    gap: 12,
  },
  categoryItem: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  categoryBar: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryPercentage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    minWidth: 40,
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 16,
  },
  trendItem: {
    flex: 1,
    alignItems: 'center',
  },
  trendMonth: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  trendBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    gap: 2,
  },
  trendBar: {
    width: 8,
    height: 60,
    justifyContent: 'flex-end',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 2,
  },
  trendBalance: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  trendLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
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
});

export default StatsScreen;
