import { Alert } from 'react-native';

export const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  
  if (error.code === 'unavailable') {
    Alert.alert(
      'Network Error',
      'Unable to connect to the server. Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  } else if (error.code === 'permission-denied') {
    Alert.alert(
      'Permission Error',
      'You do not have permission to perform this action.',
      [{ text: 'OK' }]
    );
  } else if (error.code === 'not-found') {
    Alert.alert(
      'Not Found',
      'The requested data was not found.',
      [{ text: 'OK' }]
    );
  } else if (error.code === 'already-exists') {
    Alert.alert(
      'Already Exists',
      'This data already exists.',
      [{ text: 'OK' }]
    );
  } else {
    Alert.alert(
      'Error',
      'An unexpected error occurred. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

export const checkNetworkConnection = () => {
  // You can add network checking logic here if needed
  return true;
};