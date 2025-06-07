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
        'Processing Voice Input',
        `Processing: "${voiceText}"\n\nPlease wait...`,
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
        'Processing Error',
        'Failed to process voice input. Please try again or add transaction manually.',
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
        'Success',
        'Transaction added successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to add transaction. Please try again.',
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
          <Text style={styles.headerTitle}>Add Transaction</Text>
          <Text style={styles.headerSubtitle}>
            Use voice input or add manually
          </Text>
        </View>

        {/* Voice Input Section */}
        <View style={styles.voiceSection}>
          <Text style={styles.sectionTitle}>Voice Input</Text>
          <Text style={styles.sectionDescription}>
            Tap the microphone and describe your transaction
          </Text>
          
          <VoiceButton
            onVoiceResult={handleVoiceResult}
            disabled={isProcessing}
          />

          {!GeminiService.isApiKeyConfigured() && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Gemini API key not configured. Using fallback parsing.
              </Text>
              <Text style={styles.warningSubtext}>
                Add your Gemini API key in src/constants/index.ts for better accuracy.
              </Text>
            </View>
          )}
        </View>

        {/* Manual Input Section */}
        <View style={styles.manualSection}>
          <Text style={styles.sectionTitle}>Manual Input</Text>
          <Text style={styles.sectionDescription}>
            Coming soon - manual transaction form
          </Text>
          
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>
              Manual input form will be available in the next update
            </Text>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Voice Input Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Speak clearly and include the amount and description
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Use keywords like "spent", "bought", "received", "earned"
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Examples: "Bought coffee for 25 thousand", "Received salary 5 million"
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                You can review and edit the parsed transaction before saving
              </Text>
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
    paddingBottom: 40,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  tipsSection: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipsList: {
    marginTop: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default AddTransactionScreen;
