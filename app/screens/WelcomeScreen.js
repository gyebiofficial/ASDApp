import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useRouter } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';

const WelcomeScreen = () => {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('/sign-in');
  };
  const handleSignUpPress = () => {
    router.push('/sign-up');
  };

  return (
    <ImageBackground
      source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/brain.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Centered long white bar with menu icon and auti.jpg */}
      <View style={styles.menuBarContainer}>
        <View style={styles.menuBar}>
          <TouchableOpacity style={styles.menuIconButton}>
            <Entypo name="menu" size={28} color="#1565c0" />
          </TouchableOpacity>
          <View style={styles.menuBarCenter}>
            <Image
              source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/Auti.jpg')}
              style={styles.menuBarLogo}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <View style={styles.overlay}>
        <Text style={styles.welcomeText}>AUTISM SPECTRUM DISORDER DETECTION</Text>
        
        <Text style={styles.subtitle}> Welcome to AutiScan.  
           AutiScan is an Ai-powered app that provides a quick and easy way to screen for autism spectrum disorder (ASD) risk factors.
          It is not a diagnostic tool, but rather a screening tool to help identify potential signs of ASD early on.
          AutiScan is designed to help with the early detection of autism spectrum disorder (ASD) and to provide support resources for families and caregivers.
          Empowering early detection and support for autism spectrum disorder.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLoginPress}
        >
          <Text style={styles.loginButtonText}>Detect</Text>
        </TouchableOpacity>
        <View style={styles.signUpTextContainer}>
          <Text style={styles.signUpPrompt}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUpPress}>
            <Text style={styles.signUpLink}>Click here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 55,
    marginBottom: 10,
    position: 'absolute',
    top: 0,
    zIndex: 20,
  },
  menuBar: {
    width: '80%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    elevation: 6,
    shadowColor: '#1565c0',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: 'flex-start',
    position: 'relative',
  },
  menuIconButton: {
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  menuBarCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  menuBarLogo: {
    width: 90,
    height: 58,
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(74, 144, 226, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontSize: 30,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 70,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Arial',
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: 180,
    marginBottom: 15,
    elevation: 2,
  },
  loginButtonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpPrompt: {
    color: '#fff',
    fontSize: 16,
  },
  signUpLink: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;