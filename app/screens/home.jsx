import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Animated, Dimensions, Platform, StatusBar } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import childImg from 'C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/child.png';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // Sidebar for main menu (left)
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH * 0.7)).current;

  // Sidebar for profile (right)
  const [profileSidebarVisible, setProfileSidebarVisible] = useState(false);
  const profileSidebarAnim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Signed out', 'You have been signed out successfully.');
      router.replace('/sign-in');
    } catch (err) {
      Alert.alert('Error', 'Could not sign out. Please try again.');
    }
  };

  // Open/close main menu sidebar
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

  // Open/close profile sidebar
  const openProfileSidebar = () => {
    setProfileSidebarVisible(true);
    Animated.timing(profileSidebarAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };
  const closeProfileSidebar = () => {
    Animated.timing(profileSidebarAnim, {
      toValue: -SCREEN_WIDTH * 0.7,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setProfileSidebarVisible(false));
  };

  const handleSidebarNav = (route) => {
    closeSidebar();
    setTimeout(() => {
      if (route === 'home') router.replace('/screens/home');
      if (route === 'detect') Alert.alert('Detect', 'Detection feature coming soon!');
      if (route === 'about') router.replace('/screens/about');
      if (route === 'dashboard') Alert.alert('Dashboard', 'Dashboard coming soon!');
    }, 250);
  };

  return (
    <View style={styles.root}>
      {/* Menu Bar Header */}
      <View style={styles.menuBarHeader}>
        <View style={styles.menuBar}>
          <Image
            source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/Auti1.png')}
            style={styles.menuBarLogo}
            resizeMode="contain"
          />
          <View style={styles.menuBarIconsRight}>
            <TouchableOpacity style={styles.iconButton} onPress={openSidebar}>
              <Entypo name="menu" size={28} color="#1565c0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={openProfileSidebar}>
              <AntDesign name="user" size={24} color="#1565c0" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Sidebar Overlay */}
      {sidebarVisible && (
        <TouchableOpacity style={styles.sidebarOverlay} activeOpacity={1} onPress={closeSidebar} />
      )}
      {/* Main Sidebar (left) */}
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
      </Animated.View>

      {/* Profile Sidebar Overlay */}
      {profileSidebarVisible && (
        <TouchableOpacity style={styles.profileSidebarOverlay} activeOpacity={1} onPress={closeProfileSidebar} />
      )}
      {/* Profile Sidebar (right) */}
      <Animated.View style={[styles.profileSidebar, { right: profileSidebarAnim }]}>
        <View style={styles.profileSidebarHeader}>
          <Text style={styles.profileSidebarTitle}>Profile</Text>
          <TouchableOpacity onPress={closeProfileSidebar}>
            <Entypo name="cross" size={28} color="#1565c0" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <AntDesign name="user" size={48} color="#1565c0" style={{ marginBottom: 10 }} />
          <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.primaryEmailAddress?.emailAddress || ''}</Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>
            Welcome{user?.firstName ? `, ${user.firstName}` : ''}!
          </Text>
          {user?.fullName && (
            <Text style={styles.userNameText}>
              Signed in as: {user.fullName}
            </Text>
          )}
          <Text style={styles.subtitle}>
            Empowering early detection and support for autism spectrum disorder.
          </Text>
          <Image
            source={childImg}
            style={styles.childImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.detectButton}
            onPress={() => Alert.alert('Detect', 'Detection feature coming soon!')}
          >
            <Text style={styles.detectButtonText}>Start Detection</Text>
          </TouchableOpacity>
        </View>

       
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Autism Detection App</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f6f8fc',
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
  // Profile Sidebar Styles
  profileSidebarOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 50,
  },
  profileSidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 101,
    paddingTop: 60,
    paddingHorizontal: 18,
    elevation: 10,
    shadowColor: '#1565c0',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: -2, height: 0 },
    alignItems: 'center',
  },
  profileSidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  profileSidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
  },
  menuBarHeader: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#e3eaf2',
    elevation: 6,
    shadowColor: '#1565c0',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 16, // Add friendly top padding
    paddingBottom: 8, // Add bottom padding for breathing room
    height: undefined, // Remove fixed height for flexibility
  },
  menuBar: {
    width: '92%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBarLogo: {
    width: 100,
    height: 58,
  },
  menuBarIconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  container: {
    alignItems: 'center',
    paddingTop: 110,
    paddingBottom: 30,
    minHeight: '100%',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '90%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  signOutButton: {
    backgroundColor: '#1565c0',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
    elevation: 2,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#1565c0',
    fontSize: 15,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 16,
    color: '#1565c0',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  childImage: {
    width: 480,
    height: 300,
    marginVertical: 18,
    alignSelf: 'center',
  },
  detectButton: {
    backgroundColor: '#1565c0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 70,
    elevation: 2,
    alignSelf: 'center',
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});