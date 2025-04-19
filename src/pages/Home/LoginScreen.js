import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// For responsive design
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isLargeDevice = SCREEN_WIDTH >= 768;

// Responsive scaling function
const normalize = (size) => {
  if (isSmallDevice) return Math.round(size * 0.9);
  if (isLargeDevice) return Math.round(size * 1.2);
  return size;
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Clear any existing token on component mount
  useEffect(() => {
    console.log('LoginScreen mounted');
    const clearToken = async () => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (error) {
        console.error('Error clearing token:', error);
      }
    };
    
    clearToken();
  }, []);

  // Handle login
  const handleLogin = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate input
    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    // Start loading state
    setLoading(true);
    
    try {
      // In a real app, this would make an API call to authenticate
      // For now, we'll simulate a successful login
      console.log('Logging in with:', email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the token to indicate logged in state
      await AsyncStorage.setItem('userToken', 'demo-token');
      
      // Show success message
      setSuccessMessage('Login successful!');
      
      // Navigate to Home screen
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate input
    if (!email.trim()) {
      setErrorMessage('Please enter your email to sign up');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter a password to sign up');
      return;
    }
    
    // Start loading state
    setLoading(true);
    
    try {
      // In a real app, this would navigate to sign up screen or register directly
      // For now we'll simulate registration and login
      console.log('Signing up with:', email);
      
      // Simulate registration
      setTimeout(async () => {
        try {
          // Store token to indicate logged in state
          await AsyncStorage.setItem('userToken', 'demo-token');
          
          // Show success and navigate
          setSuccessMessage('Account created successfully!');
          
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }, 500);
        } catch (error) {
          console.error('Sign up error:', error);
          setErrorMessage('Registration failed. Please try again.');
          setLoading(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email to reset password');
      return;
    }
    
    Alert.alert(
      'Reset Password',
      `We'll send password reset instructions to ${email}`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Send',
          onPress: () => {
            // In a real app, this would trigger an API call to send a reset email
            // For now we'll just show a confirmation
            setSuccessMessage(`Password reset instructions sent to ${email}`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={normalize(40)} color="#8b5cf6" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Login to continue tracking your habits
            </Text>
          </View>
          
          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.messageContainer}>
              <Ionicons name="alert-circle" size={normalize(16)} color="#f44336" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          {/* Success Message */}
          {successMessage ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={normalize(16)} color="#4CAF50" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}
          
          {/* Login Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={normalize(18)} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                editable={!loading}
              />
            </View>
            
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={normalize(18)} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)} 
                style={styles.eyeIcon}
                disabled={loading}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={normalize(18)} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            
            {/* Forgot Password Link */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            
            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account? 
              </Text>
              <TouchableOpacity onPress={handleSignUp} disabled={loading}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: normalize(20),
    paddingTop: normalize(10),
  },
  header: {
    alignItems: 'center',
    marginTop: normalize(isSmallDevice ? 20 : 30),
    marginBottom: normalize(20),
  },
  logoContainer: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    backgroundColor: '#f0ecff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  title: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: normalize(4),
  },
  subtitle: {
    fontSize: normalize(13),
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    marginBottom: normalize(12),
    height: normalize(45),
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: normalize(14),
    color: '#333',
  },
  inputIcon: {
    marginRight: normalize(8),
  },
  eyeIcon: {
    padding: normalize(8),
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: normalize(16),
  },
  forgotPasswordText: {
    fontSize: normalize(13),
    fontWeight: '500',
    color: '#8b5cf6',
  },
  loginButton: {
    backgroundColor: '#8b5cf6',
    height: normalize(44),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  loginButtonDisabled: {
    backgroundColor: '#c4b5fd',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: normalize(15),
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(4),
    marginBottom: normalize(20),
  },
  signupText: {
    fontSize: normalize(13),
    color: '#666',
  },
  signupLink: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: '#8b5cf6',
    marginLeft: normalize(4),
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: normalize(10),
    borderRadius: normalize(8),
    marginBottom: normalize(12),
  },
  errorText: {
    color: '#f44336',
    marginLeft: normalize(8),
    flex: 1,
    fontSize: normalize(13),
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: normalize(10),
    borderRadius: normalize(8),
    marginBottom: normalize(12),
  },
  successText: {
    color: '#4CAF50',
    marginLeft: normalize(8),
    flex: 1,
    fontSize: normalize(13),
  },
});

export default LoginScreen; 