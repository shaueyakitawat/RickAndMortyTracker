import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  PixelRatio,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Components
import Button from '../../components/common/Button';
import { AppContext } from '../../services/AppContext';

// For responsive design
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Standard width
const verticalScale = size => SCREEN_HEIGHT / 812 * size; // Standard height

const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const { theme } = React.useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [savedEmail, setSavedEmail] = useState('');

  // Check for saved credentials
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('savedEmail');
        if (email) {
          setSavedEmail(email);
          setEmail(email);
        }
      } catch (error) {
        console.log('Error loading saved email:', error);
      }
    };
    
    loadSavedEmail();
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      setFormError('Password is required');
      return false;
    }
    
    setFormError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save email if "Remember me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email);
      } else {
        await AsyncStorage.removeItem('savedEmail');
      }
      
      // Store auth token
      await AsyncStorage.setItem('userToken', 'demo-token');
      
      setLoading(false);
      
      // Force navigation to the main app
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => {
            // Reload the app to trigger RootNavigator's auth check
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        }
      ]);
    } catch (error) {
      setLoading(false);
      setFormError('Login failed. Please try again.');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'An email with password reset instructions will be sent to your email address.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Email',
          onPress: () => {
            if (!email.trim()) {
              setFormError('Please enter your email address first');
            } else {
              Alert.alert('Email Sent', 'Check your inbox for password reset instructions');
            }
          },
        },
      ]
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google authentication would be initiated here in a production app');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Apple authentication would be initiated here in a production app');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.text + '99' }]}>
            Login to continue tracking your habits
          </Text>
        </View>
        
        {formError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={normalize(16)} color="#f44336" />
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        ) : null}
        
        <View style={styles.form}>
          <View style={[styles.inputContainer, { borderColor: theme.text + '20' }]}>
            <Ionicons name="mail-outline" size={normalize(20)} color={theme.text + '80'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              placeholderTextColor={theme.text + '60'}
              value={email}
              onChangeText={text => {
                setEmail(text);
                setFormError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>
          
          <View style={[styles.inputContainer, { borderColor: theme.text + '20' }]}>
            <Ionicons name="lock-closed-outline" size={normalize(20)} color={theme.text + '80'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.text + '60'}
              value={password}
              onChangeText={text => {
                setPassword(text);
                setFormError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={normalize(20)} 
                color={theme.text + '80'} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={styles.rememberMeContainer} 
              onPress={toggleRememberMe}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkbox, 
                { borderColor: theme.primary },
                rememberMe && { backgroundColor: theme.primary }
              ]}>
                {rememberMe && (
                  <Ionicons name="checkmark" size={normalize(14)} color="white" />
                )}
              </View>
              <Text style={[styles.rememberMeText, { color: theme.text + '99' }]}>
                Remember me
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          
          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            fullWidth
          />
          
          <Text style={[styles.directLoginText, { color: theme.text + 'AA' }]}>
            For testing, you can use any email and password
          </Text>
          
          <View style={styles.orContainer}>
            <View style={[styles.divider, { backgroundColor: theme.text + '20' }]} />
            <Text style={[styles.orText, { color: theme.text + '80' }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: theme.text + '20' }]} />
          </View>
          
          <TouchableOpacity 
            style={[styles.socialButton, { borderColor: theme.text + '20' }]}
            onPress={handleGoogleLogin}
          >
            <Ionicons name="logo-google" size={normalize(20)} color="#DB4437" />
            <Text style={[styles.socialButtonText, { color: theme.text }]}>Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, { borderColor: theme.text + '20' }]}
            onPress={handleAppleLogin}
          >
            <Ionicons name="logo-apple" size={normalize(20)} color="#000000" />
            <Text style={[styles.socialButtonText, { color: theme.text }]}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text + '99' }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={[styles.signupText, { color: theme.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: normalize(24),
    paddingTop: normalize(40),
    paddingBottom: normalize(30),
  },
  header: {
    alignItems: 'center',
    marginBottom: normalize(32),
  },
  logo: {
    width: normalize(80),
    height: normalize(80),
    marginBottom: normalize(16),
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: normalize(8),
  },
  subtitle: {
    fontSize: normalize(16),
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    borderRadius: normalize(6),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  errorText: {
    color: '#f44336',
    marginLeft: normalize(8),
    fontSize: normalize(14),
  },
  form: {
    marginBottom: normalize(24),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: normalize(8),
    marginBottom: normalize(16),
    paddingHorizontal: normalize(12),
    backgroundColor: 'rgba(250,250,250,0.2)',
    height: normalize(50),
  },
  inputIcon: {
    marginRight: normalize(8),
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
  },
  eyeIcon: {
    padding: normalize(8),
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: normalize(18),
    height: normalize(18),
    borderRadius: normalize(4),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(8),
  },
  rememberMeText: {
    fontSize: normalize(14),
  },
  forgotPassword: {
    padding: normalize(4),
  },
  forgotPasswordText: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: normalize(16),
  },
  directLoginText: {
    textAlign: 'center',
    fontSize: normalize(12),
    marginBottom: normalize(16),
    fontStyle: 'italic',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  divider: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: normalize(16),
    fontWeight: '500',
    fontSize: normalize(14),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(48),
    borderWidth: 1,
    borderRadius: normalize(8),
    marginBottom: normalize(16),
  },
  socialButtonText: {
    marginLeft: normalize(12),
    fontSize: normalize(15),
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(8),
  },
  footerText: {
    fontSize: normalize(14),
  },
  signupText: {
    fontWeight: '600',
    fontSize: normalize(14),
  },
});

export default LoginScreen; 