import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const MilestoneProgressTracker = ({ childId, childName, childAge }) => {
  const [selectedCategory, setSelectedCategory] = useState('communication');
  const [milestoneData, setMilestoneData] = useState({});
  const [progressHistory, setProgressHistory] = useState([]);

  // Define milestone categories and their milestones
  const milestoneCategories = {
    communication: {
      title: 'Communication & Language',
      icon: 'message-circle',
      color: '#3B82F6',
      milestones: {
        '12-18': [
          'Says first words (mama, dada)',
          'Responds to simple commands',
          'Points to request items',
          'Imitates sounds and gestures'
        ],
        '18-24': [
          'Uses 10-50 words',
          'Combines two words',
          'Follows two-step instructions',
          'Names familiar objects'
        ],
        '2-3': [
          'Uses 200+ words',
          'Forms 3-word sentences',
          'Asks "what" and "where" questions',
          'Uses pronouns (I, you, me)'
        ],
        '3-4': [
          'Speaks in complete sentences',
          'Tells simple stories',
          'Asks many questions',
          'Speech is mostly clear'
        ],
        '4-5': [
          'Uses complex sentences',
          'Understands time concepts',
          'Follows detailed instructions',
          'Explains rules of games'
        ]
      }
    },
    social: {
      title: 'Social & Emotional',
      icon: 'users',
      color: '#10B981',
      milestones: {
        '12-18': [
          'Shows affection to familiar people',
          'Plays simple games like peek-a-boo',
          'Shows stranger anxiety',
          'Explores but stays near caregiver'
        ],
        '18-24': [
          'Shows independence',
          'Imitates others behavior',
          'Gets excited around other children',
          'Shows defiant behavior'
        ],
        '2-3': [
          'Copies adults and friends',
          'Shows excitement when with other children',
          'Shows more independence',
          'Shows range of emotions'
        ],
        '3-4': [
          'Cooperates with other children',
          'Plays "mom" or "dad"',
          'Increasingly creative with make-believe',
          'Would rather play with others than alone'
        ],
        '4-5': [
          'Wants to please friends',
          'More likely to agree with rules',
          'Likes to sing, dance, and act',
          'Shows concern for crying friend'
        ]
      }
    },
    motor: {
      title: 'Motor Skills',
      icon: 'activity',
      color: '#F59E0B',
      milestones: {
        '12-18': [
          'Walks alone',
          'Climbs stairs with help',
          'Drinks from cup',
          'Eats with spoon'
        ],
        '18-24': [
          'Runs steadily',
          'Climbs on furniture',
          'Throws ball overhand',
          'Uses fork'
        ],
        '2-3': [
          'Jumps with both feet',
          'Pedals tricycle',
          'Draws circles and lines',
          'Builds tower of blocks'
        ],
        '3-4': [
          'Hops on one foot',
          'Catches bounced ball',
          'Draws person with 3 parts',
          'Uses scissors'
        ],
        '4-5': [
          'Skips and jumps',
          'Does somersaults',
          'Draws letters and numbers',
          'Dresses and undresses'
        ]
      }
    },
    cognitive: {
      title: 'Cognitive & Learning',
      icon: 'book', // ✅ Fixed: Changed from 'brain' to 'book'
      color: '#8B5CF6',
      milestones: {
        '12-18': [
          'Finds hidden objects',
          'Looks at pictures in book',
          'Drinks from cup',
          'Explores things in different ways'
        ],
        '18-24': [
          'Knows what ordinary things are for',
          'Points to body parts',
          'Scribbles on own',
          'Shows more independence'
        ],
        '2-3': [
          'Sorts shapes and colors',
          'Completes sentences in familiar books',
          'Plays simple make-believe',
          'Builds towers of 4+ blocks'
        ],
        '3-4': [
          'Names colors and numbers',
          'Understands counting',
          'Remembers parts of stories',
          'Understands "same" and "different"'
        ],
        '4-5': [
          'Counts 10+ things',
          'Draws person with 6+ body parts',
          'Prints some letters',
          'Understands time concepts'
        ]
      }
    }
  };

  const getAgeGroup = (ageInMonths) => {
    if (ageInMonths >= 12 && ageInMonths < 18) return '12-18';
    if (ageInMonths >= 18 && ageInMonths < 24) return '18-24';
    if (ageInMonths >= 24 && ageInMonths < 36) return '2-3';
    if (ageInMonths >= 36 && ageInMonths < 48) return '3-4';
    if (ageInMonths >= 48 && ageInMonths < 60) return '4-5';
    return '4-5'; // Default for older children
  };

  const toggleMilestone = (milestone) => {
    const key = `${selectedCategory}_${milestone}`;
    const newStatus = !milestoneData[key];
    
    setMilestoneData(prev => ({
      ...prev,
      [key]: newStatus
    }));

    // Add to progress history
    const newEntry = {
      date: new Date(),
      category: selectedCategory,
      milestone,
      achieved: newStatus,
      childAge: childAge
    };

    setProgressHistory(prev => [...prev, newEntry]);
  };

  const calculateProgress = (category) => {
    const ageGroup = getAgeGroup(childAge);
    const categoryMilestones = milestoneCategories[category]?.milestones[ageGroup] || [];
    
    const completed = categoryMilestones.filter(milestone => 
      milestoneData[`${category}_${milestone}`]
    ).length;

    return categoryMilestones.length > 0 ? (completed / categoryMilestones.length) * 100 : 0;
  };

  const getOverallProgress = () => {
    const categories = Object.keys(milestoneCategories);
    const totalProgress = categories.reduce((sum, category) => 
      sum + calculateProgress(category), 0
    );
    return totalProgress / categories.length;
  };

  const generateProgressChart = () => {
    // Generate sample data for the last 6 months
    const months = ['6m ago', '5m ago', '4m ago', '3m ago', '2m ago', '1m ago', 'Now'];
    const progressData = [45, 52, 61, 68, 75, 82, getOverallProgress()];

    return {
      labels: months,
      datasets: [{
        data: progressData,
        strokeWidth: 3,
        color: () => milestoneCategories[selectedCategory].color,
      }]
    };
  };

  const ageGroup = getAgeGroup(childAge);
  const currentMilestones = milestoneCategories[selectedCategory]?.milestones[ageGroup] || [];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F8FAFC', '#EFF6FF']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Milestone Progress Tracker</Text>
          <Text style={styles.subtitle}>{childName} • {Math.floor(childAge/12)} years {childAge%12} months</Text>
        </View>
        
        <View style={styles.overallProgress}>
          <Text style={styles.overallProgressLabel}>Overall Progress</Text>
          <Text style={styles.overallProgressValue}>
            {Math.round(getOverallProgress())}%
          </Text>
        </View>
      </LinearGradient>

      {/* Progress Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Progress Over Time</Text>
        <LineChart
          data={generateProgressChart()}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
            style: { borderRadius: 16 },
            propsForLabels: { fontSize: 12 },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Category Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
        {Object.entries(milestoneCategories).map(([key, category]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryCard,
              selectedCategory === key && styles.selectedCategoryCard
            ]}
            onPress={() => setSelectedCategory(key)}
          >
            <LinearGradient
              colors={selectedCategory === key 
                ? [category.color, category.color + '20'] 
                : ['#FFFFFF', '#F8FAFC']
              }
              style={styles.categoryGradient}
            >
              <View style={[
                styles.categoryIcon,
                { backgroundColor: selectedCategory === key ? '#FFFFFF' : category.color + '20' }
              ]}>
                <Feather 
                  name={category.icon} 
                  size={20} 
                  color={selectedCategory === key ? category.color : category.color} 
                />
              </View>
              <Text style={[
                styles.categoryTitle,
                { color: selectedCategory === key ? '#FFFFFF' : '#1E293B' }
              ]}>
                {category.title}
              </Text>
              <Text style={[
                styles.categoryProgress,
                { color: selectedCategory === key ? '#FFFFFF' : '#64748B' }
              ]}>
                {Math.round(calculateProgress(key))}%
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Milestone List */}
      <View style={styles.milestoneSection}>
        <Text style={styles.milestoneTitle}>
          {milestoneCategories[selectedCategory].title} • Age {ageGroup.replace('-', ' to ')} months
        </Text>
        
        <View style={styles.milestoneList}>
          {currentMilestones.map((milestone, index) => {
            const isCompleted = milestoneData[`${selectedCategory}_${milestone}`];
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.milestoneItem,
                  isCompleted && styles.completedMilestone
                ]}
                onPress={() => toggleMilestone(milestone)}
              >
                <View style={[
                  styles.milestoneCheckbox,
                  { backgroundColor: isCompleted ? milestoneCategories[selectedCategory].color : '#F1F5F9' }
                ]}>
                  {isCompleted && (
                    <Feather name="check" size={16} color="#FFFFFF" />
                  )}
                </View>
                
                <Text style={[
                  styles.milestoneText,
                  isCompleted && styles.completedMilestoneText
                ]}>
                  {milestone}
                </Text>
                
                {isCompleted && (
                  <View style={styles.achievedBadge}>
                    <Text style={styles.achievedText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Progress Summary */}
      <View style={styles.progressSummary}>
        <Text style={styles.summaryTitle}>Progress Summary</Text>
        <View style={styles.summaryGrid}>
          {Object.entries(milestoneCategories).map(([key, category]) => (
            <View key={key} style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: category.color + '20' }]}>
                <Feather name={category.icon} size={16} color={category.color} />
              </View>
              <Text style={styles.summaryLabel}>{category.title}</Text>
              <Text style={[styles.summaryValue, { color: category.color }]}>
                {Math.round(calculateProgress(key))}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  overallProgress: {
    alignItems: 'center',
  },
  overallProgressLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  overallProgressValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E40AF',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  categorySelector: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  categoryCard: {
    marginRight: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryProgress: {
    fontSize: 14,
    fontWeight: '700',
  },
  milestoneSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  milestoneList: {
    gap: 12,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedMilestone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  milestoneCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  milestoneText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  completedMilestoneText: {
    color: '#065F46',
    textDecorationLine: 'line-through',
  },
  achievedBadge: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  achievedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default MilestoneProgressTracker;