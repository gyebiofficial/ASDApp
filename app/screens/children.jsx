import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import Firebase services
import { addChild, getAllChildren, deleteChild } from '../services/firebaseService';

const { width } = Dimensions.get('window');

// Enhanced color palette
const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#3730A3',
  secondary: '#64748B',
  accent: '#F59E0B',
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  white: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#1E293B',
  textLight: '#64748B',
  textMuted: '#94A3B8',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  success: '#10B981',
  successLight: '#F0FDF4',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Generate arrays for date selection
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= currentYear - 18; year--) {
    years.push(year);
  }
  return years;
};

const generateMonths = () => {
  return [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];
};

const generateDays = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  return days;
};

// Utility function to calculate age in years or months
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 1) {
    // Less than 1 year old, show months
    if (months === 0) {
      return 'Less than 1 month';
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  } else if (months === 0) {
    // Exact years
    return `${years} year${years > 1 ? 's' : ''}`;
  } else {
    // Years and months
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  }
};

// Utility function to format date
const formatDate = (year, month, day) => {
  const monthStr = (month + 1).toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
};

// Utility function to format date for display
const formatDateDisplay = (year, month, day) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month]} ${day}, ${year}`;
};

const ChildrenScreen = () => {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthYear: new Date().getFullYear(),
    birthMonth: new Date().getMonth(),
    birthDay: new Date().getDate(),
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load children on component mount
  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const childrenData = await getAllChildren();
      setChildren(childrenData);
    } catch (error) {
      // Error is already handled in firebaseService, just log here
      console.error('Error in loadChildren:', error);
      // Don't show additional alert since handleFirebaseError already did
    } finally {
      setLoading(false);
    }
  };

  const refreshChildren = async () => {
    try {
      setRefreshing(true);
      const childrenData = await getAllChildren();
      setChildren(childrenData);
    } catch (error) {
      console.error('Error refreshing children:', error);
      Alert.alert('Error', 'Failed to refresh children.');
    } finally {
      setRefreshing(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    const birthDate = new Date(formData.birthYear, formData.birthMonth, formData.birthDay);
    const today = new Date();
    if (birthDate >= today) {
      newErrors.dateOfBirth = 'Date of birth must be in the past';
    }

    const age = calculateAge(birthDate);
    if (age > 18) {
      newErrors.dateOfBirth = 'Age must be 18 years or younger';
    }

    if (!formData.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle date picker confirmation
  const handleDateConfirm = () => {
    setShowDatePicker(false);
    // Clear date error if exists
    if (errors.dateOfBirth) {
      setErrors(prev => ({
        ...prev,
        dateOfBirth: '',
      }));
    }
  };

  // Handle adding a new child
  const handleAddChild = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error', 
        'Please correct the errors and try again.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const birthDate = new Date(formData.birthYear, formData.birthMonth, formData.birthDay);
    const formattedDate = formatDate(formData.birthYear, formData.birthMonth, formData.birthDay);

    const childData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      fullName: fullName,
      dateOfBirth: formattedDate,
      displayDate: formatDateDisplay(formData.birthYear, formData.birthMonth, formData.birthDay),
      gender: formData.gender.trim(),
      age: calculateAge(formattedDate),
    };

    try {
      setLoading(true);
      const childId = await addChild(childData);
      
      // Reload children from Firebase
      await loadChildren();
      
      // Reset form and show success
      const currentDate = new Date();
      setFormData({
        firstName: '',
        lastName: '',
        birthYear: currentDate.getFullYear(),
        birthMonth: currentDate.getMonth(),
        birthDay: currentDate.getDate(),
        gender: '',
      });
      setErrors({});

      Alert.alert(
        'Success!', 
        `${fullName} has been added successfully.`,
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (error) {
      // Error already handled in firebaseService
      console.error('Error in handleAddChild:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a child
  const handleDeleteChild = (id, name) => {
    Alert.alert(
      'Delete Child',
      `Are you sure you want to delete ${name} and all their assessments?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteChild(id);
              await loadChildren(); // Reload from Firebase
              Alert.alert('Success', 'Child deleted successfully.');
            } catch (error) {
              // Error already handled in firebaseService
              console.error('Error in handleDeleteChild:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle start assessment
  const handleStartAssessment = (child) => {
    // Try different routing approaches
    router.push({
      pathname: '/screens/detect', // if using tabs
      params: { 
        childId: child.id,
        childName: child.fullName,
        childAge: child.age
      } 
    });
    
    // OR try this if it's a screen route:
    // router.push({
    //   pathname: '/detect',
    //   params: { 
    //     childId: child.id,
    //     childName: child.fullName,
    //     childAge: child.age
    //   } 
    // });
    
    // OR try this simpler approach:
    // router.push(`/detect?childId=${child.id}&childName=${child.fullName}&childAge=${child.age}`);
  };

  // Render individual child card
  const renderChildCard = ({ item, index }) => (
    <View style={[styles.childCard, { marginTop: index === 0 ? 0 : SPACING.md }]}>
      <View style={styles.childCardHeader}>
        <View style={styles.childAvatar}>
          <Text style={styles.childAvatarText}>
            {item.firstName?.charAt(0)}{item.lastName?.charAt(0)}
          </Text>
        </View>
        <View style={styles.childCardInfo}>
          <Text style={styles.childName}>{item.fullName}</Text>
          <Text style={styles.childAge}>
            {item.age ? `${item.age} old` : 'Age not available'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteChild(item.id, item.fullName)}
          disabled={loading}
        >
          <Feather name="trash-2" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.childDetailsContainer}>
        <View style={styles.childDetailItem}>
          <Text style={styles.childDetailLabel}>Date of Birth</Text>
          <Text style={styles.childDetailValue}>{item.displayDate}</Text>
        </View>
        <View style={styles.childDetailItem}>
          <Text style={styles.childDetailLabel}>Gender</Text>
          <Text style={styles.childDetailValue}>{item.gender}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.assessmentButton}
        onPress={() => handleStartAssessment(item)}
        activeOpacity={0.85}
        disabled={loading}
      >
        <Feather name="activity" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.assessmentButtonText}>Start Assessment</Text>
      </TouchableOpacity>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Text style={styles.emptyStateIconText}>👶</Text>
      </View>
      <Text style={styles.emptyStateTitle}>No Children Added Yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Add your first child to start using the assessment features.
      </Text>
    </View>
  );

  // Render date picker modal
  const renderDatePickerModal = () => {
    const years = generateYears();
    const months = generateMonths();
    const days = generateDays(formData.birthYear, formData.birthMonth);

    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
              <TouchableOpacity
                onPress={handleDateConfirm}
                style={styles.modalConfirmButton}
              >
                <Text style={styles.modalConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Month</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.birthMonth}
                    style={styles.picker}
                    onValueChange={(value) => handleInputChange('birthMonth', value)}
                  >
                    {months.map(month => (
                      <Picker.Item key={month.value} label={month.label} value={month.value} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Day</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.birthDay}
                    style={styles.picker}
                    onValueChange={(value) => handleInputChange('birthDay', value)}
                  >
                    {days.map(day => (
                      <Picker.Item key={day} label={day.toString()} value={day} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Year</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.birthYear}
                    style={styles.picker}
                    onValueChange={(value) => handleInputChange('birthYear', value)}
                  >
                    {years.map(year => (
                      <Picker.Item key={year} label={year.toString()} value={year} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Loading indicator
  if (loading && children.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textLight }}>Loading children...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <View style={styles.inlineBackContainer}>
          <TouchableOpacity
            style={styles.friendlyBackButton}
            onPress={() => router.replace('/screens/home')}
            activeOpacity={0.7}
          >
            <View style={styles.backIconContainer}>
              <Feather name="arrow-left" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.friendlyBackText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Children Management</Text>
          <Text style={styles.headerSubtitle}>Add and manage your children's information</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Add New Child</Text>
          
          {/* Name Fields Row */}
          <View style={styles.nameRow}>
            <View style={[styles.inputContainer, styles.nameField]}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                placeholder="Enter first name"
                placeholderTextColor={COLORS.textMuted}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {errors.firstName && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                </View>
              )}
            </View>
            <View style={[styles.inputContainer, styles.nameField]}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                placeholder="Enter last name"
                placeholderTextColor={COLORS.textMuted}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {errors.lastName && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                </View>
              )}
            </View>
          </View>
          {/* Date of Birth Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput, errors.dateOfBirth && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.dateText}>
                {formatDateDisplay(formData.birthYear, formData.birthMonth, formData.birthDay)}
              </Text>
              <Text style={styles.dateIcon}>📅</Text>
            </TouchableOpacity>
            {errors.dateOfBirth && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
              </View>
            )}
          </View>
          {/* Gender Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gender</Text>
            <TextInput
              style={[styles.input, errors.gender && styles.inputError]}
              placeholder="Enter gender"
              placeholderTextColor={COLORS.textMuted}
              value={formData.gender}
              onChangeText={(value) => handleInputChange('gender', value)}
              autoCapitalize="words"
            />
            {errors.gender && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.gender}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.addButton, loading && { opacity: 0.7 }]}
            onPress={handleAddChild}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.addButtonText}>Add Child</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Children List Section */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>My Children</Text>
            {children.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{children.length}</Text>
              </View>
            )}
          </View>
          
          {children.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={children}
              keyExtractor={(item) => item.id}
              renderItem={renderChildCard}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              refreshing={refreshing}
              onRefresh={refreshChildren}
            />
          )}
        </View>
        
        {renderDatePickerModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inlineBackContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  friendlyBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  backIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  friendlyBackText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  formSection: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: 16,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listSection: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  nameRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  nameField: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.text,
    minHeight: 52,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  dateIcon: {
    fontSize: 18,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
  },
  errorContainer: {
    marginTop: SPACING.xs,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  childCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  childCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  childAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  childCardInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  childAge: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  childDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  childDetailItem: {
    flex: 1,
  },
  childDetailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  childDetailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyStateIconText: {
    fontSize: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalCancelButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  modalCancelText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  modalConfirmButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  modalConfirmText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pickerWrapper: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  picker: {
    width: '100%',
    height: 180,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 16,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assessmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-end',
    marginTop: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  assessmentButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default ChildrenScreen;