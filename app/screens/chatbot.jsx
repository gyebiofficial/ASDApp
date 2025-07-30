import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { height: screenHeight } = Dimensions.get('window');

// Consistent color palette matching AutiScan app
const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#3730A3',
  secondary: '#64748B',
  accent: '#F59E0B',
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  white: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#1E293B',
  textLight: '#64748B',
  textMuted: '#94A3B8',
  error: '#EF4444',
  success: '#10B981',
  userMessage: '#4F46E5',
  botMessage: '#F1F5F9',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

const ChatbotScreen = ({ navigation }) => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AutiScan AI assistant. I\'m here to help answer questions about Autism Spectrum Disorder, including symptoms, diagnosis, treatments, and therapies. How can I assist you today?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        // Scroll to bottom when keyboard appears
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  const callGroqAPI = async (userMessage) => {
    // Get API key from environment variable
    let apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    
    // Clean the key (remove any surrounding quotes)
    if (apiKey) {
      apiKey = apiKey.replace(/^['"]|['"]$/g, '').trim();
    }
    
    // Debug logs (remove in production)
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    console.log('API Key prefix:', apiKey ? apiKey.substring(0, 7) + '...' : 'None');
    
    if (!apiKey) {
      console.error('Groq API key not found in environment variables');
      return "I apologize, but the API key is not configured. Please contact support.";
    }

    if (!apiKey.startsWith('gsk_')) {
      console.error('Invalid Groq API key format - does not start with gsk_');
      return "The API key format appears to be invalid. Please check the configuration.";
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { 
              role: "system",
              content: "You are an expert assistant who only answers questions related to Autism Spectrum Disorder (ASD), its diagnosis, symptoms, treatments, therapies, research, and general information about autism. If a user asks something unrelated, politely redirect them back to autism-related topics. Keep responses helpful, empathetic, and informative."
            },
            { role: "user", content: userMessage }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - invalid API key');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded - too many requests');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Groq API Error:", error);
      
      if (error.message.includes('Authentication failed')) {
        return "Authentication failed. Please check if your API key is valid and active.";
      } else if (error.message.includes('Rate limit')) {
        return "I'm currently experiencing high demand. Please try again in a few moments.";
      } else if (error.message.includes('network')) {
        return "Network connection error. Please check your internet connection and try again.";
      } else {
        return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);

    const reply = await callGroqAPI(currentInput);
    const botMsg = { role: 'assistant', content: reply };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const handleInputFocus = () => {
    // Scroll to bottom when input is focused
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleBackPress = () => {
    router.replace('/screens/home');
  };

  // Calculate the bottom position for input container
  const getInputContainerStyle = () => {
    if (Platform.OS === 'ios') {
      return {
        bottom: isKeyboardVisible ? keyboardHeight : 0,
      };
    } else {
      // Android
      return {
        bottom: 0,
      };
    }
  };

  // Calculate messages container style
  const getMessagesContainerStyle = () => {
    const inputContainerHeight = 80; // Approximate height of input container
    
    if (Platform.OS === 'ios') {
      return {
        paddingBottom: isKeyboardVisible 
          ? keyboardHeight + inputContainerHeight 
          : inputContainerHeight,
      };
    } else {
      return {
        paddingBottom: inputContainerHeight,
      };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AutiScan AI Assistant</Text>
          <Text style={styles.headerSubtitle}>Autism Support & Information</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </View>

      {Platform.OS === 'ios' ? (
        // iOS Layout
        <View style={styles.container}>
          {/* Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesContent,
              getMessagesContainerStyle()
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  msg.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.role === 'user' ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.role === 'user' ? styles.userMessageText : styles.botMessageText,
                  ]}>
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))}
            
            {loading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBubble}>
                  <View style={styles.typingIndicator}>
                    <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                    <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
                    <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
                  </View>
                  <Text style={styles.loadingText}>AI is thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Container - Fixed position for iOS */}
          <View style={[
            styles.inputContainer,
            styles.inputContainerFixed,
            getInputContainerStyle()
          ]}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                placeholder="Ask about autism, symptoms, treatments..."
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
                multiline
                maxLength={500}
                onFocus={handleInputFocus}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { opacity: input.trim() ? 1 : 0.5 }
                ]}
                onPress={sendMessage}
                disabled={!input.trim() || loading}
                activeOpacity={0.7}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        // Android Layout with KeyboardAvoidingView
        <KeyboardAvoidingView
          style={styles.container}
          behavior="height"
          keyboardVerticalOffset={0}
        >
          {/* Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesContent,
              { paddingBottom: 100 } // Extra padding for Android
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  msg.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.role === 'user' ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.role === 'user' ? styles.userMessageText : styles.botMessageText,
                  ]}>
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))}
            
            {loading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBubble}>
                  <View style={styles.typingIndicator}>
                    <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                    <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
                    <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
                  </View>
                  <Text style={styles.loadingText}>AI is thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Container - For Android */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                placeholder="Ask about autism, symptoms, treatments..."
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
                multiline
                maxLength={500}
                onFocus={handleInputFocus}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { opacity: input.trim() ? 1 : 0.5 }
                ]}
                onPress={sendMessage}
                disabled={!input.trim() || loading}
                activeOpacity={0.7}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: SPACING.xs,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 18,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.white,
  },
  botMessageText: {
    color: COLORS.text,
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginVertical: SPACING.xs,
  },
  loadingBubble: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: 1,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainerFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginLeft: SPACING.xs,
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ChatbotScreen;