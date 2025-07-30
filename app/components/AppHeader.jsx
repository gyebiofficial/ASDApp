import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const AppHeader = ({ 
  showMenu = true, 
  showProfile = true, 
  onMenuPress, 
  onProfilePress, 
  title = "AutiCare" 
}) => {
  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6', '#60A5FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        {/* Menu Button */}
        {showMenu && (
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Feather name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/AutiScan.png')}
            style={styles.headerLogo}
            resizeMode="cover"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>{title}</Text>
            <Text style={styles.logoSubtext}>AI Detection</Text>
          </View>
        </View>

        {/* Profile Button */}
        {showProfile && (
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <View style={styles.profileAvatar}>
              <Feather name="user" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 20,
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
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default AppHeader;