import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { AppProvider } from './services/AppContext';
import RootNavigator from './navigation/RootNavigator';

// Ignore specific warnings for better debugging
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  return (
    <AppProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AppProvider>
  );
};

export default App; 