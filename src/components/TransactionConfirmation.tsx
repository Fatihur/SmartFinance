import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ParsedTransaction } from '../types';
import { formatCurrency } from '../utils';
import { COLORS, CATEGORIES } from '../constants';

interface TransactionConfirmationProps {
  visible: boolean;
  parsedTransaction: ParsedTransaction | null;
  originalText: string;
  onConfirm: (transaction: ParsedTransaction) => void;
  onCancel: () => void;
}

const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  visible,
  parsedTransaction,
  originalText,
  onConfirm,
  onCancel,
}) => {
  const [editedTransaction, setEditedTransaction] = useState<ParsedTransaction | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  React.useEffect(() => {
    if (parsedTransaction) {
      setEditedTransaction({ ...parsedTransaction });
    }
  }, [parsedTransaction]);

  if (!editedTransaction) return null;

  const handleConfirm = () => {
    if (editedTransaction.amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    if (!editedTransaction.description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description for this transaction.');
      return;
    }

    onConfirm(editedTransaction);
  };

  const categories = editedTransaction.type === 'income' 
    ? CATEGORIES.INCOME 
    : CATEGORIES.EXPENSE;

  const confidenceColor = editedTransaction.confidence > 0.8 
    ? COLORS.success 
    : editedTransaction.confidence > 0.5 
    ? COLORS.warning 
    : COLORS.error;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Transaction</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Original Voice Text */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Original Voice Input:</Text>
              <Text style={styles.originalText}>"{originalText}"</Text>
            </View>

            {/* Confidence Score */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parsing Confidence:</Text>
              <View style={styles.confidenceContainer}>
                <View style={[
                  styles.confidenceBar,
                  { width: `${editedTransaction.confidence * 100}%`, backgroundColor: confidenceColor }
                ]} />
                <Text style={styles.confidenceText}>
                  {Math.round(editedTransaction.confidence * 100)}%
                </Text>
              </View>
            </View>

            {/* Transaction Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type:</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    editedTransaction.type === 'income' && styles.typeButtonActive,
                    { borderColor: COLORS.income }
                  ]}
                  onPress={() => setEditedTransaction({
                    ...editedTransaction,
                    type: 'income',
                    category: CATEGORIES.INCOME[0]
                  })}
                >
                  <Icon name="trending-up" size={20} color={
                    editedTransaction.type === 'income' ? COLORS.surface : COLORS.income
                  } />
                  <Text style={[
                    styles.typeButtonText,
                    editedTransaction.type === 'income' && styles.typeButtonTextActive
                  ]}>Income</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    editedTransaction.type === 'expense' && styles.typeButtonActive,
                    { borderColor: COLORS.expense }
                  ]}
                  onPress={() => setEditedTransaction({
                    ...editedTransaction,
                    type: 'expense',
                    category: CATEGORIES.EXPENSE[0]
                  })}
                >
                  <Icon name="trending-down" size={20} color={
                    editedTransaction.type === 'expense' ? COLORS.surface : COLORS.expense
                  } />
                  <Text style={[
                    styles.typeButtonText,
                    editedTransaction.type === 'expense' && styles.typeButtonTextActive
                  ]}>Expense</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount:</Text>
              <TextInput
                style={styles.amountInput}
                value={editedTransaction.amount.toString()}
                onChangeText={(text) => {
                  const amount = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
                  setEditedTransaction({ ...editedTransaction, amount });
                }}
                keyboardType="numeric"
                placeholder="Enter amount"
              />
              <Text style={styles.amountDisplay}>
                {formatCurrency(editedTransaction.amount)}
              </Text>
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category:</Text>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={styles.categoryButtonText}>{editedTransaction.category}</Text>
                <Icon name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description:</Text>
              <TextInput
                style={styles.descriptionInput}
                value={editedTransaction.description}
                onChangeText={(text) => setEditedTransaction({ ...editedTransaction, description: text })}
                placeholder="Enter description"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>

          {/* Category Picker Modal */}
          <Modal
            visible={showCategoryPicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowCategoryPicker(false)}
          >
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerTitle}>Select Category</Text>
                <ScrollView>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.categoryOption}
                      onPress={() => {
                        setEditedTransaction({ ...editedTransaction, category });
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={styles.categoryOptionText}>{category}</Text>
                      {editedTransaction.category === category && (
                        <Icon name="check" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    margin: 20,
    maxHeight: '90%',
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  originalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceBar: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    backgroundColor: COLORS.border,
  },
  confidenceText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  typeButtonTextActive: {
    color: COLORS.surface,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
  },
  amountDisplay: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.surface,
  },
  categoryButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    margin: 40,
    maxHeight: '60%',
    width: '80%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    textAlign: 'center',
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default TransactionConfirmation;
