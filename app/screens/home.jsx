import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Animated, Dimensions, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import childImg from 'C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/child.png';
import { getAllAssessments, getAllChildren, getUserStats } from '../services/firebaseService';
import AppHeader from '../components/AppHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Home() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // ✅ KEEP ALL HOOKS HERE - Don't move these after early returns
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current;
  const [profileSidebarVisible, setProfileSidebarVisible] = useState(false);
  const profileSidebarAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [daysActive, setDaysActive] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ KEEP ALL useEffect HOOKS HERE
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoaded && user?.id) {
      loadUserData();
    } else if (isLoaded && !user) {
      setAssessmentCount(0);
      setChildrenCount(0);
      setDaysActive(1);
      setLoading(false);
    }
  }, [isLoaded, user?.id]);

  useEffect(() => {
    const unsubscribe = router.addListener?.('focus', () => {
      if (isLoaded && user?.id) {
        loadUserData();
      }
    });
    return unsubscribe;
  }, [router, isLoaded, user?.id]);

  // ✅ DEFINE ALL FUNCTIONS HERE
  const loadUserData = async () => {
    if (!isLoaded) {
      console.log('User not loaded yet, waiting...');
      return;
    }
    
    if (!user?.id) {
      console.log('No user logged in');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading data for user:', user.id);
      
      const stats = await getUserStats(user.id);
      setAssessmentCount(stats.assessmentCount);
      setChildrenCount(stats.childrenCount);
      
      const userCreatedAt = user?.createdAt ? new Date(user.createdAt) : new Date();
      const today = new Date();
      const diffTime = Math.abs(today - userCreatedAt);
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setDaysActive(diffDays);

      console.log(`User ${user.id} stats loaded:`, stats);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setAssessmentCount(0);
      setChildrenCount(0);
      setDaysActive(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/screens/WelcomeScreen');
            } catch (err) {
              Alert.alert('Error', 'Could not sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Sidebar animations
  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -SCREEN_WIDTH * 0.75,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setSidebarVisible(false));
  };

  const openProfileSidebar = () => {
    setProfileSidebarVisible(true);
    Animated.timing(profileSidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeProfileSidebar = () => {
    Animated.timing(profileSidebarAnim, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setProfileSidebarVisible(false));
  };

  const handleSidebarNav = (route) => {
    closeSidebar();
    setTimeout(() => {
      if (route === 'home') router.replace('/screens/home');
      if (route === 'detect') router.replace('/screens/detect');
      if (route === 'about') router.replace('/screens/about');
      if (route === 'chatbot') router.replace('/screens/chatbot');
      if (route === 'dashboard') router.replace('/screens/results');
    }, 300);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // ✅ NOW PUT EARLY RETURNS AFTER ALL HOOKS AND FUNCTIONS
  if (!isLoaded) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={{ marginTop: 16, color: '#64748B' }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 18, color: '#1E293B', textAlign: 'center', marginBottom: 20 }}>
          Please sign in to continue
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#1E40AF',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
          onPress={() => router.replace('/(auth)/sign-in')}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ MAIN COMPONENT JSX GOES HERE
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Replace the existing header with the new component */}
      <AppHeader
        onMenuPress={openSidebar}
        onProfilePress={openProfileSidebar}
        title="AutiCare"
      />

      {/* Profile Sidebar - Update the large avatar too */}
      {profileSidebarVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeProfileSidebar} />
      )}
      <Animated.View style={[styles.profileSidebar, { right: profileSidebarAnim }]}>
        <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.profileSidebarHeader}>
          <Text style={styles.profileSidebarTitle}>Profile</Text>
          <TouchableOpacity onPress={closeProfileSidebar} style={styles.closeButton}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.profileContent}>
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatarLarge}>
              <Feather name="user" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.primaryEmailAddress?.emailAddress || ''}</Text>
          </View>

          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.profileActionButton}
              onPress={() => {
                closeProfileSidebar();
                setTimeout(() => {
                  router.push('/screens/edit-profile');
                }, 300);
              }}>
              <Feather name="edit" size={20} color="#1E40AF" />
              <Text style={styles.profileActionText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.profileActionButton}>
              <Feather name="user-plus" size={20} color="#1E40AF" />
              <Text style={styles.profileActionText}>Manage Accounts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.profileActionButton}
              onPress={() => router.replace('/screens/resources')}>
              <Feather name="help-circle" size={20} color="#1E40AF" />
              <Text style={styles.profileActionText}>Help & Support</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.signOutGradient}>
              <Feather name="log-out" size={20} color="#FFFFFF" />
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Sidebar */}
      {sidebarVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeSidebar} />
      )}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.sidebarHeader}>
          <View style={styles.sidebarTitleContainer}>
            <MaterialIcons name="dashboard" size={24} color="#FFFFFF" />
            <Text style={styles.sidebarTitle}>Navigation</Text>
          </View>
          <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.sidebarContent}>
          {[
            { key: 'home', icon: 'home', label: 'Home', iconLib: Feather },
            { key: 'detect', icon: 'search', label: 'Detection', iconLib: Feather },
            { key: 'dashboard', icon: 'bar-chart-2', label: 'Dashboard', iconLib: Feather },
            { key: 'chatbot', icon: 'message-circle', label: 'Chatbot', iconLib: Feather },
            { key: 'about', icon: 'info', label: 'About', iconLib: Feather },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.sidebarButton}
              onPress={() => handleSidebarNav(item.key)}
            >
              <View style={styles.sidebarIconContainer}>
                <item.iconLib name={item.icon} size={20} color="#1E40AF" />
              </View>
              <Text style={styles.sidebarButtonText}>{item.label}</Text>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Welcome Section */}
          <LinearGradient
            colors={['#F8FAFC', '#EFF6FF']}
            style={styles.welcomeSection}
          >
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.welcomeTitle}>
              {user?.firstName ? `${user.firstName}!` : 'Welcome!'}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Ready to continue your autism detection journey?
            </Text>

            <Image source={childImg} style={styles.childImage} resizeMode="contain" />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace('/screens/detect')}
            >
              <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.buttonGradient}>
                <Text style={styles.primaryButtonText}>Start Assessment</Text>
                <Feather name="arrow-right" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity 
          style={styles.quickActionCard} 
          onPress={() => router.push('/screens/detect')} // Adjust path if needed
         >
      <View style={{ backgroundColor: '#10B981', borderRadius: 10, padding: 10 }}>
        <Entypo name="magnifying-glass" size={24} color="white" />
      </View>
      <Text style={styles.quickActionTitle}>New Assessment</Text>
      <Text style={styles.quickActionSubtitle}>Start detection process</Text>
    </TouchableOpacity>
              {[
                { icon: 'users', title: 'Manage Children', subtitle: 'Add or edit child profiles', color: '#F59E0B', route: '/screens/children' },
                { icon: 'book-open', title: 'Resources', subtitle: 'Educational content', color: '#8B5CF6', route: '/screens/resources' },
                { icon: 'bar-chart-2', title: 'View Results', subtitle: 'Check past assessments', color: '#3B82F6', route: '/screens/results' },
              ].map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionCard}
                  onPress={() => {
                    if (action.route) {
                      router.push(action.route);
                    }
                  }}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                    <Feather name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats Section - Updated with real data */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="check-circle" size={20} color="#1E40AF" />
                </View>
                <Text style={styles.statNumber}>{assessmentCount}</Text>
                <Text style={styles.statLabel}>Assessments{'\n'}Completed</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="calendar" size={20} color="#1E40AF" />
                </View>
                <Text style={styles.statNumber}>{daysActive}</Text>
                <Text style={styles.statLabel}>Days{'\n'}Active</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="users" size={20} color="#1E40AF" />
                </View>
                <Text style={styles.statNumber}>{childrenCount}</Text>
                <Text style={styles.statLabel}>Children{'\n'}Added</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Feather name="clock" size={20} color="#64748B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Welcome to AutiScan!</Text>
                <Text style={styles.activitySubtitle}>
                  You've successfully signed in. Start your first assessment to begin your journey.
                </Text>
                <Text style={styles.activityTime}>Just now</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingBottom: 40,
  },

  // Welcome Section
  welcomeSection: {
    margin: 20,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  childImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 200,
    marginBottom: 32,
  },
  primaryButton: {
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },

  // Sections
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },

  // Recent Activity
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // Profile Sidebar
  profileSidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  profileSidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 24,
  },
  profileSidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  profileActions: {
    paddingVertical: 24,
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  profileActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 16,
  },
  signOutButton: {
    marginTop: 'auto',
    marginBottom: 32,
    borderRadius: 16,
  },
  signOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Main Sidebar
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 24,
  },
  sidebarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sidebarContent: {
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sidebarIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sidebarButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
});