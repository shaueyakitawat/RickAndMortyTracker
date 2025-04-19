import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Screens
import HomeScreen from '../pages/Home/HomeScreen';
import HabitsScreen from '../pages/Home/HabitsScreen';
import StatsScreen from '../pages/Home/StatsScreen';
import ProfileScreen from '../pages/Home/ProfileScreen';
import SettingsScreen from '../pages/Home/SettingsScreen';

// Context
import { AppContext, APP_MODES } from '../services/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home stack
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

// HabitsStack - For adding/editing habits
const HabitsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HabitsMain" component={HabitsScreen} />
    </Stack.Navigator>
  );
};

// Tab Navigator
const TabNavigator = () => {
  const { theme, currentMode } = useContext(AppContext);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Habits') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.text + '10',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarItemStyle: {
          paddingVertical: 5
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 3
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen 
        name="Habits" 
        component={HabitsStack} 
        options={{
          tabBarLabel: 'My Habits'
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{
          tabBarLabel: 'Stats'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator; 