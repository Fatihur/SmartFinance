import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';
import { COLORS } from '../constants';

// Import Voice for React Native (mobile platforms)
let Voice: any = null;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-voice/voice').default;
  } catch (error) {
    console.log('Voice package not available:', error);
  }
}

interface VoiceOverlayProps {
  visible: boolean;
  onClose: () => void;
  onVoiceResult: (text: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ visible, onClose, onVoiceResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  
  const pulseAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Initialize speech recognition for web
    if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'id-ID';
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscription(finalTranscript + interimTranscript);
        
        if (finalTranscript) {
          onVoiceResult(finalTranscript);
          handleClose();
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        handleClose();
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      setTranscription('');
      startRecording();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      stopRecording();
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscription('');

      if (Platform.OS === 'web' && recognition) {
        recognition.start();
      } else if (Voice) {
        // Mobile speech recognition using react-native-voice
        try {
          // Setup Voice listeners
          Voice.onSpeechStart = () => {
            console.log('Speech started');
            setTranscription('Mendengarkan...');
          };

          Voice.onSpeechPartialResults = (event: any) => {
            if (event.value && event.value.length > 0) {
              setTranscription(event.value[0]);
            }
          };

          Voice.onSpeechResults = (event: any) => {
            if (event.value && event.value.length > 0) {
              const result = event.value[0];
              setTranscription(result);
              onVoiceResult(result);
              handleClose();
            }
          };

          Voice.onSpeechError = (error: any) => {
            console.error('Speech recognition error:', error);
            setTranscription('Error dalam pengenalan suara');
            setTimeout(() => handleClose(), 2000);
          };

          // Start speech recognition
          await Voice.start('id-ID'); // Indonesian language

          // Auto-stop after 10 seconds
          setTimeout(() => {
            if (isRecording) {
              Voice.stop();
            }
          }, 10000);

        } catch (error) {
          console.error('Error starting voice recognition:', error);
          setTranscription('Voice recognition tidak tersedia');
          setTimeout(() => handleClose(), 2000);
        }
      } else {
        // Fallback for platforms without voice support
        setTranscription('Voice recognition tidak didukung pada platform ini');
        setTimeout(() => handleClose(), 2000);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      handleClose();
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);

      if (Platform.OS === 'web' && recognition) {
        recognition.stop();
      } else if (Voice) {
        // Stop voice recognition
        await Voice.stop();
        await Voice.destroy();
      } else if (recording) {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: false,
        });
        setRecording(null);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handleClose = () => {
    stopRecording();
    setTranscription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Voice Input</Text>
            <Text style={styles.subtitle}>
              {isRecording ? 'Mendengarkan...' : 'Tahan tombol untuk bicara'}
            </Text>
          </View>

          <View style={styles.recordingArea}>
            <Animated.View style={[styles.micButton, { transform: [{ scale: pulseAnim }] }]}>
              <Icon 
                name={isRecording ? 'mic' : 'mic-none'} 
                size={48} 
                color={COLORS.surface} 
              />
            </Animated.View>
            
            {isRecording && (
              <View style={styles.waveContainer}>
                <View style={styles.wave} />
                <View style={[styles.wave, styles.wave2]} />
                <View style={[styles.wave, styles.wave3]} />
              </View>
            )}
          </View>

          <View style={styles.transcriptionArea}>
            <Text style={styles.transcriptionLabel}>Transcription:</Text>
            <Text style={styles.transcriptionText}>
              {transcription || 'Mulai bicara...'}
            </Text>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              {Platform.OS === 'web'
                ? 'Bicara dengan jelas dalam bahasa Indonesia'
                : 'Bicara dengan jelas - recording akan berhenti otomatis'
              }
            </Text>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: screenWidth * 0.9,
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  recordingArea: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.3,
  },
  wave2: {
    width: 130,
    height: 130,
    borderRadius: 65,
    opacity: 0.2,
  },
  wave3: {
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.1,
  },
  transcriptionArea: {
    width: '100%',
    marginBottom: 24,
  },
  transcriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    minHeight: 48,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  instructions: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default VoiceOverlay;
