import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../store/AppContext';
import VoiceButton from '../components/VoiceButton';
import TransactionConfirmation from '../components/TransactionConfirmation';
import { GeminiService } from '../services/gemini';
import { ParsedTransaction } from '../types';
import { COLORS } from '../constants';

const AddTransactionScreen: React.FC = () => {
  const { addTransaction } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [parsedTransaction, setParsedTransaction] = useState<ParsedTransaction | null>(null);
  const [originalVoiceText, setOriginalVoiceText] = useState('');

  const handleVoiceResult = async (voiceText: string) => {
    try {
      setIsProcessing(true);
      setOriginalVoiceText(voiceText);

      // Show processing message
      Alert.alert(
        'Memproses Input Suara',
        `Memproses: "${voiceText}"\n\nMohon tunggu...`,
        [],
        { cancelable: false }
      );

      // Parse voice text using Gemini API
      const parsed = await GeminiService.parseVoiceToTransaction(voiceText);
      
      setParsedTransaction(parsed);
      setShowConfirmation(true);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      Alert.alert(
        'Kesalahan Pemrosesan',
        'Gagal memproses input suara. Silakan coba lagi atau tambah transaksi secara manual.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmTransaction = async (confirmedTransaction: ParsedTransaction) => {
    try {
      await addTransaction({
        type: confirmedTransaction.type,
        amount: confirmedTransaction.amount,
        category: confirmedTransaction.category,
        description: confirmedTransaction.description,
        date: new Date(),
      });

      setShowConfirmation(false);
      setParsedTransaction(null);
      setOriginalVoiceText('');

      Alert.alert(
        'Berhasil',
        'Transaksi berhasil ditambahkan!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Kesalahan',
        'Gagal menambahkan transaksi. Silakan coba lagi.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setParsedTransaction(null);
    setOriginalVoiceText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tambah Transaksi</Text>
          <Text style={styles.headerSubtitle}>
            Gunakan input suara atau tambah manual
          </Text>
        </View>

        {/* Voice Input Section */}
        <View style={styles.voiceSection}>
          <Text style={styles.sectionTitle}>Input Suara</Text>
          <Text style={styles.sectionDescription}>
            Tekan mikrofon dan deskripsikan transaksi Anda
          </Text>
          
          <VoiceButton
            onVoiceResult={handleVoiceResult}
            disabled={isProcessing}
          />

          {!GeminiService.isApiKeyConfigured() && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Kunci API Gemini belum dikonfigurasi. Menggunakan parsing cadangan.
              </Text>
              <Text style={styles.warningSubtext}>
                Tambahkan kunci API Gemini di src/constants/index.ts untuk akurasi yang lebih baik.
              </Text>
            </View>
          )}
        </View>

        {/* Manual Input Section */}
        <View style={styles.manualSection}>
          <Text style={styles.sectionTitle}>Input Manual</Text>
          <Text style={styles.sectionDescription}>
            Segera hadir - formulir transaksi manual
          </Text>

          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>
              Formulir input manual akan tersedia di pembaruan berikutnya
            </Text>
          </View>
        </View>

        {/* Hint Section */}
        <View style={styles.hintSection}>
          <Text style={styles.sectionTitle}>Kata Kunci</Text>
          <View style={styles.keywordContainer}>
            <View style={styles.keywordGroup}>
              <Text style={styles.keywordGroupTitle}>Pemasukan:</Text>
              <View style={styles.keywordTags}>
                <Text style={styles.keywordTag}>terima</Text>
                <Text style={styles.keywordTag}>dapat</Text>
                <Text style={styles.keywordTag}>gaji</Text>
                <Text style={styles.keywordTag}>bonus</Text>
              </View>
            </View>
            <View style={styles.keywordGroup}>
              <Text style={styles.keywordGroupTitle}>Pengeluaran:</Text>
              <View style={styles.keywordTags}>
                <Text style={styles.keywordTag}>beli</Text>
                <Text style={styles.keywordTag}>bayar</Text>
                <Text style={styles.keywordTag}>buat</Text>
                <Text style={styles.keywordTag}>habis</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmation
        visible={showConfirmation}
        parsedTransaction={parsedTransaction}
        originalText={originalVoiceText}
        onConfirm={handleConfirmTransaction}
        onCancel={handleCancelConfirmation}
      />
    </KeyboardAvoidingView>
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
  scrollContent: {
    paddingBottom: 120, // Space for bottom navigation
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
  voiceSection: {
    backgroundColor: COLORS.surface,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 12,
    color: '#856404',
  },
  manualSection: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  comingSoonContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  hintSection: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  keywordContainer: {
    marginTop: 12,
  },
  keywordGroup: {
    marginBottom: 16,
  },
  keywordGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  keywordTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordTag: {
    backgroundColor: COLORS.primary,
    color: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AddTransactionScreen;
