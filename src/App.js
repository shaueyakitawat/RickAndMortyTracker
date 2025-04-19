import React from 'react';
import { StatusBar } from 'react-native';
import { AppProvider } from './services/AppContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <AppProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AppProvider>
  );
};

export default App; 