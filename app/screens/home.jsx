import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Signed out', 'You have been signed out successfully.');
      router.replace('/sign-in');
    } catch (err) {
      Alert.alert('Error', 'Could not sign out. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/autism.jpg')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <Text style={styles.title}>Welcome{user?.firstName ? `, ${user.firstName}` : ''}!</Text>
        <Text style={styles.subtitle}>
          Empowering early detection and support for autism spectrum disorder.
        </Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About AutiScan</Text>
        <Text style={styles.infoText}>
          AutiScan is designed to help with the early detection of autism spectrum disorder (ASD) and to provide support resources for families and caregivers. Our app offers:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Quick and easy screening tools for ASD risk factors</Text>
          <Text style={styles.bulletItem}>• Personalized dashboard for tracking progress</Text>
          <Text style={styles.bulletItem}>• Access to educational resources and articles</Text>
          <Text style={styles.bulletItem}>• Secure profile management</Text>
          <Text style={styles.bulletItem}>• History of previous screenings</Text>
        </View>
        <Text style={styles.infoText}>
          Remember, AutiScan is not a diagnostic tool. For a formal diagnosis, please consult a qualified healthcare professional.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Autism Detection App</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f8fc',
    alignItems: 'center',
    paddingVertical: 30,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    width: '90%',
  },
  headerImage: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    marginBottom: 18,
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
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'center',
    elevation: 2,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 22,
    width: '90%',
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#1565c0',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    textAlign: 'left',
  },
  bulletList: {
    marginBottom: 10,
    marginLeft: 10,
  },
  bulletItem: {
    fontSize: 15,
    color: '#1565c0',
    marginBottom: 4,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#1565c0',
    fontSize: 15,
    fontWeight: '500',
  },
});