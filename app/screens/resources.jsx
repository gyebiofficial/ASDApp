import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
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

const ResourcesScreen = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('overview');

  const categories = [
    { id: 'overview', title: 'Overview', icon: 'info' },
    { id: 'early-signs', title: 'Early Signs', icon: 'eye' },
    { id: 'support', title: 'Support', icon: 'heart' },
    { id: 'treatment', title: 'Treatment', icon: 'activity' },
    { id: 'research', title: 'Research', icon: 'book-open' },
  ];

  const resources = {
    overview: [
      {
        title: 'Understanding Autism Spectrum Disorder',
        content: 'Autism Spectrum Disorder (ASD) is a developmental disability that can cause significant social, communication, and behavioral challenges. The term "spectrum" reflects the wide variation in challenges and strengths possessed by each person with autism.',
        type: 'info',
      },
      {
        title: 'Key Facts About ASD',
        content: '• 1 in 87 children under age of 3 has been identified with autism\n• Boys are 4 times more likely to be diagnosed\n• Early intervention can significantly improve outcomes\n• Autism affects people of all racial, ethnic, and socioeconomic groups',
        type: 'stats',
      },
      {
        title: 'Autism Acceptance',
        content: 'Every person with autism is unique, with their own strengths, challenges, and potential. With proper support and understanding, individuals with autism can lead fulfilling lives and make valuable contributions to their communities.',
        type: 'success',
      },
    ],
    'early-signs': [
      {
        title: 'Social Communication Signs',
        content: '• Limited eye contact\n• Delayed speech development\n• Difficulty with back-and-forth conversation\n• Unusual nonverbal communication\n• Challenges developing friendships',
        type: 'warning',
      },
      {
        title: 'Behavioral Signs',
        content: '• Repetitive behaviors or speech\n• Intense interest in specific topics\n• Inflexibility with routines\n• Unusual reactions to sensory input\n• Hand-flapping, spinning, or rocking',
        type: 'warning',
      },
      {
        title: 'When to Seek Help',
        content: 'If you notice several of these signs, consult with your pediatrician. Early screening and intervention can make a significant difference in a child\'s development.',
        type: 'info',
      },
    ],
    support: [
      {
        title: 'Family Support Strategies',
        content: '• Create predictable routines\n• Use visual schedules and supports\n• Practice patience and understanding\n• Celebrate small victories\n• Connect with other families',
        type: 'success',
      },
      {
        title: 'Educational Support',
        content: '• Individualized Education Program (IEP)\n• Special education services\n• Inclusive classroom settings\n• Assistive technology\n• Social skills training',
        type: 'info',
      },
      {
        title: 'Community Resources',
        content: '• Autism support groups\n• Therapy services\n• Recreational programs\n• Respite care\n• Advocacy organizations',
        type: 'success',
      },
    ],
    treatment: [
      {
        title: 'Evidence-Based Treatments',
        content: '• Applied Behavior Analysis (ABA)\n• Speech and Language Therapy\n• Occupational Therapy\n• Social Skills Training\n• Cognitive Behavioral Therapy',
        type: 'info',
      },
      {
        title: 'Early Intervention',
        content: 'Research shows that early intervention services can greatly improve a child\'s development. These services are designed to meet the specific needs of the child and family.',
        type: 'success',
      },
      {
        title: 'Complementary Approaches',
        content: '• Sensory integration therapy\n• Music therapy\n• Art therapy\n• Animal-assisted therapy\n• Mindfulness and relaxation techniques',
        type: 'info',
      },
    ],
    research: [
      {
        title: 'Current Research Areas',
        content: '• Genetic factors and autism\n• Brain development studies\n• Environmental influences\n• New diagnostic tools\n• Treatment effectiveness research',
        type: 'info',
      },
      {
        title: 'Future Directions',
        content: 'Researchers are working on better understanding the causes of autism, developing new treatments, and improving quality of life for individuals with autism and their families.',
        type: 'success',
      },
      {
        title: 'How to Get Involved',
        content: '• Participate in research studies\n• Support autism research organizations\n• Advocate for research funding\n• Share your experiences\n• Stay informed about new findings',
        type: 'info',
      },
    ],
  };

  const externalResources = [
    {
      title: 'Autism Speaks',
      description: 'Leading autism advocacy organization with resources and support',
      url: 'https://www.autismspeaks.org',
      icon: 'external-link',
    },
    {
      title: 'CDC Autism Information',
      description: 'Official information and resources from the CDC',
      url: 'https://www.cdc.gov/autism',
      icon: 'shield',
    },
    {
      title: 'Autism Society',
      description: 'Supporting individuals with autism and their families',
      url: 'https://www.autism-society.org',
      icon: 'users',
    },
    {
      title: 'National Autistic Society',
      description: 'UK-based charity providing support and information',
      url: 'https://www.autism.org.uk',
      icon: 'globe',
    },
  ];

  const handleExternalLink = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const renderResourceCard = (resource, index) => {
    const getCardColor = (type) => {
      switch (type) {
        case 'success': return COLORS.success;
        case 'warning': return COLORS.warning;
        case 'stats': return COLORS.accent;
        default: return COLORS.info;
      }
    };

    return (
      <View key={index} style={[styles.resourceCard, { borderLeftColor: getCardColor(resource.type) }]}>
        <View style={styles.resourceHeader}>
          <View style={[styles.resourceIcon, { backgroundColor: getCardColor(resource.type) + '15' }]}>
            <MaterialIcons 
              name={resource.type === 'stats' ? 'analytics' : resource.type === 'success' ? 'check-circle' : resource.type === 'warning' ? 'warning' : 'info'} 
              size={20} 
              color={getCardColor(resource.type)} 
            />
          </View>
          <Text style={styles.resourceTitle}>{resource.title}</Text>
        </View>
        <Text style={styles.resourceContent}>{resource.content}</Text>
      </View>
    );
  };

  const renderExternalResourceCard = (resource, index) => (
    <TouchableOpacity
      key={index}
      style={styles.externalCard}
      onPress={() => handleExternalLink(resource.url)}
      activeOpacity={0.7}
    >
      <View style={styles.externalCardContent}>
        <View style={styles.externalIcon}>
          <Feather name={resource.icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.externalTextContent}>
          <Text style={styles.externalTitle}>{resource.title}</Text>
          <Text style={styles.externalDescription}>{resource.description}</Text>
        </View>
        <Feather name="arrow-up-right" size={20} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <View style={styles.backContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/screens/home')}
            activeOpacity={0.7}
          >
            <View style={styles.backIconContainer}>
              <Feather name="arrow-left" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.backText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Autism Resources</Text>
          <Text style={styles.headerSubtitle}>
            Educational content and support resources for understanding Autism Spectrum Disorder
          </Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.id && styles.activeCategoryTab
                ]}
                onPress={() => setActiveCategory(category.id)}
                activeOpacity={0.7}
              >
                <Feather 
                  name={category.icon} 
                  size={18} 
                  color={activeCategory === category.id ? COLORS.white : COLORS.primary} 
                />
                <Text style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.activeCategoryText
                ]}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {resources[activeCategory]?.map((resource, index) => renderResourceCard(resource, index))}
        </View>

        {/* External Resources */}
        <View style={styles.externalSection}>
          <Text style={styles.sectionTitle}>External Resources</Text>
          <Text style={styles.sectionSubtitle}>
            Trusted organizations and websites for additional information
          </Text>
          {externalResources.map((resource, index) => renderExternalResourceCard(resource, index))}
        </View>

        {/* Emergency Contact */}
       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  backContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backButton: {
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
  backText: {
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
  categoryContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.lg,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeCategoryTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 6,
  },
  activeCategoryText: {
    color: COLORS.white,
  },
  contentSection: {
    padding: SPACING.lg,
  },
  resourceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  resourceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  resourceContent: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  externalSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundSecondary,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  externalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  externalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  externalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  externalTextContent: {
    flex: 1,
  },
  externalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  externalDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  emergencySection: {
    margin: SPACING.lg,
    backgroundColor: COLORS.error + '10',
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '20',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
  emergencyText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  emergencyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ResourcesScreen;