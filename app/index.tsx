import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { AppProvider } from "../src/services/AppContext";

export default function Index() {
  // This component redirects to the traditional navigation structure
  // The AppProvider is included to maintain context across navigation methods
  return (
    <AppProvider>
      <Redirect href="../src/App" />
    </AppProvider>
  );
}
