import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, StatusBar, ImageBackground } from 'react-native'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('') // <-- Add error state

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    setError(''); // Clear previous errors

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/screens/home')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        setError('Sign in not complete. Please check your credentials or try again.')
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // Display a user-friendly error message
      setError('Invalid email or password. Please try again.')
      
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/images/autism.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor="#4A90E2"
            onChangeText={setEmailAddress}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#4A90E2"
            secureTextEntry={true}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={onSignInPress} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <View style={styles.signUpRow}>
            <Text style={styles.signUpPrompt}>Don't have an account?</Text>
            <Link href="/sign-up" style={styles.signUpLink}>
              <Text style={styles.signUpLinkText}>Sign up</Text>
            </Link>
          </View>
        </View>
      </View>
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
    backgroundColor: 'rgba(74, 144, 226, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    padding: 28,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#003366',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 30,
    color: '#1565c0',
    fontWeight: 'bold',
    marginBottom: 28,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f6ff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 18,
    fontSize: 16,
    color: '#1565c0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#1565c0',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  signUpPrompt: {
    color: '#1565c0',
    fontSize: 15,
    marginRight: 6,
  },
  signUpLink: {
    textDecorationLine: 'underline',
  },
  signUpLinkText: {
    color: '#1B5E20',
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
})