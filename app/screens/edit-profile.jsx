import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  StatusBar, 
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

export default function EditProfile() {
  const { user } = useUser();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Try to get the current name from various properties
      setDisplayName(user.firstName || user.fullName || user.username || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name is required');
      return;
    }

    setIsLoading(true);
    try {
      // Use Clerk's setFirstName method instead of update
      await user.setFirstName(displayName.trim());

      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Settings</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar Section */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.avatarContainer}>
            <View style={styles.defaultProfileImage}>
              <Text style={styles.avatarInitials}>
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <Text style={styles.avatarText}>Profile Avatar</Text>
            <Text style={styles.avatarSubtext}>Displays your first initial</Text>
          </View>
        </View>

        {/* Account Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Display Name</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your display name"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <Text style={styles.helperText}>This name will be shown in your profile</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.inputWrapper, styles.disabledWrapper]}>
              <Feather name="mail" size={20} color="#94A3B8" />
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user?.primaryEmailAddress?.emailAddress || ''}
                editable={false}
                placeholder="Email address"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <Text style={styles.helperText}>Email address cannot be changed here</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>User ID</Text>
            <View style={[styles.inputWrapper, styles.disabledWrapper]}>
              <Feather name="hash" size={20} color="#94A3B8" />
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user?.id?.substring(0, 12) + '...' || 'N/A'}
                editable={false}
                placeholder="User ID"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <Text style={styles.helperText}>Unique identifier for your account</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.saveButton, (!displayName.trim() || isLoading) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!displayName.trim() || isLoading}
          >
            <LinearGradient
              colors={displayName.trim() ? ['#1E40AF', '#3B82F6'] : ['#64748B', '#475569']}
              style={styles.saveButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Feather name="save" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
            <Feather name="x" size={20} color="#6B7280" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  defaultProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  avatarSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  disabledWrapper: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  disabledInput: {
    color: '#6B7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  buttonSection: {
    paddingBottom: 40,
  },
  saveButton: {
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});