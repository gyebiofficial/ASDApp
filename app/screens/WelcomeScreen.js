// import React, { useState, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, ScrollView } from 'react-native';
// import { useRouter } from "expo-router";
// import Entypo from '@expo/vector-icons/Entypo';
// import AntDesign from '@expo/vector-icons/AntDesign';

// const SCREEN_WIDTH = Dimensions.get('window').width;

// const WelcomeScreen = () => {
//   const router = useRouter();

//   // Sidebar state and animation
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const sidebarAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.7)).current;

//   const openSidebar = () => {
//     setSidebarVisible(true);
//     Animated.timing(sidebarAnim, {
//       toValue: 0,
//       duration: 250,
//       useNativeDriver: false,
//     }).start();
//   };

//   const closeSidebar = () => {
//     Animated.timing(sidebarAnim, {
//       toValue: -SCREEN_WIDTH * 0.7,
//       duration: 200,
//       useNativeDriver: false,
//     }).start(() => setSidebarVisible(false));
//   };

//   const handleSidebarNav = (route) => {
//     closeSidebar();
//     setTimeout(() => {
//       if (route === 'home') router.replace('/screens/home');
//       if (route === 'detect') router.replace('/screens/home'); // Change to your detect screen if available
//       if (route === 'dashboard') router.replace('/screens/home'); // Change to your dashboard screen if available
//       if (route === 'about') router.replace('/screens/about');
//       if (route === 'sign-in') router.replace('/sign-in');
//     }, 250);
//   };

//   const handleLoginPress = () => {
//     router.push('/sign-in');
//   };
//   const handleSignUpPress = () => {
//     router.push('/sign-up');
//   };

//   return (
//     <View style={styles.background}>
//       {/* Sidebar Overlay */}
//       {sidebarVisible && (
//         <TouchableOpacity style={styles.sidebarOverlay} activeOpacity={1} onPress={closeSidebar} />
//       )}
//       {/* Sidebar */}
//       <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
//         <View style={styles.sidebarHeader}>
//           <Text style={styles.sidebarTitle}>Menu</Text>
//           <TouchableOpacity onPress={closeSidebar}>
//             <Entypo name="cross" size={28} color="#1565c0" />
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('home')}>
//           <Entypo name="home" size={22} color="#1565c0" style={styles.sidebarIcon} />
//           <Text style={styles.sidebarButtonText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('detect')}>
//           <Entypo name="magnifying-glass" size={22} color="#1565c0" style={styles.sidebarIcon} />
//           <Text style={styles.sidebarButtonText}>Detect</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('dashboard')}>
//           <AntDesign name="dashboard" size={22} color="#1565c0" style={styles.sidebarIcon} />
//           <Text style={styles.sidebarButtonText}>Dashboard</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('about')}>
//           <Entypo name="info" size={22} color="#1565c0" style={styles.sidebarIcon} />
//           <Text style={styles.sidebarButtonText}>About</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.sidebarButton} onPress={() => handleSidebarNav('sign-in')}>
//           <AntDesign name="login" size={22} color="#1565c0" style={styles.sidebarIcon} />
//           <Text style={styles.sidebarButtonText}>Sign In</Text>
//         </TouchableOpacity>
//       </Animated.View>

//       {/* Header */}
//       <View style={styles.header}>
//         <Image
//           source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/Auti.jpg')}
//           style={styles.headerLogo}
//           resizeMode="contain"
//         />
//         <View style={{ width: 28 }} /> {/* Placeholder for symmetry */}
//         <TouchableOpacity style={styles.menuIconButton} onPress={openSidebar}>
//           <Entypo name="menu" size={28} color="#1565c0" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.content}>
//           <Text style={styles.welcomeText}>AUTISM SPECTRUM DISORDER DETECTION</Text>
//           <Text style={styles.subtitle}>
//             Welcome to <Text style={{ color: '#1565c0', fontWeight: 'bold' }}>AutiScan</Text>
//             . An AI-powered app for quick ASD risk screening and early support. Start your journey to understanding and empowerment.
//           </Text>
//           <TouchableOpacity
//             style={styles.detectButton}
//             onPress={handleLoginPress}
//           >
//             <Text style={styles.detectButtonText}>Detect</Text>
//           </TouchableOpacity>
//           <View style={styles.signUpTextContainer}>
//             <Text style={styles.signUpPrompt}>Don't have an account? </Text>
//             <TouchableOpacity onPress={handleSignUpPress}>
//               <Text style={styles.signUpLink}>Click here</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Features Section */}
//         <View style={styles.featuresSection}>
//           <Text style={styles.featuresTitle}>App Features</Text>
//           <View style={styles.featureContainer}>
//             <AntDesign name="checkcircleo" size={28} color="#1565c0" style={styles.featureIcon} />
//             <View style={styles.featureTextContainer}>
//               <Text style={styles.featureTitle}>Quick ASD Screening</Text>
//               <Text style={styles.featureDesc}>Answer a few questions and get instant risk feedback powered by AI.</Text>
//             </View>
//           </View>
//           <View style={styles.featureContainer}>
//             <AntDesign name="dashboard" size={28} color="#1565c0" style={styles.featureIcon} />
//             <View style={styles.featureTextContainer}>
//               <Text style={styles.featureTitle}>Personal Dashboard</Text>
//               <Text style={styles.featureDesc}>Track your screening history and progress over time.</Text>
//             </View>
//           </View>
//           <View style={styles.featureContainer}>
//             <Entypo name="book" size={28} color="#1565c0" style={styles.featureIcon} />
//             <View style={styles.featureTextContainer}>
//               <Text style={styles.featureTitle}>Educational Resources</Text>
//               <Text style={styles.featureDesc}>Access articles and tips about autism spectrum disorder and support.</Text>
//             </View>
//           </View>
//           <View style={styles.featureContainer}>
//             <AntDesign name="lock" size={28} color="#1565c0" style={styles.featureIcon} />
//             <View style={styles.featureTextContainer}>
//               <Text style={styles.featureTitle}>Secure & Private</Text>
//               <Text style={styles.featureDesc}>Your data is protected and confidential at all times.</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#fff',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   scrollContent: {
//     paddingBottom: 40,
//     paddingTop: 120,
//     alignItems: 'center',
//     width: '100%',
//   },
//   content: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//     marginBottom: 10,
//   },
//   featuresSection: {
//     width: '92%',
//     backgroundColor: '#f6f8fc',
//     borderRadius: 18,
//     padding: 22,
//     marginTop: 18,
//     marginBottom: 30,
//     elevation: 3,
//     shadowColor: '#1565c0',
//     shadowOpacity: 0.10,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 3 },
//     borderWidth: 1,
//     borderColor: '#e3eaf2',
//   },
//   featuresTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1565c0',
//     marginBottom: 18,
//     textAlign: 'center',
//     letterSpacing: 0.7,
//     textTransform: 'uppercase',
//   },
//   featureContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     height: 80,
//     alignItems: 'flex-start',
//     backgroundColor: '#fff',
//     borderRadius: 18, // increased from 14
//     padding: 22,      // increased from 16
//     marginBottom: 18, // increased from 14
//     elevation: 3,     // increased from 2
//     shadowColor: '#1565c0',
//     shadowOpacity: 0.10, // increased from 0.08
//     shadowRadius: 10,    // increased from 6
//     shadowOffset: { width: 0, height: 3 },
//     borderWidth: 1,
//     borderColor: '#e3eaf2',
//   },
//   featureIcon: {
//     marginRight: 18,
//     marginTop: 2,
//     backgroundColor: '#e3eaf2',
//     borderRadius: 8,
//     padding: 6,
//     width: 40,
//     height: 40,
//   },
//   featureTextContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     width: '100%',
//     paddingRight: 10,
//     paddingLeft: 10,  
//     paddingTop: 2,
//     paddingBottom: 2,
//     marginLeft: 10,
//     marginRight: 10,
//     height: '100%',
//     alignItems: 'flex-start',
//   },
//   featureTitle: {
//     fontSize: 17,
//     fontWeight: 'bold',
//     color: '#1565c0',
//     marginBottom: 4,
//     letterSpacing: 0.2,
//   },
//   featureDesc: {
//     fontSize: 15,
//     color: '#444',
//     marginBottom: 0,
//     lineHeight: 31,
//   },
//   sidebarOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.25)',
//     zIndex: 50,
//   },
//   sidebar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '70%',
//     height: '100%',
//     backgroundColor: '#fff',
//     zIndex: 100,
//     paddingTop: 60,
//     paddingHorizontal: 18,
//     elevation: 10,
//     shadowColor: '#1565c0',
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     shadowOffset: { width: 2, height: 0 },
//   },
//   sidebarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   sidebarTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1565c0',
//   },
//   sidebarButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   sidebarIcon: {
//     marginRight: 14,
//   },
//   sidebarButtonText: {
//     fontSize: 17,
//     color: '#1565c0',
//     fontWeight: '600',
//   },
//   header: {
//     width: '100%',
//     height: 80,
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 18,
//     paddingTop: 10,
//     elevation: 6,
//     shadowColor: '#1565c0',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     borderBottomWidth: 1,
//     borderBottomColor: '#e3eaf2',
//     zIndex: 30,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   headerLogo: {
//     width: 120,
//     height: 70,
//   },
//   menuIconButton: {
//     padding: 8,
//     borderRadius: 20,
//     zIndex: 2,
//   },
//   welcomeText: {
//     fontSize: 46,
//     fontWeight: 'bold',
//     color: 'rgb(87, 9, 243)',
//     textAlign: 'center',
//     marginBottom: 18,
//     marginTop: 5,
//     letterSpacing: 0.5,
//     textShadowColor: 'rgba(0, 0, 0, 0)',
//     textShadowOffset: { width: 1, height: 2 },
//     textShadowRadius: 2,
//   },
//   subtitle: {
//     fontSize: 17,
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 18,
//     paddingHorizontal: 10,
//     lineHeight: 24,
//   },
//   detectButton: {
//     backgroundColor: '#1565c0',
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     width: 180,
//     marginBottom: 18,
//     elevation: 2,
//   },
//   detectButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   signUpTextContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 1,
//     marginBottom: 20,
//     justifyContent: 'center',
//   },
//   signUpPrompt: {
//     color: '#1565c0',
//     fontSize: 16,
//   },
//   signUpLink: {
//     color: '#1B5E20',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textDecorationLine: 'underline',
//     marginLeft: 4,
//   },
// });

// export default WelcomeScreen;



import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, ScrollView, StatusBar } from 'react-native';
import { useRouter } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;

const WelcomeScreen = () => {
  const router = useRouter();
  
  // Sidebar state and animation
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: -SCREEN_WIDTH * 0.75,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => setSidebarVisible(false));
  };

  const handleSidebarNav = (route) => {
    closeSidebar();
    setTimeout(() => {
      if (route === 'home') router.replace('/screens/WelcomeScreen');
      if (route === 'detect') router.replace('/sign-in'); // Change to your detect screen if available
      if (route === 'dashboard') router.replace('/sign-in'); // Change to your dashboard screen if available
      if (route === 'about') router.replace('/screens/AboutScreen');
      if (route === 'sign-in') router.replace('/sign-in');
    }, 300);
  };

  const handleLoginPress = () => {
    router.push('/sign-in');
  };

  const handleSignUpPress = () => {
    router.push('/sign-up');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <Animated.View style={[styles.sidebarOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.overlayTouchable} 
            activeOpacity={1} 
            onPress={closeSidebar} 
          />
        </Animated.View>
      )}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          style={styles.sidebarGradient}
        >
          <View style={styles.sidebarHeader}>
            <View style={styles.sidebarTitleContainer}>
              <View style={styles.sidebarIconWrapper}>
                <MaterialIcons name="menu-open" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.sidebarTitle}>Navigation</Text>
            </View>
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.sidebarContent}>
          {[
            { key: 'home', icon: 'home', label: 'Home', iconLib: Feather },
            { key: 'detect', icon: 'search', label: 'Detect', iconLib: Feather },
            { key: 'dashboard', icon: 'bar-chart-2', label: 'Dashboard', iconLib: Feather },
            { key: 'about', icon: 'info', label: 'About', iconLib: Feather },
            { key: 'sign-in', icon: 'log-in', label: 'Sign In', iconLib: Feather },
          ].map((item, index) => (
            <TouchableOpacity 
              key={item.key}
              style={[styles.sidebarButton, { 
                transform: [{ 
                  translateX: sidebarVisible ? 0 : -50 
                }] 
              }]} 
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

      {/* Header with Gradient */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.menuButton} onPress={openSidebar}>
          <Feather name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image
            source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/AutiScan.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>AutiScan</Text>
            <Text style={styles.logoSubtext}>AI Detection</Text>
          </View>
        </View>
        
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Gradient Background */}
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

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Why Choose AutiScan?</Text>
            <View style={styles.titleUnderline} />
          </View>
          <Text style={styles.sectionSubtitle}>
            Comprehensive tools designed for accurate screening and ongoing support
          </Text>

          <View style={styles.featuresGrid}>
            {[
              {
                icon: 'check-circle',
                title: 'Quick Screening',
                description: 'Complete assessment in minutes with AI-powered analysis',
                color: '#10B981',
                gradient: ['#10B981', '#059669']
              },
              {
                icon: 'trending-up',
                title: 'Progress Tracking',
                description: 'Monitor development and track improvements over time',
                color: '#3B82F6',
                gradient: ['#3B82F6', '#1D4ED8']
              },
              {
                icon: 'book-open',
                title: 'Expert Resources',
                description: 'Access curated educational content and professional guidance',
                color: '#8B5CF6',
                gradient: ['#8B5CF6', '#7C3AED']
              },
              {
                icon: 'shield',
                title: 'Privacy First',
                description: 'Your data is encrypted and completely confidential',
                color: '#EF4444',
                gradient: ['#EF4444', '#DC2626']
              }
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <LinearGradient
                  colors={feature.gradient}
                  style={styles.featureIconContainer}
                >
                  <Feather name={feature.icon} size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Enhanced Stats Section */}
        {/* <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          style={styles.statsSection}
        >
          <Text style={styles.statsTitle}>Trusted by Thousands</Text>
          <View style={styles.statsGrid}>
            {[
              { number: '10K+', label: 'Screenings Completed', icon: 'users' },
              { number: '95%', label: 'Accuracy Rate', icon: 'target' },
              { number: '24/7', label: 'Available Support', icon: 'clock' }
            ].map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name={stat.icon} size={20} color="#1E40AF" />
                </View>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient> */}

        {/* Call to Action Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of families who trust AutiScan for early detection and support
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUpPress}>
            <Text style={styles.secondaryButtonText}>Get Started Today</Text>
            <Feather name="arrow-right" size={18} color="#1E40AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Sidebar Styles
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 50,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  sidebarGradient: {
    paddingTop: 60,
    borderTopRightRadius: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sidebarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
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
    width: 44,
    height: 44,
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

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  
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
  headerSpacer: {
    width: 48,
  },

  // Content Styles
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 70,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitleContainer: {
    alignItems: 'center',
    marginBottom: 20,
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

  // Features Section
  featuresSection: {
    paddingHorizontal: 24,
    paddingBottom: 70,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
  },
  titleUnderline: {
    width: 80,
    height: 3,
    backgroundColor: '#1E40AF',
    borderRadius: 2,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
    paddingHorizontal: 12,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 24,
  },

  // Stats Section
  statsSection: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 32,
    marginBottom: 40,
    elevation: 6,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1E40AF',
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  secondaryButtonText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default WelcomeScreen;