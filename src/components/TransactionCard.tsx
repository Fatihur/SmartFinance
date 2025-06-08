import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Transaction } from '../types';
import { formatCurrency, formatCurrencyCompact, formatDate } from '../utils';
import { COLORS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');
const isLargeScreen = screenWidth > 400;
const paddingHorizontal = isLargeScreen ? 20 : 16;
const paddingVertical = isLargeScreen ? 16 : 12;

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
  onDelete,
}) => {
  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      'Food': 'restaurant',
      'Transport': 'directions-car',
      'Shopping': 'shopping-cart',
      'Entertainment': 'movie',
      'Health': 'local-hospital',
      'Education': 'school',
      'Bills': 'receipt',
      'Salary': 'work',
      'Freelance': 'computer',
      'Investment': 'trending-up',
      'Bonus': 'card-giftcard',
      'Gift': 'redeem',
    };
    return iconMap[category] || 'category';
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.iconContainer}>
          <View style={[
            styles.icon,
            { backgroundColor: transaction.type === 'income' ? COLORS.income + '15' : COLORS.expense + '15' }
          ]}>
            <Icon 
              name={getCategoryIcon(transaction.category)} 
              size={24} 
              color={transaction.type === 'income' ? COLORS.income : COLORS.expense} 
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <View style={styles.metadataContainer}>
            <Text style={styles.category}>{transaction.category}</Text>
            <Text style={styles.separator}> • </Text>
            <Text style={styles.date}>{formatDate(transaction.date)}</Text>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[
            styles.amount,
            { color: transaction.type === 'income' ? COLORS.income : COLORS.expense }
          ]}>
            {transaction.type === 'income' ? '+' : '-'}{' '}
            {formatCurrencyCompact(transaction.amount)}
          </Text>
        </View>

        {onDelete && (
          <TouchableOpacity 
            onPress={onDelete} 
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="delete-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: paddingHorizontal,
    marginVertical: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  separator: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginHorizontal: 6,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  amountContainer: {
    marginRight: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
});

export default TransactionCard;
