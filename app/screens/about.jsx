// import React from 'react';
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SLIDER_INTERVAL = 3000; // 3 seconds

const AboutScreen = ({ navigation }) => {
 

  const values = [
    {
      icon: 'shield',
      title: 'Privacy & Security',
      description: 'Your family\'s data is protected with enterprise-grade encryption',
      gradient: ['#EF4444', '#DC2626']
    },
    {
      icon: 'heart',
      title: 'Compassionate Care',
      description: 'Every feature is designed with empathy and understanding',
      gradient: ['#EC4899', '#DB2777']
    },
    {
      icon: 'award',
      title: 'Clinical Excellence',
      description: 'Evidence-based tools validated by leading autism specialists',
      gradient: ['#10B981', '#059669']
    },
    {
      icon: 'users',
      title: 'Community Support',
      description: 'Connecting families with resources and support networks',
      gradient: ['#3B82F6', '#1D4ED8']
    }
  ];

  // Slider state
  const [currentValueIndex, setCurrentValueIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValueIndex((prev) => (prev + 1) % values.length);
    }, SLIDER_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const router = typeof navigation === 'undefined' ? useRouter() : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.replace('/screens/home')}
        >
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About AutiScan</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={styles.heroGradient}
        >
           <Image
  source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/AutiScan.png')}
  style={{
    width: 80,
    height: 80,
    borderRadius: 40, // Half of width/height for perfect circle
    overflow: 'hidden',
    backgroundColor: '#fff', // Optional: for better contrast
    alignSelf: 'center',
  }}
  resizeMode="cover"
/>
          <Text style={styles.heroTitle}>Empowering Early Detection</Text>
          <Text style={styles.heroSubtitle}>
            Supporting families with AI-powered autism screening tools
          </Text>
        </LinearGradient>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <View style={styles.titleUnderline} />
        </View>
        <Text style={styles.missionText}>
          AutiScan is dedicated to providing accessible, accurate, and compassionate 
          autism screening tools. We believe early detection can transform lives, 
          and every child deserves the support they need to thrive.
        </Text>
       
      </View>

      {/* Values Section as Slider */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.titleUnderline} />
        </View>
        <View style={styles.sliderContainer}>
          <View style={styles.bigValueCard}>
            <LinearGradient
              colors={values[currentValueIndex].gradient}
              style={styles.bigValueIconContainer}
            >
              <Feather
                name={values[currentValueIndex].icon}
                size={24}
                color="#FFFFFF"
              />
            </LinearGradient>
            <View style={styles.bigValueContent}>
              <Text style={styles.bigValueTitle}>{values[currentValueIndex].title}</Text>
              <Text style={styles.bigValueDescription}>{values[currentValueIndex].description}</Text>
            </View>
          </View>
          <View style={styles.sliderDots}>
            {values.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  currentValueIndex === idx && styles.activeDot
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Contact Section */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.titleUnderline} />
        </View>
        <Text style={styles.contactText}>
          Have questions or feedback? We'd love to hear from you.
        </Text>
        <View style={styles.contactButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              // Opens email app with your address
              Linking.openURL('mailto:gyebiofficial@gmail.com');
            }}
          >
            <Feather name="mail" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>gyebiofficial@gmail.com</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              // Opens phone dialer with your number
              Linking.openURL('tel:0506526768');
            }}
          >
            <Feather name="message-circle" size={18} color="#1E40AF" />
            <Text style={styles.secondaryButtonText}>0506526768</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  heroSection: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    
  },
  heroGradient: {
    padding: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  missionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  bigValueCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28, // bigger radius
    padding: 36,      // more padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    minHeight: 150,   // taller card
    width: '100%',
    marginBottom: 24, // more space below
  },
  bigValueIconContainer: {
    width: 90,        // bigger icon container
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 32,  // more space to content
  },
  bigValueContent: {
    flex: 1,
  },
  bigValueTitle: {
    fontSize: 26,     // bigger title
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  bigValueDescription: {
    fontSize: 18,     // bigger description
    color: '#374151',
    lineHeight: 28,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 18,          // more gap
  },
  dot: {
    width: 20,        // bigger dots
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: '#1E40AF',
  },
  valuesGrid: {
    gap: 16,
  },
  valueCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  valueIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  teamCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  teamIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  recognitionContainer: {
    gap: 16,
  },
  recognitionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  recognitionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recognitionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  contactText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  contactButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AboutScreen;