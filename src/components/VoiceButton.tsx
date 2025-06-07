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
  const scaleAnim = new Animated.Value(1);

  const startListening = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to use voice input.');
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

      // Auto-stop after max duration
      setTimeout(() => {
        if (isListening) {
          stopListening();
        }
      }, VOICE_CONFIG.MAX_DURATION);

    } catch (error) {
      console.error('Error starting voice recording:', error);
      Alert.alert('Error', 'Failed to start voice recording. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1);

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
      Alert.alert('Error', 'Failed to process voice recording.');
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
          ? 'Listening... Tap to stop' 
          : 'Tap the microphone button and say something like:'
        }
      </Text>
      
      {!isListening && (
        <View style={styles.examples}>
          <Text style={styles.exampleText}>"Spent $12.50 on lunch"</Text>
          <Text style={styles.exampleText}>"Received $500 salary"</Text>
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 16,
  },
  buttonListening: {
    backgroundColor: COLORS.error,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textSecondary,
    elevation: 2,
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
