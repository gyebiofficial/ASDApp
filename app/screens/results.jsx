import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAllAssessments, getAllChildren } from '../services/firebaseService';

const { width } = Dimensions.get('window');

// Colors and spacing constants
const COLORS = {
  primary: '#1E40AF',
  secondary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  white: '#FFFFFF',
  background: '#F8FAFC',
  text: '#1E293B',
  textLight: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Utility functions
const getRiskLevelColor = (riskLevel) => {
  switch (riskLevel?.toLowerCase()) {
    case 'low':
      return [COLORS.success, '#059669'];
    case 'medium':
      return [COLORS.warning, '#D97706'];
    case 'high':
      return [COLORS.error, '#DC2626'];
    default:
      return [COLORS.textMuted, '#6B7280'];
  }
};

const getRiskLevelIcon = (riskLevel) => {
  switch (riskLevel?.toLowerCase()) {
    case 'low':
      return 'check-circle';
    case 'medium':
      return 'alert-triangle';
    case 'high':
      return 'alert-circle';
    default:
      return 'help-circle';
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Child Assessment Card Component
const ChildAssessmentCard = ({ child, assessments, onViewDetails }) => {
  const latestAssessment = assessments[0]; // Assuming sorted by date
  const totalAssessments = assessments.length;

  return (
    <View style={styles.childCard}>
      <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.childCardGradient}>
        {/* Child Header */}
        <View style={styles.childHeader}>
          <View style={styles.childAvatar}>
            <Text style={styles.childAvatarText}>
              {child.firstName?.charAt(0)}{child.lastName?.charAt(0)}
            </Text>
          </View>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>{child.fullName}</Text>
            <Text style={styles.childDetails}>Age: {child.age} • {child.gender}</Text>
            <Text style={styles.assessmentCount}>
              {totalAssessments} assessment{totalAssessments !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => onViewDetails(child, assessments)}
          >
            <Feather name="chevron-right" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Latest Assessment Results */}
        {latestAssessment && (
          <View style={styles.latestAssessment}>
            <Text style={styles.latestTitle}>Latest Assessment</Text>
            <View style={styles.assessmentSummary}>
              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>Score</Text>
                <Text style={styles.scoreValue}>
                  {latestAssessment.score}/{latestAssessment.totalQuestions}
                </Text>
              </View>
              <View style={styles.riskSection}>
                <Text style={styles.riskLabel}>Risk Level</Text>
                <LinearGradient 
                  colors={getRiskLevelColor(latestAssessment.riskLevel)} 
                  style={styles.riskBadge}
                >
                  <Feather 
                    name={getRiskLevelIcon(latestAssessment.riskLevel)} 
                    size={12} 
                    color={COLORS.white} 
                  />
                  <Text style={styles.riskText}>{latestAssessment.riskLevel}</Text>
                </LinearGradient>
              </View>
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>Date</Text>
                <Text style={styles.dateValue}>
                  {formatDate(latestAssessment.completedAt)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Assessment History Preview */}
        {assessments.length > 1 && (
          <View style={styles.historyPreview}>
            <Text style={styles.historyTitle}>Recent History</Text>
            <View style={styles.historyDots}>
              {assessments.slice(0, 5).map((assessment, index) => (
                <View
                  key={index}
                  style={[
                    styles.historyDot,
                    { backgroundColor: getRiskLevelColor(assessment.riskLevel)[0] }
                  ]}
                />
              ))}
              {assessments.length > 5 && (
                <Text style={styles.moreIndicator}>+{assessments.length - 5}</Text>
              )}
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

// Statistics Card Component
const StatisticsCard = ({ children, assessments }) => {
  const totalChildren = children.length;
  const totalAssessments = assessments.length;
  const childrenWithAssessments = children.filter(child => 
    assessments.some(assessment => assessment.childId === child.id)
  ).length;
  
  const riskDistribution = assessments.reduce((acc, assessment) => {
    const risk = assessment.riskLevel?.toLowerCase() || 'unknown';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {});

  return (
    <View style={styles.statsCard}>
      <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.statsGradient}>
        <Text style={styles.statsTitle}>Assessment Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalChildren}</Text>
            <Text style={styles.statLabel}>Total Children</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalAssessments}</Text>
            <Text style={styles.statLabel}>Assessments</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{childrenWithAssessments}</Text>
            <Text style={styles.statLabel}>Assessed</Text>
          </View>
        </View>

        <View style={styles.riskDistribution}>
          <Text style={styles.riskDistributionTitle}>Risk Distribution</Text>
          <View style={styles.riskBars}>
            {Object.entries(riskDistribution).map(([risk, count]) => (
              <View key={risk} style={styles.riskBarContainer}>
                <Text style={styles.riskBarLabel}>{risk}</Text>
                <View style={styles.riskBar}>
                  <View 
                    style={[
                      styles.riskBarFill,
                      { 
                        width: `${(count / totalAssessments) * 100}%`,
                        backgroundColor: getRiskLevelColor(risk)[0]
                      }
                    ]}
                  />
                </View>
                <Text style={styles.riskBarCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// Main Results Screen Component
const ResultsScreen = () => {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [childrenData, assessmentsData] = await Promise.all([
        getAllChildren(),
        getAllAssessments()
      ]);
      
      setChildren(childrenData);
      setAssessments(assessmentsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load assessment data');
      Alert.alert('Error', 'Failed to load assessment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleViewChildDetails = (child, childAssessments) => {
    // Navigate to detailed view for specific child
    router.push({
      pathname: '/screens/child-detail',
      params: {
        childId: child.id,
        childName: child.fullName,
      }
    });
  };

  const handleBackPress = () => {
    router.push('/screens/home');
  };

  // Group assessments by child
  const getAssessmentsForChild = (childId) => {
    return assessments
      .filter(assessment => assessment.childId === childId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  };

  const childrenWithAssessments = children.filter(child =>
    assessments.some(assessment => assessment.childId === child.id)
  );

  if (loading) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.white} />
          <Text style={styles.loadingText}>Loading assessment results...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <LinearGradient colors={[COLORS.white, '#F8FAFC']} style={styles.backButtonGradient}>
              <Feather name="arrow-left" size={20} color={COLORS.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Assessment Results</Text>
            <Text style={styles.headerSubtitle}>Dashboard Overview</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
            activeOpacity={0.7}
          >
            <Feather name="refresh-cw" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Statistics Card */}
          <StatisticsCard children={children} assessments={assessments} />

          {/* Results Section */}
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>
              Children Assessment Results ({childrenWithAssessments.length})
            </Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {childrenWithAssessments.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="clipboard" size={64} color={COLORS.textMuted} />
                <Text style={styles.emptyStateTitle}>No Assessment Results</Text>
                <Text style={styles.emptyStateText}>
                  No children have completed assessments yet. Start by adding children and conducting assessments.
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/screens/children')}
                >
                  <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.emptyStateButtonGradient}>
                    <Feather name="plus" size={18} color={COLORS.white} />
                    <Text style={styles.emptyStateButtonText}>Add Children</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              childrenWithAssessments.map((child) => (
                <ChildAssessmentCard
                  key={child.id}
                  child={child}
                  assessments={getAssessmentsForChild(child.id)}
                  onViewDetails={handleViewChildDetails}
                />
              ))
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/screens/detect')}
              >
                <LinearGradient colors={[COLORS.success, '#059669']} style={styles.actionButtonGradient}>
                  <Feather name="plus-circle" size={20} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>New Assessment</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/screens/children')}
              >
                <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.actionButtonGradient}>
                  <Feather name="users" size={20} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Manage Children</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  statsCard: {
    marginVertical: SPACING.lg,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  statsGradient: {
    borderRadius: 16,
    padding: SPACING.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  riskDistribution: {
    marginTop: SPACING.md,
  },
  riskDistributionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  riskBars: {
    gap: SPACING.xs,
  },
  riskBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  riskBarLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    width: 60,
    textTransform: 'capitalize',
  },
  riskBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  riskBarCount: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    width: 20,
    textAlign: 'right',
  },
  resultsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  childCard: {
    marginBottom: SPACING.md,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  childCardGradient: {
    borderRadius: 16,
    padding: SPACING.lg,
  },
  childHeader: {
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
    fontWeight: '700',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
    marginBottom: 2,
  },
  assessmentCount: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  viewButton: {
    padding: SPACING.sm,
  },
  latestAssessment: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  latestTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  assessmentSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  riskSection: {
    alignItems: 'center',
    flex: 1,
  },
  riskLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  dateSection: {
    alignItems: 'center',
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  historyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  historyDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moreIndicator: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginLeft: 4,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '20',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  emptyStateButton: {
    borderRadius: 12,
    elevation: 3,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  emptyStateButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: SPACING.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    elevation: 3,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ResultsScreen;