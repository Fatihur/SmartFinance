import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { COLORS, VOICE_CONFIG } from '../constants';

interface VoiceButtonProps {
  onVoiceResult: (text: string) => void;
  disabled?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ onVoiceResult, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(3);
  const scaleAnim = new Animated.Value(1);

  const startListening = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Mohon berikan izin mikrofon untuk menggunakan input suara.');
        return;
      }

      setIsListening(true);
      
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);

      // Start countdown
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            stopListening();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Auto-stop after 3 seconds of silence
      const timer = setTimeout(() => {
        clearInterval(countdownInterval);
        if (isListening) {
          stopListening();
        }
      }, 3000); // 3 seconds
      setSilenceTimer(timer);

    } catch (error) {
      console.error('Error starting voice recording:', error);
      Alert.alert('Kesalahan', 'Gagal memulai perekaman suara. Silakan coba lagi.');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1);

      // Clear silence timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        setSilenceTimer(null);
      }

      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);

        // For demo purposes, we'll simulate voice-to-text
        // In a real app, you would use a speech-to-text service
        simulateVoiceToText();
      }
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      Alert.alert('Kesalahan', 'Gagal memproses perekaman suara.');
    }
  };

  const simulateVoiceToText = () => {
    // This is a simulation. In a real app, you would:
    // 1. Send the audio file to a speech-to-text service
    // 2. Get the transcribed text back
    // 3. Call onVoiceResult with the text
    
    const sampleTexts = [
      'Saya beli kopi 25 ribu',
      'Bayar bensin 50000',
      'Terima gaji 5 juta',
      'Beli makan siang 30 ribu',
      'Dapat bonus 1 juta',
    ];
    
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    
    setTimeout(() => {
      onVoiceResult(randomText);
    }, 1000);
  };

  const handlePress = () => {
    if (disabled) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isListening && styles.buttonListening,
          disabled && styles.buttonDisabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Icon
            name={isListening ? 'mic' : 'mic-none'}
            size={32}
            color={COLORS.surface}
          />
        </Animated.View>
      </TouchableOpacity>
      
      <Text style={styles.instruction}>
        {isListening
          ? `Mendengarkan... ${countdown}s`
          : 'Tekan tombol mikrofon dan katakan sesuatu seperti:'
        }
      </Text>

      {!isListening && (
        <View style={styles.examples}>
          <Text style={styles.exampleText}>"Beli makan siang 25 ribu"</Text>
          <Text style={styles.exampleText}>"Terima gaji 5 juta"</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonListening: {
    backgroundColor: COLORS.error,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  instruction: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  examples: {
    alignItems: 'center',
  },
  exampleText: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
    marginVertical: 2,
  },
});

export default VoiceButton;
