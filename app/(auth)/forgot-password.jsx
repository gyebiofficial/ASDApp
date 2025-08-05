import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform, Image, ScrollView, Alert } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('email') // 'email', 'code', 'password'
  const [emailFocused, setEmailFocused] = useState(false)
  const [codeFocused, setCodeFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Step 1: Request password reset
  const onRequestReset = async () => {
    if (!isLoaded || !validateEmail(email)) return
    setError('')
    setIsLoading(true)

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setStep('code')
      Alert.alert('Success', 'Reset code sent to your email!')
    } catch (err) {
      setError('Failed to send reset code. Please check your email address.')
      console.error('Reset request error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify code and reset password
  const onResetPassword = async () => {
    if (!isLoaded || !code || !newPassword) return
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      })

      if (result.status === 'complete') {
        Alert.alert(
          'Success!',
          'Your password has been reset successfully.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }]
        )
      } else {
        setError('Failed to reset password. Please try again.')
      }
    } catch (err) {
      setError('Invalid code or password requirements not met.')
      console.error('Reset password error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderEmailStep = () => (
    <>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a reset code</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={[
          styles.inputWrapper,
          emailFocused && styles.inputWrapperFocused,
          error && !validateEmail(email) && email.length > 0 && styles.inputWrapperError
        ]}>
          <Feather name="mail" size={20} color={emailFocused ? "#1E40AF" : "#64748B"} />
          <TextInput
            autoCapitalize="none"
            value={email}
            placeholder="Enter your email"
            placeholderTextColor="#94A3B8"
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={styles.input}
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!validateEmail(email) || isLoading) && styles.buttonDisabled
        ]}
        onPress={onRequestReset}
        disabled={!validateEmail(email) || isLoading}
      >
        <LinearGradient
          colors={validateEmail(email) ? ['#1E40AF', '#3B82F6'] : ['#64748B', '#475569']}
          style={styles.buttonGradient}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Code</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </>
  )

  const renderCodeStep = () => (
    <>
      <Text style={styles.title}>Enter Reset Code</Text>
      <Text style={styles.subtitle}>Check your email for the verification code</Text>

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
          <Feather name="shield" size={20} color={codeFocused ? "#1E40AF" : "#64748B"} />
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
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>New Password</Text>
        <View style={[
          styles.inputWrapper,
          passwordFocused && styles.inputWrapperFocused
        ]}>
          <Feather name="lock" size={20} color={passwordFocused ? "#1E40AF" : "#64748B"} />
          <TextInput
            value={newPassword}
            placeholder="Enter new password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            onChangeText={setNewPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            style={styles.input}
            autoComplete="new-password"
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

      <TouchableOpacity
        style={[
          styles.button,
          (!code || !newPassword || isLoading) && styles.buttonDisabled
        ]}
        onPress={onResetPassword}
        disabled={!code || !newPassword || isLoading}
      >
        <LinearGradient
          colors={(code && newPassword) ? ['#1E40AF', '#3B82F6'] : ['#64748B', '#475569']}
          style={styles.buttonGradient}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setStep('email')}
        style={styles.backToEmailButton}
      >
        <Text style={styles.backToEmailText}>← Back to email</Text>
      </TouchableOpacity>
    </>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
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
            {/* Header */}
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

            {/* Form */}
            <View style={styles.formSection}>
              {step === 'email' ? renderEmailStep() : renderCodeStep()}

              <View style={styles.signInContainer}>
                <Text style={styles.signInPrompt}>Remember your password? </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
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
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
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
  button: {
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  backToEmailButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  backToEmailText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
  },
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
})