import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [emailFocused, setEmailFocused] = React.useState(false)
  const [passwordFocused, setPasswordFocused] = React.useState(false)

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return
    setError('')
    setIsLoading(true)

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/screens/home')
      } else {
        setError('Sign in not complete. Please check your credentials or try again.')
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isFormValid = emailAddress.length > 0 && password.length > 0 && validateEmail(emailAddress)

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Full Screen Gradient Background */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fullScreenGradient}
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
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/AutiScan.png')}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
                <Text style={styles.appName}>AutiCare</Text>
              </View>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
              <View style={styles.titleSection}>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue your journey</Text>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                {error ? (
                  <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={[
                    styles.inputWrapper,
                    emailFocused && styles.inputWrapperFocused,
                    error && !validateEmail(emailAddress) && emailAddress.length > 0 && styles.inputWrapperError
                  ]}>
                    <Feather name="mail" size={20} color={emailFocused ? "#1E40AF" : "#64748B"} />
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
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={[
                    styles.inputWrapper,
                    passwordFocused && styles.inputWrapperFocused
                  ]}>
                    <Feather name="lock" size={20} color={passwordFocused ? "#1E40AF" : "#64748B"} />
                    <TextInput
                      value={password}
                      placeholder="Enter your password"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showPassword}
                      onChangeText={setPassword}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      style={styles.input}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <Link href="/(auth)/forgot-password" asChild>
                   <TouchableOpacity style={styles.forgotPassword}>
                     <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                   </TouchableOpacity>
                </Link>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={[
                    styles.signInButton,
                    !isFormValid && styles.signInButtonDisabled
                  ]}
                  onPress={onSignInPress}
                  activeOpacity={0.8}
                  disabled={!isFormValid || isLoading}
                >
                  <LinearGradient
                    colors={isFormValid ? ['#1E40AF', '#3B82F6'] : ['#64748B', '#475569']}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                        <Feather name="arrow-right" size={20} color="#FFFFFF" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpPrompt}>Don't have an account? </Text>
                  <Link href="/sign-up" asChild>
                    <TouchableOpacity>
                      <Text style={styles.signUpLink}>Create Account</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By signing in, you agree to our{' '}
                  <Text style={styles.footerLink}>Terms</Text>
                  {' '}and{' '}
                  <Text style={styles.footerLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenGradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Header Section
  headerSection: {
    paddingTop: 60,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -70 }],
    marginBottom: 1,
    marginTop: 30,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Main Content
  mainContent: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
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
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Form Section
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
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
  inputContainer: {
    marginBottom: 20,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },

  // Forgot Password
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Sign In Button
  signInButton: {
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signInButtonDisabled: {
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
    gap: 12,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // Sign Up Link
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpPrompt: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  signUpLink: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Footer
  footer: {
    paddingTop: 20,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})