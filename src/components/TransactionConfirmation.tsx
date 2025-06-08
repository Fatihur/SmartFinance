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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ParsedTransaction } from '../types';
import { formatCurrency, formatCurrencyCompact } from '../utils';
import { COLORS, CATEGORIES } from '../constants';

interface TransactionConfirmationProps {
  visible: boolean;
  parsedTransaction: ParsedTransaction | null;
  originalText: string;
  onConfirm: (transaction: ParsedTransaction) => void;
  onCancel: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
      Alert.alert('Empty Description', 'Please enter a description for this transaction.');
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
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Transaction</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Original Voice Text */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voice Input:</Text>
              <View style={styles.originalTextContainer}>
                <Icon name="mic" size={20} color={COLORS.primary} style={styles.voiceIcon} />
                <Text style={styles.originalText}>"{originalText}"</Text>
              </View>
            </View>

            {/* Confidence Score */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tingkat Kepercayaan:</Text>
              <View style={styles.confidenceContainer}>
                <View style={[
                  styles.confidenceBar,
                  { width: `${editedTransaction.confidence * 100}%`, backgroundColor: confidenceColor }
                ]} />
                <Text style={[styles.confidenceText, { color: confidenceColor }]}>
                  {Math.round(editedTransaction.confidence * 100)}%
                </Text>
              </View>
            </View>

            {/* Main Form */}
            <View style={styles.mainForm}>
              {/* Type Buttons */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Jenis Transaksi:</Text>
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
                    ]}>Pemasukan</Text>
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
                    ]}>Pengeluaran</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Amount Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Jumlah:</Text>
                <TextInput
                  style={styles.amountInput}
                  value={editedTransaction.amount.toString()}
                  onChangeText={(text) => {
                    const amount = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
                    setEditedTransaction({ ...editedTransaction, amount });
                  }}
                  keyboardType="numeric"
                  placeholder="Masukkan jumlah"
                />
                <Text style={styles.amountDisplay}>
                  {formatCurrency(editedTransaction.amount)}
                </Text>
              </View>

              {/* Category Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kategori:</Text>
                <TouchableOpacity
                  style={styles.categoryButton}
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Text style={styles.categoryButtonText}>{editedTransaction.category}</Text>
                  <Icon name="keyboard-arrow-down" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Description Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Deskripsi:</Text>
                <TextInput
                  style={styles.descriptionInput}
                  value={editedTransaction.description}
                  onChangeText={(text) => setEditedTransaction({ ...editedTransaction, description: text })}
                  placeholder="Masukkan deskripsi transaksi"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Konfirmasi</Text>
            </TouchableOpacity>
          </View>
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
              <Text style={styles.pickerTitle}>Pilih Kategori</Text>
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  originalTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  voiceIcon: {
    marginRight: 12,
  },
  originalText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  confidenceBar: {
    height: 6,
    borderRadius: 3,
    flex: 1,
  },
  confidenceText: {
    marginLeft: 16,
    fontSize: 15,
    fontWeight: '600',
  },
  mainForm: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
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
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  typeButtonTextActive: {
    color: COLORS.surface,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.background,
    marginBottom: 8,
  },
  amountDisplay: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  categoryButtonText: {
    fontSize: 15,
    color: COLORS.text,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    backgroundColor: COLORS.background,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    backgroundColor: COLORS.surface,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
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
