import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Add this import

const QUESTIONS = [
  {
    question: 'Does your child make eye contact when interacting with others?',
    options: ['Always', 'Sometimes', 'Rarely', 'Never'],
    scores: [0, 1, 2, 3],
  },
  {
    question: 'Does your child respond to their name being called?',
    options: ['Always', 'Sometimes', 'Rarely', 'Never'],
    scores: [0, 1, 2, 3],
  },
  {
    question: 'Does your child show interest in playing with other children?',
    options: ['Always', 'Sometimes', 'Rarely', 'Never'],
    scores: [0, 1, 2, 3],
  },
  {
    question: 'Does your child use gestures (like pointing or waving) to communicate?',
    options: ['Always', 'Sometimes', 'Rarely', 'Never'],
    scores: [0, 1, 2, 3],
  },
  {
    question: 'Does your child have repetitive behaviors (like hand-flapping or rocking)?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often'],
    scores: [0, 1, 2, 3],
  },
];

export default function DetectScreen() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter(); // Add this line

  const handleSelect = (qIdx, oIdx) => {
    const updated = [...answers];
    updated[qIdx] = oIdx;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      Alert.alert('Incomplete', 'Please answer all questions.');
      return;
    }
    setSubmitted(true);
  };

  const getScore = () => {
    return answers.reduce((sum, ans, idx) => sum + QUESTIONS[idx].scores[ans], 0);
  };

  const getResult = () => {
    const score = getScore();
    if (score <= 3) return 'Low risk of ASD. No immediate concern.';
    if (score <= 7) return 'Moderate risk. Consider monitoring and consulting a specialist.';
    return 'High risk. Please consult a healthcare professional for further assessment.';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          alignSelf: 'flex-start',
          marginBottom: 10,
          backgroundColor: '#E5E7EB',
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 14,
        }}
      >
        <Text style={{ color: '#1E40AF', fontWeight: '700', fontSize: 16 }}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>AutiScan Quick Screening</Text>
      {QUESTIONS.map((q, qIdx) => (
        <View key={qIdx} style={styles.questionBlock}>
          <Text style={styles.question}>{qIdx + 1}. {q.question}</Text>
          <View style={styles.optionsRow}>
            {q.options.map((opt, oIdx) => (
              <TouchableOpacity
                key={oIdx}
                style={[
                  styles.option,
                  answers[qIdx] === oIdx && styles.selectedOption,
                ]}
                onPress={() => handleSelect(qIdx, oIdx)}
                disabled={submitted}
              >
                <Text style={[
                  styles.optionText,
                  answers[qIdx] === oIdx && styles.selectedOptionText,
                ]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      {!submitted ? (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.resultBlock}>
          <Text style={styles.resultTitle}>Result</Text>
          <Text style={styles.resultText}>{getResult()}</Text>
          <Text style={styles.scoreText}>Score: {getScore()}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 24,
    textAlign: 'center',
  },
  questionBlock: {
    marginBottom: 28,
    width: '100%',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#1E40AF',
  },
  optionText: {
    color: '#1E293B',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultBlock: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
});