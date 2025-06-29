import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function About() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/autism.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/screens/home')}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
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
  backButton: {
    marginTop: 50,
    marginLeft: 18,
    marginBottom: -30,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  backButtonText: {
    color: '#1565c0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    padding: 24,
    paddingTop: 40,
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
