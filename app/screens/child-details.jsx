import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { getAllAssessments } from '../services/firebaseService';

const ChildDetailsScreen = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { childId, childName } = useLocalSearchParams();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user?.id && childId) {
      loadChildAssessments();
    }
  }, [isLoaded, user?.id, childId]);

  const loadChildAssessments = async () => {
    try {
      setLoading(true);
      const allAssessments = await getAllAssessments(user.id);
      const childAssessments = allAssessments
        .filter(assessment => assessment.childId === childId)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      setAssessments(childAssessments);
    } catch (error) {
      console.error('Error loading child assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return ['#10B981', '#059669'];
      case 'medium': return ['#F59E0B', '#D97706'];
      case 'high': return ['#EF4444', '#DC2626'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isLoaded || loading) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading assessment history...</Text>
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
            onPress={() => router.back()}
          >
            <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.backButtonGradient}>
              <Feather name="arrow-left" size={20} color="#1E40AF" />
              <Text style={styles.backButtonText}>Back</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{childName}</Text>
            <Text style={styles.headerSubtitle}>Assessment History</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {assessments.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="clipboard" size={64} color="#64748B" />
              <Text style={styles.emptyStateTitle}>No Assessments Yet</Text>
              <Text style={styles.emptyStateText}>
                This child hasn't completed any assessments yet.
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => router.push({
                  pathname: '/screens/detect',
                  params: { childId, childName }
                })}
              >
                <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.emptyStateButtonGradient}>
                  <Feather name="plus" size={18} color="#FFFFFF" />
                  <Text style={styles.emptyStateButtonText}>Start Assessment</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                Assessment History ({assessments.length})
              </Text>
              
              {assessments.map((assessment, index) => (
                <View key={assessment.id || index} style={styles.assessmentCard}>
                  <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.assessmentGradient}>
                    <View style={styles.assessmentHeader}>
                      <View style={styles.assessmentInfo}>
                        <Text style={styles.assessmentDate}>
                          {formatDate(assessment.completedAt)}
                        </Text>
                        <Text style={styles.assessmentType}>M-CHAT Assessment</Text>
                      </View>
                      <LinearGradient 
                        colors={getRiskLevelColor(assessment.riskLevel)}
                        style={styles.riskBadge}
                      >
                        <Text style={styles.riskText}>{assessment.riskLevel}</Text>
                      </LinearGradient>
                    </View>
                    
                    <View style={styles.assessmentDetails}>
                      <View style={styles.scoreContainer}>
                        <Text style={styles.scoreLabel}>Score</Text>
                        <Text style={styles.scoreValue}>
                          {assessment.score}/{assessment.totalQuestions}
                        </Text>
                      </View>
                      
                      <View style={styles.percentageContainer}>
                        <Text style={styles.percentageLabel}>Risk Percentage</Text>
                        <Text style={styles.percentageValue}>
                          {Math.round((assessment.score / assessment.totalQuestions) * 100)}%
                        </Text>
                      </View>
                    </View>

                    {assessment.recommendation && (
                      <View style={styles.recommendationContainer}>
                        <Text style={styles.recommendationTitle}>Recommendation</Text>
                        <Text style={styles.recommendationText}>
                          {assessment.recommendation}
                        </Text>
                      </View>
                    )}
                  </LinearGradient>
                </View>
              ))}
            </>
          )}
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    color: '#1E40AF',
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
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 24,
  },
  assessmentCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  assessmentGradient: {
    borderRadius: 16,
    padding: 20,
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  assessmentInfo: {
    flex: 1,
  },
  assessmentDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  assessmentType: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  riskBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  assessmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  percentageContainer: {
    alignItems: 'center',
  },
  percentageLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  percentageValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  recommendationContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
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
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ChildDetailsScreen;