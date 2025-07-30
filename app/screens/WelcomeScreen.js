import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@clerk/clerk-expo';

const WelcomeScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleLoginPress = () => {
    router.push('/sign-in');
  };

  const handleSignUpPress = () => {
    router.push('/sign-up');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/AutiScan.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>AutiCare</Text>
            <Text style={styles.logoSubtext}>AI Detection</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Hero Section with Gradient Background - Extended to fill screen */}
      <LinearGradient
        colors={['#F8FAFC', '#EFF6FF', '#DBEAFE']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroTitleContainer}>
            <Text style={styles.heroTitle}>
              Autism Spectrum{'\n'}
              <Text style={styles.heroTitleAccent}>Detection</Text>
            </Text>
            <View style={styles.heroDecoration} />
          </View>
          
          <Text style={styles.heroSubtitle}>
            AI-powered screening for early detection and support. 
            Take the first step towards understanding and empowerment.
          </Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleLoginPress}>
            <LinearGradient
              colors={['#1E40AF', '#3B82F6']}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Start Detection</Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.authPrompt}>
            <Text style={styles.authPromptText}>New to AutiScan? </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text style={styles.authLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 10,
    elevation: 8,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 60,
    height: 50,
    borderRadius: 35,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: -2,
  },

  // Hero Section Styles - Extended to fill remaining screen
  heroSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 70,
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitleContainer: {
    alignItems: 'center',
    marginBottom: 80,
    marginTop: 10,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 46,
  },
  heroTitleAccent: {
    color: '#1E40AF',
  },
  heroDecoration: {
    width: 60,
    height: 4,
    backgroundColor: '#1E40AF',
    borderRadius: 2,
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  primaryButton: {
    marginBottom: 28,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  authPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
      marginBottom: 5,
    marginTop: 120,
  },
  authPromptText: {
    fontSize: 16,
    color: '#64748B',
  
  },
  authLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
});

export default WelcomeScreen;