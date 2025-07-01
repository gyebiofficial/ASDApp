import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, ScrollView } from 'react-native';
import { useRouter } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

const SCREEN_WIDTH = Dimensions.get('window').width;

const WelcomeScreen = () => {
  const router = useRouter();

  // Sidebar state and animation
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.7)).current;

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -SCREEN_WIDTH * 0.7,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setSidebarVisible(false));
  };

  const handleSidebarNav = (route) => {
    closeSidebar();
    setTimeout(() => {
      if (route === 'home') router.replace('/screens/home');
      if (route === 'detect') router.replace('/screens/home'); // Change to your detect screen if available
      if (route === 'dashboard') router.replace('/screens/home'); // Change to your dashboard screen if available
      if (route === 'about') router.replace('/screens/about');
      if (route === 'sign-in') router.replace('/sign-in');
    }, 250);
  };

  const handleLoginPress = () => {
    router.push('/sign-in');
  };
  const handleSignUpPress = () => {
    router.push('/sign-up');
  };

  return (
    <View style={styles.background}>
      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <TouchableOpacity style={styles.sidebarOverlay} activeOpacity={1} onPress={closeSidebar} />
      )}
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity onPress={closeSidebar}>
            <Entypo name="cross" size={28} color="#1565c0" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('home')}>
          <Entypo name="home" size={22} color="#1565c0" style={styles.sidebarIcon} />
          <Text style={styles.sidebarButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('detect')}>
          <Entypo name="magnifying-glass" size={22} color="#1565c0" style={styles.sidebarIcon} />
          <Text style={styles.sidebarButtonText}>Detect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('dashboard')}>
          <AntDesign name="dashboard" size={22} color="#1565c0" style={styles.sidebarIcon} />
          <Text style={styles.sidebarButtonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('about')}>
          <Entypo name="info" size={22} color="#1565c0" style={styles.sidebarIcon} />
          <Text style={styles.sidebarButtonText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('sign-in')}>
          <AntDesign name="login" size={22} color="#1565c0" style={styles.sidebarIcon} />
          <Text style={styles.sidebarButtonText}>Sign In</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/Auti.jpg')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <View style={{ width: 28 }} /> {/* Placeholder for symmetry */}
        <TouchableOpacity style={styles.menuIconButton} onPress={openSidebar}>
          <Entypo name="menu" size={28} color="#1565c0" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.welcomeText}>AUTISM SPECTRUM DISORDER DETECTION</Text>
          <Text style={styles.subtitle}>
            Welcome to <Text style={{ color: '#1565c0', fontWeight: 'bold' }}>AutiScan</Text>
            . An AI-powered app for quick ASD risk screening and early support. Start your journey to understanding and empowerment.
          </Text>
          <TouchableOpacity
            style={styles.detectButton}
            onPress={handleLoginPress}
          >
            <Text style={styles.detectButtonText}>Detect</Text>
          </TouchableOpacity>
          <View style={styles.signUpTextContainer}>
            <Text style={styles.signUpPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text style={styles.signUpLink}>Click here</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>App Features</Text>
          <View style={styles.featureContainer}>
            <AntDesign name="checkcircleo" size={28} color="#1565c0" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Quick ASD Screening</Text>
              <Text style={styles.featureDesc}>Answer a few questions and get instant risk feedback powered by AI.</Text>
            </View>
          </View>
          <View style={styles.featureContainer}>
            <AntDesign name="dashboard" size={28} color="#1565c0" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Personal Dashboard</Text>
              <Text style={styles.featureDesc}>Track your screening history and progress over time.</Text>
            </View>
          </View>
          <View style={styles.featureContainer}>
            <Entypo name="book" size={28} color="#1565c0" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Educational Resources</Text>
              <Text style={styles.featureDesc}>Access articles and tips about autism spectrum disorder and support.</Text>
            </View>
          </View>
          <View style={styles.featureContainer}>
            <AntDesign name="lock" size={28} color="#1565c0" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Secure & Private</Text>
              <Text style={styles.featureDesc}>Your data is protected and confidential at all times.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 120,
    alignItems: 'center',
    width: '100%',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  featuresSection: {
    width: '92%',
    backgroundColor: '#f6f8fc',
    borderRadius: 18,
    padding: 22,
    marginTop: 18,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#1565c0',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#e3eaf2',
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  featureContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 18, // increased from 14
    padding: 22,      // increased from 16
    marginBottom: 18, // increased from 14
    elevation: 3,     // increased from 2
    shadowColor: '#1565c0',
    shadowOpacity: 0.10, // increased from 0.08
    shadowRadius: 10,    // increased from 6
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#e3eaf2',
  },
  featureIcon: {
    marginRight: 18,
    marginTop: 2,
    backgroundColor: '#e3eaf2',
    borderRadius: 8,
    padding: 6,
  },
  featureTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  featureDesc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 0,
    lineHeight: 21,
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 50,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 100,
    paddingTop: 60,
    paddingHorizontal: 18,
    elevation: 10,
    shadowColor: '#1565c0',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 2, height: 0 },
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  sidebarIcon: {
    marginRight: 14,
  },
  sidebarButtonText: {
    fontSize: 17,
    color: '#1565c0',
    fontWeight: '600',
  },
  header: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    elevation: 6,
    shadowColor: '#1565c0',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderBottomWidth: 1,
    borderBottomColor: '#e3eaf2',
    zIndex: 30,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerLogo: {
    width: 120,
    height: 70,
  },
  menuIconButton: {
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  welcomeText: {
    fontSize: 46,
    fontWeight: 'bold',
    color: 'rgb(87, 9, 243)',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 5,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 17,
    color: '#333',
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  detectButton: {
    backgroundColor: '#1565c0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: 180,
    marginBottom: 18,
    elevation: 2,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 20,
    justifyContent: 'center',
  },
  signUpPrompt: {
    color: '#1565c0',
    fontSize: 16,
  },
  signUpLink: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
});

export default WelcomeScreen;