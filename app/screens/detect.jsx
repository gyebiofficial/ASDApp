import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  TextInput, 
  Modal,
  FlatList 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { addAssessment, getAllChildren } from '../services/firebaseService';
import ResourcesCard from '../components/ResourcesCard';

// Scoring function
export function scoreMCHAT(answers, questions) {
  let riskScore = 0;
  answers.forEach((answer, index) => {
    if (answer === questions[index].riskAnswer) {
      riskScore += 1;
    }
  });

  let riskLevel = "Low";
  if (riskScore >= 8) riskLevel = "High";
  else if (riskScore >= 3) riskLevel = "Medium";

  return {
    score: riskScore,
    riskLevel,
  };
}

// Utility function to calculate age
export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Format date for display
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export const questions = [
  {
    text: "If you point at something across the room, does your child look at it?",
    riskAnswer: "No",
  },
  {
    text: "Have you ever wondered if your child might be deaf?",
    riskAnswer: "Yes",
  },
  {
    text: "Does your child respond to social cues (like smiling back when smiled at)?",
    riskAnswer: "No",
  },
  {
    text: "Does your child play pretend or make-believe?",
    riskAnswer: "No",
  },
  {
    text: "Does your child like climbing on things?",
    riskAnswer: "No",
  },
  {
    text: "Does your child make unusual finger movements near his or her eyes?",
    riskAnswer: "Yes",
  },
  {
    text: "Does your child point with one finger to ask for something or to get help?",
    riskAnswer: "No",
  },
  {
    text: "Is your child interested in other children?",
    riskAnswer: "No",
  },
  {
    text: "Does your child show you things by bringing them to you or holding them up for you to see — not to get help, but just to share?",
    riskAnswer: "No",
  },
  {
    text: "Does your child respond when you call his or her name?",
    riskAnswer: "No",
  },
  {
    text: "When you smile at your child, does he or she smile back at you?",
    riskAnswer: "No",
  },
  {
    text: "Does your child get upset by everyday noises?",
    riskAnswer: "Yes",
  },
  {
    text: "Does your child walk?",
    riskAnswer: "No",
  },
  {
    text: "Does your child look you in the eye when you are talking to him or her, playing with him or her, or dressing him?",
    riskAnswer: "No",
  },
  {
    text: "Does your child try to copy what you do?",
    riskAnswer: "No",
  },
  {
    text: "If you turn your head to look at something, does your child look around to see what you are looking at?",
    riskAnswer: "No",
  },
  {
    text: "Does your child try to get you to watch him or her?",
    riskAnswer: "No",
  },
  {
    text: "Does your child understand when you tell him or her to do something?",
    riskAnswer: "No",
  },
  {
    text: "If something new happens, does your child look at your face to see how you feel about it?",
    riskAnswer: "No",
  },
  {
    text: "Does your child like movement activities?",
    riskAnswer: "No",
  },
];

// Custom Date Picker Component
const CustomDatePicker = ({ visible, onClose, onDateSelect, initialDate }) => {
  const currentYear = new Date().getFullYear();
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleConfirm = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    onDateSelect(selectedDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.datePickerOverlay}>
        <View style={styles.datePickerContainer}>
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Date of Birth</Text>
          </View>

          <View style={styles.datePickerContent}>
            {/* Month Selector */}
            <View style={styles.dateColumn}>
              <Text style={styles.dateColumnTitle}>Month</Text>
              <ScrollView style={styles.dateScrollView} showsVerticalScrollIndicator={false}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.dateOption,
                      selectedMonth === index && styles.dateOptionSelected
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text style={[
                      styles.dateOptionText,
                      selectedMonth === index && styles.dateOptionTextSelected
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Day Selector */}
            <View style={styles.dateColumn}>
              <Text style={styles.dateColumnTitle}>Day</Text>
              <ScrollView style={styles.dateScrollView} showsVerticalScrollIndicator={false}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dateOption,
                      selectedDay === day && styles.dateOptionSelected
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.dateOptionText,
                      selectedDay === day && styles.dateOptionTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Year Selector */}
            <View style={styles.dateColumn}>
              <Text style={styles.dateColumnTitle}>Year</Text>
              <ScrollView style={styles.dateScrollView} showsVerticalScrollIndicator={false}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.dateOption,
                      selectedYear === year && styles.dateOptionSelected
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[
                      styles.dateOptionText,
                      selectedYear === year && styles.dateOptionTextSelected
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.datePickerActions}>
            <TouchableOpacity style={styles.datePickerCancelButton} onPress={onClose}>
              <Text style={styles.datePickerCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.datePickerConfirmButton} onPress={handleConfirm}>
              <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.datePickerConfirmGradient}>
                <Text style={styles.datePickerConfirmText}>Confirm</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Add Child Form Component
const AddChildForm = ({ visible, onClose, onSave }) => {
  const [childData, setChildData] = useState({
    name: '',
    dateOfBirth: new Date(),
    gender: '',
    notes: '',
    parentName: '',
    relationship: 'Parent'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!childData.name.trim()) {
      newErrors.name = 'Child name is required';
    }
    
    if (!childData.parentName.trim()) {
      newErrors.parentName = 'Parent/Guardian name is required';
    }

    const age = calculateAge(childData.dateOfBirth);
    if (age < 0 || age > 10) {
      newErrors.dateOfBirth = 'Please enter a valid date of birth (0-10 years)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const newChild = {
        id: Date.now().toString(),
        ...childData,
        age: calculateAge(childData.dateOfBirth),
        createdAt: new Date().toISOString(),
        assessments: []
      };
      onSave(newChild);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setChildData({
      name: '',
      dateOfBirth: new Date(),
      gender: '',
      notes: '',
      parentName: '',
      relationship: 'Parent'
    });
    setErrors({});
  };

  const handleDateSelect = (selectedDate) => {
    setChildData({ ...childData, dateOfBirth: selectedDate });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add New Child</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            {/* Child Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Child's Full Name *</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                value={childData.name}
                onChangeText={(text) => setChildData({ ...childData, name: text })}
                placeholder="Enter child's full name"
                placeholderTextColor="#94A3B8"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <TouchableOpacity
                style={[styles.dateInput, errors.dateOfBirth && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Feather name="calendar" size={20} color="#64748B" />
                <Text style={styles.dateText}>
                  {formatDate(childData.dateOfBirth)}
                </Text>
                <Text style={styles.ageText}>
                  (Age: {calculateAge(childData.dateOfBirth)} years)
                </Text>
              </TouchableOpacity>
              {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      childData.gender === gender && styles.genderButtonSelected
                    ]}
                    onPress={() => setChildData({ ...childData, gender })}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      childData.gender === gender && styles.genderButtonTextSelected
                    ]}>
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Parent/Guardian Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Parent/Guardian Name *</Text>
              <TextInput
                style={[styles.textInput, errors.parentName && styles.inputError]}
                value={childData.parentName}
                onChangeText={(text) => setChildData({ ...childData, parentName: text })}
                placeholder="Enter parent/guardian name"
                placeholderTextColor="#94A3B8"
              />
              {errors.parentName && <Text style={styles.errorText}>{errors.parentName}</Text>}
            </View>

            {/* Relationship */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <View style={styles.relationshipContainer}>
                {['Parent', 'Guardian', 'Caregiver', 'Other'].map((relationship) => (
                  <TouchableOpacity
                    key={relationship}
                    style={[
                      styles.relationshipButton,
                      childData.relationship === relationship && styles.relationshipButtonSelected
                    ]}
                    onPress={() => setChildData({ ...childData, relationship })}
                  >
                    <Text style={[
                      styles.relationshipButtonText,
                      childData.relationship === relationship && styles.relationshipButtonTextSelected
                    ]}>
                      {relationship}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                value={childData.notes}
                onChangeText={(text) => setChildData({ ...childData, notes: text })}
                placeholder="Any additional information about the child..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.saveButtonGradient}>
                <Feather name="save" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Child</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CustomDatePicker
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onDateSelect={handleDateSelect}
          initialDate={childData.dateOfBirth}
        />
      </LinearGradient>
    </Modal>
  );
};

// Child Selection Modal Component
const ChildSelectionModal = ({ visible, onClose, children, onSelectChild, router }) => {
  const renderChildItem = ({ item }) => (
    <TouchableOpacity
      style={styles.childSelectionCard}
      onPress={() => onSelectChild(item)}
      activeOpacity={0.8}
    >
      <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.childSelectionGradient}>
        <View style={styles.childSelectionHeader}>
          <View style={styles.childSelectionAvatar}>
            <Text style={styles.childSelectionAvatarText}>
              {item.firstName?.charAt(0)}{item.lastName?.charAt(0)}
            </Text>
          </View>
          <View style={styles.childSelectionInfo}>
            <Text style={styles.childSelectionName}>{item.fullName}</Text>
            <Text style={styles.childSelectionAge}>Age: {item.age}</Text>
            <Text style={styles.childSelectionGender}>{item.gender}</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#64748B" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Child for Assessment</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.childSelectionContainer}>
          {children.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="users" size={64} color="#64748B" />
              <Text style={styles.emptyStateTitle}>No Children Added</Text>
              <Text style={styles.emptyStateText}>
                You need to add a child first before starting an assessment.
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton} 
                onPress={() => {
                  onClose();
                  router.push('/screens/children'); // ✅ Now router is available
                }}
              >
                <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.emptyStateButtonGradient}>
                  <Feather name="plus" size={20} color="#FFFFFF" />
                  <Text style={styles.emptyStateButtonText}>Add Child</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.selectionInstructions}>
                Please select a child to perform the M-CHAT assessment for:
              </Text>
              <FlatList
                data={children}
                renderItem={renderChildItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.childSelectionList}
              />

              {/* Add New Child Button */}
              <TouchableOpacity
                style={[styles.addChildButton, { marginTop: 16 }]}
                onPress={() => {
                  onClose();
                  router.push('/screens/children'); // ✅ Now router is available
                }}
              >
                <LinearGradient colors={['#059669', '#10B981']} style={styles.addChildButtonGradient}>
                  <Feather name="plus" size={20} color="#FFFFFF" />
                  <Text style={styles.addChildButtonText}>Add New Child</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>
    </Modal>
  );
};

// Main DetectScreen Component
const DetectScreen = () => {
  const { user, isLoaded } = useUser(); // Add isLoaded
  const router = useRouter();
  const params = useLocalSearchParams();
  const { childId, childName, childAge } = params;
  
  // ✅ All state declarations
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showChildSelection, setShowChildSelection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assessmentStarted, setAssessmentStarted] = useState(false); // ✅ UNCOMMENT THIS

  // ✅ Early returns for loading states
  if (!isLoaded) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading user...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Please sign in to continue</Text>
        </View>
      </LinearGradient>
    );
  }

  // Check if child was passed from navigation
  useEffect(() => {
    if (childId && childName) {
      setSelectedChild({
        id: childId,
        fullName: childName,
        age: childAge
      });
      setAssessmentStarted(true);
    }
  }, [childId, childName, childAge]);

  // ✅ Updated loadChildren with proper checks
  const loadChildren = async () => {
    // Don't proceed if user isn't loaded or doesn't exist
    if (!isLoaded || !user?.id) {
      console.log('User not ready:', { isLoaded, userId: user?.id });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Loading children for user:', user.id);
      const userChildren = await getAllChildren(user.id);
      setChildren(userChildren);
      console.log(`Loaded ${userChildren.length} children for user:`, user.id);
    } catch (error) {
      console.error('Error in loadChildren:', error);
      Alert.alert('Error', 'Failed to load children data');
    } finally {
      setLoading(false);
    }
  };

  // Only load children when user is ready
  useEffect(() => {
    if (isLoaded && user?.id) {
      loadChildren();
    }
  }, [isLoaded, user?.id]); // Watch both isLoaded and user.id

  const handleSelectChild = (child) => {
    setSelectedChild(child);
    setShowChildSelection(false);
    setAssessmentStarted(true);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    
    setTimeout(() => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // All questions answered - calculate result
        const assessmentResult = scoreMCHAT(newAnswers, questions);
        setResult(assessmentResult);
        setSelectedAnswer(null);
        
        // Save assessment to Firebase
        saveAssessmentToFirebase(assessmentResult, newAnswers);
      }
    }, 200);
  };

  // ✅ Save assessment with user ID
  const saveAssessmentToFirebase = async (assessmentResult, answers) => {
    if (!selectedChild) {
      console.error('No child selected for assessment');
      return;
    }

    if (!user?.id) {
      console.error('No user logged in');
      Alert.alert('Error', 'User not authenticated. Please sign in again.');
      return;
    }

    const assessmentData = {
      userId: user.id, // 🔑 Critical: Links assessment to user
      userEmail: user.primaryEmailAddress?.emailAddress,
      childId: selectedChild.id,
      childName: selectedChild.fullName,
      childAge: selectedChild.age,
      assessmentType: 'M-CHAT-R',
      score: assessmentResult.score,
      riskLevel: assessmentResult.riskLevel,
      answers: answers,
      totalQuestions: questions.length,
      createdAt: new Date(),
    };

    try {
      const assessmentId = await addAssessment(assessmentData);
      console.log('Assessment saved with ID:', assessmentId);
    } catch (error) {
      console.error('Error saving assessment:', error);
      Alert.alert('Error', 'Failed to save assessment results.');
    }
  };

  const resetScreening = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setSelectedAnswer(null);
    setAssessmentStarted(false);
    
    // Show child selection again if we have children
    if (children.length > 0) {
      setShowChildSelection(true);
    }
  };

  const startNewAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setSelectedAnswer(null);
    setSelectedChild(null);
    setAssessmentStarted(false);
    setShowChildSelection(true);
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "Low": return ['#10B981', '#059669'];
      case "Medium": return ['#F59E0B', '#D97706'];
      case "High": return ['#EF4444', '#DC2626'];
      default: return ['#64748B', '#475569'];
    }
  };

  const getRiskLevelIcon = (riskLevel) => {
    switch (riskLevel) {
      case "Low": return "check-circle";
      case "Medium": return "alert-triangle";
      case "High": return "alert-circle";
      default: return "info";
    }
  };

  const getRiskLevelMessage = (riskLevel) => {
    switch (riskLevel) {
      case "Low":
        return "Low risk detected. Continue regular developmental monitoring.";
      case "Medium":
        return "Medium risk detected. Consider follow-up questions (M-CHAT-R/F) and consult with your pediatrician.";
      case "High":
        return "High risk detected. Recommend referral to a developmental specialist or psychologist for comprehensive evaluation.";
      default:
        return "Assessment complete.";
    }
  };

  // If loading, show loading screen
  if (loading) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading children...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Result Screen
  if (result && selectedChild) {
    const riskColors = getRiskLevelColor(result.riskLevel);
    
    return (
      <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push('/screens/home')}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.backButtonGradient}>
            <Feather name="arrow-left" size={20} color="#1E40AF" />
            <Text style={styles.backButtonText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>

        <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.resultCard}>
            <View style={styles.childInfoHeader}>
              <Feather name="user" size={20} color="#64748B" />
              <Text style={styles.childInfoText}>
                Assessment for {selectedChild.fullName} (Age: {selectedChild.age})
              </Text>
            </View>

            <View style={styles.resultHeader}>
              <LinearGradient colors={riskColors} style={styles.resultIconContainer}>
                <Feather name={getRiskLevelIcon(result.riskLevel)} size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.resultTitle}>M-CHAT-R Assessment Complete</Text>
            </View>

            <View style={styles.resultScoreSection}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Risk Score</Text>
                <Text style={styles.scoreValue}>{result.score}</Text>
                <Text style={styles.scoreTotal}>out of {questions.length}</Text>
              </View>
              <View style={styles.riskLevelContainer}>
                <Text style={styles.riskLabel}>Risk Level</Text>
                <LinearGradient colors={riskColors} style={styles.riskBadge}>
                  <Text style={styles.riskValue}>{result.riskLevel} Risk</Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.recommendationContainer}>
              <Text style={styles.recommendationTitle}>Recommendation</Text>
              <Text style={styles.recommendationText}>
                {getRiskLevelMessage(result.riskLevel)}
              </Text>
            </View>

            {/* ✅ ADD THIS - Ghana Resources Card for Medium and High Risk */}
            <ResourcesCard riskLevel={result.riskLevel} />

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.retakeButton} onPress={resetScreening}>
                <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.retakeButtonGradient}>
                  <Feather name="refresh-cw" size={18} color="#475569" />
                  <Text style={styles.retakeButtonText}>Retake for Same Child</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.newAssessmentButton} onPress={startNewAssessment}>
                <LinearGradient colors={['#059669', '#10B981']} style={styles.newAssessmentButtonGradient}>
                  <Feather name="plus" size={18} color="#FFFFFF" />
                  <Text style={styles.newAssessmentButtonText}>New Assessment</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/screens/home')}>
                <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.homeButtonGradient}>
                  <Feather name="home" size={18} color="#FFFFFF" />
                  <Text style={styles.homeButtonText}>Back to Home</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // Pre-assessment screen (child not selected or assessment not started)
  if (!assessmentStarted || !selectedChild) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push('/screens/home')}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.backButtonGradient}>
            <Feather name="arrow-left" size={20} color="#1E40AF" />
            <Text style={styles.backButtonText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.preAssessmentContainer}>
          <View style={styles.preAssessmentCard}>
            <View style={styles.preAssessmentHeader}>
              <Feather name="clipboard" size={48} color="#1E40AF" />
              <Text style={styles.preAssessmentTitle}>M-CHAT-R Assessment</Text>
              <Text style={styles.preAssessmentSubtitle}>
                Modified Checklist for Autism in Toddlers - Revised
              </Text>
            </View>

            <View style={styles.preAssessmentInfo}>
              <Text style={styles.infoTitle}>Before we begin:</Text>
              <Text style={styles.infoText}>
                • You need to select a child for this assessment{'\n'}
                • The assessment takes about 5-10 minutes{'\n'}
                • Answer questions based on your child's typical behavior{'\n'}
                • This is a screening tool, not a diagnostic test
              </Text>
            </View>

            {children.length > 0 ? (
              <TouchableOpacity 
                style={styles.selectChildButton} 
                onPress={() => setShowChildSelection(true)}
              >
                <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.selectChildButtonGradient}>
                  <Feather name="users" size={20} color="#FFFFFF" />
                  <Text style={styles.selectChildButtonText}>Select Child to Assess</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.addChildButton} 
                onPress={() => router.push('/screens/children')}
              >
                <LinearGradient colors={['#059669', '#10B981']} style={styles.addChildButtonGradient}>
                  <Feather name="plus" size={20} color="#FFFFFF" />
                  <Text style={styles.addChildButtonText}>Add a Child First</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ChildSelectionModal
          visible={showChildSelection}
          onClose={() => setShowChildSelection(false)}
          children={children}
          onSelectChild={handleSelectChild}
          router={router} // ✅ Pass router as prop
        />
      </LinearGradient>
    );
  }

  // Question Screen (assessment in progress)
  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Exit Assessment',
              'Are you sure you want to exit? Your progress will be lost.',
              [
                { text: 'Continue Assessment', style: 'cancel' },
                { text: 'Exit', style: 'destructive', onPress: () => router.push('/screens/home') }
              ]
            );
          }}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.backButtonGradient}>
            <Feather name="arrow-left" size={20} color="#1E40AF" />
            <Text style={styles.backButtonText}>Exit</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.selectedChildInfo}>
        <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.selectedChildCard}>
          <Feather name="user" size={20} color="#1E40AF" />
          <Text style={styles.selectedChildText}>
            Assessment for: {selectedChild.fullName} (Age: {selectedChild.age})
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#3B82F6', '#60A5FA']}
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
            ]}
          />
        </View>
      </View>

      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.questionNumberContainer}>
            <Text style={styles.questionNumber}>Q{currentQuestion + 1}</Text>
          </LinearGradient>
          <View style={styles.questionIconContainer}>
            <Feather name="help-circle" size={24} color="#3B82F6" />
          </View>
        </View>

        <Text style={styles.questionText}>
          {questions[currentQuestion].text}
        </Text>

        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={[styles.yesButton, selectedAnswer === 'Yes' && styles.selectedButton]}
            onPress={() => handleAnswer('Yes')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#10B981', '#059669']} style={styles.answerButtonGradient}>
              <Feather name="check" size={24} color="#FFFFFF" />
              <Text style={styles.answerButtonText}>Yes</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.noButton, selectedAnswer === 'No' && styles.selectedButton]}
            onPress={() => handleAnswer('No')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.answerButtonGradient}>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  // Back Button
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    color: '#1E40AF',
    fontWeight: '700',
    fontSize: 16,
  },
  headerSpacer: {
    flex: 1, // This will push the back button to the left
  },
  // Selected Child Info
  selectedChildInfo: {
    marginBottom: 20,
  },
  selectedChildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  selectedChildText: {
    color: '#1E40AF',
    fontWeight: '600',
    fontSize: 14,
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
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    justifyContent: 'space-between',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  questionNumberContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
  },
  questionIconContainer: {
    padding: 8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  noButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  selectedButton: {
    transform: [{ scale: 0.95 }],
    elevation: 8,
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
    fontSize: 18,
    fontWeight: '700',
  },
  // Result Container
  resultContainer: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  childInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  childInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  // Result Score Section
  resultScoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
  },
  scoreTotal: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  riskLevelContainer: {
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  riskBadge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  riskValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Recommendation
  recommendationContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  recommendationText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Result Actions
  resultActions: {
    gap: 12,
  },
  retakeButton: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  retakeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  retakeButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  newAssessmentButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 12,
  },
  newAssessmentButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  newAssessmentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  // Form Styles
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  ageText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  genderButtonSelected: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  genderButtonTextSelected: {
    color: '#1E40AF',
  },
  relationshipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  relationshipButtonSelected: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  relationshipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  relationshipButtonTextSelected: {
    color: '#1E40AF',
  },
  saveButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop: 16,
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
    fontSize: 18,
    fontWeight: '700',
  },
  // Children Management
  childrenContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyStateButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  childrenList: {
    paddingBottom: 40,
  },
  childCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  childCardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  childCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  childGender: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  childStats: {
    alignItems: 'flex-end',
  },
  assessmentCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  // Custom Date Picker Styles
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  datePickerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  datePickerContent: {
    flexDirection: 'row',
    height: 200,
  },
  dateColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  dateColumnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dateScrollView: {
    flex: 1,
  },
  dateOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dateOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  dateOptionTextSelected: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  datePickerActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  datePickerCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  datePickerCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  datePickerConfirmButton: {
    flex: 1,
    borderRadius: 12,
  },
  datePickerConfirmGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  datePickerConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // New styles for child selection and pre-assessment
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  preAssessmentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  preAssessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  preAssessmentHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  preAssessmentTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  preAssessmentSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  preAssessmentInfo: {
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  selectChildButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  selectChildButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  selectChildButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  addChildButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addChildButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  addChildButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  // Child Selection Modal Styles
  childSelectionContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  selectionInstructions: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  childSelectionList: {
    paddingBottom: 40,
  },
  childSelectionCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  childSelectionGradient: {
    borderRadius: 16,
    padding: 20,
  },
  childSelectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childSelectionAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  childSelectionAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  childSelectionInfo: {
    flex: 1,
  },
  childSelectionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  childSelectionAge: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  childSelectionGender: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});
// At the bottom of your detect.jsx file, make sure you have:
export default DetectScreen;