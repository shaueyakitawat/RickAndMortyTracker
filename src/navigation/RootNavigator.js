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
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always set to true to show HomeScreen directly
  const navigationRef = useRef(null);

  // Set up the navigation reference
  useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
    }
  }, [navigationRef.current]);

  // Set token on app start to ensure user is "logged in"
  useEffect(() => {
    const setInitialToken = async () => {
      try {
        // Always set a token to ensure we're authenticated
        await AsyncStorage.setItem('userToken', 'demo-token');
        console.log('Token set - ensuring HomeScreen shows directly');
        
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error setting token:', error);
        // Even if there's an error, still show HomeScreen
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    setInitialToken();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
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