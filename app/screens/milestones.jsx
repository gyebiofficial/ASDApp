import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import MilestoneProgressTracker from '../components/MilestoneProgressTracker';
import { getAllChildren } from '../services/firebaseService';

const MilestonesScreen = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { childId } = useLocalSearchParams();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isLoaded && user?.id) {
      loadChildren();
    }
  }, [isLoaded, user?.id]);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const childrenData = await getAllChildren(user.id);
      
      console.log('📊 Children data received:', childrenData);
      
      // Children already have calculated ages from firebaseService
      // No need to recalculate - just use the data directly
      setChildren(childrenData);
      
      // If childId is provided, select that child
      if (childId) {
        const child = childrenData.find(c => c.id === childId);
        if (child) {
          console.log('🎯 Selected child from URL:', child);
          setSelectedChild(child);
        }
      } else if (childrenData.length > 0) {
        console.log('🎯 Auto-selected first child:', childrenData[0]);
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      Alert.alert('Error', 'Failed to load children data');
    } finally {
      setLoading(false);
    }
  };

  const toggleChildSelector = () => {
    const toValue = showChildSelector ? 0 : 1;
    setShowChildSelector(!showChildSelector);
    
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const selectChild = (child) => {
    setSelectedChild(child);
    toggleChildSelector();
  };

  const truncateName = (name, maxLength = 10) => {
    if (!name) return '';
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  if (!isLoaded || loading) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner}>
              <Feather name="loader" size={32} color="#3B82F6" />
            </View>
            <Text style={styles.loadingText}>Loading milestone tracker...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Feather name="user-x" size={64} color="#64748B" />
            <Text style={styles.loadingText}>Please sign in to continue</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (children.length === 0) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.backButtonGradient}>
                <Feather name="arrow-left" size={20} color="#1E40AF" />
                <Text style={styles.backButtonText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Milestone Tracker</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Feather name="users" size={48} color="#3B82F6" />
            </View>
            <Text style={styles.emptyStateTitle}>No Children Added</Text>
            <Text style={styles.emptyStateText}>
              Add a child profile to start tracking developmental milestones and monitor their growth.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push('/screens/children')}
            >
              <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.emptyStateButtonGradient}>
                <Feather name="plus" size={18} color="#FFFFFF" />
                <Text style={styles.emptyStateButtonText}>Add Your First Child</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.backButtonGradient}>
              <Feather name="arrow-left" size={20} color="#1E40AF" />
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Milestone Tracker</Text>
            <Text style={styles.headerSubtitle}>Track developmental progress</Text>
          </View>

          {/* Child Selector Button */}
          {children.length > 1 && (
            <TouchableOpacity 
              style={styles.childSelectorButton}
              onPress={toggleChildSelector}
            >
              <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.childSelectorGradient}>
                <Feather name="users" size={16} color="#FFFFFF" />
                <Feather name={showChildSelector ? "chevron-up" : "chevron-down"} size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Current Selected Child Info */}
        {selectedChild && (
          <View style={styles.selectedChildInfo}>
            <LinearGradient colors={['rgba(59, 130, 246, 0.1)', 'rgba(30, 64, 175, 0.05)']} style={styles.selectedChildCard}>
              <View style={styles.selectedChildAvatar}>
                <Text style={styles.selectedChildAvatarText}>
                  {selectedChild.firstName?.charAt(0)}{selectedChild.lastName?.charAt(0)}
                </Text>
              </View>
              <View style={styles.selectedChildDetails}>
                <Text style={styles.selectedChildName}>{selectedChild.fullName}</Text>
                <Text style={styles.selectedChildAge}>
                  {selectedChild.ageInYears} years, {selectedChild.ageInMonthsRemainder} months old
                </Text>
              </View>
              <View style={styles.selectedChildBadge}>
                <Feather name="star" size={16} color="#3B82F6" />
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Animated Child Selector Dropdown */}
        {children.length > 1 && (
          <Animated.View 
            style={[
              styles.childSelectorDropdown,
              {
                opacity: slideAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  })
                }]
              }
            ]}
            pointerEvents={showChildSelector ? 'auto' : 'none'}
          >
            <View style={styles.dropdownContent}>
              <Text style={styles.dropdownTitle}>Select Child</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {children.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.dropdownChildCard,
                      selectedChild?.id === child.id && styles.dropdownSelectedChild
                    ]}
                    onPress={() => selectChild(child)}
                  >
                    <View style={styles.dropdownChildAvatar}>
                      <Text style={styles.dropdownChildAvatarText}>
                        {child.firstName?.charAt(0)}{child.lastName?.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.dropdownChildInfo}>
                      <Text style={styles.dropdownChildName}>{child.fullName}</Text>
                      <Text style={styles.dropdownChildAge}>
                        {child.ageInYears}y {child.ageInMonthsRemainder}m
                      </Text>
                    </View>
                    {selectedChild?.id === child.id && (
                      <Feather name="check" size={20} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        )}

        {/* Milestone Progress Tracker */}
        {selectedChild && !showChildSelector && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <MilestoneProgressTracker
              childId={selectedChild.id}
              childName={selectedChild.fullName}
              childAge={selectedChild.age}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#1E40AF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  childSelectorButton: {
    borderRadius: 12,
    elevation: 3,
  },
  childSelectorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  selectedChildInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  selectedChildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  selectedChildAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedChildAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  selectedChildDetails: {
    flex: 1,
  },
  selectedChildName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectedChildAge: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedChildBadge: {
    padding: 8,
  },
  childSelectorDropdown: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 10,
  },
  dropdownContent: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    maxHeight: 300,
  },
  dropdownTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownChildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownSelectedChild: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  dropdownChildAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dropdownChildAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dropdownChildInfo: {
    flex: 1,
  },
  dropdownChildName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  dropdownChildAge: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyStateButton: {
    borderRadius: 16,
    elevation: 3,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
});

export default MilestonesScreen;