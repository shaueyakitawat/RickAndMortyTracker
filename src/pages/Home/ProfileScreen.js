import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Context and Services
import { AppContext, APP_MODES } from '../../services/AppContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme, currentMode, switchMode, logout, isAuthenticated } = useContext(AppContext);
  
  // Profile settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyReportsEnabled, setWeeklyReportsEnabled] = useState(true);
  const [username, setUsername] = useState('User');
  
  // Check login status on mount
  useEffect(() => {
    // Check for auth token to update UI
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        // Set username if logged in
        if (token) {
          setUsername('User'); // In a real app, fetch user profile data here
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    
    checkAuthStatus();
  }, [isAuthenticated]);

  // Handle app mode switch
  const handleModeSwitch = () => {
    const newMode = currentMode === APP_MODES.PERSONAL_GROWTH 
      ? APP_MODES.ACTION 
      : APP_MODES.PERSONAL_GROWTH;
    
    switchMode(newMode);
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Use the global logout function which handles everything
              const success = await logout();
              
              if (!success) {
                // Only show error if the logout function fails
                Alert.alert('Error', 'Something went wrong. Please try again.');
              }
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Handle export data
  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your habit data will be exported as a CSV file and shared.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Export',
          onPress: () => {
            // In a real app, this would trigger the export function
            Alert.alert('Success', 'Your data has been exported successfully.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Profile" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image 
              source={require('../../../assets/images/icon.png')}
              style={styles.avatar}
              defaultSource={require('../../../assets/images/icon.png')}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.username, { color: theme.text }]}>{username}</Text>
              <Text style={[styles.memberSince, { color: theme.text + '80' }]}>
                Member since April 2023
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                12
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Habits
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                87
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Completions
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                15
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Best Streak
              </Text>
            </View>
          </View>
        </Card>

        {/* App Mode Section */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App Mode</Text>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                {currentMode === APP_MODES.PERSONAL_GROWTH 
                  ? 'Personal Growth Mode' 
                  : 'Action Mode'}
              </Text>
              <Text style={[styles.switchDescription, { color: theme.text + '80' }]}>
                {currentMode === APP_MODES.PERSONAL_GROWTH
                  ? 'Focus on mindful progress with calming visuals'
                  : 'Energetic interface for maximum productivity'}
              </Text>
            </View>
            
            <Switch
              trackColor={{ false: '#767577', true: theme.primary + '80' }}
              thumbColor={currentMode === APP_MODES.ACTION ? theme.primary : '#f4f3f4'}
              onValueChange={handleModeSwitch}
              value={currentMode === APP_MODES.ACTION}
            />
          </View>
        </Card>

        {/* Notifications Section */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Push Notifications
              </Text>
              <Text style={[styles.switchDescription, { color: theme.text + '80' }]}>
                Get reminders for your daily habits
              </Text>
            </View>
            
            <Switch
              trackColor={{ false: '#767577', true: theme.primary + '80' }}
              thumbColor={notificationsEnabled ? theme.primary : '#f4f3f4'}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Weekly Report
              </Text>
              <Text style={[styles.switchDescription, { color: theme.text + '80' }]}>
                Receive weekly progress summaries
              </Text>
            </View>
            
            <Switch
              trackColor={{ false: '#767577', true: theme.primary + '80' }}
              thumbColor={weeklyReportsEnabled ? theme.primary : '#f4f3f4'}
              onValueChange={setWeeklyReportsEnabled}
              value={weeklyReportsEnabled}
            />
          </View>
        </Card>

        {/* Data Section */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data</Text>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleExportData}
          >
            <View style={styles.actionInfo}>
              <Ionicons name="download-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Export Habit Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="cloud-upload-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Backup to Cloud
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
        </Card>

        {/* Account Section */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="person-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Account Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Privacy Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="help-circle-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
        </Card>
        
        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          textStyle={{ color: '#ffffff' }}
        />
        
        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: theme.text + '60' }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    flex: 1,
    paddingRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
  },
});

export default ProfileScreen; 