import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import OnboardingScreen from '../pages/Auth/OnboardingScreen';

// Navigation
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

// Context
import { AppContext, APP_MODES } from '../services/AppContext';

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const { currentMode } = React.useContext(AppContext);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const firstLaunch = await AsyncStorage.getItem('firstLaunch');
        
        if (firstLaunch === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('firstLaunch', 'false');
        } else {
          setIsFirstLaunch(false);
        }
        
        if (userToken) {
          console.log('User is authenticated with token:', userToken);
          setIsAuthenticated(true);
        } else {
          console.log('No authentication token found');
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.log('Error checking auth:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // You could add a loading screen here
    return null;
  }

  // First time user - show onboarding
  if (isFirstLaunch) {
    return <OnboardingScreen onDone={() => setIsFirstLaunch(false)} />;
  }

  return (
    isAuthenticated ? <AppNavigator /> : <AuthNavigator />
  );
};

export default RootNavigator; 