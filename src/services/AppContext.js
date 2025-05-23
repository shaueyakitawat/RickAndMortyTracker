import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

// Create context
export const AppContext = createContext();

// App modes
export const APP_MODES = {
  PERSONAL_GROWTH: 'personal_growth',
  ACTION: 'action',
  COSMIC: 'cosmic',
  SUNSET: 'sunset'
};

// Global navigation reference (to be set in RootNavigator)
export let navigationRef = null;

// Set the navigation reference
export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

// Navigate to a specific screen
export const navigate = (name, params) => {
  if (navigationRef?.isReady()) {
    navigationRef.navigate(name, params);
  }
};

// Reset navigation stack
export const resetNavigation = (routeName) => {
  if (navigationRef?.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  }
};

// Theme colors for different modes
export const THEMES = {
  [APP_MODES.PERSONAL_GROWTH]: {
    primary: '#8b5cf6', // Soft purple
    secondary: '#c4b5fd',
    background: '#f8f7ff', // Lighter background
    card: '#ffffff',
    text: '#4b5563',
    textSecondary: '#6b7280',
    accent: '#a78bfa',
    success: '#10b981', // Green
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    info: '#3b82f6', // Blue
    border: '#e9e4ff',
    buttonText: '#ffffff',
    cardShadow: 'rgba(139, 92, 246, 0.15)',
    gradientStart: '#a78bfa',
    gradientEnd: '#8b5cf6',
    statusBarStyle: 'dark-content',
    divider: '#e5e7eb',
    iconBackground: '#f3f0ff',
    completedColor: '#10b981',
    incompletedColor: '#e5e7eb',
    progressTrack: '#f3f0ff',
    badgeBackground: '#f3f0ff',
    cardHeader: '#f5f3ff',
    // UI Styles
    borderRadius: 12,
    cardElevation: 2,
    buttonElevation: 4,
    // Typography
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      h1: 28,
      h2: 24,
      h3: 20,
      h4: 18,
      body: 16,
      caption: 14,
      small: 12,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    headingStyle: {
      letterSpacing: 0.2,
      lineHeight: 1.4,
    }
  },
  [APP_MODES.ACTION]: {
    primary: '#ef4444', // Energetic red
    secondary: '#fca5a5',
    background: '#fafafa', // More neutral background
    card: '#ffffff',
    text: '#1f2937',
    textSecondary: '#4b5563',
    accent: '#f87171',
    success: '#059669', // Darker green for contrast
    warning: '#d97706', // Darker amber for contrast
    error: '#b91c1c', // Darker red for contrast
    info: '#2563eb', // Darker blue for contrast
    border: '#fee2e2',
    buttonText: '#ffffff',
    cardShadow: 'rgba(239, 68, 68, 0.15)',
    gradientStart: '#f87171',
    gradientEnd: '#ef4444',
    statusBarStyle: 'dark-content',
    divider: '#e5e7eb',
    iconBackground: '#fff5f5',
    completedColor: '#059669',
    incompletedColor: '#e5e7eb',
    progressTrack: '#fff5f5',
    badgeBackground: '#fff5f5',
    cardHeader: '#fef2f2',
    // UI Styles - more angular for action mode
    borderRadius: 8,
    cardElevation: 3,
    buttonElevation: 5,
    // Typography - bolder and more condensed for action mode
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      h1: 30,
      h2: 26,
      h3: 22,
      h4: 18,
      body: 16,
      caption: 14,
      small: 12,
    },
    fontWeight: {
      light: '400',
      regular: '500',
      medium: '600',
      semibold: '700',
      bold: '800',
    },
    headingStyle: {
      letterSpacing: 0,
      lineHeight: 1.2,
    }
  },
};

// Provider component
export const AppProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState(APP_MODES.PERSONAL_GROWTH);
  const [theme, setTheme] = useState(THEMES[APP_MODES.PERSONAL_GROWTH]);
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load saved mode on start
  useEffect(() => {
    const loadSavedMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('appMode');
        if (savedMode && Object.values(APP_MODES).includes(savedMode)) {
          setCurrentMode(savedMode);
          setTheme(THEMES[savedMode]);
        }
      } catch (error) {
        console.log('Error loading saved mode:', error);
      }
    };

    loadSavedMode();
  }, []);

  // Switch between app modes
  const switchMode = async (mode) => {
    console.log('Switching to mode:', mode);
    
    // Check if the mode is a valid mode string, even if not in APP_MODES
    if (mode && mode !== currentMode) {
      setCurrentMode(mode);
      
      // Handle custom themes not defined in THEMES
      if (THEMES[mode]) {
        setTheme(THEMES[mode]);
      } else {
        // For custom modes like COSMIC and SUNSET, use appropriate fallback theme
        // This is a simple solution - in a real app, you'd define proper themes
        if (mode === 'COSMIC') {
          const customTheme = {
            ...THEMES[APP_MODES.PERSONAL_GROWTH],
            primary: '#8b5cf6',
            secondary: '#c026d3',
            background: '#130c25',
            text: '#f8fafc',
            cardShadow: 'rgba(139, 92, 246, 0.3)'
          };
          setTheme(customTheme);
        } else if (mode === 'SUNSET') {
          const customTheme = {
            ...THEMES[APP_MODES.PERSONAL_GROWTH], 
            primary: '#f97316',
            secondary: '#fb923c',
            background: '#fffbeb',
            text: '#44403c'
          };
          setTheme(customTheme);
        } else {
          // Default to personal growth theme if unknown mode
          setTheme(THEMES[APP_MODES.PERSONAL_GROWTH]);
        }
      }
      
      try {
        // Save the mode, even if custom
        await AsyncStorage.setItem('appMode', mode);
        console.log('Saved app mode:', mode);
      } catch (error) {
        console.log('Error saving app mode:', error);
      }
    }
  };

  // Handle user logout
  const logout = async () => {
    try {
      console.log('Logout function called');
      
      // Clear the auth token
      await AsyncStorage.removeItem('userToken');
      
      // Update authentication state
      setIsAuthenticated(false);
      
      // Force navigation to Login screen through RootNavigator
      if (navigationRef?.isReady()) {
        console.log('Navigation ref is ready, resetting to Login');
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      } else {
        console.log('Navigation ref not ready');
      }
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  // Set authentication status - called from RootNavigator
  const setAuthStatus = (status) => {
    setIsAuthenticated(status);
  };

  // Value object to be provided to consumers
  const contextValue = {
    currentMode,
    theme,
    habits,
    isLoading,
    isAuthenticated,
    switchMode,
    setHabits,
    setIsLoading,
    logout,
    setAuthStatus,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 