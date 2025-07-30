// import React, { useState } from "react";
// import { View, Text, Button, TouchableOpacity } from "react-native";
// import { questions } from "/screens/MChatQuestion";
// import { scoreMCHAT } from "/screens/MChatScoring";

// const MChatScreen = () => {
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [result, setResult] = useState(null);

//   const handleAnswer = (answer) => {
//     const updated = [...answers, answer];
//     setAnswers(updated);
//     if (current + 1 < questions.length) {
//       setCurrent(current + 1);
//     } else {
//       const score = scoreMCHAT(updated, questions);
//       setResult(score);
//     }
//   };

//   if (result) {
//     return (
//       <View style={{ padding: 20 }}>
//         <Text style={{ fontSize: 20, marginBottom: 10 }}>
//           M-CHAT-R Score: {result.score}
//         </Text>
//         <Text style={{ fontSize: 20, marginBottom: 10 }}>
//           Risk Level: {result.riskLevel}
//         </Text>
//         {result.riskLevel === "Medium" && (
//           <Text>Consider follow-up questions (M-CHAT-R/F)</Text>
//         )}
//         {result.riskLevel === "High" && (
//           <Text>
//             Recommend referral to a developmental specialist or psychologist.
//           </Text>
//         )}
//       </View>
//     );
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 18 }}>
//         Question {current + 1} of {questions.length}
//       </Text>
//       <Text style={{ fontSize: 22, marginVertical: 20 }}>
//         {questions[current].text}
//       </Text>
//       <TouchableOpacity onPress={() => handleAnswer("Yes")}>
//         <Text style={{ padding: 10, backgroundColor: "#4caf50", marginBottom: 10 }}>Yes</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => handleAnswer("No")}>
//         <Text style={{ padding: 10, backgroundColor: "#f44336" }}>No</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default MChatScreen;
// import React, { useState } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { questions } from "./MChatQuestions";         // ✅ fixed path
// import { scoreMCHAT } from "./MChatScoring";          // ✅ fixed path

// const MChatScreen = () => {
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [result, setResult] = useState(null);

//   const handleAnswer = (answer) => {
//     const updated = [...answers, answer];
//     setAnswers(updated);
//     if (current + 1 < questions.length) {
//       setCurrent(current + 1);
//     } else {
//       const score = scoreMCHAT(updated, questions);
//       setResult(score);
//     }
//   };

//   if (result) {
//     return (
//       <View style={{ padding: 20 }}>
//         <Text style={{ fontSize: 20, marginBottom: 10 }}>
//           M-CHAT-R Score: {result.score}
//         </Text>
//         <Text style={{ fontSize: 20, marginBottom: 10 }}>
//           Risk Level: {result.riskLevel}
//         </Text>
//         {result.riskLevel === "Medium" && (
//           <Text>Consider follow-up questions (M-CHAT-R/F)</Text>
//         )}
//         {result.riskLevel === "High" && (
//           <Text>
//             Recommend referral to a developmental specialist or psychologist.
//           </Text>
//         )}
//       </View>
//     );
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 18 }}>
//         Question {current + 1} of {questions.length}
//       </Text>
//       <Text style={{ fontSize: 22, marginVertical: 20 }}>
//         {questions[current].text}
//       </Text>
//       <TouchableOpacity onPress={() => handleAnswer("Yes")}>
//         <Text style={{ padding: 10, backgroundColor: "#4caf50", marginBottom: 10 }}>Yes</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => handleAnswer("No")}>
//         <Text style={{ padding: 10, backgroundColor: "#f44336" }}>No</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default MChatScreen;
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { questions } from "./MChatQuestions";
import { scoreMCHAT } from "./MChatScoring";

const MChatScreen = ({ navigation }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    
    // Add a small delay to show the selection before moving to next question
    setTimeout(() => {
      const updated = [...answers, answer];
      setAnswers(updated);
      
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelectedAnswer(null); // Reset selection for next question
      } else {
        const score = scoreMCHAT(updated, questions);
        setResult(score);
        setSelectedAnswer(null);
      }
    }, 200);
  };

  const handleRetakeAssessment = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
    setSelectedAnswer(null);
  };

  // Modified navigation function with multiple options
  const handleGoHome = () => {
    // Option 1: Navigate to specific screen (most common)
    navigation.navigate('Home');
    
    // Option 2: Go back to previous screen
    // navigation.goBack();
    
    // Option 3: Reset navigation stack and go to home
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Home' }],
    // });
    
    // Option 4: Pop to top of stack
    // navigation.popToTop();
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "Low": return styles.lowRisk;
      case "Medium": return styles.mediumRisk;
      case "High": return styles.highRisk;
      default: return styles.defaultRisk;
    }
  };

  if (result) {
    return (
      <View style={styles.container}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Assessment Complete</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>M-CHAT-R Score</Text>
            <Text style={styles.scoreValue}>{result.score}</Text>
          </View>

          <View style={styles.riskContainer}>
            <Text style={styles.riskLabel}>Risk Level</Text>
            <View style={[styles.riskBadge, getRiskLevelColor(result.riskLevel)]}>
              <Text style={styles.riskValue}>{result.riskLevel}</Text>
            </View>
          </View>

          <View style={styles.recommendationContainer}>
            {result.riskLevel === "Medium" && (
              <Text style={styles.recommendationText}>
                Consider follow-up questions (M-CHAT-R/F)
              </Text>
            )}
            {result.riskLevel === "High" && (
              <Text style={styles.recommendationText}>
                Recommend referral to a developmental specialist or psychologist.
              </Text>
            )}
          </View>

          <View style={styles.resultButtonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.retakeButton]} 
              onPress={handleRetakeAssessment}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Retake Assessment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.homeButton]} 
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>🏠 Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoHome}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {current + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((current + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>
          {questions[current].text}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.yesButton,
            selectedAnswer === "Yes" && styles.selectedButton
          ]} 
          onPress={() => handleAnswer("Yes")}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.buttonText,
            selectedAnswer === "Yes" && styles.selectedButtonText
          ]}>
            Yes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.noButton,
            selectedAnswer === "No" && styles.selectedButton
          ]} 
          onPress={() => handleAnswer("No")}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.buttonText,
            selectedAnswer === "No" && styles.selectedButtonText
          ]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 20,
    lineHeight: 28,
    color: '#1e293b',
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  yesButton: {
    backgroundColor: '#10b981',
  },
  noButton: {
    backgroundColor: '#ef4444',
  },
  selectedButton: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  selectedButtonText: {
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
  },
  riskContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  riskLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
  },
  riskBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  riskValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  lowRisk: {
    backgroundColor: '#10b981',
  },
  mediumRisk: {
    backgroundColor: '#f59e0b',
  },
  highRisk: {
    backgroundColor: '#ef4444',
  },
  defaultRisk: {
    backgroundColor: '#64748b',
  },
  recommendationContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    textAlign: 'center',
  },
  resultButtonContainer: {
    gap: 12,
  },
  retakeButton: {
    backgroundColor: '#3b82f6',
  },
  homeButton: {
    backgroundColor: '#059669',
    paddingVertical: 18,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default MChatScreen;