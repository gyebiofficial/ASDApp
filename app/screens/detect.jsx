import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const QUESTIONS = [
  'Does your child make eye contact when interacting with others?',
  'Does your child respond to their name being called?',
  'Does your child show interest in playing with other children?',
  'Does your child use gestures (like pointing or waving) to communicate?',
  'Does your child have repetitive behaviors (like hand-flapping or rocking)?',
];

export default function DetectScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered
      setSubmitted(true);
    }
  };

  const getScore = () => {
    // Count "No" answers (higher score = higher risk)
    return answers.filter(answer => answer === 'No').length;
  };

  const getResult = () => {
    const score = getScore();
    if (score <= 1) return 'Low risk of ASD. No immediate concern.';
    if (score <= 3) return 'Moderate risk. Consider monitoring and consulting a specialist.';
    return 'High risk. Please consult a healthcare professional for further assessment.';
  };

  const resetScreening = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        style={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push('/screens/home')}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.backButtonGradient}
          >
            <Feather name="arrow-left" size={20} color="#1E40AF" />
            <Text style={styles.backButtonText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Feather name="check-circle" size={48} color="#10B981" />
            <Text style={styles.resultTitle}>Screening Complete</Text>
          </View>
          
          <View style={styles.resultContent}>
            <Text style={styles.resultText}>{getResult()}</Text>
            <Text style={styles.scoreText}>Score: {getScore()}/{QUESTIONS.length}</Text>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={resetScreening}>
              <Text style={styles.retakeButtonText}>Take Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.homeButton} 
              onPress={() => router.push('/screens/home')}
            >
              <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                style={styles.homeButtonGradient}
              >
                <Text style={styles.homeButtonText}>Go to Home</Text>
                <Feather name="home" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6', '#60A5FA']}
      style={styles.container}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.push('/screens/home')}
        style={styles.backButton}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.backButtonGradient}
        >
          <Feather name="arrow-left" size={20} color="#1E40AF" />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Q{currentQuestion + 1}</Text>
          <Feather name="help-circle" size={24} color="#1E40AF" />
        </View>
        
        <Text style={styles.questionText}>
          {QUESTIONS[currentQuestion]}
        </Text>

        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={styles.yesButton}
            onPress={() => handleAnswer('Yes')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.answerButtonGradient}
            >
              <Feather name="check" size={24} color="#FFFFFF" />
              <Text style={styles.answerButtonText}>Yes</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.noButton}
            onPress={() => handleAnswer('No')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.answerButtonGradient}
            >
              <Feather name="x" size={24} color="#FFFFFF" />
              <Text style={styles.answerButtonText}>No</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Back Button
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  backButtonText: {
    color: '#1E40AF',
    fontWeight: '700',
    fontSize: 16,
  },

  // Progress
  progressContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },

  // Question Card
  questionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    justifyContent: 'space-between',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 32,
    flex: 1,
    textAlignVertical: 'center',
  },

  // Answer Buttons
  answerButtons: {
    gap: 16,
    marginTop: 32,
  },
  yesButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  noButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  answerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  // Result Card
  resultCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    justifyContent: 'space-between',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 16,
  },
  resultContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  resultActions: {
    gap: 16,
  },
  retakeButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  retakeButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  homeButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  homeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});