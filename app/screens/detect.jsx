// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Feather } from '@expo/vector-icons';
// import { useState } from 'react';

// // const QUESTIONS = [
// //   'If you point at something across the room, does your child look at it?',
// //   'Have you ever wondered if your child might be deaf?',
// //   'Does your child respond to social cues (like smiling back when smiled at)?',
// //   'Does your child play pretend or make-believe?',
// //   'Does your child like climbing on things?',
// //   'Does your child make unusual finger movements near his or her eyes?',
// //   'Does your child point with one finger to ask for something or to get help?',
// //   'Is your child interested in other children?',
// //   'Does your child show you things by bringing them to you or holding them up for you to see — not to get help, but just to share?',
// //   'Does your child respond when you call his or her name? ',
// //   'When you smile at your child, does he or she smile back at you?',
// //   'Does your child get upset by everyday noises?',
// //   'Does your child walk?',
// //   'Does your child look you in the eye when you are talking to him or her, playing with him or her, or dressing him or her?',
// //   'Does your child try to copy what you do?',
// //   'If you turn your head to look at something, does your child look around to see what you are looking at?',
// //   'Does your child try to get you to watch him or her?',
// //   'Does your child understand when you tell him or her to do something?',
// //   'If something new happens, does your child look at your face to see how you feel about it?',
// //   'Does your child like movement activities?', 
//   // 'Does your child make eye contact when interacting with others?',
//   // 'Does your child respond to their name being called?',
//   // 'Does your child show interest in playing with other children?',
//   // 'Does your child use gestures (like pointing or waving) to communicate?',
//   // 'Does your child have repetitive behaviors (like hand-flapping or rocking)?',
// // ];
// export const questions = [
//   {
//     text: "If you point at something across the room, does your child look at it?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Have you ever wondered if your child might be deaf?",
//     riskAnswer: "Yes",
//   },
//   {
//     text: "Does your child respond to social cues (like smiling back when smiled at)?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child play pretend or make-believe?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child like climbing on things?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child make unusual finger movements near his or her eyes?",
//     riskAnswer: "Yes",
//   },
//   {
//     text: "Does your child point with one finger to ask for something or to get help?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Is your child interested in other children?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child show you things by bringing them to you or holding them up for you to see — not to get help, but just to share?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child respond when you call his or her name?",
//     riskAnswer: "No",
//   },
//   {
//     text: "When you smile at your child, does he or she smile back at you?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child get upset by everyday noises?",
//     riskAnswer: "Yes",
//   },
//   {
//     text: "Does your child walk?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child look you in the eye when you are talking to him or her, playing with him or her, or dressing him or her?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child try to copy what you do?",
//     riskAnswer: "No",
//   },
//   {
//     text: "If you turn your head to look at something, does your child look around to see what you are looking at?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child try to get you to watch him or her?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child understand when you tell him or her to do something?",
//     riskAnswer: "No",
//   },
//   {
//     text: "If something new happens, does your child look at your face to see how you feel about it?",
//     riskAnswer: "No",
//   },
//   {
//     text: "Does your child like movement activities?",
//     riskAnswer: "No",
//   },
// ];


// export default function DetectScreen() {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [submitted, setSubmitted] = useState(false);
//   const router = useRouter();

//   const handleAnswer = (answer) => {
//     const newAnswers = [...answers, answer];
//     setAnswers(newAnswers);

//     if (currentQuestion < QUESTIONS.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     } else {
//       // All questions answered
//       setSubmitted(true);
//     }
//   };

//   const getScore = () => {
//     // Count "No" answers (higher score = higher risk)
//     return answers.filter(answer => answer === 'No').length;
//   };

//   const getResult = () => {
//     const score = getScore();
//     if (score <= 1) return 'Low risk of ASD. No immediate concern.';
//     if (score <= 3) return 'Moderate risk. Consider monitoring and consulting a specialist.';
//     return 'High risk. Please consult a healthcare professional for further assessment.';
//   };

//   const resetScreening = () => {
//     setCurrentQuestion(0);
//     setAnswers([]);
//     setSubmitted(false);
//   };

//   if (submitted) {
//     return (
//       <LinearGradient
//         colors={['#1E40AF', '#3B82F6', '#60A5FA']}
//         style={styles.container}
//       >
//         {/* Back Button */}
//         <TouchableOpacity
//           onPress={() => router.push('/screens/home')}
//           style={styles.backButton}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={['#FFFFFF', '#F8FAFC']}
//             style={styles.backButtonGradient}
//           >
//             <Feather name="arrow-left" size={20} color="#1E40AF" />
//             <Text style={styles.backButtonText}>Back to Home</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <View style={styles.resultCard}>
//           <View style={styles.resultHeader}>
//             <Feather name="check-circle" size={48} color="#10B981" />
//             <Text style={styles.resultTitle}>Screening Complete</Text>
//           </View>
          
//           <View style={styles.resultContent}>
//             <Text style={styles.resultText}>{getResult()}</Text>
//             <Text style={styles.scoreText}>Score: {getScore()}/{QUESTIONS.length}</Text>
//           </View>

//           <View style={styles.resultActions}>
//             <TouchableOpacity style={styles.retakeButton} onPress={resetScreening}>
//               <Text style={styles.retakeButtonText}>Take Again</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.homeButton} 
//               onPress={() => router.push('/screens/home')}
//             >
//               <LinearGradient
//                 colors={['#1E40AF', '#3B82F6']}
//                 style={styles.homeButtonGradient}
//               >
//                 <Text style={styles.homeButtonText}>Go to Home</Text>
//                 <Feather name="home" size={18} color="#FFFFFF" />
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient
//       colors={['#1E40AF', '#3B82F6', '#60A5FA']}
//       style={styles.container}
//     >
//       {/* Back Button */}
//       <TouchableOpacity
//         onPress={() => router.push('/screens/home')}
//         style={styles.backButton}
//         activeOpacity={0.8}
//       >
//         <LinearGradient
//           colors={['#FFFFFF', '#F8FAFC']}
//           style={styles.backButtonGradient}
//         >
//           <Feather name="arrow-left" size={20} color="#1E40AF" />
//           <Text style={styles.backButtonText}>Back to Home</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       {/* Progress Indicator */}
//       <View style={styles.progressContainer}>
//         <Text style={styles.progressText}>
//           Question {currentQuestion + 1} of {QUESTIONS.length}
//         </Text>
//         <View style={styles.progressBar}>
//           <View 
//             style={[
//               styles.progressFill, 
//               { width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }
//             ]} 
//           />
//         </View>
//       </View>

//       {/* Question Card */}
//       <View style={styles.questionCard}>
//         <View style={styles.questionHeader}>
//           <Text style={styles.questionNumber}>Q{currentQuestion + 1}</Text>
//           <Feather name="help-circle" size={24} color="#1E40AF" />
//         </View>
        
//         <Text style={styles.questionText}>
//           {QUESTIONS[currentQuestion]}
//         </Text>

//         <View style={styles.answerButtons}>
//           <TouchableOpacity
//             style={styles.yesButton}
//             onPress={() => handleAnswer('Yes')}
//             activeOpacity={0.8}
//           >
//             <LinearGradient
//               colors={['#10B981', '#059669']}
//               style={styles.answerButtonGradient}
//             >
//               <Feather name="check" size={24} color="#FFFFFF" />
//               <Text style={styles.answerButtonText}>Yes</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.noButton}
//             onPress={() => handleAnswer('No')}
//             activeOpacity={0.8}
//           >
//             <LinearGradient
//               colors={['#EF4444', '#DC2626']}
//               style={styles.answerButtonGradient}
//             >
//               <Feather name="x" size={24} color="#FFFFFF" />
//               <Text style={styles.answerButtonText}>No</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     paddingBottom: 40,
//   },
  
//   // Back Button
//   backButton: {
//     alignSelf: 'flex-start',
//     marginBottom: 20,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: '#1E40AF',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//   },
//   backButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     gap: 8,
//   },
//   backButtonText: {
//     color: '#1E40AF',
//     fontWeight: '700',
//     fontSize: 16,
//   },

//   // Progress
//   progressContainer: {
//     marginBottom: 30,
//     alignItems: 'center',
//   },
//   progressText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   progressBar: {
//     width: '100%',
//     height: 6,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 3,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 3,
//   },

//   // Question Card
//   questionCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     padding: 32,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 12,
//     justifyContent: 'space-between',
//   },
//   questionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   questionNumber: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#1E40AF',
//     backgroundColor: '#EFF6FF',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 12,
//   },
//   questionText: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1E293B',
//     textAlign: 'center',
//     lineHeight: 32,
//     flex: 1,
//     textAlignVertical: 'center',
//   },

//   // Answer Buttons
//   answerButtons: {
//     gap: 16,
//     marginTop: 32,
//   },
//   yesButton: {
//     borderRadius: 16,
//     elevation: 4,
//     shadowColor: '#10B981',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   noButton: {
//     borderRadius: 16,
//     elevation: 4,
//     shadowColor: '#EF4444',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   answerButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//     paddingHorizontal: 32,
//     borderRadius: 16,
//     gap: 12,
//   },
//   answerButtonText: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: '700',
//   },

//   // Result Card
//   resultCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     padding: 32,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 12,
//     justifyContent: 'space-between',
//   },
//   resultHeader: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   resultTitle: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: '#1E293B',
//     marginTop: 16,
//   },
//   resultContent: {
//     alignItems: 'center',
//     flex: 1,
//     justifyContent: 'center',
//   },
//   resultText: {
//     fontSize: 18,
//     color: '#374151',
//     textAlign: 'center',
//     lineHeight: 28,
//     marginBottom: 16,
//   },
//   scoreText: {
//     fontSize: 16,
//     color: '#64748B',
//     fontWeight: '600',
//   },
//   resultActions: {
//     gap: 16,
//   },
//   retakeButton: {
//     backgroundColor: '#F3F4F6',
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//   },
//   retakeButtonText: {
//     color: '#374151',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   homeButton: {
//     borderRadius: 16,
//     elevation: 4,
//     shadowColor: '#1E40AF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   homeButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 18,
//     paddingHorizontal: 32,
//     borderRadius: 16,
//     gap: 8,
//   },
//   homeButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '700',
//   },
// });
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

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
    text: "Does your child look you in the eye when you are talking to him or her, playing with him or her, or dressing him or her?",
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

export default function DetectScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const router = useRouter();

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
      }
    }, 200);
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

  const resetScreening = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setSelectedAnswer(null);
  };

  if (result) {
    const riskColors = getRiskLevelColor(result.riskLevel);
    
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
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
            <LinearGradient
              colors={riskColors}
              style={styles.resultIconContainer}
            >
              <Feather 
                name={getRiskLevelIcon(result.riskLevel)} 
                size={32} 
                color="#FFFFFF" 
              />
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
              <LinearGradient
                colors={riskColors}
                style={styles.riskBadge}
              >
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

          <View style={styles.resultActions}>
            <TouchableOpacity 
              style={styles.retakeButton} 
              onPress={resetScreening}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#F8FAFC', '#F1F5F9']}
                style={styles.retakeButtonGradient}
              >
                <Feather name="refresh-cw" size={18} color="#475569" />
                <Text style={styles.retakeButtonText}>Retake Assessment</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.push('/screens/home')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                style={styles.homeButtonGradient}
              >
                <Feather name="home" size={18} color="#FFFFFF" />
                <Text style={styles.homeButtonText}>Back to Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#334155']}
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

      {/* Question Card */}
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <LinearGradient
            colors={['#EFF6FF', '#DBEAFE']}
            style={styles.questionNumberContainer}
          >
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
            style={[
              styles.yesButton,
              selectedAnswer === 'Yes' && styles.selectedButton
            ]}
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
            style={[
              styles.noButton,
              selectedAnswer === 'No' && styles.selectedButton
            ]}
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

  // Result Card
  resultCard: {
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
  homeButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 36,
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