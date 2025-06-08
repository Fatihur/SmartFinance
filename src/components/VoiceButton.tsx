import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Voice from '@react-native-voice/voice';
import { COLORS } from '../constants';
import { requestVoicePermissions } from '../utils/permissions';

interface VoiceButtonProps {
  onVoiceResult: (text: string) => void;
  disabled?: boolean;
}

const NUM_BARS = 5;

const VoiceButton: React.FC<VoiceButtonProps> = ({ onVoiceResult, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const scaleAnim = new Animated.Value(1);
  const spectrumAnimations = Array.from({ length: NUM_BARS }, () => new Animated.Value(0));

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestVoicePermissions();
      setHasPermission(granted);
    };

    if (Platform.OS !== 'web') {
      checkPermissions();
      
      Voice.onSpeechStart = () => setIsListening(true);
      Voice.onSpeechEnd = () => setIsListening(false);
      Voice.onSpeechResults = (e: any) => {
        if (e.value && e.value[0]) {
          handleVoiceResult(e.value[0]);
        }
      };
      Voice.onSpeechError = (e: any) => {
        console.error('Speech recognition error:', e);
        Alert.alert('Error', 'Failed to recognize speech. Please try again.');
        setIsListening(false);
        stopAnimation();
      };
    }

    return () => {
      if (Platform.OS !== 'web') {
        Voice.destroy().then(Voice.removeAllListeners);
      }
      stopAnimation();
    };
  }, []);

  const handleVoiceResult = (text: string) => {
    onVoiceResult(text);
    setIsListening(false);
    stopAnimation();
  };

  const startAnimation = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
    animateSpectrum();
  };

  const stopAnimation = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    spectrumAnimations.forEach(anim => anim.setValue(0));
  };

  const animateSpectrum = () => {
    if (!isListening) return;

    const animations = spectrumAnimations.map((anim) => {
      const randomHeight = Math.random() * 0.8 + 0.2;
      return Animated.sequence([
        Animated.timing(anim, {
          toValue: randomHeight,
          duration: 200 + Math.random() * 300,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.2,
          duration: 200 + Math.random() * 300,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      if (isListening) {
        animateSpectrum();
      }
    });
  };

  const startListening = async () => {
    if (!hasPermission && Platform.OS !== 'web') {
      const granted = await requestVoicePermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Microphone permission is required to use voice input.',
          [{ text: 'OK' }]
        );
        return;
      }
      setHasPermission(granted);
    }

    try {
      if (Platform.OS !== 'web') {
        await Voice.start('id-ID');
      }
      setIsListening(true);
      startAnimation();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Error', 'Could not start voice recognition. Please try again.');
    }
  };

  const stopListening = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Voice.stop();
      }
      setIsListening(false);
      stopAnimation();
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.spectrumContainer}>
        {spectrumAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.spectrumBar,
              {
                transform: [
                  { scaleY: anim },
                  { translateY: 20 }, // Offset for bottom alignment
                ],
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          isListening && styles.buttonListening,
          disabled && styles.buttonDisabled,
        ]}
        onPress={toggleListening}
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
          ? 'Mendengarkan... Bicara sekarang!'
          : 'Tekan tombol mikrofon dan katakan sesuatu seperti:'
        }
      </Text>

      {!isListening && (
        <View style={styles.examples}>
          <Text style={styles.exampleText}>"Beli makan siang 25 ribu"</Text>
          <Text style={styles.exampleText}>"Terima gaji 5 juta"</Text>
          {Platform.OS === 'web' ? (
            <Text style={styles.infoText}>
              💡 Voice recognition aktif di browser
            </Text>
          ) : (
            <Text style={styles.infoText}>
              💡 Demo mode - akan generate contoh transaksi
            </Text>
          )}
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
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  spectrumContainer: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  spectrumBar: {
    width: 4,
    height: 40,
    backgroundColor: COLORS.primary,
    marginHorizontal: 2,
    borderRadius: 2,
  },
});

export default VoiceButton;