import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';
import VoiceOverlay from '../components/VoiceOverlay';
import TransactionConfirmation from '../components/TransactionConfirmation';
import { MainTabParamList, ParsedTransaction } from '../types';
import { GeminiService } from '../services/gemini';
import { useApp } from '../store/AppContext';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabNavigator: React.FC = () => {
  const { addTransaction } = useApp();
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<ParsedTransaction | null>(null);
  const [originalVoiceText, setOriginalVoiceText] = useState('');

  const handleVoiceResult = async (text: string) => {
    console.log('Voice result:', text);
    setShowVoiceOverlay(false);

    if (text.includes('Speech-to-text service needs to be configured')) {
      Alert.alert(
        'Voice Input Setup Required',
        'For mobile platforms, you need to integrate with a speech-to-text service like:\n• Google Cloud Speech-to-Text\n• Azure Speech Services\n• AWS Transcribe\n\nWeb browser speech recognition is working!',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Show processing alert
      Alert.alert(
        'Memproses Input Suara',
        `Memproses: "${text}"\n\nMohon tunggu...`,
        [],
        { cancelable: false }
      );

      // Process voice input with Gemini
      const parsedTransaction = await GeminiService.parseVoiceToTransaction(text);

      // Hide processing alert
      Alert.alert('', '', [], { cancelable: true });

      // Show confirmation modal
      setOriginalVoiceText(text);
      setPendingTransaction(parsedTransaction);
      setShowConfirmation(true);

    } catch (error) {
      console.error('Error processing voice input:', error);
      Alert.alert(
        'Kesalahan Pemrosesan',
        'Gagal memproses input suara. Silakan coba lagi atau tambah transaksi secara manual.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleConfirmTransaction = async (transaction: ParsedTransaction) => {
    try {
      const transactionWithDate = {
        ...transaction,
        date: new Date(),
      };
      await addTransaction(transactionWithDate);
      setShowConfirmation(false);
      setPendingTransaction(null);
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

  const handleCancelTransaction = () => {
    setShowConfirmation(false);
    setPendingTransaction(null);
    setOriginalVoiceText('');
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
        tabBar={(props) => (
          <View style={{
            flexDirection: 'row',
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.cardBorder,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 75,
            paddingBottom: 10,
            paddingTop: 10,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}>
            {/* Home Tab */}
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => props.navigation.navigate('Home')}
            >
              <Icon
                name="home"
                size={24}
                color={props.state.index === 0 ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={{
                fontSize: 12,
                color: props.state.index === 0 ? COLORS.primary : COLORS.textSecondary,
                marginTop: 4,
                fontWeight: '600'
              }}>
                Beranda
              </Text>
            </TouchableOpacity>

            {/* Voice Button */}
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -25,
              }}
              onPress={() => setShowVoiceOverlay(true)}
            >
              <View style={{
                backgroundColor: COLORS.primary,
                borderRadius: 40,
                width: 80,
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 4,
                borderColor: COLORS.surface,
              }}>
                <Icon name="mic" size={36} color={COLORS.surface} />
              </View>
            </TouchableOpacity>

            {/* Stats Tab */}
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => props.navigation.navigate('Stats')}
            >
              <Icon
                name="bar-chart"
                size={24}
                color={props.state.index === 1 ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={{
                fontSize: 12,
                color: props.state.index === 1 ? COLORS.primary : COLORS.textSecondary,
                marginTop: 4,
                fontWeight: '600'
              }}>
                Statistik
              </Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
        />
      </Tab.Navigator>

      {/* Voice Overlay */}
      <VoiceOverlay
        visible={showVoiceOverlay}
        onClose={() => setShowVoiceOverlay(false)}
        onVoiceResult={handleVoiceResult}
      />

      {/* Transaction Confirmation Modal */}
      {pendingTransaction && (
        <TransactionConfirmation
          visible={showConfirmation}
          parsedTransaction={pendingTransaction}
          originalText={originalVoiceText}
          onConfirm={handleConfirmTransaction}
          onCancel={handleCancelTransaction}
        />
      )}
    </View>
  );
};

export default TabNavigator;
