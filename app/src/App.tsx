import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import App from '../../src/App';

export default function AppPage() {
  return <App />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 