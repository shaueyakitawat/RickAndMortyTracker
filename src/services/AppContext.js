import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
export const AppContext = createContext();

// App modes
export const APP_MODES = {
  PERSONAL_GROWTH: 'personal_growth',
  ACTION: 'action',
};

// Theme colors for different modes
export const THEMES = {
  [APP_MODES.PERSONAL_GROWTH]: {
    primary: '#8b5cf6', // Soft purple
    secondary: '#c4b5fd',
    background: '#f5f3ff',
    card: '#ffffff',
    text: '#4b5563',
    accent: '#a78bfa',
  },
  [APP_MODES.ACTION]: {
    primary: '#ef4444', // Energetic red
    secondary: '#fca5a5',
    background: '#fef2f2',
    card: '#ffffff',
    text: '#1f2937',
    accent: '#f87171',
  },
};

// Provider component
export const AppProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState(APP_MODES.PERSONAL_GROWTH);
  const [theme, setTheme] = useState(THEMES[APP_MODES.PERSONAL_GROWTH]);
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    if (Object.values(APP_MODES).includes(mode) && mode !== currentMode) {
      setCurrentMode(mode);
      setTheme(THEMES[mode]);
      
      try {
        await AsyncStorage.setItem('appMode', mode);
      } catch (error) {
        console.log('Error saving app mode:', error);
      }
    }
  };

  // Value object to be provided to consumers
  const contextValue = {
    currentMode,
    theme,
    habits,
    isLoading,
    switchMode,
    setHabits,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 