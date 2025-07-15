// import * as React from 'react'
// import { Text, TextInput, TouchableOpacity, View, StyleSheet, StatusBar, ImageBackground } from 'react-native'
// import { useSignUp } from '@clerk/clerk-expo'
// import { Link, useRouter } from 'expo-router'

// export default function SignUpScreen() {
//   const { isLoaded, signUp, setActive } = useSignUp()
//   const router = useRouter()

//   const [emailAddress, setEmailAddress] = React.useState('')
//   const [password, setPassword] = React.useState('')
//   const [pendingVerification, setPendingVerification] = React.useState(false)
//   const [code, setCode] = React.useState('')

//   // Handle submission of sign-up form
//   const onSignUpPress = async () => {
//     if (!isLoaded) return

//     // Start sign-up process using email and password provided
//     try {
//       await signUp.create({
//         emailAddress,
//         password,
//       })

//       // Send user an email with verification code
//       await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

//       // Set 'pendingVerification' to true to display second form
//       // and capture OTP code
//       setPendingVerification(true)
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   }

//   // Handle submission of verification form
//   const onVerifyPress = async () => {
//     if (!isLoaded) return

//     try {
//       // Use the code the user provided to attempt verification
//       const signUpAttempt = await signUp.attemptEmailAddressVerification({
//         code,
//       })

//       // If verification was completed, set the session to active
//       // and redirect the user
//       if (signUpAttempt.status === 'complete') {
//         await setActive({ session: signUpAttempt.createdSessionId })
//         router.replace('/')
//       } else {
//         // If the status is not complete, check why. User may need to
//         // complete further steps.
//         console.error(JSON.stringify(signUpAttempt, null, 2))
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   }

//   if (pendingVerification) {
//     return (
//       <ImageBackground
//         source={require('../../assets/images/autism.jpg')}
//         style={styles.background}
//         resizeMode="cover"
//       >
//         <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
//         <View style={styles.overlay}>
//           <View style={styles.formContainer}>
//             <Text style={styles.title}>Verify your email</Text>
//             <TextInput
//               value={code}
//               placeholder="Enter your verification code"
//               placeholderTextColor="#4A90E2"
//               onChangeText={setCode}
//               style={styles.input}
//               keyboardType="number-pad"
//             />
//             <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
//               <Text style={styles.buttonText}>Verify</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ImageBackground>
//     )
//   }

//   return (
//     <ImageBackground
//       source={require('../../assets/images/autism.jpg')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
//       <View style={styles.overlay}>
//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Sign Up</Text>
//           <TextInput
//             autoCapitalize="none"
//             value={emailAddress}
//             placeholder="Enter email"
//             placeholderTextColor="#4A90E2"
//             onChangeText={setEmailAddress}
//             style={styles.input}
//             keyboardType="email-address"
//           />
//           <TextInput
//             value={password}
//             placeholder="Enter password"
//             placeholderTextColor="#4A90E2"
//             secureTextEntry={true}
//             onChangeText={setPassword}
//             style={styles.input}
//           />
//           <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
//             <Text style={styles.buttonText}>Continue</Text>
//           </TouchableOpacity>
//           <View style={styles.signInRow}>
//             <Text style={styles.signInPrompt}>Already have an account?</Text>
//             <Link href="/sign-in" style={styles.signInLink}>
//               <Text style={styles.signInLinkText}>Sign in</Text>
//             </Link>
//           </View>
//         </View>
//       </View>
//     </ImageBackground>
//   )
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(74, 144, 226, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   formContainer: {
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     borderRadius: 18,
//     padding: 28,
//     width: '100%',
//     maxWidth: 350,
//     alignItems: 'center',
//     shadowColor: '#003366',
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },
//   title: {
//     fontSize: 30,
//     color: '#1565c0',
//     fontWeight: 'bold',
//     marginBottom: 28,
//     letterSpacing: 1,
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#f0f6ff',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 18,
//     fontSize: 16,
//     color: '#1565c0',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   button: {
//     backgroundColor: '#1565c0',
//     paddingVertical: 15,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 10,
//     elevation: 2,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },
//   signInRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 18,
//   },
//   signInPrompt: {
//     color: '#1565c0',
//     fontSize: 15,
//     marginRight: 6,
//   },
//   signInLink: {
//     textDecorationLine: 'underline',
//   },
//   signInLinkText: {
//     color: '#1B5E20',
//     fontSize: 15,
//     fontWeight: 'bold',
//   },
// })
import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, StatusBar, ImageBackground, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  
  // Focus states
  const [emailFocused, setEmailFocused] = React.useState(false)
  const [passwordFocused, setPasswordFocused] = React.useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = React.useState(false)
  const [firstNameFocused, setFirstNameFocused] = React.useState(false)
  const [lastNameFocused, setLastNameFocused] = React.useState(false)
  const [codeFocused, setCodeFocused] = React.useState(false)

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 8
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Weak', color: '#EF4444' }
      case 2:
      case 3: return { text: 'Medium', color: '#F59E0B' }
      case 4:
      case 5: return { text: 'Strong', color: '#10B981' }
      default: return { text: 'Weak', color: '#EF4444' }
    }
  }

  const isFormValid = () => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      validateEmail(emailAddress) &&
      validatePassword(password) &&
      password === confirmPassword
    )
  }

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    setError('')
    setIsLoading(true)

    if (!isFormValid()) {
      setError('Please fill in all fields correctly')
      setIsLoading(false)
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      setError(err.errors?.[0]?.message || 'An error occurred during sign up')
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    setError('')
    setIsLoading(true)

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/screens/home')
      } else {
        setError('Verification failed. Please check your code and try again.')
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Verification failed')
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = async () => {
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert('Success', 'Verification code sent!')
    } catch (err) {
      Alert.alert('Error', 'Failed to resend code')
    }
  }

  if (pendingVerification) {
    return (
      <ImageBackground
        source={require('../../assets/images/autism.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <LinearGradient
          colors={['rgba(30, 64, 175, 0.9)', 'rgba(59, 130, 246, 0.8)', 'rgba(147, 197, 253, 0.7)']}
          style={styles.overlay}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header Section */}
              <View style={styles.headerSection}>
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={['#FFFFFF', '#F8FAFC']}
                    style={styles.logoBackground}
                  >
                    <MaterialIcons name="mark-email-read" size={32} color="#1E40AF" />
                  </LinearGradient>
                </View>
                <Text style={styles.welcomeText}>Check Your Email</Text>
                <Text style={styles.subtitle}>
                  We've sent a verification code to{'\n'}
                  <Text style={styles.emailHighlight}>{emailAddress}</Text>
                </Text>
              </View>

              {/* Verification Form */}
              <View style={styles.formContainer}>
                {error ? (
                  <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Verification Code</Text>
                  <View style={[
                    styles.inputWrapper, 
                    codeFocused && styles.inputWrapperFocused
                  ]}>
                    <MaterialIcons name="security" size={20} color={codeFocused ? "#1E40AF" : "#94A3B8"} style={styles.inputIcon} />
                    <TextInput
                      value={code}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="#94A3B8"
                      onChangeText={setCode}
                      onFocus={() => setCodeFocused(true)}
                      onBlur={() => setCodeFocused(false)}
                      style={styles.input}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoComplete="sms-otp"
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.verifyButton,
                    code.length !== 6 && styles.verifyButtonDisabled
                  ]} 
                  onPress={onVerifyPress}
                  disabled={code.length !== 6 || isLoading}
                >
                  <LinearGradient
                    colors={code.length === 6 ? ['#1E40AF', '#3B82F6'] : ['#94A3B8', '#64748B']}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.verifyButtonText}>Verify Account</Text>
                        <Feather name="check-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn't receive the code? </Text>
                  <TouchableOpacity onPress={resendCode}>
                    <Text style={styles.resendLink}>Resend Code</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground
      source={require('../../assets/images/autism.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['rgba(30, 64, 175, 0.9)', 'rgba(59, 130, 246, 0.8)', 'rgba(147, 197, 253, 0.7)']}
        style={styles.overlay}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8FAFC']}
                  style={styles.logoBackground}
                >
                  <MaterialIcons name="person-add" size={32} color="#1E40AF" />
                </LinearGradient>
              </View>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.subtitle}>Join AutiScan and start your journey</Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={16} color="#EF4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Name Inputs */}
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, styles.nameInput]}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <View style={[
                    styles.inputWrapper, 
                    firstNameFocused && styles.inputWrapperFocused
                  ]}>
                    <MaterialIcons name="person" size={20} color={firstNameFocused ? "#1E40AF" : "#94A3B8"} style={styles.inputIcon} />
                    <TextInput
                      value={firstName}
                      placeholder="First name"
                      placeholderTextColor="#94A3B8"
                      onChangeText={setFirstName}
                      onFocus={() => setFirstNameFocused(true)}
                      onBlur={() => setFirstNameFocused(false)}
                      style={styles.input}
                      autoComplete="given-name"
                    />
                  </View>
                </View>

                <View style={[styles.inputContainer, styles.nameInput]}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <View style={[
                    styles.inputWrapper, 
                    lastNameFocused && styles.inputWrapperFocused
                  ]}>
                    <MaterialIcons name="person" size={20} color={lastNameFocused ? "#1E40AF" : "#94A3B8"} style={styles.inputIcon} />
                    <TextInput
                      value={lastName}
                      placeholder="Last name"
                      placeholderTextColor="#94A3B8"
                      onChangeText={setLastName}
                      onFocus={() => setLastNameFocused(true)}
                      onBlur={() => setLastNameFocused(false)}
                      style={styles.input}
                      autoComplete="family-name"
                    />
                  </View>
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[
                  styles.inputWrapper, 
                  emailFocused && styles.inputWrapperFocused,
                  error && !validateEmail(emailAddress) && emailAddress.length > 0 && styles.inputWrapperError
                ]}>
                  <MaterialIcons name="email" size={20} color={emailFocused ? "#1E40AF" : "#94A3B8"} style={styles.inputIcon} />
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="#94A3B8"
                    onChangeText={setEmailAddress}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    style={styles.input}
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                  {emailAddress.length > 0 && validateEmail(emailAddress) && (
                    <Feather name="check" size={20} color="#10B981" />
                  )}
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[
                  styles.inputWrapper, 
                  passwordFocused && styles.inputWrapperFocused
                ]}>
                  <MaterialIcons name="lock" size={20} color={passwordFocused ? "#1E40AF" : "#94A3B8"} style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    placeholder="Create password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    style={styles.input}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <View style={styles.passwordStrength}>
                    <View style={styles.strengthBars}>
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <View
                          key={bar}
                          style={[
                            styles.strengthBar,
                            {
                              backgroundColor: bar <= getPasswordStrength(password) 
                                ? getPasswordStrengthText(getPasswordStrength(password)).color 
                                : '#E5E7EB'
                            }
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={[
                      styles.strengthText,
                      { color: getPasswordStrengthText(getPasswordStrength(password)).color }
                    ]}>
                      {getPasswordStrengthText(getPasswordStrength(password)).text}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[
                  styles.inputWrapper, 
                  confirmPasswordFocused && styles.inputWrapperFocused,
                  confirmPassword.length > 0 && password !== confirmPassword && styles.inputWrapperError
                ]}>
                  <MaterialIcons name="lock" size={20} color={confirmPasswordFocused ? "#1E40AF" : "#94A3B8"} style={styles.inputIcon} />
                  <TextInput
                    value={confirmPassword}
                    placeholder="Confirm password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    style={styles.input}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather 
                      name={showConfirmPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </TouchableOpacity>
                  {confirmPassword.length > 0 && password === confirmPassword && (
                    <Feather name="check" size={20} color="#10B981" style={styles.checkIcon} />
                  )}
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity 
                style={[
                  styles.signUpButton,
                  !isFormValid() && styles.signUpButtonDisabled
                ]} 
                onPress={onSignUpPress}
                disabled={!isFormValid() || isLoading}
              >
                <LinearGradient
                  colors={isFormValid() ? ['#1E40AF', '#3B82F6'] : ['#94A3B8', '#64748B']}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.signUpButtonText}>Create Account</Text>
                      <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              {/* <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View> */}

              {/* Social Sign Up Options */}
              {/* <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <MaterialIcons name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <MaterialIcons name="apple" size={24} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <MaterialIcons name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              </View> */}

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInPrompt}>Already have an account? </Text>
                <Link href="/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.footerLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  emailHighlight: {
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Form Container
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  // Error Handling
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },

  // Input Styles
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameInput: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputWrapperFocused: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  checkIcon: {
    marginLeft: 8,
  },

  // Password Strength
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  strengthBar: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Buttons
  signUpButton: {
    borderRadius: 16,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signUpButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  verifyButton: {
    borderRadius: 16,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  verifyButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },



  // Sign In Link
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInPrompt: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  signInLink: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Resend Code
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  resendLink: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})