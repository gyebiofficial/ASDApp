import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function About() {
  const router = useRouter();

  // Sidebar state and animation
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const sidebarAnim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;

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
      toValue: SCREEN_WIDTH,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setSidebarVisible(false));
  };

  const handleSidebarNav = (route) => {
    closeSidebar();
    setTimeout(() => {
      if (route === 'home') router.replace('/screens/WelcomeScreen');
      if (route === 'detect') router.replace('/sign-in'); // Change to your detect screen if available
      if (route === 'dashboard') router.replace('/sign-in'); // Change to your dashboard screen if available
      if (route === 'about') router.replace('/screens/about');
      if (route === 'sign-in') router.replace('/sign-in');
    }, 250);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/autism.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Sidebar Overlay */}
        {sidebarVisible && (
          <TouchableOpacity style={styles.sidebarOverlay} activeOpacity={1} onPress={closeSidebar} />
        )}
        {/* Sidebar */}
        <Animated.View style={[styles.sidebar, { right: sidebarAnim }]}>
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
            <Entypo name="bar-graph" size={22} color="#1565c0" style={styles.sidebarIcon} />
            <Text style={styles.sidebarButtonText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('about')}>
            <Entypo name="info" size={22} color="#1565c0" style={styles.sidebarIcon} />
            <Text style={styles.sidebarButtonText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('sign-in')}>
            <Entypo name="login" size={22} color="#1565c0" style={styles.sidebarIcon} />
            <Text style={styles.sidebarButtonText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Menu Bar Header */}
        <View style={styles.menuBarHeader}>
          <Image
            source={require('../../assets/images/Auti1.png')}
            style={styles.menuBarLogo}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.iconButton} onPress={openSidebar}>
            <Entypo name="menu" size={28} color="#1565c0" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>About Autism Spectrum Disorder (ASD)</Text>
          <Text style={styles.sectionText}>
            Autism Spectrum Disorder (ASD) is a developmental condition that affects how a person communicates, interacts, and experiences the world. People with ASD may have unique strengths and face challenges in social skills, repetitive behaviors, speech, and nonverbal communication.
          </Text>
          <Text style={styles.sectionText}>
            Early detection and support can make a significant difference in the lives of individuals with autism and their families. Understanding and acceptance are key to helping people with ASD thrive.
          </Text>

          <Text style={styles.subtitle}>What is AutiScan?</Text>
          <Text style={styles.sectionText}>
            <Text style={{fontWeight: 'bold'}}>AutiScan</Text> is an AI-powered app designed to help with the early screening of autism spectrum disorder (ASD) risk factors. Our goal is to empower families, caregivers, and individuals by providing:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Quick and easy ASD screening tools</Text>
            <Text style={styles.bulletItem}>• Personalized dashboard for tracking progress</Text>
            <Text style={styles.bulletItem}>• Access to educational resources and articles</Text>
            <Text style={styles.bulletItem}>• Secure profile management</Text>
            <Text style={styles.bulletItem}>• History of previous screenings</Text>
          </View>
          <Text style={styles.sectionText}>
            <Text style={{fontWeight: 'bold', color: '#e65100'}}>Note:</Text> AutiScan is a screening tool, not a diagnostic tool. For a formal diagnosis, please consult a qualified healthcare professional.
          </Text>
          <Text style={styles.footerText}>© 2025 AutiScan | Empowering Early Detection</Text>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(74, 144, 226, 0.75)',
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  menuBarHeader: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 20, // Increased from 10 to 30 for more space from the top
    paddingBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e3eaf2',
    elevation: 6,
    shadowColor: '#1565c0',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  menuBarLogo: {
    width: 120,
    height: 50,
    alignSelf: 'center',
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 50,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
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
    shadowOffset: { width: -2, height: 0 },
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
  container: {
    padding: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 14,
    textAlign: 'left',
    lineHeight: 22,
  },
  bulletList: {
    marginLeft: 12,
    marginBottom: 16,
  },
  bulletItem: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
    lineHeight: 22,
  },
  footerText: {
    marginTop: 30,
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
  }
});
