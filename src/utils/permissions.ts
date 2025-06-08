import { Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestVoicePermissions = async () => {
  if (Platform.OS === 'web') {
    return true;
  }

  const permission = Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.MICROPHONE 
    : PERMISSIONS.ANDROID.RECORD_AUDIO;

  try {
    const result = await check(permission);
    
    if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    }

    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error checking/requesting permissions:', error);
    return false;
  }
};
