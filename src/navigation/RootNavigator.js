import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

// Global navigation reference
import { setNavigationRef } from '../services/AppContext';

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Always start with auth screen
  const navigationRef = useRef(null);

  // Set up the navigation reference
  useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
    }
  }, [navigationRef.current]);

  // Initialize app and check authentication
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app and checking auth state');
      setIsLoading(true);
      
      try {
        // Check for existing token - this determines if we show login or home
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('Authentication token found:', userToken ? 'Yes' : 'No');
        
        // For testing, we'll reset auth state on app start if this is false
        const shouldStartWithAuth = true;  
        
        if (shouldStartWithAuth) {
          // Clear any existing tokens for testing
          await AsyncStorage.removeItem('userToken');
          setIsAuthenticated(false);
          console.log('Auth cleared for testing - showing login screen');
        } else {
          // Otherwise, authenticate if a token exists
          setIsAuthenticated(!!userToken);
          console.log('Auth state set based on token:', !!userToken);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    initializeApp();
    
    // Listen for auth state changes (mock implementation)
    const interval = setInterval(async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsAuthenticated(!!token);
      } catch (e) {
        console.error('Error checking token:', e);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  console.log('Rendering root navigator with auth state:', isAuthenticated);
  
  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    color: '#8b5cf6',
    fontSize: 16,
  }
});

export default RootNavigator; 