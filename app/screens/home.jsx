import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

export default function Home() {
  const { user } = useUser();

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
      </View>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../assets/images/menu.jpg')}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardDesc}>View and edit your personal information.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../assets/images/menu.jpg')}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>History</Text>
          <Text style={styles.cardDesc}>See your previous screenings and results.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../assets/images/menu.jpg')}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Start Screening</Text>
          <Text style={styles.cardDesc}>Begin a new autism detection screening.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../assets/images/menu.jpg')}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Resources</Text>
          <Text style={styles.cardDesc}>Access helpful articles and support links.</Text>
        </TouchableOpacity>
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#1565c0',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIcon: {
    width: 38,
    height: 38,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
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