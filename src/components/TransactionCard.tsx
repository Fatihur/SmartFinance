import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { COLORS } from '../constants';

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
      'Makanan': 'restaurant',
      'Transportasi': 'directions-car',
      'Belanja': 'shopping-cart',
      'Hiburan': 'movie',
      'Kesehatan': 'local-hospital',
      'Pendidikan': 'school',
      'Tagihan': 'receipt',
      'Gaji': 'work',
      'Freelance': 'computer',
      'Investasi': 'trending-up',
      'Bonus': 'card-giftcard',
      'Hadiah': 'redeem',
    };
    return iconMap[category] || 'category';
  };

  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isIncome ? COLORS.income : COLORS.expense }
        ]}>
          <Icon
            name={getCategoryIcon(transaction.category)}
            size={24}
            color={COLORS.surface}
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={styles.category}>
            {transaction.category}
          </Text>
          <Text style={styles.date}>
            {formatDate(transaction.date)}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[
          styles.amount,
          { color: isIncome ? COLORS.income : COLORS.expense }
        ]}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="delete" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
});

export default TransactionCard;
